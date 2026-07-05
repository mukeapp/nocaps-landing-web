export const SESSION_COOKIE_NAME = "nocap_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day, matches nocap-web-mvp's "nocap_auth" cookie

/**
 * Plain presence check, mirroring nocap-web-mvp's `request.cookies.get("nocap_auth")` pattern:
 * the cookie is a plain client-set flag, not a verified session token, so there's nothing to
 * decode. Not a security boundary — the backend re-verifying the Firebase ID token on every API
 * call is the real authority, same as mobile.
 */
export function isPlausiblySignedIn(sessionCookie: string | undefined): boolean {
  return Boolean(sessionCookie);
}
