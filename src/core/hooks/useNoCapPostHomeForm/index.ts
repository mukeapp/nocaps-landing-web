import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { canEditScreen } from "@/core/utils";
import { RouterData } from "@/core/models/section-b";
import { NocapPost, PageFetcherNocapPost } from "@/core/models/section-c";
import { useInfiniteListNoCapPost } from "../useInfiniteListNoCapPost";
import { deleteNocapPostDataPurge, fetchNocapPostComponentsByVisibilityAndUserIds, fetchNocapPostComponentsPaginated } from "@/core/services/section-c/section-c-1/post";
import { fetchUserAreFriendsAndMapForPagination } from "@/core/services/section-b";

type RootState = any; // TODO: Replace with actual RootState type

export const ALL_FRIENDS_ID = "__all__";

type FriendFilterItem = { userId: string; username: string; photo?: string | null };

type Props = {
  navigation: any;
  route: any;
};

export default function useNoCapPostHomeForm({ navigation, route }: Props) {
  const userId = useSelector(
    (state: RootState) => state?.user?.userdata?.collectdata?.userId
  ) as string | undefined;

  const user = useSelector((state: RootState) => state?.user?.userdata?.collectdata);

  const originScreen = route.params?.originScreen;
  const destinationScreenTitle = route.params?.destinationScreenTitle || "NoCaps Post Home";
  const cameFromDrawerTab = !originScreen || originScreen === "drawer";
  const canEdit = canEditScreen(originScreen);

  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<FriendFilterItem[]>([]);
  const [selectedFriendUserId, setSelectedFriendUserId] = useState<string>(ALL_FRIENDS_ID);
  const userIdsRef = useRef<string>("");
  const isAllModeRef = useRef(true);
  const hasMountedRef = useRef(false);
  const loadGuardRef = useRef(false);

  // Keep refs in sync with current selection
  useEffect(() => {
    if (!userId) return;
    isAllModeRef.current = selectedFriendUserId === ALL_FRIENDS_ID;
    if (selectedFriendUserId !== ALL_FRIENDS_ID) {
      userIdsRef.current = selectedFriendUserId;
    } else {
      const ids = [userId, ...friends.map((f) => f.userId)].filter(Boolean);
      userIdsRef.current = ids.join(",");
    }
  }, [selectedFriendUserId, friends, userId]);

  const fetcher: PageFetcherNocapPost<NocapPost> = useCallback(
    (postVisibility: number, pageNumber: number, pageSize: number) => {
      if (isAllModeRef.current) {
        return fetchNocapPostComponentsPaginated({ pageNumber, pageSize, postVisibility });
      }
      return fetchNocapPostComponentsByVisibilityAndUserIds({
        pageNumber,
        pageSize,
        postVisibility,
        userIds: userIdsRef.current,
      });
    },
    []
  );

  const postsFetcher = useInfiniteListNoCapPost<NocapPost>(fetcher, 0);
  const { reset: fetcherReset, loadNext: fetcherLoadNext } = postsFetcher;

  const navigateToHabitLink = useCallback(
    (routerData: RouterData) => {
      navigation.navigate("habitlinks", {
        originScreen: "my-habit-library",
        routerData,
      });
    },
    [navigation]
  );

  const load = useCallback(async () => {
    if (!userId || loadGuardRef.current) return;
    loadGuardRef.current = true;

    setLoading(true);
    try {
      // Fetch friends list
      const friendData = await fetchUserAreFriendsAndMapForPagination(userId, 1, 1000);
      const mapped: FriendFilterItem[] = (friendData.items ?? []).map((f: any) => ({
        userId: f.userId,
        username: f.username || f.firstName || "Friend",
        photo: f.photo ?? null,
      }));
      const selfEntry: FriendFilterItem = {
        userId: userId!,
        username: user?.username || user?.firstName || "Me",
        photo: user?.photo ?? null,
      };
      setFriends([selfEntry, ...mapped]);

      await fetcherReset();
      await fetcherLoadNext();
    } catch (error) {
      console.error("Failed to load NoCaps posts:", error);
      Toast.show("Failed to load NoCaps posts");
    } finally {
      setLoading(false);
      loadGuardRef.current = false;
    }
  }, [userId, fetcherReset, fetcherLoadNext]);

  // Reload feed when the selected friend changes (skip initial mount — focus listener handles that)
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (userId) load();
  }, [selectedFriendUserId]);

  const deletePurgeNoCapPost = useCallback(
    async (postId?: string) => {
      if (!postId) return;
      console.log("deletePurgeNoCapPost - NocapPost id:", postId);
      try {
        await deleteNocapPostDataPurge(postId);
        Toast.show("Post deleted successfully");
      } catch (error) {
        console.error("Failed to delete NoCaps post:", error);
        Toast.show("Failed to delete post");
      }
      await load();
    },
    [load]
  );

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
    navigateToHabitLink,
    postsFetcher,
    deletePurgeNoCapPost,
    friends,
    selectedFriendUserId,
    setSelectedFriendUserId,
    reload: load,
    loadInProgressRef: loadGuardRef,
  };
}
