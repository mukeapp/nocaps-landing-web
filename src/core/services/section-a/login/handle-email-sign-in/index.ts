import {GetUserByEmail} from "@/core/api/section-a/user";
import {ToastColors} from "@/core/constants/Colors";
import {auth} from "@/core/firebase";
import {UserDataAction} from "@/core/redux/user-data";
import Toast from "react-native-root-toast";

const showToast = (message: string) =>
  Toast.show(message, {
    backgroundColor: ToastColors.error,
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

type Params = {
  email: string;
  password: string;
  rememberMe: boolean;
  dispatch: any;
  navigation: any;
  setLoading: (val: boolean) => void;
};

export const handleEmailSignIn = async ({
  email,
  password,
  rememberMe,
  dispatch,
  navigation,
  setLoading,
}: Params) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    showToast("All fields are required.");
    return;
  }
  if (!EMAIL_RE.test(normalizedEmail)) {
    showToast("Please enter a valid email address.");
    return;
  }

  setLoading(true);
  try {
    const userCred: any = await auth.signInWithEmailAndPassword(
      normalizedEmail,
      password
    );

    if (userCred?.user?.emailVerified !== true) {
      await userCred.user.sendEmailVerification();
      showToast("Please verify your email address to continue.");
      return;
    }

    const refreshToken = userCred.user.refreshToken;
    const accessToken = await userCred.user.getIdToken();
    const uid = userCred.user.uid;
    const email = userCred.user.email;

    console.log("User signed in:", userCred.user.email);

    try {
      const res = await GetUserByEmail({ mail: normalizedEmail });
      console.log("GetUserByEmail response:", res?.data);
      const collectdata = res?.data;

      dispatch(
        UserDataAction.setUserData({
          idToken: refreshToken,
          accessToken,
          collectdata,
        })
      );

      dispatch(UserDataAction.setUserAuth(accessToken));

      if (rememberMe) {
        dispatch(UserDataAction.setUserEmail(normalizedEmail));
      }
    } catch (apiErr: any) {
      console.log("Error fetching user by email:");
      //console.log("GetUserByEmail API error:", apiErr);
      console.log("API error details:", apiErr?.data?.error);
      setLoading(false);
      if (apiErr?.data?.error === "Not Found") {
        navigation.navigate("termservice", {
          uid,
          email,
          refreshToken,
          accessToken
        });
        setLoading(false);
        //return;
      } else {
        setLoading(false);
        console.warn("GetUserByEmail error:", apiErr);
        showToast("Unable to fetch user profile.");
      }
    } finally {
      setLoading(false);
    }
  } catch (err: any) {
    console.log("Error signing in:");
    console.log("signIn error:", err);
    console.log("signIn error:", err?.message ?? err);
    showToast("User not found or wrong credentials.");
  } finally {
    setLoading(false);
  }
};
