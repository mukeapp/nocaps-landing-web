import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { IUser } from "@/core/models/section-a";
import { HabitCategory, HabitStackComponent, RouterData } from "@/core/models/section-b";

type FriendFilterItem = { userId: string; username: string; photo?: string | null };
import { fetchInterestSectors } from "@/core/services/section-a";
import {
  dataMigrationCopyHabitStackToAnotherUser,
  getHabitStackComponentsByUserIdsAndSectorAndHideFromFriends,
} from "@/core/services/section-b/section-b-0/habitstack";
import { dataMigrationCopyHabitLinkItemToAnotherUser, dataMigrationCopyHabitLinkToAnotherUser, dataMigrationCopyHabitToAnotherUser, fetchUserAreFriendsAndMapForPagination } from "@/core/services/section-b";
import { showToastSuccess } from "@/core/utils/utilities/toast";
import { canEditScreen } from "@/core/utils/utilities/screenAccessCore";
import {getHabitCategories, canShowCopyButton} from "@/core/utils";

type RootState = any;
type Props = { navigation: any; route: any };

export default function useMyFriendsAndHabitsForm({ navigation, route }: Props) {
  const navigateToFriendsRequest = () =>
    navigation.navigate("friends-requests", {
      originScreen: "my-friends-and-habits",
    });

  const navigateToFriends = () =>
    navigation.navigate("your-friends", {
      originScreen: "my-friends-and-habits",
    });

  const navigateToNewFriends = () =>
    navigation.navigate("new-friends", {
      originScreen: "my-friends-and-habits",
    });

  const userId: string = useSelector(
    (s: RootState) => s?.user?.userdata?.collectdata?.userId
  );
  const userdata = useSelector((s: any) => s?.user?.userdata);
  const originScreen = route.params?.originScreen;
  const destinationScreenTitle = route.params?.destinationScreenTitle || "Friends and Habits";
  const showCopyButton: boolean = canShowCopyButton(originScreen);
  //console.log("showCopyButton", showCopyButton);
  const routerData: RouterData = route.params?.routeData || null;
  const dataHasOnlySelfUser = routerData?.dataHasOnlySelfUser || false;
  //console.log("routerData", routerData);
  const cameFromDrawerTab =
    originScreen == undefined || originScreen === "drawer" ? true : false;
  //console.log("cameFromDrawerTab", cameFromDrawerTab);
  const canEdit = canEditScreen(originScreen);
  let habitCategories: HabitCategory[] = getHabitCategories(originScreen);
  //console.log("originScreen", originScreen);
  //console.log("habitCategories", habitCategories);
  // const [habitCategories, setHabitCategories] = useState(_habitCategories);
  // console.log("habitCategories", habitCategories);
  const pre_selected_category_id = habitCategories[0]?.id || 1;
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(pre_selected_category_id);

  const [selectedFriendLinkId, setSelectedFriendLinkId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [sectors, setSectors] = useState<any[]>([]);
  const [stacksBySector, setStacksBySector] = useState<
    Record<string, HabitStackComponent[]>
  >({});
  const [friends, setFriends] = useState<FriendFilterItem[]>([]);
  const [selectedFriendUserId, setSelectedFriendUserId] = useState<string | null>(null);

  const fetchedSectorIdsRef = useRef<Set<string>>(new Set());

  const [friendLinks, setFriendLinks] = useState([
    {
      id: 1,
      name: "Friends Requests",
      link: "friends-requests",
      OnPress: navigateToFriendsRequest,
    },
    {
      id: 2,
      name: "Your Friends",
      link: "your-friends",
      OnPress: navigateToFriends,
    },
    {
      id: 3,
      name: "New Friends",
      link: "new-friends",
      OnPress: navigateToNewFriends,
    },
  ]);

  //  Set Habit Categories based on originScreen

  const setHabitCategoriesBasedOnOrigin = useCallback(() => {
    //console.log("originScreen log-002 :", originScreen);
    const categories = getHabitCategories(originScreen);
    habitCategories = categories;
    //console.log("categories log-003 :", categories);
    const firstCategoryId = categories[0]?.id || 1;
    setSelectedCategoryId(firstCategoryId);
  }, [originScreen]);

  // useEffect(() => {
  //   setHabitCategoriesBasedOnOrigin();
  // }, [setHabitCategoriesBasedOnOrigin]);

  // Main load function that resets everything and reloads
  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Clear previous data
      setHabitCategoriesBasedOnOrigin();
      setStacksBySector({});
      setSelectedFriendUserId(null);
      fetchedSectorIdsRef.current.clear();

      const result = await fetchInterestSectors();
      setSectors(filterSectorsByRouterDataSectorId(routerData, result));

      if (!dataHasOnlySelfUser) {
        const friendData = await fetchUserAreFriendsAndMapForPagination(userId, 1, 1000);
        const mapped: FriendFilterItem[] = (friendData.items ?? [])
          .filter((f) => !!f.userId)
          .map((f) => ({
            userId: f.userId!,
            username: f.username || f.firstName || "Friend",
            photo: f.photo ?? null,
          }));
        setFriends(mapped);
      }
    } catch (e) {
      Toast.show("Failed to load habit links");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const filterSectorsByRouterDataSectorId = (routerData: RouterData, interestSectors: any[]) => {

    const data = Array.isArray(interestSectors) ? interestSectors : [];

    if(routerData && routerData.habitSectorId){
      const filteredData = data.filter((sector) => sector.documentId === routerData.habitSectorId);
      return filteredData;
    }
    return data;
  }

  const fetchStacks = useCallback(
    async (sectorDocId?: string) => {
      if (!sectorDocId) return;
      if (fetchedSectorIdsRef.current.has(sectorDocId)) return;
      fetchedSectorIdsRef.current.add(sectorDocId);
      try {
        let friendData;
        let data;
        let userIds: any;

        //console.log("dataHasOnlySelfUser value:", dataHasOnlySelfUser);
        if(dataHasOnlySelfUser){
          data = await getHabitStackComponentsByUserIdsAndSectorAndHideFromFriends(
            [userId],
            sectorDocId
          );
        } else {
          friendData = await fetchUserAreFriendsAndMapForPagination(
            userId,
            1,
            1000
          );
          userIds = friendData.items?.map((f) => f.userId);
          data = await getHabitStackComponentsByUserIdsAndSectorAndHideFromFriends(
            userIds ? userIds : [],
            sectorDocId
          );
        }
        setStacksBySector((prev) => ({
          ...prev,
          [sectorDocId]: Array.isArray(data) ? data : [],
        }));
      } catch (e) {
        // If it fails, allow future retries
        fetchedSectorIdsRef.current.delete(sectorDocId);
      }
    },
    [userId]
  );

  // function called copyItem
  const copyItem = useCallback(
    async (id?: string, parentId?: string, dataType?: string) => {

      console.log("Checking --> Current userId:", userId);
      console.log("Checking --> documentId :", id);
      console.log("Checking --> parentId :", parentId);
      console.log("Checking --> dataType :", dataType);

      if(dataType == "habit-stack"){
        console.log("Copying habit stack...");
        await dataMigrationCopyHabitStackToAnotherUser({
          habitStackId: id,
          newOwnerUserId: userId,
        });
      } else if (dataType == "habit") {
        console.log("Copying habit...");

        console.log("parentHabitStackId :", routerData.habitStackId); // habitStackId
        console.log("habitId :", id); // habitId to copy
        console.log("newOwnerUserId :", userId);
        await dataMigrationCopyHabitToAnotherUser({
          parentHabitStackId: routerData.habitStackId,
          habitId: id,
          newOwnerUserId: userId,
        });
      } else if (dataType == "habit-link") {
        console.log("Copying habit link...");
        console.log("parentHabitId :", routerData.habitId);
        console.log("habitLinkId :", id);
        console.log("newOwnerUserId :", userId);
        await dataMigrationCopyHabitLinkToAnotherUser({
          parentHabitId: routerData.habitId,
          habitLinkId: id,
          newOwnerUserId: userId,
        });
      } else if (dataType == "habit-link-item") {
        console.log("Copying habit link item...");
        console.log("parentHabitLinkId :", routerData.habitLinkId);// habitLinkId
        console.log("habitLinkItemId :", id); // habitLinkItemId to copy
        console.log("newOwnerUserId :", userId);
        await dataMigrationCopyHabitLinkItemToAnotherUser({
          parentHabitLinkId: routerData.habitLinkId,
          habitLinkItemId: id,
          newOwnerUserId: userId,
        });
      }
      showToastSuccess("Item copied to your habit library.");
    },
    [userId] // Dependencies: recreate function only when userId changes
  );

  const filteredStacksBySector = useMemo(() => {
    if (!selectedFriendUserId) return stacksBySector;
    const filtered: Record<string, HabitStackComponent[]> = {};
    for (const [sectorId, stacks] of Object.entries(stacksBySector)) {
      filtered[sectorId] = stacks.filter((s) => s.userId === selectedFriendUserId);
    }
    return filtered;
  }, [stacksBySector, selectedFriendUserId]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);

  return {
    loading,
    userdata,
    userId,
    friendLinks,
    selectedFriendLinkId,
    setSelectedFriendLinkId,
    navigateToFriendsRequest,
    navigateToFriends,
    navigateToNewFriends,
    sectors,
    stacksBySector,
    fetchStacks,
    setHabitCategoriesBasedOnOrigin,
    load,
    copyItem,
    cameFromDrawerTab,
    canEdit,
    habitCategories,
    selectedCategoryId,
    setSelectedCategoryId,
    showCopyButton,
    destinationScreenTitle,
    friends,
    selectedFriendUserId,
    setSelectedFriendUserId,
    filteredStacksBySector,
  };
}
