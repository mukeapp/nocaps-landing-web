
import {auth} from "@/core/firebase";
import {UserDataAction} from "@/core/redux/user-data";
import {showToast, showToastError} from "@/core/utils/utilities/toast";
import {isStrongPassword, isValidEmail} from "@/core/utils/utilities/validation";
import {Alert} from "react-native";

type Params = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dispatch: any;
  navigation: any;
  setLoading: (v: boolean) => void;
};

export const handleEmailSignUp = async ({
  firstName,
  lastName,
  userName,
  email,
  password,
  confirmPassword,
  dispatch,
  navigation,
  setLoading,
}: Params) => {
  const e = email.trim().toLowerCase();
  const uname = userName.trim().toLowerCase();

  // Basic validation
  if (!firstName || !lastName || !uname || !e || !password || !confirmPassword) {
    showToastError("All fields are required.");
    return;
  }
  if (!isValidEmail(e)) {
    showToastError("Please enter a valid email address.");
    return;
  }
  if (password !== confirmPassword) {
    showToastError("Passwords do not match.");
    return;
  }
  if (!isStrongPassword(password)) {
    showToastError(
      "Password must be at least 8 characters and include a capital letter, a number, and a special character."
    );
    return;
  }

  setLoading(true);
  try {
    // If using modular v9, prefer: createUserWithEmailAndPassword(auth, e, password)
    const cred: any = await auth.createUserWithEmailAndPassword(e, password);

    // Store temp data for next steps in onboarding
    dispatch(
      UserDataAction.setTempData({
        first: firstName,
        last: lastName,
        username: uname,
      })
    );

    // Attempt to send verification email (non-fatal if it fails)
    try {
      await cred?.user?.sendEmailVerification?.();
    } catch (verr) {
      console.log("Error sending email verification:");
      console.log("sendEmailVerification error:", verr);
    }

    Alert.alert(
      "Signup Successful",
      "Verification email sent. Please check your inbox.",
      [{ text: "OK", onPress: () => navigation.navigate("signin") }],
      { cancelable: false }
    );
  } catch (err: any) {
    console.warn("Sign Up Error:");
    console.log("Error code:", err);
    if (err?.code === "auth/email-already-in-use") {
      showToast("This email is already registered. Please log in instead.");
    } else {
      console.warn("Sign Up Error:", err?.message ?? err);
      showToast("Unable to sign up. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};