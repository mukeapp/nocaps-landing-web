import { API, normalizeAxiosError } from "@/lib/api/client";
import { ApiResponse, FirestoreUser, IUser } from "@/types/section-a/user";

/**
 * Save user in Firestore via the backend (creates the app-side profile record).
 */
export async function SaveUserInFirestore(params: {
  loggedUser: FirestoreUser;
  token: string;
}): Promise<ApiResponse<unknown>> {
  try {
    const res = await API.post("/user-firestore", params.loggedUser, {
      headers: { Authorization: `Bearer ${params.token}` },
    });

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(res.data?.message || "Unknown error");
    }

    return { data: res.data, status: res.status };
  } catch (err) {
    const e = normalizeAxiosError(err);
    console.error("SaveUserInFirestore error:", e);
    return { data: null, status: e.status || 500 };
  }
}

/**
 * Fetch a user by email. Throws (with a normalized shape) on failure —
 * callers use this to distinguish "not found" (404) from other errors.
 */
export async function GetUserByEmail(params: {
  mail: string;
}): Promise<ApiResponse<unknown>> {
  try {
    const email = encodeURIComponent(params.mail.trim().toLowerCase());
    const res = await API.get(`/user-firestore/by-email/${email}`);

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(res.data?.message || "Unknown error");
    }

    return { data: res.data, status: res.status };
  } catch (err) {
    const e = normalizeAxiosError(err);
    throw e;
  }
}

export const GetUserByUserId = async (payload: { userId: string }) => {
  try {
    const response = await API.get(`/user-firestore/by-userId/${payload.userId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("Error fetching user by userId:", err);
    return { data: null, status: 500 };
  }
};

export const UpdateFirestoreUser = async (payload: { data: IUser; documentId: string }) => {
  try {
    const response = await API.put(`/user-firestore/${payload.documentId}`, payload.data);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("UpdateFirestoreUser error:", err);
    return { data: null, status: 500 };
  }
};
