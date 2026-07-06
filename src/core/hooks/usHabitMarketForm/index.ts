import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { canEditScreen, canShowCopyButton, ConstantsUtils, getHabitCategories, showToastSuccess } from "@/core/utils";
import { HabitCategory, HabitStackComponent, HabitStackComponentPagination, RouterData, Sector } from "@/core/models/section-b";
import {fetchInterestSectors} from "@/core/services/section-a";
import {fetchHabitStackComponentsByUserAndSector} from "@/core/api/section-b";
import {dataMigrationCopyHabitStackToAnotherUser, getHabitStackComponentsByUserAndSector} from "@/core/services/section-b/section-b-0/habitstack";
import {dataMigrationCopyHabitLinkItemToAnotherUser, dataMigrationCopyHabitLinkToAnotherUser, dataMigrationCopyHabitToAnotherUser} from "@/core/services/section-b";
import {fetchHabitStackComponentsMarketIsOwnedByAdminUserId} from "@/core/services/section-b/section-b-3/market";

type RootState = any; // TODO: Replace with actual RootState type

type Props = {
  navigation: any;
  route: any;
};

const allSector: Sector = {
  documentId: "sector-all-000",
  priorityIds: [],
  createdAt:  new Date(1759470277 * 1000 + 108000000 / 1000000),
  focusIds: ["MONEY", "COUNT"],
  interestIds: [],
  description:
    "All interests combined.",
  id: "sector-all-000",
  label: "All",
  value: "ALL",
  unitIds: [],
  updatedAt: new Date(1759470277 * 1000 + 108000000 / 1000000),
};


export default function useHabitMarketForm({ navigation, route }: Props) {


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


  /*
  export interface HabitStackComponentPagination {
  habitStackComponents?: HabitStackComponent[];
  numberOfPages?: number;
  pageSize?: number;
  pageNumber?: number;
  totalNumberOfHabitStackComponents?: number;
  sectorId?: string;
}
  */

  const defaulHabitStackComponentPagination: HabitStackComponentPagination = {
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
  const originScreen = route.params?.originScreen;
  const destinationScreenTitle = route.params?.destinationScreenTitle || "Habit Market";
  const cameFromDrawerTab = !originScreen || originScreen === "drawer";
  const routerData: RouterData = route.params?.routeData || null;
  const [loading, setLoading] = useState(false);
  let habitCategories: HabitCategory[] = getHabitCategories(originScreen);
  const [habitCategory, setHabitCategory] = useState(habitCategories[0]?.name);
  const [activeSector, setActiveSector] = useState("All");
  const [sectors, setSectors] = useState<Sector[]>([allSector]);
  const fetchedSectorIdsRef = useRef<Set<string>>(new Set());


  const canEdit = canEditScreen(originScreen);
  const showCopyButton: boolean = canShowCopyButton(originScreen);
  const pre_selected_category_id = habitCategories[0]?.id || 1;
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(pre_selected_category_id);

  const [financeStacks, setFinanceStacks] = useState<HabitStackComponentPagination>(defaulHabitStackComponentPagination);
  const [healthFitnessStacks, setHealthFitnessStacks] = useState<HabitStackComponentPagination>(defaulHabitStackComponentPagination);
  const [lifestyleRecreationStacks, setLifestyleRecreationStacks] = useState<HabitStackComponentPagination>(defaulHabitStackComponentPagination);
  const [personalGrowthStacks, setPersonalGrowthStacks] = useState<HabitStackComponentPagination>(defaulHabitStackComponentPagination);
  const [productivityStacks, setProductivityStacks] = useState<HabitStackComponentPagination>(defaulHabitStackComponentPagination);
  const [relationshipsStacks, setRelationshipsStacks] = useState<HabitStackComponentPagination>(defaulHabitStackComponentPagination);

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


  //////////// Handlers ///////////////
  const setHabitCategoriesBasedOnOrigin = useCallback(() => {
    const categories = getHabitCategories(originScreen);
    habitCategories = categories;
    const firstCategoryId = categories[0]?.id || 1;
    setSelectedCategoryId(firstCategoryId);
  }, []);

  const filterSectorsByRouterDataSectorId = (routerData: RouterData, interestSectors: any[]) => {

    let data = Array.isArray(interestSectors) ? interestSectors : [];

    data = [allSector, ...data];

    if(routerData && routerData.habitSectorId){
      const filteredData = data.filter((sector) => sector.documentId === routerData.habitSectorId);
      return filteredData;
    }
    return data;
  }

  /////// Retrieve Habit Stacks for a Sector /////////


  const fetchStacksForSector = useCallback( async (sectorDocId: string) : Promise<HabitStackComponentPagination> => {

    // const data = await getHabitStackComponentsByUserAndSector(
    //   marketAdminUserId,
    //   sectorDocId
    // );

    const data = await fetchHabitStackComponentsMarketIsOwnedByAdminUserId({
          marketAdminUserId: marketAdminUserId,
          marketOwnerId: userId,
          isMarketOwned: true,
          sectorId: sectorDocId,
          pageSize: pageSize,
          pageNumber: 1,
        });

    return data;

  }, []);


  const fetchAllSectorStacks = useCallback( async () => {

    const financeData = await fetchStacksForSector(financeSectorId);
    setFinanceStacks(financeData);

    const healthFitnessData = await fetchStacksForSector(healthFitnessSectorId);
    setHealthFitnessStacks(healthFitnessData);

    const lifestyleRecreationData = await fetchStacksForSector(lifestyleRecreationSectorId);
    setLifestyleRecreationStacks(lifestyleRecreationData);

    const personalGrowthData = await fetchStacksForSector(personalGrowthSectorId);
    setPersonalGrowthStacks(personalGrowthData);

    const productivityData = await fetchStacksForSector(productivitySectorId);
    setProductivityStacks(productivityData);

    const relationshipsData = await fetchStacksForSector(relationshipsSectorId);
    setRelationshipsStacks(relationshipsData);

  }, [fetchStacksForSector]);



  ///////////// Loaders /////////////

  const load = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {

      // Clear previous data
      setHabitCategoriesBasedOnOrigin();
      //setStacksBySector({});
      fetchedSectorIdsRef.current.clear();

      const result = await fetchInterestSectors();
      setSectors(filterSectorsByRouterDataSectorId(routerData, result));
      setActiveSector(sectors[0]?.id);
      setHabitCategory(habitCategories[0]?.name);

      // Fetch all sector stacks
      await fetchAllSectorStacks();


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

  const onOpenLinkItem = (habitLink: any) =>
    navigation.navigate("habitlinks", {
      originScreen: "habit-market",
      habitLink,
      multiple: true,
    });

  // Go to HabitMarketManagerScreen
  const navigateToHabitMarketManager = () => {
    navigation.navigate("habit-market-manager", {
      originScreen: "habit-market",
    });
  };

  const navigateToSeeAll = useCallback(
  (sectorId: string, sectorName: string) => {

    const routeData: RouterData = {
          habitSectorId: sectorId,
          habitCategories: habitCategories,
          sectors,
          selectedCategoryId,
          canEdit,
          preOriginScreenLevel1: originScreen,
        };

    navigation.navigate("habit-market-see-all", {
      destinationScreenTitle: "Habit Market Seel All",
      originScreen: "habit-market",
      routeData,
    });
  },
  [navigation, habitCategories, sectors, selectedCategoryId, canEdit]
);

  /*
   create a method
   parameter: sectorDocId: string
   return true if sectors contains sectorDocId
  */
  const doesSectorExist = (sectorDocId: string): boolean => {
    return sectors.some((sector) => sector.documentId === sectorDocId);
  }

  return {
    loading,
    user,
    userId,
    cameFromDrawerTab,
    canEdit,
    destinationScreenTitle,
    navigateToHabitLink,
    habitCategories,
    habitCategory,
    setHabitCategory,
    activeSector,
    setActiveSector,
    sectors,
    //stacksBySector,
    financeStacks,
    healthFitnessStacks,
    lifestyleRecreationStacks,
    personalGrowthStacks,
    productivityStacks,
    relationshipsStacks,
    selectedCategoryId,
    showCopyButton,
    setSelectedCategoryId,
    copyItem,
    load,
    onOpenLinkItem,
    navigateToHabitMarketManager,
    navigateToSeeAll,
    doesSectorExist,
  };
}