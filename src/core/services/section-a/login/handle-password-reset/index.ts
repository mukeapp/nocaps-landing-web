// src/core/service/handlePasswordReset.ts
import {auth} from "@/core/firebase";
import {showToastError} from "@/core/utils/utilities/toast";
import {isValidEmail} from "@/core/utils/utilities/validation";

type Params = {
  email: string;
  setLoading: (v: boolean) => void;
  navigation: any;
};

export const handlePasswordReset = async ({
  email,
  setLoading,
  navigation,
}: Params) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    showToastError("Please enter a valid email address.");
    return;
  }

  setLoading(true);
  try {
    await auth.sendPasswordResetEmail(normalizedEmail);
    showToastError("Password reset email sent. Please check your inbox.");
    navigation.navigate("signin");
  } catch (err: any) {
    console.warn("Password Reset Error:");
    console.warn("sendPasswordResetEmail error:", err);
    // Optional: handle specific Firebase codes
    if (err?.code === "auth/user-not-found") {
      showToastError("Email not found.");
    } else {
      showToastError("Unable to send reset email. Please try again.");
      console.log("sendPasswordResetEmail error:", err?.message ?? err);
    }
  } finally {
    setLoading(false);
  }
};
