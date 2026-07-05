import axios, { AxiosError, AxiosInstance } from "axios";
import { auth } from "@/lib/firebase/client";

const baseURL = process.env.NEXT_PUBLIC_API_NOCAP_API;

export const API: AxiosInstance = axios.create({
  baseURL,
  timeout: 120_000, // matches mobile's core/clients/axios timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  validateStatus: (status) => status >= 200 && status < 300,
});

/**
 * Auto-attaches a fresh Firebase ID token on every request.
 * Deliberate improvement over mobile, which attaches a token snapshot manually
 * per call — this refreshes automatically instead of going stale for up to an hour.
 */
API.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url;
    const status = error.response?.status;
    console.log(`[AXIOS ERROR] ${status} ${url}`);
    return Promise.reject(error);
  },
);

/**
 * Normalize any Axios error into a predictable shape.
 */
export function normalizeAxiosError(err: unknown) {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<any>;
    const status = axErr.response?.status ?? 0;
    const data = axErr.response?.data;
    const message =
      data?.message ||
      data?.error ||
      axErr.message ||
      "Request failed. Please try again.";

    return { status, message, data };
  }
  return { status: 0, message: (err as any)?.message ?? "Unknown error" };
}
