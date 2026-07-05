"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { DeleteFriendRequest, GetUserAreFriends } from "@/lib/api/section-b/friends";
import { UserRow, type FriendUser } from "@/components/dashboard/user-row";
import { DataState } from "@/components/dashboard/data-state";
import { Button } from "@/components/ui/button";

/** Mirrors mobile's YourFriendsScreen: current friends with Unfriend. */
export default function YourFriendsPage() {
  const userId = useCurrentUserId();
  const [users, setUsers] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    GetUserAreFriends({ userId, pageSize: 50, pageNumber: 1 })
      .then((res) => setUsers(((res.data as any)?.users ?? []) as FriendUser[]))
      .finally(() => setLoading(false));
  }, [userId]);

  async function unfriend(user: FriendUser) {
    const docId = user.friend?.documentId;
    if (!docId) return;
    setUsers((prev) => prev.filter((u) => u.userId !== user.userId));
    const res = await DeleteFriendRequest({ docId });
    if (res.status >= 200 && res.status < 300) {
      toast.success("Removed from friends");
    } else {
      toast.error("Failed to remove friend");
      setUsers((prev) => [user, ...prev]);
    }
  }

  return (
    <div className="mx-auto max-w-xl pb-8">
      <h1 className="mb-4 text-[20px] font-bold text-white">Your Friends</h1>
      <DataState loading={loading || !userId} error={null}>
        {users.length === 0 ? (
          <div className="flex h-[40vh] items-center justify-center">
            <p className="text-base font-semibold text-white">No Friend Found.</p>
          </div>
        ) : (
          users.map((user) => (
            <UserRow
              key={user.userId}
              user={user}
              actions={
                <Button size="sm" variant="outline" onClick={() => unfriend(user)}>
                  Unfriend
                </Button>
              }
            />
          ))
        )}
      </DataState>
    </div>
  );
}
