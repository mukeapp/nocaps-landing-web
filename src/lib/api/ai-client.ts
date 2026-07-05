import axios from "axios";
import { auth } from "@/lib/firebase/client";

// Separate AI backend service — mirrors mobile's EXPO_PUBLIC_API_NOCAP_AI /
// nocap-web-mvp's NEXT_PUBLIC_API_NOCAP_AI. Not called by any feature yet
// (AI Tools is a "Coming soon" placeholder), but wired up so the env var and
// auth-attaching pattern are ready when that feature gets built.
export const AiAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_NOCAP_AI,
  timeout: 120_000,
  headers: { "Content-Type": "application/json" },
});

AiAPI.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AiAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(`[AI AXIOS ERROR] ${error.response?.status} ${error.config?.url}`);
    return Promise.reject(error);
  },
);
