import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { canEditScreen, ConstantsUtils } from "@/core/utils";
import { HabitStackComponent, RouterData, Sector } from "@/core/models/section-b";
import { PageFetcherNocapPost } from "@/core/models/section-c";
import {fetchInterestSectors} from "@/core/services/section-a/interest";
import {IUser} from "@/core/models/section-a";
import {fetchUserFromUserIds} from "@/core/services/section-a/user";
import {fetchHabitStackByDocumentIds, getHabitStackComponentsComplexV1} from "@/core/services/section-b";
import {useInfiniteListHabitStackComponentsComplexV1} from "../useInfiniteListHabitStackComponentsComplexV1";

type RootState = any; // TODO: Replace with actual RootState type

type Props = {
  navigation: any;
  route: any;
};

export default function useHabitStackSearchShowForm({ navigation, route }: Props) {
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

  const userIdsCommaSeperated: string = userIds.join(',');

  const [sector, setSector] = useState<Sector | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [habitStacks, setHabitStacks] = useState<HabitStackComponent[]>([]);

  const destinationScreenTitle = route.params?.destinationScreenTitle || "Habit Stack Search Show";
  const canEdit = canEditScreen(originScreen);

  const [loading, setLoading] = useState(false);

  const fetcher: PageFetcherNocapPost<HabitStackComponent> = useCallback(
    (_postVisibility: number, pageNumber: number, pageSize: number) => {
      return getHabitStackComponentsComplexV1({
        pageNumber,
        pageSize,
        searchName: habitStackSearchName || '',
        sectorIds: sectorId || '',
        habitStackIds: habitStackIds.length > 0 ? habitStackIds.join(',') : '',
        userIdsToInclude: userIdsCommaSeperated || '',
        userIdsToIgnore: ConstantsUtils.marketAdminUserId || '',
        isPublic: true,
        hideFromFriends: false,
      });
    },
    [sectorId, userIdsCommaSeperated, habitStackSearchName, habitStackIds]
  );

  const habitStackComponentFetcher = useInfiniteListHabitStackComponentsComplexV1<HabitStackComponent>(fetcher, 0);

  const getSectorBySectorId = (id: string, sectors: Sector[]): Sector | undefined => {
    return sectors.find((s) => s.id === id);
  };

  const load = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const sectors: Sector[] = await fetchInterestSectors();
      const foundSector = getSectorBySectorId(sectorId, sectors);
      const foundUsers: IUser[] = await fetchUserFromUserIds(userIds);
      const foundHabitStacks: HabitStackComponent[] = await fetchHabitStackByDocumentIds(habitStackIds?.join(',') || '');

      setSector(foundSector || null);
      setUsers(foundUsers);
      setHabitStacks(foundHabitStacks || []);

      await habitStackComponentFetcher.reset();
      await habitStackComponentFetcher.loadNext();
    } catch (error) {
      console.error("Failed to load HabitStack components:", error);
      Toast.show("Failed to load HabitStack components");
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
    canEdit,
    destinationScreenTitle,
    habitStackComponentFetcher,
    sector,
    users,
    habitStackSearchName,
    habitStacks,
  };
}
