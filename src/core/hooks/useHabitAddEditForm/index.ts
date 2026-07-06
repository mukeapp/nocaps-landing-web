import {selectGenerateHabitLinkCost} from "@/core/redux/habit-intelligence-cost";
import {
  RevenueCatAction,
  selectRevenueCat,
} from "@/core/redux/user-revenue-cat";
import {decreaseRemainingCreditsByUserId} from "@/core/services/section-b";
import {useCallback, useEffect, useState} from "react";
import Toast from "react-native-root-toast";
import v4 from "react-native-uuid";
import {useDispatch, useSelector} from "react-redux";

import {HabitLinkComponent} from "@/core/models/section-b/habit";
import {
  deleteAllHabitDaysByHabitId,
  deleteHabitLink,
  fetchColors,
  fetchDays,
  fetchFrequencies,
  fetchIcons,
  fetchInterestsBySector,
  saveHabit,
  saveHabitDay,
  updateHabit,
} from "@/core/services/section-b/section-b-0/habit";
import {apiGetHabitLinksComponentsByHabitId} from "@/core/services/section-b/section-b-0/habit-link";
import {getImageKey} from "@/core/utils";

type UseHabitFormArgs = {
  navigation: any;
  route: any;
  media: { local: string | null; preview: string | null; loading: boolean };
  pickers: {
    startDate: Date | null;
    endDate: Date | null;
    startTime: Date | null;
    endTime: Date | null;
  };
};

export default function useHabitAddEditForm({
  navigation,
  route,
  media,
  pickers,
}: UseHabitFormArgs) {
  const dispatch = useDispatch();
  //console.log("useHabitForm route.params:", route?.params); // --- IGNORE ---
  const uid = route?.params?.uuidnow; // habitStackId
  const sector = route?.params?.selectedItem; // sector object
  //console.log("Selected sector:", sector); // --- IGNORE ---
  const routeData = route?.params?.habitdata || {};
  //console.log("Route data useHabitForms:", routeData); // --- IGNORE ---

  const userData = useSelector((s: any) => s?.user?.userdata);
  const userId = userData?.collectdata?.userId?.trim();
  const generateHabitLinkCost = useSelector((s: any) =>
    selectGenerateHabitLinkCost(s),
  );
  const revenueCat = useSelector((s: any) => selectRevenueCat(s));

  // AI confirm modal
  const [showAIConfirmModal, setShowAIConfirmModal] = useState(false);
  const [steerDescription, setSteerDescription] = useState("");

  // ui + form state
  const [habitname, setHabitName] = useState("");
  const [des, setDes] = useState("");
  const [status, setStatus] = useState<
    "" | "play" | "pause" | "stop" | "previous" | "next"
  >("");

  const [selectedColour, setSelectedColour] = useState("rgba(45,156,219,1)");
  const [popupclr, setPopupClr] = useState(false);

  const [icnoname, setIconName] = useState("");
  const [iconDetail, setIconDetail] = useState("");
  const [showicon, setShowIcon] = useState(false);

  const [allicons, setAllIcons] = useState<any[]>([]);
  const [allcolor, setAllColor] = useState<any[]>([]);
  const [alldays, setAllDays] = useState<any[]>([]);
  const [frequency, setFrequency] = useState<any[]>([]);
  const [interestAll, setInterestAll] = useState<any[]>([]);

  const [week, setWeek] = useState<any[]>([]);
  const [interestSelect, setInterestSelect] = useState<string | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(
    null,
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalName, setModalName] = useState("");

  const [habitlinkitem, setHabitLinkItem] = useState<any[]>([]);
  const [editdeleteID, setEditdeleteID] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const isEditingExisting = Object.keys(routeData).length !== 0;
  const [uuidnow, setUuidnow] = useState(
    isEditingExisting ? routeData?.documentId : v4.v4().toString(),
  );
  const [enable, setEnable] = useState(isEditingExisting);

  // prefill from route
  const routeBannerImage = isEditingExisting ? routeData?.bannerImage : null;

  // sync uploaded preview to banner in form gating
  const bannerImage = media.preview || routeBannerImage || null;

  // effects (load lists)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [icons, colors, days, freqs] = await Promise.all([
          fetchIcons(),
          fetchColors(),
          fetchDays(),
          fetchFrequencies(),
        ]);
        setAllIcons(icons);
        setAllColor(colors);
        setAllDays(
          [...days].sort(
            (a: any, b: any) =>
              (a?.createdAt?._seconds || 0) - (b?.createdAt?._seconds || 0),
          ),
        );
        setFrequency(freqs);
      } catch (e) {
        setLoading(false);
        // noop
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // load interests by sector
  useEffect(() => {
    (async () => {
      if (!sector?.documentId) {
        console.log("no sector id");
        return;
      }
      try {
        setLoading(true);
        const res = await fetchInterestsBySector(sector.documentId);
        setInterestAll(res?.interests || []);
      } catch {
        console.log("error fetching interests");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [sector?.documentId]);

  // prime icon if new
  useEffect(() => {
    if (!isEditingExisting && allicons.length) {
      const def = allicons[6]?.imageLocation || allicons[0]?.imageLocation;
      if (def) pickIcon(def);
    }
  }, [isEditingExisting, allicons]);

  // prime route values if editing
  useEffect(() => {
    if (!isEditingExisting) return;
    const wek = routeData?.habitDayComponents || [];
    setWeek(wek.map((x: any) => x.day));
    setDes(routeData?.description || "");
    setStatus(routeData?.status || "");
    setHabitName(routeData?.name || "");
    setSelectedColour(routeData?.iconColor || selectedColour);
    pickIcon(routeData?.icon);
    setSelectedFrequency(routeData?.frequency || null);
    setInterestSelect(routeData?.interest || null);
  }, [isEditingExisting]);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      //console.log("Loading habit links for user ID:", userId); // --- IGNORE ---
      await refreshHabitLinks();
      setLoading(false);
    } catch (e) {
      Toast.show("Failed to load habit links");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const refreshHabitLinks = async () => {
    try {
      const habitId = routeData?.documentId;
      //console.log("Refreshing habit links for habit ID:", habitId); // --- IGNORE ---
      if (!habitId) {
        setHabitLinkItem([]);
        return;
      }
      //console.log("Fetching habit links for habit ID:", habitId); // --- IGNORE ---
      const items = await apiGetHabitLinksComponentsByHabitId(habitId);
      //console.log("Fetched habit links:", items); // --- IGNORE ---
      setHabitLinkItem(items);
    } catch {
      console.log("Error fetching habit links"); // --- IGNORE ---
    }
  };

  // helpers
  const openModal = (name: "frequency" | "interest") => {
    setModalName(name);
    setModalData(name === "frequency" ? frequency : interestAll);
    setModalVisible(true);
  };

  const handleSelect = (_name: string, _check: boolean, item: any) => {
    if (modalName === "frequency") {
      setSelectedFrequency(item);
    } else {
      setInterestSelect(item);
    }
    setModalVisible(false);
  };

  const toggleDay = (day: any) => {
    setWeek((prev) => {
      const exists = prev.some((d) => d.label === day.label);
      return exists
        ? prev.filter((d) => d.label !== day.label)
        : [...prev, day];
    });
  };

  const pickColor = (clr: string) => {
    setPopupClr(false);
    setSelectedColour(clr);
  };

  const pickIcon = (url?: string) => {
    if (!url || url === "no") {
      setShowIcon(false);
      return;
    }
    setIconDetail(url);
    setIconName(getImageKey(url) || "");
    setShowIcon(false);
  };

  // const goShowItem = () =>
  //   navigation.navigate("habitlinks", {
  //      id: uuidnow,
  //       originScreen: 'add_edit_habit'
  //     });
  // };

  const goShowItem = (habitLink: HabitLinkComponent) =>
    navigation.navigate("habitlinks", {
      id: uuidnow,
      originScreen: "add_edit_habit",
      habitLink,
      multiple: true,
    });

  const editHabitLink = (obj: any) => {
    navigation.navigate("add_edit_habitlink", {
      originScreen: "add_edit_habit",
      interestSelect,
      uuidnow,
      habitLink: obj,
    });
  };

  const deleteHabitLinkHandler = async (id: string) => {
    setLoading(true);
    try {
      await deleteHabitLink(id);
      await refreshHabitLinks();
      Toast.show("Habit Link Deleted Successfully");
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const deleteHabitLinkUi = (id: string) => deleteHabitLinkHandler(id);

  // validation
  const validate = (): string => {
    if (!interestSelect) return "Please select habit type";
    if (!iconDetail) return "Please select icon";
    if (!bannerImage) return "Please upload image";
    if (!status) return "Please select habit status";
    return "";
  };

  // save
  const save = async (
    mode: "save" | "link" | "link-ai",
    opts?: { adjustedCost?: number; modelId?: string },
  ) => {
    const msg = validate();
    if (msg) return Toast.show(msg);

    const data = {
      id: uuidnow,
      userId: userData?.collectdata?.userId?.trim(),
      habitStackId: uid,
      name: habitname,
      icon: iconDetail,
      iconColor: selectedColour,
      bannerImage,
      description: des,
      interest: interestSelect, // keep identical to your previous logic
      status,
      startDate: pickers.startDate,
      endDate: pickers.endDate,
      startTime: pickers.startTime,
      endTime: pickers.endTime,
      frequency: selectedFrequency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLoading(true);
    try {
      if (enable) {
        await updateHabit(data);
      } else {
        await saveHabit(data);
        setEnable(true);
      }

      // delete all existing days by habitId (for edits, to avoid duplicates)
      if (enable) {
        await deleteAllHabitDaysByHabitId(uuidnow);
      }

      // Save selected days for both new AND existing habits
      // This ensures days are persisted on edit too
      for (const d of week) {
        await saveHabitDay({
          id: v4.v4().toString(),
          habitId: uuidnow,
          dayId: d?.documentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      if (mode === "save") {
        navigation.goBack();
      } else if (mode === "link-ai") {
        const cost = opts?.adjustedCost ?? generateHabitLinkCost;
        const modelId = opts?.modelId ?? "claude-sonnet-4-6";
        const { data: record, status: httpStatus } =
          await decreaseRemainingCreditsByUserId(userId, cost);
        if (httpStatus >= 200 && httpStatus < 300 && record) {
          dispatch(RevenueCatAction.subtractCredits(cost));
          navigation.navigate("habit-links-ai", {
            habitId: uuidnow,
            steerDescription,
            modelId,
          });
        }
      } else {
        navigation.navigate("add_edit_habitlink", {
          habitLink: {},
          interestSelect,
          uuidnow,
        });
      }
    } catch (e) {
      // keep quiet
    } finally {
      setLoading(false);
    }
  };

  const navigateToMarket = () => {
    // Navigate to market screen
    navigation.navigate("habit-market", {
      originScreen: "add_edit_habit",
      routeData: {
        habitSectorId: sector.documentId,
        habitStackId: null,
        habitId: uuidnow,
        habitLinkId: null,
        habitLinkItemId: null,
      },
    });
  };

  const navigateToFriendsHabits = () => {
    // Navigate to friends habit stacks screen
    navigation.navigate("my-friends-and-habits", {
      originScreen: "add_edit_habit",
      routeData: {
        habitSectorId: sector.documentId,
        habitStackId: null,
        habitId: uuidnow,
        habitLinkId: null,
        habitLinkItemId: null,
      },
    });
  };

  const navigateToMyLibraryHabitLinks = () => {
    // Navigate to my library habits screen
    navigation.navigate("my-friends-and-habits", {
      originScreen: "add_edit_habit",
      destinationScreenTitle: "My Library",
      routeData: {
        dataHasOnlySelfUser: true,
        habitSectorId: sector.documentId,
        habitStackId: null,
        habitId: uuidnow,
        habitLinkId: null,
        habitLinkItemId: null,
      },
    });
  };

  // // load user habit links on focus
  // useEffect(() => {
  //   const unsub = navigation.addListener("focus", () => {
  //     refreshHabitLinks();
  //   });
  //   return unsub;
  // }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);

  return {
    // state for UI
    habitname,
    setHabitName,
    des,
    setDes,
    status,
    setStatus,
    selectedColour,
    popupclr,
    setPopupClr,
    icnoname,
    showicon,
    setShowIcon,
    allcolor,
    allicons,

    alldays,
    week,
    toggleDay,

    interestSelect,
    selectedFrequency,
    openModal,

    modalVisible,
    setModalVisible,
    modalData,
    modalName,
    handleSelect,

    habitlinkitem,
    editdeleteID,
    setEditdeleteID,
    deleteHabitLink: deleteHabitLinkUi,
    editHabitLink,
    goShowItem,

    // saving
    save,
    loading,

    // image + icon + color
    routeBannerImage,
    pickColor,
    pickIcon,

    // booleans
    enable,
    isEditingExisting,

    // for modals
    setSelectedColour,
    navigateToMarket,
    navigateToFriendsHabits,
    load,
    navigateToMyLibraryHabitLinks,
    showAIConfirmModal,
    setShowAIConfirmModal,
    steerDescription,
    setSteerDescription,
    generateHabitLinkCost,
    revenueCat,
  };
}
