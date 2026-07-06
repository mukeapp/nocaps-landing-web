// src/core/service/location.ts
import * as Location from "expo-location";
import { SaveUserLocationFirestore } from "@/core/api/section-a";
import { UserDataAction } from "@/core/redux/user-data";
import { showToast } from "@/core/utils";

/**
 * Request foreground location permission, read coords, reverse geocode,
 * save to backend, and set the user as authenticated.
 */
export async function enableAndSaveLocation(params: {
  collectId?: string; // userdata.collectdata.id
  userId?: string; // userdata.collectdata.userId  (your backend's user id)
  accessToken?: string; // userdata.accessToken (for redux setUserAuth)
  dispatch: any;
  setLoading: (v: boolean) => void;
}) {
  const { collectId, userId, accessToken, dispatch, setLoading } = params;

  if (!collectId || !userId) {
    showToast("Missing user information. Please sign in again.");
    return;
  }

  setLoading(true);
  try {
    // 1) Ask permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      showToast("Permission to access location was not granted.");
      return;
    }

    // 2) Get coordinates
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    // 3) Reverse geocode (best-effort)
    let city: string | null;
    let country: string | null;
    let pull_data: any;
    try {
      const resp = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      const first = resp?.[0];
      city = first?.city;
      country = first?.country;

      // 4) Build payload exactly like your previous code (key name `pull_data`)
      pull_data = {
        id: collectId,
        userId,
        isSelected: true,
        coordinates: coords,
        city,
        country,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.log("Error reverse geocoding:");
      // ignore reverse geocode failures; still save coords
      console.log("Reverse geocode failed:", error);
    }

    await SaveUserLocationFirestore({ pull_data });

    // 5) Mark user as authenticated (keeps your app flow the same)
    if (accessToken) {
      dispatch(UserDataAction.setUserAuth(accessToken));
    }
  } catch (e) {
    console.log("Error enabling and saving location:");
    console.log("enableAndSaveLocation error:", e);
    showToast("Unable to save your location. Please try again.");
  } finally {
    setLoading(false);
  }
}

/** Skip location saving, just mark user authenticated. */
export function skipLocation(params: { accessToken?: string; dispatch: any }) {
  const { accessToken, dispatch } = params;
  // console.log("AccessToken at skipLocation:", accessToken);
  if (accessToken) {
    // console.log("Dispatching setUserAuth with accessToken.");
    dispatch(UserDataAction.setUserAuth(accessToken));
  }
}
