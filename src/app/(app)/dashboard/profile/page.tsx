"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Pencil, Share2, Star } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/user-data";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { getHabitStackComponentsByUserId } from "@/lib/api/section-b/habit-stack";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { HabitStackCard } from "@/components/dashboard/habit-stack-card";
import { DataState } from "@/components/dashboard/data-state";

/**
 * Mirrors mobile's ProfileScreen (app/src/screens/section-b/section-b-3/
 * ProfileScreen) for the user's own profile: ProfileHero (banner + overlapping
 * avatar + name/@username/Available Now), HabitStacksChipsRow, AboutMeSection,
 * PostHabitToggle, StatsRow, and the tab content (habit stacks list / posts).
 */
export default function ProfilePage() {
  const router = useRouter();
  const userId = useCurrentUserId();
  const { userdata } = useAppSelector(selectUser);
  const user = (userdata as any)?.collectdata ?? userdata ?? {};

  const [stacks, setStacks] = useState<HabitStackComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(true);
  const [toggle, setToggle] = useState<"post" | "habitStacks">("habitStacks");

  useEffect(() => {
    if (!userId) return;
    getHabitStackComponentsByUserId({ id: userId })
      .then((res) => setStacks(Array.isArray(res.data) ? res.data : []))
      .finally(() => setLoading(false));
  }, [userId]);

  const habitStats = useMemo(() => {
    const habits = stacks.flatMap((s) => s.habitData ?? []);
    const links = habits.flatMap((h) => h.habitLinkData ?? []);
    return [
      { name: "HabitStacks", value: stacks.length },
      { name: "Habits", value: habits.length },
      { name: "HabitLinks", value: links.length },
    ];
  }, [stacks]);

  const postStats = [
    { name: "Posts", value: 0 },
    { name: "Following", value: 0 },
    { name: "Followers", value: 0 },
  ];

  const stats = toggle === "post" ? postStats : habitStats;
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.fullName || "Your Name";
  const username = user?.username ? `@${user.username.replace(/^@/, "")}` : "";

  return (
    <div className="mx-auto max-w-xl pb-8">
      {/* ProfileHero */}
      <div>
        <div className="relative overflow-visible rounded-t-2xl bg-[#252525]">
          <div className="relative h-52 w-full overflow-hidden rounded-t-2xl">
            <Image
              src={user?.bannerImage || "/assets/images/default_banner_image_000.png"}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          {/* edit button bottom-right of banner */}
          <button
            onClick={() => router.push("/dashboard/profile/edit")}
            className="absolute bottom-2 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white"
          >
            <Pencil className="h-4 w-4" />
          </button>
          {/* Avatar overlapping */}
          <div className="absolute -bottom-8 left-4 z-10 h-[72px] w-[72px] rounded-full border-[3px] border-white bg-black">
            <Image
              src={user?.photo || "/assets/images/default-avatar.png"}
              alt=""
              width={72}
              height={72}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* Profile info section */}
        <div className="relative flex items-center justify-between bg-[#252525] px-4 pb-4 pt-12">
          <div className="min-w-0">
            <p className="text-[17px] font-semibold text-white">{fullName}</p>
            <p className="flex items-center gap-1.5 text-[13px] text-white/50">
              <span className="truncate">{username}</span>
              {username ? <span>•</span> : null}
              <span>Available Now</span>
              <span className="h-2 w-2 rounded-full bg-[rgba(33,150,83,1)]" />
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(25,25,25,1)] text-white">
              <Star className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(25,25,25,1)] text-white">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* HabitStacksChipsRow */}
      {stacks.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto bg-[#0D0D0D] px-4 py-3">
          {stacks.map((s) => (
            <span
              key={s.documentId ?? s.id}
              className="shrink-0 rounded-full bg-white/[0.07] px-3 py-1 text-[12px] font-semibold text-white"
            >
              {s.name}
            </span>
          ))}
        </div>
      ) : null}

      {/* AboutMeSection */}
      <div className="rounded-b-2xl bg-[#0D0D0D] px-5 py-5">
        <div className="mb-4 h-px bg-[#9E9E9E]" />
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-white">About Me</h2>
          <button
            onClick={() => setAboutOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
          >
            {aboutOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        {aboutOpen ? (
          <p className="mt-3 text-[15px] leading-6 text-[#9CA3AF]">
            {user?.description || "No description yet."}
          </p>
        ) : null}
      </div>

      {/* PostHabitToggle */}
      <div className="mt-4 flex justify-center">
        <div className="flex w-full rounded-full bg-[#2A2A2A] p-1">
          {(["post", "habitStacks"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setToggle(key)}
              className={`flex-1 rounded-full py-3 text-[16px] font-semibold transition-colors ${
                toggle === key ? "bg-white text-black" : "text-[#6B7280]"
              }`}
            >
              {key === "post" ? "Post" : "HabitStacks"}
            </button>
          ))}
        </div>
      </div>

      {/* StatsRow */}
      <div className="mt-4 flex justify-between gap-2">
        {stats.map((item) => (
          <div key={item.name} className="flex flex-1 flex-col items-center rounded-2xl bg-[rgba(25,25,25,1)] py-4">
            <span className="text-[18px] font-semibold text-white">
              {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
            </span>
            <span className="mt-1 text-[13px] text-[#9E9E9E]">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {toggle === "habitStacks" ? (
          <DataState loading={loading || !userId} error={null}>
            {stacks.length === 0 ? (
              <div className="flex h-[25vh] items-center justify-center">
                <p className="text-base font-semibold text-white">No Habit Stack Found.</p>
              </div>
            ) : (
              stacks.map((stack) => {
                const id = stack.documentId ?? stack.id;
                return (
                  <HabitStackCard
                    key={id}
                    stack={stack}
                    href={`/dashboard/habit-stacks/${id}`}
                    editHref={`/dashboard/habit-stacks/${id}/edit`}
                    onDelete={() => {}}
                  />
                );
              })
            )}
          </DataState>
        ) : (
          <div className="flex h-[25vh] items-center justify-center">
            <p className="text-base font-semibold text-white">No Post Found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
