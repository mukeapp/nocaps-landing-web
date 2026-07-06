import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import {useInfiniteList} from "../useInfiniteList";
import { showToast, showToastError, showToastSuccess } from "@/core/utils";

import {Friend, PageFetcher} from "@/core/models/section-b";
import {fetchNewFriends} from "@/core/services/section-b";
import {createFriendRequest, fetchNewFriendsAndMapForPagination} from "@/core/services/section-b/section-b-1";

type RootState = any; // replace with your real RootState

type Props = { navigation: any; route: any };

export default function useNewFriendsForm({ navigation, route }: Props) {
  const userId: string = useSelector(
    (s: RootState) => s?.user?.userdata?.collectdata?.userId
  );

  const userdata = useSelector((s: any) => s?.user?.userdata);

  const [loading, setLoading] = useState(false);


  const fetcher: PageFetcher<Friend> = useCallback(
    (userId: string, page: number, pageSize: number) => {
      return fetchNewFriendsAndMapForPagination(userId, page, pageSize);
    },
    []
  );


  const friends = useInfiniteList<Friend>(fetcher);


  const removeFriend = useCallback(
    (friendId: string) => {
      friends.setData((prev) => prev.filter((f) => f.userId !== friendId));
    },
    [friends]
  );

  // send Friend Request
  const sendFriendRequest = useCallback(
    async (friendId: string) => {
      try {
        removeFriend(friendId); // from the list
        await createFriendRequest(userId, friendId);
        showToastSuccess("Friend request sent");
      } catch (e) {
        console.log("Error sending friend request:", e);
        //showToastError("Failed to send friend request");
      }
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
    sendFriendRequest,
  };
}
