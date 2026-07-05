"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUser, UserDataAction } from "@/redux/user-data";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { GetUserByUserId, UpdateFirestoreUser } from "@/lib/api/section-a/user";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-[#3A3A3A] bg-[rgba(41,41,41,1)] px-3 py-2.5 text-[14px] text-white placeholder:text-white/40 outline-none focus:border-[rgba(45,156,219,1)]";

/**
 * Mirrors mobile's ProfileEditScreen (fields per useProfileEditForm:
 * firstName, lastName, username, description; saves via
 * updateUserInFirestore then refreshes redux with setUserCollectData).
 * Photo/banner upload (Firebase Storage on mobile) not wired yet — existing
 * values are preserved on save.
 */
export default function ProfileEditPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userId = useCurrentUserId();
  const { userdata } = useAppSelector(selectUser);
  const user = (userdata as any)?.collectdata ?? userdata ?? {};

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setUserName(user?.username ?? "");
    setDescription(user?.description ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.documentId]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) return void toast.error("First name is required");
    if (!lastName.trim()) return void toast.error("Last name is required");
    if (!userName.trim()) return void toast.error("Username is required");

    setSaving(true);
    try {
      const res = await UpdateFirestoreUser({
        documentId: user.documentId,
        data: {
          ...user,
          username: userName.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          description: description.trim(),
        },
      });

      if (res.status === 200) {
        if (userId) {
          const updated = await GetUserByUserId({ userId });
          if (updated.data) dispatch(UserDataAction.setUserCollectData(updated.data));
        }
        toast.success("Profile updated successfully");
        router.push("/dashboard/profile");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-semibold text-white">Edit Profile</h1>
      <form onSubmit={onSave} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[13px] text-white/50">First name</label>
            <input className={inputClass} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] text-white/50">Last name</label>
            <input className={inputClass} value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] text-white/50">Username</label>
          <input className={inputClass} value={userName} onChange={(e) => setUserName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] text-white/50">About me</label>
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
