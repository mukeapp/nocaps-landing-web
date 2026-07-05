import { IUser, UserTempData } from "@/types/section-a/user";

// Ported from mobile core/utils/utilities/user.ts (buildUserFromTempAndAuth).
const DEFAULT_ROLE_ID = "d5009833-0656-47a8-beb0-90c047de91c3";
const DEFAULT_AVATAR =
  "https://www.mtsolar.us/wp-content/uploads/2020/04/avatar-placeholder.png";

type TempData = { first: string; last: string; username: string };
type AuthMini = { uid: string; email?: string | null };

export function buildUserFromTempAndAuth(temp: UserTempData, auth: AuthMini): IUser {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    userId: auth.uid,
    firstName: temp.first,
    lastName: temp.last,
    fullName: temp.fullName || `${temp.first} ${temp.last}`,
    username: temp.username,
    roles: [DEFAULT_ROLE_ID],
    description: "",
    photo: temp.photoUrl || DEFAULT_AVATAR,
    email: auth.email ?? undefined,
    created: now,
    updated: now,
  };
}
