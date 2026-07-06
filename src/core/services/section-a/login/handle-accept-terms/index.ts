// src/app/service/handleAcceptTerms.ts

import {SaveUserInFirestore} from "@/core/api/section-a/user";
import {UserDataAction} from "@/core/redux/user-data";
import {buildUserFromTempAndAuth, showToast} from "@/core/utils";

type TempData = { first: string; last: string; username: string } | null;

type AuthTokens = {
  uid: string;
  email?: string | null;
  accessToken: string;
  refreshToken: string;
};

type Params = {
  acceptedTerms: boolean;
  wantsNews: boolean; // reserved for future
  tempdata: TempData;
  auth: AuthTokens;
  dispatch: any;
  navigation: any;
  setLoading: (v: boolean) => void;
};

export const handleAcceptTerms = async ({
  acceptedTerms,
  wantsNews, // currently unused
  tempdata,
  auth,
  dispatch,
  navigation,
  setLoading,
}: Params) => {
  if (!acceptedTerms) {
    showToast("Please check our Terms of Service & Privacy Policy.");
    return;
  }

  // console.log("Tempdata at handleAcceptTerms:", tempdata);
  // console.log("Auth at handleAcceptTerms:", auth);

  if (!tempdata?.first || !tempdata?.last || !tempdata?.username) {
    showToast("Missing profile info. Please sign up again.");
    return;
  }

  if (!auth?.uid || !auth?.accessToken || !auth?.refreshToken) {
    showToast("Missing auth data. Please sign in again.");
    return;
  }

  setLoading(true);
  try {
    const loggedUser = buildUserFromTempAndAuth(
      {
        first: tempdata.first,
        last: tempdata.last,
        username: tempdata.username,
      },
      { uid: auth.uid, email: auth.email }
    );

    const res = await SaveUserInFirestore({
      loggedUser,
      token: auth.accessToken,
    });

    const collectdata = res?.data;

    dispatch(
      UserDataAction.setUserData({
        idToken: auth.refreshToken,
        accessToken: auth.accessToken,
        collectdata,
      })
    );

    navigation.navigate("interestsector");
  } catch (error) {
    console.log("Error enabling and saving location:");
    console.log("Error In SaveUserInFirestore", error);
    showToast("Unable to complete setup. Please try again.");
  } finally {
    setLoading(false);
  }
};
