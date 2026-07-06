import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { canEditScreen } from "@/core/utils";
import { HabitStackComponent, RouterData, Sector } from "@/core/models/section-b";
import { NocapPost, PageFetcherNocapPost } from "@/core/models/section-c";
import { fetchNocapPostsPaginated } from "@/core/services/section-c";
import {getNocapPostComponentsByAllFiltersPaginated, deleteNocapPostDataPurge, fetchNocapPostComponentByDocumentId} from "@/core/services/section-c/section-c-1/post";
import {fetchInterestSectors} from "@/core/services/section-a/interest";
import {useInfiniteListNoCapPostSearch} from "../useInfiniteListNoCapPostSearch";
import {IUser} from "@/core/models/section-a";
import {fetchUserFromUserIds} from "@/core/services/section-a/user";
import {fetchHabitStackByDocumentIds} from "@/core/services/section-b";

type RootState = any; // TODO: Replace with actual RootState type

type Props = {
  navigation: any;
  route: any;
};

export default function usePostSearchShowScreenForm({ navigation, route }: Props) {
  const userId = useSelector(
    (state: RootState) => state?.user?.userdata?.collectdata?.userId
  ) as string | undefined;

  const user = useSelector((state: RootState) => state?.user?.userdata?.collectdata);

  const originScreen = route.params?.originScreen;
  const routerData: RouterData = route.params?.routerData;

  const sectorId: string = routerData?.sectorId || '';
  const userIds: string[] = routerData?.userIds || [];
  const habitStackIds: string[] = routerData?.habitStackIds || [];
  const habitStackSearchName: string = routerData?.habitStackSearchName || '';
  const postId: string = routerData?.postId || '';


  const userIdsCommaSeperated : string = userIds.join(',');
  const habitStackIdsCommaSeperated: string = habitStackIds.join(',');

  const [sector, setSector] = useState<Sector | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [habitStacks, setHabitStacks] = useState<HabitStackComponent[]>([]);

  const destinationScreenTitle = route.params?.destinationScreenTitle || "NoCaps Post Search Show";
  //const cameFromDrawerTab = !originScreen || originScreen === "drawer";
  const canEdit = canEditScreen(originScreen);

  const [loading, setLoading] = useState(false);

  const postVisibility = 0;

  const fetcher: PageFetcherNocapPost<NocapPost> = useCallback(
    async (_postVisibility: number, pageNumber: number, pageSize: number) => {
      if (postId) {
        const result = await fetchNocapPostComponentByDocumentId(postId);
        return { items: result ? [result] : [], hasMore: false };
      }
      return getNocapPostComponentsByAllFiltersPaginated({
        pageNumber,
        pageSize,
        sectorIds: sectorId,
        userIds: userIdsCommaSeperated,
        habitStackIds: habitStackIdsCommaSeperated,
      });
    },
    [postId, sectorId, userIdsCommaSeperated, habitStackIdsCommaSeperated]
  );

  const postsFetcher = useInfiniteListNoCapPostSearch<NocapPost>(fetcher, postVisibility);

  // const navigateToHabitLink = useCallback(
  //   (routerData: RouterData) => {
  //     navigation.navigate("habitlinks", {
  //       originScreen: "search-habitstacks-or-posts",
  //       routerData,
  //     });
  //   },
  //   [navigation]
  // );

  const getSectorBySectorId = (sectorId: string, sectors: Sector[]): Sector | undefined => {
    return sectors.find((sector) => sector.id === sectorId);
  };

  const load = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {

      const sectors: Sector[] = await fetchInterestSectors();
      const foundSector = getSectorBySectorId(sectorId, sectors);

      const foundUsers: IUser[] = await fetchUserFromUserIds(userIds);
      const foundHabitStacks: HabitStackComponent[] = await fetchHabitStackByDocumentIds(
        habitStackIds.join(',')
      );

      setSector(foundSector || null);
      setUsers(foundUsers);
      setHabitStacks(foundHabitStacks || []);

      await postsFetcher.reset();
      await postsFetcher.loadNext();
    } catch (error) {
      console.error("Failed to load NoCaps posts:", error);
      Toast.show("Failed to load NoCaps posts");
    } finally {
      setLoading(false);
    }
  }, [userId]);


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
    //cameFromDrawerTab,
    canEdit,
    destinationScreenTitle,
    // navigateToHabitLink,
    postsFetcher,
    deletePurgeNoCapPost,
    sector,
    users,
    habitStacks,
    habitStackSearchName,
    postId,
  };
}
