import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { canEditScreen, canShowCopyButton, ConstantsUtils, getHabitCategories, showToastSuccess } from "@/core/utils";
import { HabitCategory, HabitStackComponent, HabitStackComponentPagination, PageFetcherHabitStack, RouterData, Sector } from "@/core/models/section-b";
import { fetchInterestSectors } from "@/core/services/section-a";
import { dataMigrationCopyHabitStackToAnotherUser } from "@/core/services/section-b/section-b-0/habitstack";
import {
  dataMigrationCopyHabitLinkItemToAnotherUser,
  dataMigrationCopyHabitLinkToAnotherUser,
  dataMigrationCopyHabitToAnotherUser,
} from "@/core/services/section-b";
import { fetchHabitStackComponentsMarketIsOwnedByAdminUserId, fetchHabitStackComponentsMarketIsOwnedByAdminUserIdForPagination } from "@/core/services/section-b/section-b-3/market";
import {useInfiniteListHabitStack} from "../useInfiniteListHabitStack";

type RootState = any; // TODO: Replace with actual RootState type

type Props = {
  navigation: any;
  route: any;
};

const allSector: Sector = {
  documentId: "sector-all-000",
  priorityIds: [],
  createdAt: new Date(1759470277 * 1000 + 108000000 / 1000000),
  focusIds: ["MONEY", "COUNT"],
  interestIds: [],
  description: "All interests combined.",
  id: "sector-all-000",
  label: "All",
  value: "ALL",
  unitIds: [],
  updatedAt: new Date(1759470277 * 1000 + 108000000 / 1000000),
};

export default function useHabitMarketSeelAllForm({ navigation, route }: Props) {

  //////////// Constants /////////////
  const marketAdminUserId = ConstantsUtils.marketAdminUserId;
  const pageSize = ConstantsUtils.pageSize;
  const financeSectorId = ConstantsUtils.financeSectorId;
  const healthFitnessSectorId = ConstantsUtils.healthFitnessSectorId;
  const lifestyleRecreationSectorId = ConstantsUtils.lifestyleRecreationSectorId;
  const personalGrowthSectorId = ConstantsUtils.personalGrowthSectorId;
  const productivitySectorId = ConstantsUtils.productivitySectorId;
  const relationshipsSectorId = ConstantsUtils.relationshipsSectorId;

  const defaultPagination: HabitStackComponentPagination = {
    habitStackComponents: [],
    numberOfPages: 0,
    pageSize: pageSize,
    pageNumber: 1,
    totalNumberOfHabitStackComponents: 0,
    sectorId: "",
  };

  //////////// Selectors /////////////
  const userId = useSelector(
    (state: RootState) => state?.user?.userdata?.collectdata?.userId
  ) as string | undefined;

  const user = useSelector((state: RootState) => state?.user?.userdata);

  //////////// States ///////////////
  const destinationScreenTitle = route.params?.destinationScreenTitle || "Habit Market See All";
  const routerData: RouterData = route.params?.routeData || null;
  const preOriginScreenLevel1 = routerData?.preOriginScreenLevel1;
  const originScreen = preOriginScreenLevel1 || route.params?.originScreen;
  const cameFromDrawerTab = !originScreen || originScreen === "drawer";
  //console.log("Router Data in useHabitMarketSeelAllForm:", routerData);
  const [loading, setLoading] = useState(false);
  const [habitCategory, setHabitCategory] = useState<string>("");
  const [activeSector, setActiveSector] = useState("All");
  const [sectors, setSectors] = useState<Sector[]>([allSector]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);

  const [financeStacks, setFinanceStacks] = useState<HabitStackComponentPagination>(defaultPagination);
  const [healthFitnessStacks, setHealthFitnessStacks] = useState<HabitStackComponentPagination>(defaultPagination);
  const [lifestyleRecreationStacks, setLifestyleRecreationStacks] = useState<HabitStackComponentPagination>(defaultPagination);
  const [personalGrowthStacks, setPersonalGrowthStacks] = useState<HabitStackComponentPagination>(defaultPagination);
  const [productivityStacks, setProductivityStacks] = useState<HabitStackComponentPagination>(defaultPagination);
  const [relationshipsStacks, setRelationshipsStacks] = useState<HabitStackComponentPagination>(defaultPagination);

  const fetchedSectorIdsRef = useRef<Set<string>>(new Set());

  const canEdit = routerData?.canEdit ?? canEditScreen(originScreen);
  const showCopyButton = canShowCopyButton(originScreen);
  let habitCategories: HabitCategory[] = routerData?.habitCategories || getHabitCategories(originScreen);

  //////////// Navigation ///////////////
  const navigateToHabitLink = useCallback(
    (routerData: RouterData) => {
      navigation.navigate("habitlinks", {
        originScreen: "habit-market",
        routerData,
      });
    },
    [navigation]
  );

  const onOpenLinkItem = useCallback(
    (habitLink: any) => {
      navigation.navigate("habitlinks", {
        originScreen: "habit-market",
        habitLink,
        multiple: true,
      });
    },
    [navigation]
  );

  //////////// Handlers ///////////////
  const setHabitCategoriesBasedOnOrigin = useCallback(() => {
    const categories = routerData?.habitCategories || getHabitCategories(originScreen);
    habitCategories = categories;
    setSelectedCategoryId(categories[0]?.id || 1);
    setHabitCategory(categories[0]?.name || "");
  }, [originScreen]);

  const filterSectorsByRouterDataSectorId = useCallback(
    (routerData: RouterData, interestSectors: any[]) => {
      const data = [allSector, ...(Array.isArray(interestSectors) ? interestSectors : [])];

      if (routerData?.habitSectorId) {
        return data.filter((sector) => sector.documentId === routerData.habitSectorId);
      }
      return data;
    },
    []
  );

  const doesSectorExist = useCallback(
    (sectorDocId: string): boolean => {
      return sectors.some((sector) => sector.documentId === sectorDocId);
    },
    [sectors]
  );

  /////// Retrieve Habit Stacks /////////

  // const fetchStacksForSector = useCallback(
  //   async (sectorDocId: string, pageNumber?: number): Promise<HabitStackComponentPagination> => {

  //      // if pageNumber is null, undefined, empty, or NaN, set it to 1
  //       if (pageNumber == null || isNaN(pageNumber)) {
  //         pageNumber = 1;
  //       }

  //     return await fetchHabitStackComponentsMarketIsOwnedByAdminUserId({
  //       marketAdminUserId,
  //       marketOwnerId: userId,
  //       isMarketOwned: true,
  //       sectorId: sectorDocId,
  //       pageSize,
  //       pageNumber,
  //     });
  //   },
  //   [marketAdminUserId, userId, pageSize]
  // );

  const fetcher: PageFetcherHabitStack<HabitStackComponent> = useCallback(
      (sectorId: string, pageNumber: number, pageSize: number, userId: string) => {
        return fetchHabitStackComponentsMarketIsOwnedByAdminUserIdForPagination({
        marketAdminUserId,
        marketOwnerId: userId,
        isMarketOwned: true,
        sectorId,
        pageSize,
        pageNumber,
      });
      },
      []
    );

  const stacksFetcher = useInfiniteListHabitStack<HabitStackComponent>(fetcher, routerData?.habitSectorId ?? "", "");

  // const fetchStacksForSectorId = useCallback(async (sectorId?: string) => {
  //   const [finance, healthFitness, lifestyle, personalGrowth, productivity, relationships] =
  // await Promise.all([
  //   sectorId === financeSectorId ? fetchStacksForSector(financeSectorId) : Promise.resolve(defaultPagination),
  //   sectorId === healthFitnessSectorId ? fetchStacksForSector(healthFitnessSectorId) : Promise.resolve(defaultPagination),
  //   sectorId === lifestyleRecreationSectorId ? fetchStacksForSector(lifestyleRecreationSectorId) : Promise.resolve(defaultPagination),
  //   sectorId === personalGrowthSectorId ? fetchStacksForSector(personalGrowthSectorId) : Promise.resolve(defaultPagination),
  //   sectorId === productivitySectorId ? fetchStacksForSector(productivitySectorId) : Promise.resolve(defaultPagination),
  //   sectorId === relationshipsSectorId ? fetchStacksForSector(relationshipsSectorId) : Promise.resolve(defaultPagination),
  // ]);

  //   setFinanceStacks(finance);
  //   setHealthFitnessStacks(healthFitness);
  //   setLifestyleRecreationStacks(lifestyle);
  //   setPersonalGrowthStacks(personalGrowth);
  //   setProductivityStacks(productivity);
  //   setRelationshipsStacks(relationships);
  // }, [fetchStacksForSector]);

  ///////////// Loaders /////////////
  const load = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      setHabitCategoriesBasedOnOrigin();
      fetchedSectorIdsRef.current.clear();

      const result = await fetchInterestSectors();
      const filteredSectors = filterSectorsByRouterDataSectorId(routerData, result);
      setSectors(filteredSectors);
      setActiveSector(filteredSectors[0]?.id || "sector-all-000");

      // await fetchStacksForSectorId(routerData.habitSectorId);

      await stacksFetcher.reset();
      await stacksFetcher.loadNext(); // initial page
    } catch (error) {
      console.error("Failed to load habit market:", error);
      Toast.show("Failed to load habit market");
    } finally {
      setLoading(false);
    }
  }, [userId, setHabitCategoriesBasedOnOrigin, filterSectorsByRouterDataSectorId, stacksFetcher]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation, load]);

  //////////// Copy Item ///////////////
  const copyItem = useCallback(
    async (id?: string, parentId?: string, dataType?: string) => {
      if (dataType === "habit-stack") {
        await dataMigrationCopyHabitStackToAnotherUser({
          habitStackId: id,
          newOwnerUserId: userId,
        });
      } else if (dataType === "habit") {
        await dataMigrationCopyHabitToAnotherUser({
          parentHabitStackId: routerData?.habitStackId,
          habitId: id,
          newOwnerUserId: userId,
        });
      } else if (dataType === "habit-link") {
        await dataMigrationCopyHabitLinkToAnotherUser({
          parentHabitId: routerData?.habitId,
          habitLinkId: id,
          newOwnerUserId: userId,
        });
      } else if (dataType === "habit-link-item") {
        await dataMigrationCopyHabitLinkItemToAnotherUser({
          parentHabitLinkId: routerData?.habitLinkId,
          habitLinkItemId: id,
          newOwnerUserId: userId,
        });
      }
      showToastSuccess("Item copied to your habit library.");
    },
    [userId, routerData]
  );

  //////////// Return /////////////////
  return {
    loading,
    user,
    userId,
    cameFromDrawerTab,
    canEdit,
    destinationScreenTitle,
    habitCategories,
    habitCategory,
    setHabitCategory,
    activeSector,
    setActiveSector,
    sectors,
    selectedCategoryId,
    setSelectedCategoryId,
    showCopyButton,
    financeStacks,
    healthFitnessStacks,
    lifestyleRecreationStacks,
    personalGrowthStacks,
    productivityStacks,
    relationshipsStacks,
    navigateToHabitLink,
    // navigateToSeeAll,
    // navigateToHabitMarketManager,
    onOpenLinkItem,
    doesSectorExist,
    copyItem,
    load,
    stacksFetcher,
  };
}