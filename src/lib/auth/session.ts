import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session-cookie";

/**
 * Marks the user as signed in for middleware's benefit — a plain client-set
 * cookie, no server round-trip. Mirrors nocap-web-mvp's "nocap_auth" cookie
 * (see src/services/auth/handle-email-sign-in.ts there). The Firebase ID
 * token itself is what actually authenticates API calls (attached per-request
 * by the axios interceptor in src/lib/api/client.ts); this cookie only lets
 * middleware decide whether to render the dashboard shell or redirect.
 */
export async function establishSession(_idToken: string) {
  document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
}
