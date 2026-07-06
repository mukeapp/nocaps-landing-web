import { API, normalizeAxiosError } from "@/core/clients/axios";
import { ApiResponse, FirestoreUser, IUser } from "@/core/models/section-a";

/**
 * Save user in Firestore via your backend.
 */
export async function SaveUserInFirestore(params: {
  loggedUser: FirestoreUser;
  token: string;
}): Promise<ApiResponse<unknown>> {
  try {
    const res = await API.post("/user-firestore", params.loggedUser, {
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    });

    if (res.status !== 200 && res.status !== 201) {
      console.error("Error saving user:", res.data);
      throw new Error(res.data?.message || "Unknown error");
    }

    return { data: res.data, status: res.status };
  } catch (err) {
    console.log("Error saving user:");
    const e = normalizeAxiosError(err);
    // Useful in dev; keep logs minimal in prod
    console.error("SaveUserInFirestore error:", e);
    //throw e; // { status, message, data? }
    return { data: null, status: e.status || 500 }; // Return null on error
  }
}

/**
 * Fetch a user by email.
 */
export async function GetUserByEmail(params: {
  mail: string;
}): Promise<ApiResponse<unknown>> {
  try {
    const email = encodeURIComponent(params.mail.trim().toLowerCase());
    const res = await API.get(`/user-firestore/by-email/${email}`);

    if (res.status !== 200 && res.status !== 201) {
      console.error("Error fetching user:", res.data);
      throw new Error(res.data?.message || "Unknown error");
    }

    return { data: res.data, status: res.status };
  } catch (err) {
    console.log("mail:", params.mail);
    console.log("Error fetching user by email:");
    const e = normalizeAxiosError(err);
    console.warn("GetUserByEmail error:", e);
    throw e; // { status, message, data? }
    //return { data: null, status: e.status || 500 }; // Return null on error
  }
}

export const GetFirestoreUserPaginated = async (payload:any) => {
  const request = `/user-firestore/paginated?pageNumber=${payload?.pno}&pageSize=${payload?.psize}&firebaseUserId=${payload.uid}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("Error fetching paginated users:");
    //throw err;
    return { data: null, status: 500 }; // Return null on error
  }
};

export const GetUserByUserId = async (payload: { userId: string }) => {
  const request = `/user-firestore/by-userId/${payload.userId}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("Error fetching user by userId:");
    //throw err;
    return { data: null, status: 500 }; // Return null on error
  }
};

export const UpdateFirestoreUser = async (payload: { data: IUser, documentId: string }) => {
  const request = `/user-firestore/${payload.documentId}`;
  try {
    const response = await API.put(request, payload.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("UpdateFirestoreUser error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};