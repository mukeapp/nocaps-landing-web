// @react-native-google-signin → firebase web popup (approved plan: same flow,
// popup instead of native sheet). Returns the v16 result shape the mobile
// SigninScreen expects ({ type, data: { idToken } }).
import { auth, firebase } from "@/core/firebase";

export const GoogleSignin = {
  configure: (_options?: any) => {},
  hasPlayServices: async (_options?: any) => true,
  signIn: async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const credential: any = result.credential;
    return {
      type: "success",
      data: {
        idToken: credential?.idToken ?? null,
        user: {
          email: result.user?.email,
          name: result.user?.displayName,
          photo: result.user?.photoURL,
          id: result.user?.uid,
        },
      },
    };
  },
  signOut: async () => {
    await auth.signOut();
  },
  getCurrentUser: async () => null,
};

export function isSuccessResponse(response: any): boolean {
  return response?.type === "success";
}

export function isErrorWithCode(error: any): boolean {
  return !!error && typeof error === "object" && "code" in error;
}

export const statusCodes = {
  SIGN_IN_CANCELLED: "SIGN_IN_CANCELLED",
  IN_PROGRESS: "IN_PROGRESS",
  PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES_NOT_AVAILABLE",
};
