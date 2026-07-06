import {TextBox} from "@/core/components/section-b";
import {
  HabitLinkComponent,
  HabitStackComponent,
} from "@/core/models/section-b/habit";
import {selectGenerateHabitCost} from "@/core/redux/habit-intelligence-cost";
import {
  RevenueCatAction,
  selectRevenueCat,
} from "@/core/redux/user-revenue-cat";
import {decreaseRemainingCreditsByUserId} from "@/core/services/section-b";
import {fetchHabitComponentsByHabitStackId} from "@/core/services/section-b/section-b-0/habit";
import {
  deleteHabitOnly,
  fetchColors,
  fetchIcons,
  fetchSectorById,
  fetchSectorFull,
  fetchSectorOptions,
  saveHabitStack,
  updateHabitStack,
} from "@/core/services/section-b/section-b-0/habitstack";
import {fetchUnitsByDocumentId} from "@/core/services/section-b/section-b-0/units";
import {getImageKey} from "@/core/utils";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Alert} from "react-native";
import Toast from "react-native-root-toast";
import v4 from "react-native-uuid";
import {useDispatch, useSelector} from "react-redux";

type Media = {
  preview: string | null;
  loading: boolean;
  pickImg: () => void;
  setPreview?: (v: string | null) => void;
  setUploaded?: (url: string) => void;
};
type Args = { navigation: any; route: any; media: Media };

export default function useHabitStackAddEditForm({
  navigation,
  route,
  media,
}: Args) {
  const dispatch = useDispatch();
  const userdata = useSelector((s: any) => s?.user?.userdata);
  // console.log("userdata in useHabitStackAddEditForm:", userdata); // --- IGNORE ---
  const username = userdata?.collectdata?.username;
  const userId = userdata?.collectdata?.userId?.trim();
  const generateHabitCost = useSelector((s: any) => selectGenerateHabitCost(s));
  const revenueCat = useSelector((s: any) => selectRevenueCat(s));

  const initial = route.params?.habitstackdata || {};
  const enableButton = !!initial?.documentId;

  const [loading, setLoading] = useState(false);
  const [showAIConfirmModal, setShowAIConfirmModal] = useState(false);
  const [steerDescription, setSteerDescription] = useState("");

  // lists
  const [sectors, setSectors] = useState<any[]>([]);
  const [allIcons, setAllIcons] = useState<any[]>([]);
  const [allColors, setAllColors] = useState<any[]>([]);
  const [focusList, setFocusList] = useState<any[]>([]);
  const [unitList, setUnitList] = useState<any[]>([]);
  const [priorityList, setPriorityList] = useState<any[]>([]);

  // form
  const [uuid] = useState(initial.documentId || v4.v4().toString());

  const [isPublic, setIsPublic] = useState<boolean>(initial.isPublic || false);
  const [hideFromFriends, setHideFromFriends] = useState<boolean>(
    initial.hideFromFriends || false,
  );

  const [stackname, setStackname] = useState<string>(initial.name || "");
  const [description, setDescription] = useState<string>(
    initial.description || "",
  );
  const [personsCount, setPersonsCount] = useState<number>(
    initial.personsCount || 0,
  );

  const [sectorId, setSectorId] = useState<string>(initial.sectorId || "");
  const [sectorVal, setSectorVal] = useState<string>("");

  const [focusVal, setFocusVal] = useState<string>(initial.focus || "");
  const [unitVal, setUnitVal] = useState<string>(initial.unit || "");
  const [priorityVal, setPriorityVal] = useState<string>(
    initial.priority || "",
  );

  const [iconDetail, setIconDetail] = useState<string>(initial.icon || "");
  const [iconColor, setIconColor] = useState<string>(
    initial.iconColor || "rgba(45, 156, 219, 1)",
  );
  const iconKey = useMemo(
    () => getImageKey(iconDetail) ?? "dollar",
    [iconDetail],
  );

  const [bannerImage, setBannerImage] = useState<string | null>(
    initial.bannerImage || null,
  );

  // friends
  const [friends, setFriends] = useState<any[]>([]);

  // habits & UI
  const [habits, setHabits] = useState<any[]>(initial?.habitData || []);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // when media preview changes (new upload or from existing initial data)
  useEffect(() => {
    if (media?.preview) {
      setBannerImage(media.preview); // this will be the uploaded downloadURL once upload completes
    }
  }, [media?.preview]);

  // bootstrap
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [secOpts, icons, colors] = await Promise.all([
          fetchSectorOptions(),
          fetchIcons(),
          fetchColors(),
        ]);
        setSectors(secOpts);
        setAllIcons(icons);
        setAllColors(colors);

        if (initial.sectorId) {
          const s = await fetchSectorById(initial.sectorId);
          setSectorVal(s?.label || "");
          const full = await fetchSectorFull(initial.sectorId);
          setFocusList(full?.focusIds || []);
          setPriorityList(full?.priorityIds || []);
          setUnitList(full?.unitIds || []);
        } else if (!initial.icon && icons?.[6]?.imageLocation) {
          setIconDetail(icons[6].imageLocation);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const fetchHabits = await fetchHabitComponentsByHabitStackId(uuid);
      setHabits(fetchHabits);
    } catch (e) {
      Toast.show("Failed to load habit links");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // people/friends
  const incPersons = () => setPersonsCount((p) => p + 1);
  const decPersons = () => setPersonsCount((p) => (p > 0 ? p - 1 : 0));
  const openFriendPicker = () =>
    navigation.navigate("selectfriend", {
      onGoBack: (data: any[]) => setFriends(data),
    });

  // habit card actions
  const toggleExpand = (id: string) =>
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const openMenu = (id: string) =>
    setMenuId((prev) => (prev === id ? null : id));
  const editHabit = (h: any) => {
    setMenuId(null);
    // sectorId
    // console.log("navigating to add_edit_habit with sectorId:", sectorId); // --- IGNORE ---
    navigation.navigate("add_edit_habit", {
      habitdata: h,
      selectedItem: {
        documentId: sectorId,
      },
      uuidnow: uuid,
    });
  };
  const deleteHabit = async (id: string) => {
    Alert.alert("Are you sure?", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await deleteHabitOnly(id);
            deleteHabitById(id);
            Toast.show("Habit Deleted Successfully");
            setMenuId(null);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };
  // const openItem = () => navigation.navigate("habitlinks", { originScreen: 'add_edit_habitstack', multiple: false });

  // delete habit from local habits array by id
  const deleteHabitById = (targetId: string) => {
    if (!targetId) return;
    setHabits((prev) =>
      prev.filter((habit) => (habit.documentId ?? habit.id) !== targetId),
    );
  };

  const openItem = (habitLink: HabitLinkComponent) =>
    navigation.navigate("habitlinks", {
      originScreen: "add_edit_habitstack",
      habitLink,
      multiple: true,
    });

  // pickers bridge (used by usePickers)
  const setSectorFromItem = async (item: any) => {
    setSectorId(item?.documentId);
    setSectorVal(item?.label);
    const full = await fetchSectorFull(item?.documentId);
    setFocusList(full?.focusIds || []);
    setPriorityList(full?.priorityIds || []);
    setUnitList(full?.unitIds || []);
    setFocusVal("");
    setUnitVal("");
    setPriorityVal("");
  };

  const setFocus = (v: any) => setFocusVal(v);
  const setUnit = (v: any) => setUnitVal(v);
  const setPriority = (v: any) => setPriorityVal(v);
  const setColor = (c: string) => setIconColor(c);
  const setIcon = (i: string) => setIconDetail(i);

  // media handoff
  useEffect(() => {
    // when media upload completes, useMediaUpload will call setUploaded()
    // which should set bannerImage here; we expose setter to the media hook
  }, []);

  // validate & save
  const validate = () => {
    if (!stackname) return "Please enter habit stack name";
    if (!iconDetail) return "Please select icon";
    if (!bannerImage) return "Please upload image";
    if (!description) return "Please enter habit stack description";
    if (!focusVal) return "Please slect habit stack focus item";
    if (!priorityVal) return "Please enter habit stack priority item";
    if (!unitVal) return "Please enter habit stack unit item";
    return "";
  };

  // New method: save and return boolean status
  const saveAndReturnStatus = async (): Promise<boolean> => {
    const msg = validate();
    if (msg) {
      Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
      return false;
    }

    //setLoading(true);
    try {
      const payload: HabitStackComponent = {
        id: uuid,
        isPublic,
        hideFromFriends,
        userId,
        sectorId,
        name: stackname,
        searchName: stackname.trim().toLowerCase(),
        icon: iconDetail,
        iconColor,
        bannerImage: bannerImage!,
        description,
        focus: focusVal,
        unit: unitVal,
        priority: priorityVal,
        personsCount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (enableButton) {
        await updateHabitStack(payload);
      } else {
        await saveHabitStack(payload);
      }

      // Toast.show("Habit Stack saved successfully!", {
      //   duration: Toast.durations.LONG,
      //   position: Toast.positions.BOTTOM,
      // });

      setLoading(false);
      return true;
    } catch (error) {
      console.log("Error saving habit stack:", error);
      Toast.show("Failed to save Habit Stack. Please try again.", {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const save = async (goHome: boolean) => {
    const msg = validate();
    if (msg) return Toast.show(msg);

    setLoading(true);
    try {
      const payload: HabitStackComponent = {
        id: uuid,
        isPublic,
        hideFromFriends,
        userId,
        sectorId,
        name: stackname,
        searchName: stackname.trim().toLowerCase(),
        icon: iconDetail,
        iconColor,
        bannerImage: bannerImage!,
        description,
        focus: focusVal,
        unit: unitVal,
        priority: priorityVal,
        personsCount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (enableButton) await updateHabitStack(payload);
      else await saveHabitStack(payload);

      if (goHome) navigation.navigate("drawertab");
      else
        navigation.navigate("add_edit_habit", {
          habitdata: {},
          uuid,
          selectedItem: {
            documentId: sectorId,
          },
          uuidnow: uuid,
        });
    } finally {
      setLoading(false);
    }
  };

  // const goAddHabit = () => navigation.navigate("add_edit_habit");
  const goAddHabit = () => console.log("goAddHabit clicked, but save first");
  const cancel = () => navigation.goBack();

  const DescriptionInput = (
    <TextBox
      icn={false}
      hig={15}
      wid={90}
      plac="Write here..."
      top={1}
      clr
      val={description}
      onchan={setDescription}
    />
  );

  const navigateToMarket = () => {
    // Navigate to market screen
    navigation.navigate("habit-market", {
      originScreen: "add_edit_habitstack",
      routeData: {
        habitSectorId: sectorId,
        habitStackId: uuid,
        habitId: null,
        habitLinkId: null,
        habitLinkItemId: null,
      },
    });
  };

  const navigateToFriendsHabits = () => {
    // Navigate to friends habit stacks screen
    navigation.navigate("my-friends-and-habits", {
      originScreen: "add_edit_habitstack",
      routeData: {
        habitSectorId: sectorId,
        habitStackId: uuid,
        habitId: null,
        habitLinkId: null,
        habitLinkItemId: null,
      },
    });
  };

  const navigateToHabitsAIScreen = async (opts?: { adjustedCost?: number; modelId?: string }) => {
    const cost = opts?.adjustedCost ?? generateHabitCost;
    const modelId = opts?.modelId ?? 'claude-sonnet-4-6';
    const fetchedUnits = await fetchUnitsByDocumentId(unitVal);
    const costSymbol = (fetchedUnits as any)?.[0]?.symbol ?? "";
    const { data: record, status } = await decreaseRemainingCreditsByUserId(userId, cost);
    if (status >= 200 && status < 300 && record) {
      dispatch(RevenueCatAction.subtractCredits(cost));
      navigation.navigate("habits-ai", {
        originScreen: "add_edit_habitstack",
        routeData: {
          habitStackId: uuid,
          steerDescription: steerDescription.trim(),
          modelId,
          costSymbol,
        },
      });
    }
  };

  const navigateToHabitStacksAIScreen = () => {
    dispatch(RevenueCatAction.subtractCredits(generateHabitCost));
    navigation.navigate("habit-stack-ai", {
      originScreen: "my-habit-stacks",
      routeData: { steerDescription: steerDescription.trim() },
    });
  };

  const navigateToMyLibraryHabits = () => {
    // Navigate to my library habit stacks screen
    navigation.navigate("my-friends-and-habits", {
      originScreen: "add_edit_habitstack",
      destinationScreenTitle: "My Library",
      routeData: {
        dataHasOnlySelfUser: true,
        habitSectorId: sectorId,
        habitStackId: uuid,
        habitId: null,
        habitLinkId: null,
        habitLinkItemId: null,
      },
    });
  };

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);

  return {
    uuid,
    // state for UI
    loading,
    username,
    userdata,
    // lists
    sectors,
    allIcons,
    allColors,
    focusList,
    unitList,
    priorityList,
    // form
    stackname,
    setStackname,
    iconKey,
    iconColor,
    setColor,
    setIcon,
    sectorId,
    sectorVal,
    focusVal,
    unitVal,
    priorityVal,
    setSectorFromItem,
    setFocus,
    setUnit,
    setPriority,
    // people/friends
    personsCount,
    incPersons,
    decPersons,
    friends,
    openFriendPicker,
    // media
    bannerImage,
    setBannerImage,
    // habits
    habits,
    expandedIds,
    toggleExpand,
    menuId,
    openMenu,
    editHabit,
    deleteHabit,
    openItem,
    // actions
    save,
    saveAndReturnStatus,
    goAddHabit,
    cancel,
    // description
    DescriptionInput,
    // navigate
    navigateToMarket,
    navigateToFriendsHabits,
    navigateToHabitsAIScreen,
    navigateToHabitStacksAIScreen,
    load,
    navigateToMyLibraryHabits,
    showAIConfirmModal,
    setShowAIConfirmModal,
    steerDescription,
    setSteerDescription,
    generateHabitCost,
    revenueCat,
    isPublic,
    setIsPublic,
    hideFromFriends,
    setHideFromFriends,
  };
}
