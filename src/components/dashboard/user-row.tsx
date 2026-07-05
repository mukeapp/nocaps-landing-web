"use client";

import Image from "next/image";

export interface FriendUser {
  documentId: string;
  id?: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  username: string;
  photo?: string | null;
  friend?: {
    documentId?: string;
    isSender?: boolean;
    isReceiver?: boolean;
    friendRequestStatus?: string;
  };
}

/**
 * Mirrors mobile's UserRow/FriendCard pattern: avatar + name/username in a
 * dark rounded row with action buttons on the right.
 */
export function UserRow({
  user,
  actions,
}: {
  user: FriendUser;
  actions?: React.ReactNode;
}) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return (
    <div className="mt-2 flex items-center gap-3 rounded-xl bg-[rgba(25,25,25,1)] px-3 py-2.5">
      <Image
        src={user.photo || "/assets/images/default-avatar.png"}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-white">{fullName || user.username}</p>
        <p className="truncate text-[12px] text-white/50">@{user.username?.replace(/^@/, "")}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    </div>
  );
}
