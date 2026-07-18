import axios, { AxiosError, AxiosInstance } from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_NOCAP_API;

export const API: AxiosInstance = axios.create({
  baseURL,
  //timeout: 15_000,// Max time Axios will wait for a response: 15 seconds (15,000 ms)
  // timeout: 60_000,// Max time Axios will wait for a response: 60 seconds (60,000 ms) or 1 minute
  timeout: 120_000,// Max time Axios will wait for a response: 120 seconds (120,000 ms) or 2 minutes
  // timeout: 300_000,// Max time Axios will wait for a response: 300 seconds (300,000 ms) or 5 minutes
  // timeout: 600_000,// Max time Axios will wait for a response: 600 seconds (600,000 ms) or 10 minutes
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Let axios throw on non-2xx so we can normalize below
  validateStatus: (status) => status >= 200 && status < 300,
});

// Add response interceptor to log all requests
// API.interceptors.request.use(
//   (config) => {
//     console.log(`[AXIOS REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
//     return config;
//   },
//   (error) => {
//     console.error("[AXIOS REQUEST ERROR]", error);
//     return Promise.reject(error);
//   }
// );

// Add response interceptor to catch and log errors
API.interceptors.response.use(
  (response) => {
   // console.log(`[AXIOS RESPONSE] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const url = error.config?.url;
    const status = error.response?.status;
    console.log(`[AXIOS ERROR] ${status} ${url}`);

    // Don't retry, just reject immediately
    return Promise.reject(error);
  }
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

    console.log(`[NORMALIZE ERROR] Status: ${status}, Message: ${message}`);

    return { status, message, data };
  }
  // Non-Axios error
  console.log("[NORMALIZE ERROR] Non-Axios error:", err);
  return { status: 0, message: (err as any)?.message ?? "Unknown error" };
}