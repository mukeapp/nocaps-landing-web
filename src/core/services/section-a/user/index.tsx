import {GetFirestoreUserPaginated, GetUserByUserId, UpdateFirestoreUser} from "@/core/api/section-a";
import {IUser} from "@/core/models/section-a/user";

export async function fetchUserByUserId(userId: string) {
    const res = await GetUserByUserId({ userId });
  return res?.data || null;
}

export const fetchUserFromUserIds = async (userIds: string[]): Promise<IUser[]> => {
  const results = await Promise.all(
    userIds.map((userId) => fetchUserByUserId(userId))
  );

  // Filter out any nulls in case some userIds didn't resolve
  return results.filter((user): user is IUser => user !== null);
};


export const fetchPaginatedUsers = async (pno: number, psize: number, uid?: string) => {
  const res = await GetFirestoreUserPaginated({ pno, psize, uid });
  return res?.data || null;
};

export const updateUserInFirestore = async (data: any, documentId: string) => {
  try {
    const res = await UpdateFirestoreUser({ data, documentId });
    return res?.status|| null;
  } catch (error) {
    console.error("Error updating user in Firestore:", error);
    return null;
  }
};