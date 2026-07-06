import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import {
  canEditScreen,
  canShowCopyButton,
  ConstantsUtils,
  getHabitCategories,
  getHabitMarketActions,
  showToastSuccess,
} from "@/core/utils";
import {
  Action,
  HabitCategory,
  HabitStackComponent,
  HabitStackComponentPagination,
  HabitStackMarketComponent,
  RouterData,
  Sector,
} from "@/core/models/section-b";
import { getHabitStackComponentsByUserAndSector } from "@/core/services/section-b/section-b-0/habitstack";
import { fetchInterestSectors } from "@/core/services/section-a";
import {
  fetchHabitStacksMarketInProgress,
  fetchHabitStacksMarketPending,
  fetchHabitStacksMarketPublished,
  updateMarkHabitStackAsMarketInProgress,
  updateMarkHabitStackAsMarketPending,
  updateMarkHabitStackAsMarketPublished,
  updatePublishHabitStackToMarket,
  updateUnpublishHabitStackFromMarket,
} from "@/core/services/section-b/section-b-3";
import { Payload } from "@/core/models/section-a/api";
import {fetchHabitStackComponentsMarketIsOwnedByUserId } from "@/core/services/section-b/section-b-3/market";

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

export default function useHabitMarketManagerForm({
  navigation,
  route,
}: Props) {
  //////////// Constants /////////////
  const marketAdminUserId = ConstantsUtils.marketAdminUserId;
  const pageSize = ConstantsUtils.pageSize;
  const financeSectorId = ConstantsUtils.financeSectorId;
  const healthFitnessSectorId = ConstantsUtils.healthFitnessSectorId;
  const lifestyleRecreationSectorId =
    ConstantsUtils.lifestyleRecreationSectorId;
  const personalGrowthSectorId = ConstantsUtils.personalGrowthSectorId;
  const productivitySectorId = ConstantsUtils.productivitySectorId;
  const relationshipsSectorId = ConstantsUtils.relationshipsSectorId;

  //////////// Selectors /////////////
  const userId = useSelector(
    (state: RootState) => state?.user?.userdata?.collectdata?.userId
  ) as string | undefined;

  const user = useSelector((state: RootState) => state?.user?.userdata);

  //////////// States ///////////////
  const currentScreen = "habit-market-manager";
  const originScreen = route.params?.originScreen;
  const destinationScreenTitle =
    route.params?.destinationScreenTitle || "Habit Market Manager";
  const cameFromDrawerTab = !originScreen || originScreen === "drawer";
  const routerData: RouterData = route.params?.routeData || null;
  const [loading, setLoading] = useState(false);
  //console.log("useHabitMarketManagerForm originScreen:", originScreen);

  let habitCategories: HabitCategory[] = getHabitCategories(currentScreen);
  let habitMarketActions: Action[] = getHabitMarketActions();
  const [habitMarketAction, setHabitMarketAction] = useState(
    habitMarketActions[0]?.name
  );
  const [activeSector, setActiveSector] = useState("All");
  const [sectors, setSectors] = useState<Sector[]>([allSector]);
  const fetchedSectorIdsRef = useRef<Set<string>>(new Set());

  const canEdit = canEditScreen(originScreen);
  const showCopyButton: boolean = canShowCopyButton(originScreen);
  const pre_selected_market_action_id = habitMarketActions[0]?.id || 1;
  const [selectedMarketActionId, setSelectedMarketActionId] = useState<number>(
    pre_selected_market_action_id
  );

  const [financeStacks, setFinanceStacks] =
    useState<HabitStackComponentPagination>({});
  const [healthFitnessStacks, setHealthFitnessStacks] =
    useState<HabitStackComponentPagination>({});
  const [lifestyleRecreationStacks, setLifestyleRecreationStacks] =
    useState<HabitStackComponentPagination>({});
  const [personalGrowthStacks, setPersonalGrowthStacks] =
    useState<HabitStackComponentPagination>({});
  const [productivityStacks, setProductivityStacks] =
    useState<HabitStackComponentPagination>({});
  const [relationshipsStacks, setRelationshipsStacks] =
    useState<HabitStackComponentPagination>({});

  //////////// Navigation ///////////////
  const onOpenLinkItem = (habitLink: any) =>
    navigation.navigate("habitlinks", {
      originScreen: "habit-market-manager",
      habitLink,
      multiple: true,
    });

  //////////// Handlers ///////////////

  const filterSectorsByRouterDataSectorId = (
    routerData: RouterData,
    interestSectors: any[]
  ) => {
    let data = Array.isArray(interestSectors) ? interestSectors : [];

    data = [allSector, ...data];

    if (routerData && routerData.habitSectorId) {
      const filteredData = data.filter(
        (sector) => sector.documentId === routerData.habitSectorId
      );
      return filteredData;
    }
    return data;
  };

  /////// Retrieve Habit Stacks for a Sector /////////

  const fetchStacksForSector = useCallback(
    async (sectorDocId: string): Promise<HabitStackComponentPagination> => {
      let data = {
        habitStackComponents: [],
        pageNumber: 1,
        pageSize: 0,
        totalCount: 0,
        totalPages: 0,
      } as HabitStackComponentPagination;

      if (selectedMarketActionId === 1) {
        data = await fetchHabitStacksMarketInProgress({
          userId: userId,
          sectorId: sectorDocId,
          pageSize: pageSize,
          pageNumber: 1,
        });
      } else if (selectedMarketActionId === 2) {
        data = await fetchHabitStacksMarketPending({
          userId: userId,
          sectorId: sectorDocId,
          pageSize: pageSize,
          pageNumber: 1,
        });
      } else if (selectedMarketActionId === 3) {
        data = await fetchHabitStacksMarketPublished({
          userId: userId,
          sectorId: sectorDocId,
          pageSize: pageSize,
          pageNumber: 1,
        });
      } else if (selectedMarketActionId === 4) {
        data = await fetchHabitStackComponentsMarketIsOwnedByUserId({
          marketAdminUserId: marketAdminUserId,
          marketOwnerId: userId,
          isMarketOwned: true,
          sectorId: sectorDocId,
          pageSize: pageSize,
          pageNumber: 1,
        });
      }

      return data;
    },
    [selectedMarketActionId]
  );

  const fetchAllSectorStacks = useCallback(async () => {
    const financeData = await fetchStacksForSector(financeSectorId);
    setFinanceStacks(financeData);

    const healthFitnessData = await fetchStacksForSector(healthFitnessSectorId);
    setHealthFitnessStacks(healthFitnessData);

    const lifestyleRecreationData = await fetchStacksForSector(
      lifestyleRecreationSectorId
    );
    setLifestyleRecreationStacks(lifestyleRecreationData);

    const personalGrowthData = await fetchStacksForSector(
      personalGrowthSectorId
    );
    setPersonalGrowthStacks(personalGrowthData);

    const productivityData = await fetchStacksForSector(productivitySectorId);
    setProductivityStacks(productivityData);

    const relationshipsData = await fetchStacksForSector(relationshipsSectorId);
    setRelationshipsStacks(relationshipsData);
  }, [fetchStacksForSector]);

  //////////// Load /////////////
  const load = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // TODO: Add actual loading logic here
      fetchedSectorIdsRef.current.clear();
      const result = await fetchInterestSectors();
      setSectors(filterSectorsByRouterDataSectorId(routerData, result));
      setActiveSector(sectors[0]?.id);
      // Fetch all sector stacks
      await fetchAllSectorStacks();
    } catch (error) {
      console.error("Failed to load habit links:", error);
      Toast.show("Failed to load habit links");
    } finally {
      setLoading(false);
    }
  }, [selectedMarketActionId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation, load]);

  //////SubmitMarketActionChange

  const submitMarketActionChange = async (
    habitStackId: string,
    oldOwnerUserId: string,
    action: string,
    marketActionId: number
  ): Promise<void> => {
    console.log(
      "submitMarketActionChange called with:",
      habitStackId,
      oldOwnerUserId,
      action,
      marketActionId
    );
    if (!userId) return;

    let response: HabitStackMarketComponent | null = null;
    let response2: HabitStackComponent | null = null;
    setLoading(true);
    try {
      ////PENDING ACTIONS///
      if (marketActionId === 1) {
        if (action === "send") {
          const payload: Payload = {
            id: habitStackId,
            valid: true,
          };

          response = await updateMarkHabitStackAsMarketPending(payload);

          if (response.updated) {
            showToastSuccess("Habit Stack sent to Pending successfully.");
          }
        } else if (action === "delete") {
          const payload: Payload = {
            id: habitStackId,
            valid: false,
          };

          response = await updateMarkHabitStackAsMarketInProgress(payload);

          if (response.updated) {
            showToastSuccess(
              "Habit Stack removed from In Progress successfully."
            );
          }
        }
      }
      else if (marketActionId === 2) {
        if (action === "send") {
          const payload: Payload = {
            id: habitStackId,
            valid: true,
          };

          response = await updateMarkHabitStackAsMarketPublished(payload);

          if (response.updated) {
            showToastSuccess("Habit Stack published to Market successfully.");
          }
        } else if (action === "delete") {
          const payload: Payload = {
            id: habitStackId,
            valid: false,
          };

          response = await updateMarkHabitStackAsMarketPending(payload);

          if (response.updated) {
            showToastSuccess("Habit Stack removed from Pending successfully.");
          }
        }
      }
      else if (marketActionId === 3) {
        if (action === "send") {
          const payload: Payload = {
            id: habitStackId,
            newOwnerUserId: marketAdminUserId,
            oldOwnerUserId: userId,
          };

          response2 = await updatePublishHabitStackToMarket(payload);

          if (response2.id) {
            showToastSuccess("Habit Stack ownership transferred successfully.");
          }
        } else if (action === "delete") {
          const payload: Payload = {
            id: habitStackId,
            valid: false,
          };

          response = await updateMarkHabitStackAsMarketPublished(payload);

          if (response.updated) {
            showToastSuccess(
              "Habit Stack removed from MarketPublished successfully."
            );
          }
        }
      }
      else if (marketActionId === 4) {
        if (action === "send") {

           // console.log("Publishing to market:", habitStackId, oldOwnerUserId, marketAdminUserId);
           console.log("Unpublishing from market:", habitStackId);
           console.log("marketAdminUserId:", marketAdminUserId);
           console.log("oldOwnerUserId:", oldOwnerUserId);

           showToastSuccess("Already ready to published to market.");

        }
        else if (action === "delete") {
          const payload: Payload = {
            id: habitStackId,
          };

          response = await updateUnpublishHabitStackFromMarket(payload);
          if (response.updated) {
            showToastSuccess("Habit Stack unpublished successfully.");
          }
        }
      }

      // After action, reload stacks
      await fetchAllSectorStacks();
    } catch (error) {
      console.error("Failed to change market action:", error);
      Toast.show("Failed to change market action");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    user,
    userId,
    cameFromDrawerTab,
    canEdit,
    destinationScreenTitle,
    onOpenLinkItem,
    activeSector,
    setActiveSector,
    sectors,
    financeStacks,
    healthFitnessStacks,
    lifestyleRecreationStacks,
    personalGrowthStacks,
    productivityStacks,
    relationshipsStacks,
    showCopyButton,
    habitCategories,
    habitMarketActions,
    habitMarketAction,
    setHabitMarketAction,
    selectedMarketActionId,
    setSelectedMarketActionId,
    load,
    submitMarketActionChange,
  };
}
