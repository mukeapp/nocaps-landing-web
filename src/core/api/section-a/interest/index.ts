import { API, normalizeAxiosError } from "@/core/clients/axios";
import { ApiResponse, UserInterest } from "@/core/models/section-a";

/** GET /sector-components */
export async function GetInterestAndSector(): Promise<ApiResponse<any[]>> {
  try {
    const res = await API.get("/sector-components");

    if (res.status !== 200 && res.status !== 201) {
      console.warn("Error fetching interests/sectors:", res.data);
      // throw new Error(res.data?.message || "Unknown error");
      return { data: [], status: res.status || 500 }; // Return empty array on error
    }

    return { data: res.data, status: res.status };
  } catch (err) {
    console.log("Error fetching user interest and sector:");
    const e = normalizeAxiosError(err);
    console.warn("GetUserInterestAndSector error:", e);
    //throw e; // { status, message, data? }
    return { data: [], status: e.status || 500 }; // Return empty array on error
  }
}

/** POST /user-interests */
export async function SaveUserInterest(params: {
  data: UserInterest;
}): Promise<ApiResponse<unknown>> {
  try {
    const res = await API.post("/user-interests", params.data);

    if (res.status !== 200 && res.status !== 201) {
      console.warn("Error saving user interest:", res.data);
      // throw new Error(res.data?.message || "Unknown error");
      return { data: [], status: res.status || 500 }; // Return empty array on error
    }

    return { data: res.data, status: res.status };
  } catch (err) {
    console.log("Error saving user interest:");
    const e = normalizeAxiosError(err);
    console.warn("SaveUserInterest error:", e);
    //throw e; // { status, message, data? }
    return { data: [], status: e.status || 500 }; // Return empty array on error
  }
}
