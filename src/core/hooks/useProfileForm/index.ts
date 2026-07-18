import {getHabitStackComponentsByUserId} from "@/core/api/section-b";
import {
  HabitStackChips,
  HabitStackComponent,
  RouterData,
  StatGroup,
} from "@/core/models/section-b";
import {UserDataAction} from "@/core/redux/user-data";
import {fetchUserByUserId} from "@/core/services/section-a/user";
import {getHabitStacksForFriends} from "@/core/services/section-b";
import {
  createFriendRequest,
  deleteFriendRequest,
  fetchFriendsRequestsAndMapForPagination,
  fetchUserAreFriendsAndMapForPagination,
  updateFriendRequestAreFriends,
} from "@/core/services/section-b/section-b-1";
import {canEditScreen, showToastSuccess} from "@/core/utils";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Toast from "react-native-root-toast";
import {useDispatch, useSelector} from "react-redux";

type RootState = any; // replace with your real RootState

type Props = { navigation: any; route: any };

export default function useProfileForm({ navigation, route }: Props) {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((s: any) => s?.user?.userdata?.collectdata);

  const originScreen = route.params?.originScreen;
  //console.log("originScreen:", originScreen);

  const canEdit = canEditScreen(originScreen);
  const cameFromDrawerTab =
    originScreen == undefined || originScreen === "drawer" ? true : false;
  const routerData: RouterData = route.params?.routerData || null;
  const userIdFromRoute: string | undefined = routerData?.userId || undefined;

  console.log("userIdFromRoute:", userIdFromRoute);

  const dataHasOnlySelfUser = cameFromDrawerTab
    ? true
    : routerData?.dataHasOnlySelfUser || false;

  // FIX: Add user state
  const [user, setUser] = useState(userIdFromRoute ? null : loggedInUser);
  const userId = userIdFromRoute ? userIdFromRoute : loggedInUser?.userId;
  const isMyUserProfile = userId === loggedInUser?.userId;
  const canEditProfile = cameFromDrawerTab || isMyUserProfile ? true : false;

  const destinationScreenTitle = isMyUserProfile
    ? "My Profile"
    : "User Profile";

  // Friendship state
  const [friendshipStatus, setFriendshipStatus] = useState<
    "none" | "pending-sent" | "pending-received" | "friends"
  >("none");
  const [friendDocId, setFriendDocId] = useState<string | undefined>(undefined);
  const friendDocIdRef = useRef<string | undefined>(undefined);
  const [friendshipLoading, setFriendshipLoading] = useState(false);

  const checkFriendshipStatus = useCallback(async () => {
    if (!loggedInUser?.userId || !userIdFromRoute || isMyUserProfile) {
      setFriendshipStatus("none");
      return;
    }
    try {
      // 1. Check confirmed friends
      const friendsRes = await fetchUserAreFriendsAndMapForPagination(
        loggedInUser.userId,
        1,
        1000,
      );
      const friendEntry = friendsRes.items.find(
        (f: any) => f.userId === userIdFromRoute,
      );
      if (friendEntry?.friend?.areFriend) {
        setFriendshipStatus("friends");
        setFriendDocId(friendEntry.friend.documentId);
        friendDocIdRef.current = friendEntry.friend.documentId;
        return;
      }

      // 2. Check pending friend requests (both sent and received)
      const requestsRes = await fetchFriendsRequestsAndMapForPagination(
        loggedInUser.userId,
        1,
        1000,
      );
      const requestEntry = requestsRes.items.find(
        (f: any) => f.userId === userIdFromRoute,
      );
      if (requestEntry?.friend?.friendRequestStatus === "pending") {
        if (requestEntry.friend.isSender) {
          setFriendshipStatus("pending-sent");
        } else {
          setFriendshipStatus("pending-received");
        }
        setFriendDocId(requestEntry.friend.documentId);
        friendDocIdRef.current = requestEntry.friend.documentId;
        return;
      }

      // 3. No relationship found
      setFriendshipStatus("none");
      setFriendDocId(undefined);
      friendDocIdRef.current = undefined;
    } catch (e) {
      console.error("Error checking friendship status:", e);
      setFriendshipStatus("none");
    }
  }, [loggedInUser?.userId, userIdFromRoute, isMyUserProfile]);

  const sendFriendRequestAction = useCallback(async () => {
    if (!loggedInUser?.userId || !userIdFromRoute) return;
    setFriendshipLoading(true);
    try {
      const res = await createFriendRequest(
        loggedInUser.userId,
        userIdFromRoute,
      );
      const newDocId = res?.documentId ?? res?.id;
      if (newDocId) {
        setFriendDocId(newDocId);
        friendDocIdRef.current = newDocId;
      }
      setFriendshipStatus("pending-sent");
      showToastSuccess("Friend request sent");
    } catch (e) {
      console.error("Error sending friend request:", e);
    } finally {
      setFriendshipLoading(false);
    }
  }, [loggedInUser?.userId, userIdFromRoute]);

  const acceptFriendRequestAction = useCallback(async () => {
    const docId = friendDocIdRef.current;
    if (!docId) return;
    setFriendshipLoading(true);
    try {
      await updateFriendRequestAreFriends(docId, true);
      setFriendshipStatus("friends");
      showToastSuccess("Friend request accepted");
    } catch (e) {
      console.error("Error accepting friend request:", e);
    } finally {
      setFriendshipLoading(false);
    }
  }, []);

  const rejectFriendRequestAction = useCallback(async () => {
    const docId = friendDocIdRef.current;
    if (!docId) return;
    setFriendshipLoading(true);
    try {
      await deleteFriendRequest(docId);
      setFriendshipStatus("none");
      setFriendDocId(undefined);
      friendDocIdRef.current = undefined;
      showToastSuccess("Friend request rejected");
    } catch (e) {
      console.error("Error rejecting friend request:", e);
    } finally {
      setFriendshipLoading(false);
    }
  }, []);

  const unfriendAction = useCallback(async () => {
    const docId = friendDocIdRef.current;
    if (!docId) return;
    setFriendshipLoading(true);
    try {
      await deleteFriendRequest(docId);
      setFriendshipStatus("none");
      setFriendDocId(undefined);
      friendDocIdRef.current = undefined;
      showToastSuccess("Friend removed");
    } catch (e) {
      console.error("Error unfriending:", e);
    } finally {
      setFriendshipLoading(false);
    }
  }, []);

  const cancelFriendRequestAction = useCallback(async () => {
    const docId = friendDocIdRef.current;
    if (!docId) return;
    setFriendshipLoading(true);
    try {
      await deleteFriendRequest(docId);
      setFriendshipStatus("none");
      setFriendDocId(undefined);
      friendDocIdRef.current = undefined;
      showToastSuccess("Friend request cancelled");
    } catch (e) {
      console.error("Error cancelling friend request:", e);
    } finally {
      setFriendshipLoading(false);
    }
  }, []);

  const [activeToggle, setActiveToggle] = useState<"post" | "habitStacks">(
    "habitStacks",
  );

  const [activeTab, setActiveTab] = useState<string>(
    activeToggle === "post" ? "Posts" : "MyHabitStacks",
  );
  const [loading, setLoading] = useState(false);

  const [habitStacks, setHabitStacks] = useState<HabitStackComponent[]>([]);
  const [friendsHabitStacks, setFriendsHabitStacks] = useState<
    HabitStackComponent[] | []
  >([]);
  const [likedHabitStacks, setLikedHabitStacks] = useState<
    HabitStackComponent[] | []
  >([]);
  const [recommendedHabitStacks, setRecommendedHabitStacks] = useState<
    HabitStackComponent[] | []
  >([]);

  const [posts, setPosts] = useState<any[]>([]);
  const [friendsPosts, setFriendsPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<any[]>([]);

  const [habitStacksChips, setHabitStacksChips] = useState<HabitStackChips[]>(
    [],
  );
  const [stats, setStats] = useState<{
    postStats: StatGroup;
    habitStats: StatGroup;
  }>({
    postStats: {
      case1: { name: "Posts", value: 0 },
      case2: { name: "Following", value: 0 },
      case3: { name: "Followers", value: 0 },
    },
    habitStats: {
      case1: { name: "HabitStacks", value: 0 },
      case2: { name: "Habits", value: 0 },
      case3: { name: "HabitLinks", value: 0 },
    },
  });

  // hydrate
  const load = useCallback(async () => {
    let responseData: any[] = [];
    console.log("Loading profile data for userId:", userId);
    if (!userId) return;
    setLoading(true);

    try {
      if (dataHasOnlySelfUser) {
        const freshUser = await fetchUserByUserId(userId);
        if (freshUser) {
          setUser(freshUser);
          dispatch(UserDataAction.setUserCollectData(freshUser));
        }

        const res = await getHabitStackComponentsByUserId({
          id: userId,
        });
        responseData = res?.data ?? [];
        setHabitStacks(responseData);

        const friendRes = await getHabitStacksForFriends(userId);
        setFriendsHabitStacks(friendRes || []);
      } else if (userIdFromRoute) {
        // FIX: Fetch and set user in state
        const fetchedUser = await fetchUserByUserId(userIdFromRoute);
        setUser(fetchedUser); // Store in state!

        const res = await getHabitStackComponentsByUserId({
          id: userIdFromRoute,
        });
        const friendRes = await getHabitStacksForFriends(userIdFromRoute);
        responseData = res?.data ?? [];
        setHabitStacks(responseData);
        setFriendsHabitStacks(friendRes || []);
      }

      if (responseData.length > 0) {
        const chips = getHabitStackChips(responseData);
        setHabitStacksChips(chips);
        const habitStats = getHabitStats(responseData);
        setStats((prevStats) => ({
          ...prevStats,
          habitStats: habitStats,
        }));
      }

      // Check friendship status if viewing another user's profile
      if (!isMyUserProfile && loggedInUser?.userId) {
        await checkFriendshipStatus();
      }
    } catch (e) {
      console.error(e);
      Toast.show("Failed to load habit links");
    } finally {
      setLoading(false);
    }
  }, [
    userId,
    userIdFromRoute,
    dataHasOnlySelfUser,
    isMyUserProfile,
    loggedInUser?.userId,
    checkFriendshipStatus,
  ]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);

  const getHabitStackChips = (
    stacks: HabitStackComponent[],
  ): HabitStackChips[] => {
    return stacks
      .filter((stack) => stack?.id && stack?.name)
      .map((stack) => ({
        habitStackId: stack.id!,
        habitStackName: stack.name!,
        active: stack.status === "PLAY",
        color: stack.iconColor || "#FF69B4",
        hideFromFriends: stack.hideFromFriends,
        isPublic: stack.isPublic,
        habits: (stack.habitData || [])
          .filter((habit) => habit?.id && habit?.name)
          .map((habit) => ({
            id: habit.id!,
            name: habit.name!,
          })),
      }));
  };

  const aboutText: string = useMemo(() => {
    return (
      user?.description ||
      "Update your about me section to let others know more about you!"
    );
  }, [user]);

  const getHabitStats = (stacks: HabitStackComponent[]): StatGroup => {
    // Count total HabitStacks
    const habitStacksCount = stacks.length;

    // Count total Habits across all stacks
    const habitsCount = stacks.reduce(
      (acc, stack) => acc + (stack.habitData?.length || 0),
      0,
    );

    // Count total HabitLinks across all habits in all stacks
    const habitLinksCount = stacks.reduce((acc, stack) => {
      if (!stack.habitData) return acc;

      return (
        acc +
        stack.habitData.reduce(
          (linkAcc, habit) => linkAcc + (habit.habitLinkData?.length || 0),
          0,
        )
      );
    }, 0);

    const habitStats: StatGroup = {
      case1: { name: "HabitStacks", value: habitStacksCount },
      case2: { name: "Habits", value: habitsCount },
      case3: { name: "HabitLinks", value: habitLinksCount },
    };

    return habitStats;
  };

  const navigateToHabitLink = (habitLink: any) =>
    navigation.navigate("habitlinks", {
      originScreen: "profile",
      habitLink: habitLink,
    });

  const navigateToEditMyProfile = () => {
    const routerData: RouterData = {
      user: user,
    };

    navigation.navigate("profile-edit", {
      originScreen: "profile",
      routerData,
    });
  };

  return {
    loading,
    user,
    userId,
    canEdit,
    cameFromDrawerTab,
    destinationScreenTitle,
    load,
    aboutText,
    activeToggle,
    setActiveToggle,
    activeTab,
    setActiveTab,
    navigateToHabitLink,
    habitStacks,
    friendsHabitStacks,
    likedHabitStacks,
    recommendedHabitStacks,
    posts,
    friendsPosts,
    likedPosts,
    recommendedPosts,
    habitStacksChips,
    stats,
    navigateToEditMyProfile,
    canEditProfile,
    isMyUserProfile,
    friendshipStatus,
    friendshipLoading,
    sendFriendRequest: sendFriendRequestAction,
    acceptFriendRequest: acceptFriendRequestAction,
    rejectFriendRequest: rejectFriendRequestAction,
    unfriend: unfriendAction,
    cancelFriendRequest: cancelFriendRequestAction,
  };
}
