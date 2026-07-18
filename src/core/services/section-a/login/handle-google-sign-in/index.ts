import {GetUserByEmail} from "@/core/api/section-a/user";
import {ToastColors} from "@/core/constants/Colors";
import { auth } from "@/core/firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import {UserDataAction} from "@/core/redux/user-data";
import {Alert} from "react-native";
import Toast from "react-native-root-toast";

const showToast = (message: string) =>
  Toast.show(message, {
    backgroundColor: ToastColors.error,
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
  });

type Params = {
  result: any; // result from promptAsync()
  dispatch: any;
  navigation: any;
  rememberMe?: boolean;
  setLoading: (v: boolean) => void;
};

export const handleGoogleSignIn = async ({
  result,
  dispatch,
  navigation,
  rememberMe = false,
  setLoading,
}: Params) => {
  if (!result || result.type !== "success") return;

  setLoading(true);
  try {
    const idToken = result.authentication?.idToken;
    const userProfile = result?.userProfile;

    dispatch(
      UserDataAction.setTempData(userProfile)
    );

    if (!idToken) {
      console.log("No idToken returned from Google Sign-In");
      //Alert.alert("Google sign-in failed (no idToken).");
      //showToast("Google sign-in failed (no idToken).");
      return;
    }

    // const gcpAccessToken = result.authentication?.accessToken;

    // if (!gcpAccessToken) {
    //   console.log("No accessToken returned from Google Sign-In");
    //   Alert.alert("Google sign-in failed (no accessToken).");
    //   //showToast("Google sign-in failed (no accessToken).");
    //   return;
    // } else {
    //   console.log("Obtained accessToken from Google Sign-In");
    //   Alert.alert("Successfully obtained accessToken from Google Sign-In.");
    // }

    const cred = GoogleAuthProvider.credential(idToken);
    // Build a Firebase credential the v9+ way
    // const credential = GoogleAuthProvider.credential(idToken, gcpAccessToken || undefined);

    if (!cred) {
      console.log("Failed to create Firebase credential from Google idToken");
      //Alert.alert("Google sign-in failed (credential error).");
      //showToast("Google sign-in failed (credential error).");
      return;
    } else {
      console.log("Firebase credential created from Google idToken");
      //Alert.alert("Google credential created.");
    }

    const userCred = await signInWithCredential(auth, cred);

    if (!userCred || !userCred.user) {
      console.log("Failed to sign in with Google credential");
      //Alert.alert("Google sign-in failed (user credential error).");
      //showToast("Google sign-in failed (user credential error).");
      return;
    } else {
      console.log("Signed in with Google credential");
      //Alert.alert("Successfully signed in with Google credential.");
    }

    const refreshToken = userCred.user.refreshToken;

    if (!refreshToken) {
      console.log("No refreshToken returned from Firebase user");
      //Alert.alert("Google sign-in failed (no refreshToken).");
      //showToast("Google sign-in failed (no refreshToken).");
      return;
    } else {
      console.log("Obtained refreshToken from Firebase user");
      //Alert.alert("Successfully obtained refreshToken from Firebase user.");
    }

    const accessToken = await userCred.user.getIdToken();

    if (!accessToken) {
      console.log("Failed to get accessToken from Firebase user");
      //Alert.alert("Google sign-in failed (no accessToken).");
      //showToast("Google sign-in failed (no accessToken).");
      return;
    } else {
      console.log("Obtained accessToken from Firebase user");
      //Alert.alert("Successfully obtained accessToken from Firebase user.");
    }

    const uid = userCred.user.uid;

    if (!uid) {
      console.log("No UID returned from Firebase user");
      //Alert.alert("Google sign-in failed (no UID).");
      //showToast("Google sign-in failed (no UID).");
      return;
    } else {
      console.log("Obtained UID from Firebase user");
      //Alert.alert("Successfully obtained UID from Firebase user.");
    }

    const email = userCred.user.email;

    if (!email) {
      console.log("No email returned from Firebase user");
      //Alert.alert("Google sign-in failed (no email).");
      //showToast("Google sign-in failed (no email).");
      return;
    } else {
      console.log("Obtained email from Firebase user");
      //Alert.alert("Successfully obtained email from Firebase user.");
    }

    console.log("User signed in:", userCred.user.email);

    //Alert.alert("Successfully signed in with Google.");
    //showToast("Successfully signed in with Google.");

    try {
      const res = await GetUserByEmail({ mail: email });
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

      if (rememberMe && email) {
        dispatch(UserDataAction.setUserEmail(email));
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
        return;
      } else {
        console.warn("GetUserByEmail error:", apiErr);
        Alert.alert("Unable to fetch user profile.");
        //showToast("Unable to fetch user profile.");
      }
    } finally {
      setLoading(false);
    }
  } catch (e) {
    console.log("Error signing in:");
    console.log("Google sign-in error:", e);
    Alert.alert("Google sign-in failed. User not found or wrong credentials.");
    //showToast("Google sign-in failed. User not found or wrong credentials.");
  } finally {
    setLoading(false);
  }
};
