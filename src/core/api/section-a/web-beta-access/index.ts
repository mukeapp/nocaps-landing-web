import { API, normalizeAxiosError } from "@/core/clients/axios";
import { ApiResponse } from "@/core/models/section-a";

export interface WebBetaAccessResult {
  hasAccess: boolean;
}

/**
 * Check whether a personal email has been granted web beta access.
 * GET /web-beta-access/check-access?personalEmail=<email>
 */
export async function CheckWebBetaAccess(params: {
  personalEmail: string;
}): Promise<ApiResponse<WebBetaAccessResult>> {
  try {
    const email = encodeURIComponent(params.personalEmail.trim().toLowerCase());
    const res = await API.get(
      `/web-beta-access/check-access?personalEmail=${email}`,
    );

    if (res.status !== 200 && res.status !== 201) {
      return { data: { hasAccess: false }, status: res.status || 500 };
    }

    return {
      data: { hasAccess: res.data?.hasAccess === true },
      status: res.status,
    };
  } catch (err) {
    const e = normalizeAxiosError(err);
    console.warn("CheckWebBetaAccess error:", e);
    return { data: { hasAccess: false }, status: e.status || 500 };
  }
}
