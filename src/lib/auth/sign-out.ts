import { auth } from "@/lib/firebase/client";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";

/**
 * Mirrors mobile's logout flow: clear the session cookie and Firebase auth.
 * Redux lives only inside the (app) layout, so callers there should
 * additionally dispatch UserDataAction.setUserLogout()/setUserRevenuCatLogOut()
 * and persistor.purge() before/after calling this.
 */
export async function signOutOfFirebase() {
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
  await auth.signOut();
}
