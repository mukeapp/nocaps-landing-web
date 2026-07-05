"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import {
  DeleteFriendRequest,
  GetUserFriendsRequests,
  PatchFriendRequestAreFriends,
} from "@/lib/api/section-b/friends";
import { UserRow, type FriendUser } from "@/components/dashboard/user-row";
import { DataState } from "@/components/dashboard/data-state";
import { Button } from "@/components/ui/button";

/** Mirrors mobile's FriendsRequestScreen: pending requests with Accept / Decline. */
export default function FriendsRequestsPage() {
  const userId = useCurrentUserId();
  const [users, setUsers] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    GetUserFriendsRequests({ userId, pageSize: 50, pageNumber: 1 })
      .then((res) => setUsers(((res.data as any)?.users ?? []) as FriendUser[]))
      .finally(() => setLoading(false));
  }, [userId]);

  async function accept(user: FriendUser) {
    const docId = user.friend?.documentId;
    if (!docId) return;
    setUsers((prev) => prev.filter((u) => u.userId !== user.userId));
    const res = await PatchFriendRequestAreFriends({ docId, areFriends: true });
    if (res.status >= 200 && res.status < 300) {
      toast.success("Friend request accepted");
    } else {
      toast.error("Failed to accept request");
      setUsers((prev) => [user, ...prev]);
    }
  }

  async function decline(user: FriendUser) {
    const docId = user.friend?.documentId;
    if (!docId) return;
    setUsers((prev) => prev.filter((u) => u.userId !== user.userId));
    const res = await DeleteFriendRequest({ docId });
    if (res.status >= 200 && res.status < 300) {
      toast.success("Friend request removed");
    } else {
      toast.error("Failed to remove request");
      setUsers((prev) => [user, ...prev]);
    }
  }

  return (
    <div className="mx-auto max-w-xl pb-8">
      <h1 className="mb-4 text-[20px] font-bold text-white">Friends Requests</h1>
      <DataState loading={loading || !userId} error={null}>
        {users.length === 0 ? (
          <div className="flex h-[40vh] items-center justify-center">
            <p className="text-base font-semibold text-white">No Friend Request Found.</p>
          </div>
        ) : (
          users.map((user) => (
            <UserRow
              key={user.userId}
              user={user}
              actions={
                <>
                  {user.friend?.isReceiver !== false ? (
                    <Button size="sm" onClick={() => accept(user)}>
                      Accept
                    </Button>
                  ) : null}
                  <Button size="sm" variant="outline" onClick={() => decline(user)}>
                    {user.friend?.isSender ? "Cancel" : "Decline"}
                  </Button>
                </>
              }
            />
          ))
        )}
      </DataState>
    </div>
  );
}
