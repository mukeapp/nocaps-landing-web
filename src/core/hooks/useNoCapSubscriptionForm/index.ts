import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { canEditScreen } from "@/core/utils";
import { RouterData } from "@/core/models/section-b";

type RootState = any; // TODO: Replace with actual RootState type

type Props = {
  navigation: any;
  route: any;
};

export default function useNoCapSubscriptionForm({ navigation, route }: Props) {
  const userId = useSelector(
    (state: RootState) => state?.user?.userdata?.collectdata?.userId
  ) as string | undefined;

  const user = useSelector((state: RootState) => state?.user?.userdata);

  const originScreen = route.params?.originScreen;
  const destinationScreenTitle = route.params?.destinationScreenTitle || "NoCap Subscription";
  const cameFromDrawerTab = !originScreen || originScreen === "drawer";
  const canEdit = canEditScreen(originScreen);

  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // TODO: Add actual loading logic here
    } catch (error) {
      console.error("Failed to load habit links:", error);
      Toast.show("Failed to load habit links");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation, load]);

  return {
    loading,
    user,
    userId,
    cameFromDrawerTab,
    canEdit,
    destinationScreenTitle,
  };
}