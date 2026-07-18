import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import {useInfiniteList} from "../useInfiniteList";
import { showToast, showToastError, showToastSuccess } from "@/core/utils";

import {Friend, PageFetcher} from "@/core/models/section-b";
import {fetchNewFriends} from "@/core/services/section-b";
import {createFriendRequest, deleteFriendRequest, fetchFriendsRequestsAndMapForPagination, fetchNewFriendsAndMapForPagination, fetchUserAreFriendsAndMapForPagination, updateFriendRequestAreFriends} from "@/core/services/section-b/section-b-1";

type RootState = any; // replace with your real RootState

type Props = { navigation: any; route: any };

export default function useYourFriendsForm({ navigation, route }: Props) {
  const userId: string = useSelector(
    (s: RootState) => s?.user?.userdata?.collectdata?.userId
  );

  const userdata = useSelector((s: any) => s?.user?.userdata);

  const [loading, setLoading] = useState(false);


  const fetcher: PageFetcher<Friend> = useCallback(
    (userId: string, page: number, pageSize: number) => {
      return fetchUserAreFriendsAndMapForPagination(userId, page, pageSize);
    },
    []
  );

  const friends = useInfiniteList<Friend>(fetcher);

  const deleteFriendRequestByDocId = useCallback(
    async (friendId: string, friendDocId: string) => {
      try {

        // I need to do below because Bottom Sheet animation will crash
        setTimeout(() => {
          removeFriend(friendId); // from the list
        }, 500);
        await deleteFriendRequest(friendDocId);
        showToastSuccess("Friend request deleted");
        // navigation reload screen
        navigation.replace("your-friends", {
          originScreen: "your-friends",
        });
      } catch (e) {
        console.log("Error deleting friend request:", e);
      }
    },
    [friends]
  );

  const removeFriend = useCallback(
    (friendId: string) => {
      friends.setData((prev) => prev.filter((f) => f.userId !== friendId));
    },
    [friends]
  );

  // hydrate
  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await friends.reset();
      await friends.loadNext(); // initial page
    } catch (e) {
      Toast.show("Failed to load friends");
    } finally {
      setLoading(false);
    }
  }, [userId, friends]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);

  // actions

  return {
    loading,
    userdata,
    userId,
    friends,
    removeFriend,
    deleteFriendRequestByDocId,
    load,
  };
}
