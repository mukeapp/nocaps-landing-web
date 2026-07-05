"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { GetUserNonFriends, SaveFriendRequest } from "@/lib/api/section-b/friends";
import { UserRow, type FriendUser } from "@/components/dashboard/user-row";
import { DataState } from "@/components/dashboard/data-state";
import { Button } from "@/components/ui/button";

/** Mirrors mobile's NewFriendsScreen: non-friends list with "Add Friend". */
export default function NewFriendsPage() {
  const userId = useCurrentUserId();
  const [users, setUsers] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    GetUserNonFriends({ userId, pageSize: 50, pageNumber: 1 })
      .then((res) => setUsers(((res.data as any)?.users ?? []) as FriendUser[]))
      .finally(() => setLoading(false));
  }, [userId]);

  async function addFriend(friend: FriendUser) {
    if (!userId) return;
    setUsers((prev) => prev.filter((u) => u.userId !== friend.userId));
    const res = await SaveFriendRequest({ userId, friendUserId: friend.userId });
    if (res.status >= 200 && res.status < 300) {
      toast.success("Friend request sent");
    } else {
      toast.error("Failed to send friend request");
      setUsers((prev) => [friend, ...prev]);
    }
  }

  return (
    <div className="mx-auto max-w-xl pb-8">
      <h1 className="mb-4 text-[20px] font-bold text-white">New Friends</h1>
      <DataState loading={loading || !userId} error={null}>
        {users.length === 0 ? (
          <div className="flex h-[40vh] items-center justify-center">
            <p className="text-base font-semibold text-white">No New Friends Found.</p>
          </div>
        ) : (
          users.map((user) => (
            <UserRow
              key={user.userId}
              user={user}
              actions={
                <Button size="sm" onClick={() => addFriend(user)}>
                  Add Friend
                </Button>
              }
            />
          ))
        )}
      </DataState>
    </div>
  );
}
