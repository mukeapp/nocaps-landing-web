"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { GetAllSectorComponents, CopyHabitStackToAnotherUser } from "@/lib/api/section-b/habit-stack";
import {
  FetchHabitStackComponentsByUserIdsAndSectorIdAndHideFromFriends,
  GetUserAreFriends,
} from "@/lib/api/section-b/friends";
import type { HabitStackComponent } from "@/types/section-b/habit";
import type { FriendUser } from "@/components/dashboard/user-row";
import { HabitStackCard } from "@/components/dashboard/habit-stack-card";
import { DataState } from "@/components/dashboard/data-state";

const FRIEND_LINKS = [
  { id: 1, name: "Friends Requests", href: "/dashboard/friends/requests" },
  { id: 2, name: "Your Friends", href: "/dashboard/friends/your" },
  { id: 3, name: "New Friends", href: "/dashboard/friends/new" },
];

interface Sector {
  documentId: string;
  label: string;
}

/**
 * Mirrors mobile's MyFriendsAndHabitsScreen: FriendsLinks chips (requests /
 * your friends / new friends), friend avatar filter row, then per-sector
 * sections of friends' habit stacks with "Copy HabitStack" buttons.
 */
export default function FriendsPage() {
  const userId = useCurrentUserId();
  const router = useRouter();

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [selectedFriendUserId, setSelectedFriendUserId] = useState<string | null>(null);
  const [stacksBySector, setStacksBySector] = useState<Record<string, HabitStackComponent[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      GetAllSectorComponents(),
      GetUserAreFriends({ userId, pageSize: 1000, pageNumber: 1 }),
    ])
      .then(([sectorsRes, friendsRes]) => {
        setSectors(Array.isArray(sectorsRes.data) ? sectorsRes.data : []);
        setFriends(((friendsRes.data as any)?.users ?? []).filter((u: FriendUser) => u.userId));
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const loadSectorStacks = useCallback(
    (sectorDocId: string, friendIds: string[]) => {
      FetchHabitStackComponentsByUserIdsAndSectorIdAndHideFromFriends({
        userIds: friendIds,
        sectorId: sectorDocId,
        hideFromFriends: false,
      }).then((res) => {
        setStacksBySector((prev) => ({
          ...prev,
          [sectorDocId]: Array.isArray(res.data) ? res.data : [],
        }));
      });
    },
    [],
  );

  useEffect(() => {
    if (friends.length === 0 || sectors.length === 0) return;
    const ids = selectedFriendUserId ? [selectedFriendUserId] : friends.map((f) => f.userId);
    setStacksBySector({});
    sectors.forEach((s) => loadSectorStacks(s.documentId, ids));
  }, [friends, sectors, selectedFriendUserId, loadSectorStacks]);

  async function copyStack(stack: HabitStackComponent) {
    if (!userId) return;
    const res = await CopyHabitStackToAnotherUser({
      data: { habitStackId: stack.documentId ?? stack.id, newOwnerUserId: userId },
    });
    if (res.status >= 200 && res.status < 300) {
      toast.success(`"${stack.name}" copied to your habit stacks.`);
    } else {
      toast.error("Unable to copy this habit stack.");
      throw new Error("copy failed");
    }
  }

  return (
    <div className="mx-auto max-w-xl pb-8">
      <h1 className="mb-4 text-[20px] font-bold text-white">Friends &amp; Habits</h1>

      {/* FriendsLinks chips */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {FRIEND_LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="shrink-0 rounded-full border border-white/[0.04] bg-[#252525] px-4 py-2 text-[14px] font-bold text-[#BBBDC1] hover:bg-white hover:text-black"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Friend avatar filter row */}
      {friends.length > 0 ? (
        <div className="mb-4 flex items-center gap-3 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedFriendUserId(null)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${
              selectedFriendUserId === null
                ? "bg-white text-black"
                : "bg-[#252525] text-white/50"
            }`}
          >
            All
          </button>
          {friends.map((friend) => {
            const active = selectedFriendUserId === friend.userId;
            return (
              <button
                key={friend.userId}
                onClick={() => setSelectedFriendUserId(active ? null : friend.userId)}
                className="flex shrink-0 flex-col items-center gap-1"
              >
                <span
                  className={`overflow-hidden rounded-full border-2 ${
                    active ? "border-[rgba(45,156,219,1)]" : "border-transparent"
                  }`}
                >
                  <Image
                    src={friend.photo || "/assets/images/default-avatar.png"}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 object-cover"
                  />
                </span>
                <span className="max-w-14 truncate text-[10px] text-white/60">{friend.username}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <DataState loading={loading || !userId} error={null}>
        {friends.length === 0 ? (
          <div className="flex h-[35vh] flex-col items-center justify-center gap-2">
            <p className="text-base font-semibold text-white">No friends yet.</p>
            <button
              onClick={() => router.push("/dashboard/friends/new")}
              className="text-[13px] font-semibold text-[rgba(45,156,219,1)] hover:underline"
            >
              Find new friends
            </button>
          </div>
        ) : (
          sectors.map((sector) => {
            const stacks = stacksBySector[sector.documentId] ?? [];
            if (stacks.length === 0) return null;
            return (
              <div key={sector.documentId} className="mb-6">
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="h-4 w-1 rounded-full bg-[rgba(45,156,219,1)]" />
                  <span className="text-[15px] font-semibold text-white">{sector.label}</span>
                </div>
                {stacks.map((stack) => {
                  const id = stack.documentId ?? stack.id;
                  return (
                    <HabitStackCard
                      key={id}
                      stack={stack}
                      href={`/dashboard/habit-stacks/${id}`}
                      editHref={`/dashboard/habit-stacks/${id}/edit`}
                      onDelete={() => {}}
                      onCopy={copyStack}
                      copyLabel="Copy HabitStack"
                    />
                  );
                })}
              </div>
            );
          })
        )}
      </DataState>
    </div>
  );
}
