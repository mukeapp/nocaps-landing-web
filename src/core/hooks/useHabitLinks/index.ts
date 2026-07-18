import {
  HabitComponent,
  HabitLinkComponent,
  HabitLinkItemComponent,
  HabitStackComponent,
} from "@/core/models/section-b/habit";
import {RouterData} from "@/core/models/section-b/router";
import {Unit} from "@/core/models/section-b/unit";
import {selectGenerateHabitLinkItemCost} from "@/core/redux/habit-intelligence-cost";
import {
  RevenueCatAction,
  selectRevenueCat,
} from "@/core/redux/user-revenue-cat";
import {
  decreaseRemainingCreditsByUserId,
  saveHabitLinkItemData,
} from "@/core/services/section-b";
import {fetchHabitComponentByHabitId} from "@/core/services/section-b/section-b-0/habit";
import {
  apiDeleteHabitLinkItem,
  apiGetHabitLinksComponentsByHabitId,
  apiGetItemsForHabitLink,
} from "@/core/services/section-b/section-b-0/habit-link";
import {deleteHabitLinkItemDataByOriginIdAndDate} from "@/core/services/section-b/section-b-0/habit-link-item-data";
import {fetchHabitStackByDocumentId} from "@/core/services/section-b/section-b-0/habitstack";
import {fetchUnitsByDocumentId} from "@/core/services/section-b/section-b-0/units";
import {
  canEditScreen,
  canGoToSwapScreenFunc,
  getDefaultImageUrl2,
  showToastError,
  uuidUtils,
} from "@/core/utils";
import {useCallback, useEffect, useMemo, useState} from "react";
import Toast from "react-native-root-toast";
import {useDispatch, useSelector} from "react-redux";

type RootState = any; // replace with your real RootState

type Props = { navigation: any; route: any };

export default function useHabitLinks({ navigation, route }: Props) {
  const dispatch = useDispatch();
  const originScreen = route.params?.originScreen;
  //console.log("useHabitLinks");
  //console.log("route.params", route.params);
  //console.log("originScreen", originScreen);
  const canEdit = canEditScreen(originScreen);
  const canGoToSwapScreen = canGoToSwapScreenFunc(originScreen);
  const canShowCheckbox = originScreen === "habit-calendar" ? true : false;
  const destinationScreenTitle = canShowCheckbox
    ? "Habit Link Calendar"
    : "Habit Links";
  const data: HabitLinkComponent = route.params?.habitLink;
  let multiple = route.params?.multiple;
  multiple = originScreen === "habit-calendar" ? true : multiple;
  //console.log("data", data);
  const hasData = data && data.id && data.id !== "";
  //console.log("hasData", hasData);

  const userId: string | undefined = useSelector(
    (s: RootState) => s?.user?.userdata?.collectdata?.userId,
  );
  const generateHabitLinkItemCost = useSelector((s: RootState) =>
    selectGenerateHabitLinkItemCost(s),
  );
  const revenueCat = useSelector((s: RootState) => selectRevenueCat(s));

  const [costUnit, setCostUnit] = useState<Unit | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<HabitLinkComponent[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string>("all");
  const activeGroup: HabitLinkComponent | undefined = useMemo(
    () => groups.find((g) => g.documentId === activeGroupId),
    [groups, activeGroupId],
  );

  // AI confirm modal
  const [showAIConfirmModal, setShowAIConfirmModal] = useState(false);
  const [steerDescription, setSteerDescription] = useState("");

  // sheets / info
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [infoItem, setInfoItem] = useState<HabitLinkItemComponent>({});
  const [habit, setHabit] = useState<HabitComponent>({});
  const [habitStack, setHabitStack] = useState<HabitStackComponent>({});

  const fetchAndSetCostUnit = async (base: HabitLinkComponent[]) => {
    if (base.length === 0) return;

    const sampleHabitLink = base[0];

    //console.log("useHabitLinks --> Fetching cost unit for sampleHabitLink:", sampleHabitLink);

    if (!sampleHabitLink?.habitId || sampleHabitLink.habitId === "") return;

    const habitComponent = await fetchHabitComponentByHabitId(
      sampleHabitLink.habitId || "",
    );
    //console.log("habitComponent", habitComponent);

    if (!habitComponent || habitComponent.length === 0) return;

    const unitId = habitComponent?.unit;
    //console.log("useHabitLinks --> Fetching unit for unit ID:", unitId);

    const fetchedUnits = await fetchUnitsByDocumentId(unitId || "");

    if (fetchedUnits && fetchedUnits.length > 0) {
      setCostUnit(fetchedUnits[0]);
    }
  };

  // hydrate
  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      let base: HabitLinkComponent[] = [];
      let _habitStack: HabitStackComponent;
      let _habit: HabitComponent = {};

      if (data.habitId && data.habitId !== "") {
        //console.log("Fetching habit stack for habitId:", data);

        _habit = await fetchHabitComponentByHabitId(data.habitId || "");
        _habitStack = await fetchHabitStackByDocumentId(
          _habit.habitStackId || "",
        );
        setHabitStack(_habitStack);
      }

      if (hasData) {
        base = [data];
        setHabit(_habit);
      }
      //console.log("multiple :", multiple);
      //console.log("data.habitId :", data.habitId);
      if (hasData && multiple) {
        //base = await apiGetHabitLinksByHabitId(data.habitId); // list of habitLinks for user
        base = await apiGetHabitLinksComponentsByHabitId(data.habitId || ""); // list of habitLinks for user
      }
      const filled: HabitLinkComponent[] = [];

      //console.log(" About to fetch cost unit for habit links");
      if (base.length > 0) {
        //console.log("Fetching cost unit for habit links");
        await fetchAndSetCostUnit(base);
      }

      for (const grp of base) {
        try {
          const items = await apiGetItemsForHabitLink(grp.documentId);
          if (items && Object.keys(items).length !== 0) {
            filled.push({
              userId: grp.userId,
              documentId: grp.documentId,
              bannerImage: grp.bannerImage,
              habitId: grp.habitId,
              name: grp.name,
              scoreComponent: grp?.scoreComponent,
              scoreColor:
                grp?.scoreComponent?.scoreInfo?.color?.toLowerCase?.(),
              items: items.habitLinkItemComponentsData ?? [],
            });
          }
        } catch {
          // ignore a single group error
          console.log("Failed to load items for group:", grp);
        }
      }

      setGroups(filled);
      if (filled.length) {
        setActiveGroupId(filled[0]?.documentId || "");
      } else {
        setActiveGroupId("all");
      }
    } catch (e) {
      Toast.show("Failed to load habit links");
    } finally {
      // 👇 Add a small delay so the loader is visible
      setTimeout(() => {
        //console.log("HabitLinks load finished → setLoading(false)");
        setLoading(false);
      }, 400); // 400–600ms is usually enough to see it
    }
  }, [userId]);

  // actions
  const onBack = () => navigation.goBack();

  const onAddItem = (groupId?: string, groupName?: string) => {
    if (!groupId || groupId === "all") return;
    navigation.navigate("add_edit_habitlinkitem", {
      id: groupId,
      nm: groupName,
      linkData: {},
    });
  };

  const onEditItem = (
    groupId?: string,
    groupName?: string,
    item?: HabitLinkItemComponent,
  ) => {
    if (!groupId || !item) return;
    navigation.navigate("add_edit_habitlinkitem", {
      id: groupId,
      nm: groupName,
      linkData: item,
    });
  };

  const onInfoItem = (item: HabitLinkItemComponent) => {
    setInfoItem(item);
    setShowInfoSheet(true);
  };

  const onDeleteRequest = (item: HabitLinkItemComponent) => {
    setInfoItem(item);
    setShowDeleteSheet(true);
  };

  const onDismissSheet = (action?: "shet" | "deleteit") => {
    setShowDeleteSheet(false);
    if (action === "shet") {
      setShowInfoSheet(false);
    } else if (action === "deleteit" && infoItem) {
      onConfirmDelete();
    }
  };

  const onConfirmDelete = async () => {
    if (!infoItem) return;
    try {
      await apiDeleteHabitLinkItem(infoItem.documentId || "");
      setInfoItem({});
      load();
    } catch {
      Toast.show("Failed to delete item");
    } finally {
      setShowDeleteSheet(false);
      setShowInfoSheet(false);
    }
  };

  const navigateToHabitLinkItemImporter = () => {
    //console.log("activeGroup:", activeGroup);

    const routerData: RouterData = {
      habit: habit,
      habitLink: activeGroup,
    };

    navigation.navigate("habit-link-item-importer", {
      originScreen: "habitlinks",
      routerData,
    });
  };

  const navigateToMarket = () => {
    // Navigate to market screen
    navigation.navigate("habit-market", {
      originScreen: "add_edit_habitlinkitem",
      routeData: {
        habitSectorId: habitStack?.sectorId,
        habitStackId: null,
        habitId: null,
        habitLinkId: activeGroup?.documentId || activeGroup?.id,
        habitLinkItemId: null,
      },
    });
  };

  const navigateToFriends = () => {
    // Navigate to friends habit stacks screen
    console.log("Navigating to friends habit stacks... :", activeGroup);
    navigation.navigate("my-friends-and-habits", {
      originScreen: "add_edit_habitlinkitem",
      routeData: {
        habitSectorId: habitStack?.sectorId,
        habitStackId: null,
        habitId: null,
        habitLinkId: activeGroup?.documentId || activeGroup?.id,
        habitLinkItemId: null,
      },
    });
  };

  const navigateToMyLibrary = () => {
    // Navigate to my library habits screen
    navigation.navigate("my-friends-and-habits", {
      originScreen: "add_edit_habitlinkitem",
      destinationScreenTitle: "My Library",
      routeData: {
        dataHasOnlySelfUser: true,
        habitSectorId: habitStack?.sectorId,
        habitStackId: null,
        habitId: null,
        habitLinkId: activeGroup?.documentId || activeGroup?.id,
        habitLinkItemId: null,
      },
    });
  };

  const navigateToSwapHabitLinkItem = (
    habitLinkItemComponent: HabitLinkItemComponent,
    modelId?: string,
  ) => {
    // Navigate to my library habits screen

    const routerData: RouterData = {
      habit: habit,
      habitLink: activeGroup,
      habitLinkItem: habitLinkItemComponent,
      modelId,
    };

    navigation.navigate("swap-habit-link-item", {
      originScreen: "habitlinks",
      destinationScreenTitle: "",
      routeData: routerData,
    });
  };

  const navigateToHabitLinkItemsAIScreen = (
    _habitLinkItemComponent?: HabitLinkItemComponent,
  ) => {
    setSteerDescription("");
    // Delay to let the bottom sheet close animation finish before showing the modal
    setTimeout(() => setShowAIConfirmModal(true), 350);
  };

  const confirmAndNavigateToAIScreen = async (opts?: { adjustedCost?: number; modelId?: string }) => {
    const cost = opts?.adjustedCost ?? generateHabitLinkItemCost;
    const modelId = opts?.modelId ?? 'claude-sonnet-4-6';
    const hasEnough = (revenueCat?.remainingCredits ?? 0) >= cost;
    if (!hasEnough) return;

    setShowAIConfirmModal(false);

    const { data: record, status } = await decreaseRemainingCreditsByUserId(
      userId ?? "",
      cost,
    );
    if (status >= 200 && status < 300 && record) {
      dispatch(RevenueCatAction.subtractCredits(cost));

      const routerData: RouterData = {
        habit: habit,
        habitLink: activeGroup,
        steerDescription: steerDescription.trim(),
        modelId,
        costSymbol: costUnit?.symbol ?? "",
      };

      navigation.navigate("habit-link-items-ai", {
        originScreen: "habitlinks",
        destinationScreenTitle: "",
        routeData: routerData,
      });
    }
  };

  const insertCalendarData = useCallback(
    async (
      item: HabitLinkItemComponent,
      year: number,
      month: number,
      day: number,
      isChecked?: boolean,
      noteText?: string,
      noteImageUrl?: string,
    ) => {
      //console.log("create data to insert with item:", item);

      const _id = uuidUtils.generateUUID();
      const habitLinkItemData: HabitLinkItemComponent = {
        id: _id,
        originId: item.id,
        userId: item.userId,
        habitLinkId: item.habitLinkId,
        habitLinkItemConstantId: _id,
        isConstant: false,
        isActive: true,
        yearActivated: year,
        monthActivated: month,
        dayActivated: day,
        canUpdate: true,
        name: item.name,
        companyName: item?.companyName,
        location: item?.location,
        price: item?.price ?? 0,
        quantity: item?.quantity ?? 1,
        description: item.description,
        //itemUrl: item.itemUrl,
        imageUrl: item.imageUrl ? item.imageUrl : getDefaultImageUrl2(),
        //videoUrl: item?.videoUrl,
        cost: item.cost ?? 0,
        score: item.score ?? 0,
        scoreCode: item.scoreCode,
        noteText: noteText,
        noteImageUrl: noteImageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        setLoading(true);
        try {
          //console.log("IsChecked:", isChecked);
          //console.log("Date:", year, month, day);
          //console.log("Inserting calendar data:", habitLinkItemData);

          if (isChecked) {
            await saveHabitLinkItemData(habitLinkItemData);
          } else {
            await deleteHabitLinkItemDataByOriginIdAndDate(
              item.id,
              item.habitLinkId,
              year,
              month,
              day,
            );
          }
          //showToastSuccess("data added to calendar.");
          //console.log("Successfully saved calendar data.");
          setLoading(false);
        } catch (e) {
          // keep quiet
          console.error("Error saving calendar data:", e);
          showToastError("Failed to add data to calendar.");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error inserting calendar data:", error);
        showToastError("Failed to add data to calendar.");
        setLoading(false);
        //throw error;
      }
    },
    [],
  );

  // on mount - load data
  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);

  return {
    loading,
    groups,
    activeGroupId,
    activeGroup,
    setActiveGroupId,

    onBack,
    onAddItem,
    onEditItem,
    onInfoItem,
    onDeleteRequest,
    onDismissSheet,
    onConfirmDelete,

    showDeleteSheet,
    showInfoSheet,
    infoItem,
    canEdit,
    costUnit,
    data,
    habit,
    canShowCheckbox,
    navigateToHabitLinkItemImporter,
    navigateToMarket,
    navigateToFriends,
    navigateToMyLibrary,
    destinationScreenTitle,
    insertCalendarData,
    load,
    canGoToSwapScreen,
    navigateToSwapHabitLinkItem,
    navigateToHabitLinkItemsAIScreen,
    showAIConfirmModal,
    setShowAIConfirmModal,
    steerDescription,
    setSteerDescription,
    generateHabitLinkItemCost,
    revenueCat,
    confirmAndNavigateToAIScreen,
  };
}
