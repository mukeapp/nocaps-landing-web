import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { canEditScreen } from "@/core/utils";
import { RouterData } from "@/core/models/section-b";
import { IUser } from "@/core/models/section-a";
import {UserDataAction} from "@/core/redux/user-data";
import {fetchUserByUserId, updateUserInFirestore} from "@/core/services/section-a/user";

type RootState = any; // replace with your real RootState

type Props = { navigation: any; route: any; media1?: any; media2?: any, dispatch: any };

export default function useProfileEditForm({
  navigation,
  route,
  media1,
  media2,
  dispatch,
}: Props) {
  const userId: string = useSelector(
    (s: RootState) => s?.user?.userdata?.collectdata?.userId
  );
  const user = useSelector((s: any) => s?.user?.userdata.collectdata);
  const originScreen = route.params?.originScreen;
  const canEdit = canEditScreen(originScreen);
  const cameFromDrawerTab =
    originScreen == undefined || originScreen === "drawer" ? true : false;
  const destinationScreenTitle =
    route.params?.destinationScreenTitle || "My Profile";
  const routerData: RouterData = route.params?.routeData || null;
  const dataHasOnlySelfUser = routerData?.dataHasOnlySelfUser || false;

  const [bannerImage, setBannerImage] = useState<string | undefined>(
    user?.bannerImage || undefined
  );
  const [userProfileImage, setUserProfileImage] = useState<string | undefined>(
    user?.photo || undefined
  );

  //console.log("ProfileForm user 000:", user);

  const [firstName, setFirstName] = useState<string | undefined>(
    user?.firstName || undefined
  );
  const [lastName, setLastName] = useState<string | undefined>(
    user?.lastName || undefined
  );
  const [userName, setUserName] = useState<string | undefined>(
    user?.username || undefined
  );
  const [description, setDescription] = useState<string | undefined>(
    user?.description || undefined
  );

  const [loading, setLoading] = useState(false);

   // when media preview changes (new upload or from existing initial data)

  useEffect(() => {
    if (media2?.preview) {
      setUserProfileImage(media2.preview); // this will be the uploaded downloadURL once upload completes
    }
  }, [media2?.preview])

  useEffect(() => {
    if (media1?.preview) {
      setBannerImage(media1.preview); // this will be the uploaded downloadURL once upload completes
    }
  }, [media1?.preview]);

  // hydrate
  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
    } catch (e) {
      console.error(e);
      Toast.show("Failed to load habit links");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);

  const onSave = useCallback(async () => {
    if (!firstName?.trim()) return Toast.show("First name is required");
    if (!lastName?.trim()) return Toast.show("Last name is required");
    if (!userName?.trim()) return Toast.show("Username is required");
    // if (!description?.trim()) return Toast.show("Description is required");

    // console.log("user onSave: user:", user);

    const updatedData: IUser = {
      //userId: "f6ce726d-9edc-4413-ad55-97220e9dbd49",
      username: userName.trim(),
      //id: "8a666cd7-b474-40fc-b1fd-a4a182f2a1ee",
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      // tags: [],
      // roles: [
      //   "ADMIN",
      //   "USER"
      // ],
      description: "A short bio about the user",
      photo: userProfileImage,
      bannerImage: bannerImage,
      // email: "john.doe@example.com",
      // createdAt: "2023-01-01T00:00:00Z",
      // updatedAt: "2023-01-02T00:00:00Z"
    };

    console.log("ProfileForm onSave updatedData:", updatedData);

    try {
      setLoading(true);
      // call service to update user in Firestore
      // assuming you have a service function updateUserInFirestore
      const res = await updateUserInFirestore(updatedData, user.documentId);
      const updatedUser = await fetchUserByUserId(userId);

      if (updatedUser) {
        //console.log("ProfileForm onSave updatedUser:", updatedUser);
        // Optionally update Redux store or local state with updated user data
        dispatch(UserDataAction.setUserCollectData(updatedUser));
      }

      if (res === 200) {
        Toast.show("Profile updated successfully");
        navigation.goBack();
      } else {
        Toast.show("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast.show("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }


  }, [userId, firstName, lastName, userName, description, media1, media2]);

  return {
    loading,
    user,
    userId,
    canEdit,
    cameFromDrawerTab,
    destinationScreenTitle,
    load,
    //navigateToHabitLink,

    bannerImage,
    userProfileImage,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    userName,
    setUserName,
    description,
    setDescription,
    onSave,
  };
}
