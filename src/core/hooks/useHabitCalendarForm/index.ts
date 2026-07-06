import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { canEditScreen } from "@/core/utils";
import {
  HabitLinkComponent,
  IHabitCalendar,
  IHabitCalendarCalendarType,
  RouterData,
} from "@/core/models/section-b";
import { getHabitCalendarCalculatedDates } from "@/core/services/section-b/section-b-2";
import { ICalendarDate } from "@/core/models/section-b/calendar";
import {
  getHabitCalendarByHabitIdAndDays,
  getHabitLinkCalendarByHabitLinkIdAndDays,
  getHabitLinkItemCalendarByHabitLinkItemIdAndDays,
  getHabitStackCalendarByHabitStackIdAndDays,
} from "@/core/services/section-b/section-b-2/calendar";

type RootState = any; // replace with your real RootState

type Props = { navigation: any; route: any };

export default function useHabitCalendarForm({ navigation, route }: Props) {
  const userId: string | undefined = useSelector(
    (s: RootState) => s?.user?.userdata?.collectdata?.userId
  );
  const user = useSelector((s: any) => s?.user?.userdata.collectdata);
  const routerData: RouterData = route.params?.routerData || null;

  // --- DERIVED ENTITY STATE (Primary Fix for Flickering) ---
  // We use useMemo to synchronously derive entities from routerData,
  // eliminating the need for useState and useEffect for these variables.

  const habitStack = useMemo(() => routerData?.habitStack, [routerData]);
  const habit = useMemo(() => routerData?.habit, [routerData]);
  const habitLink = useMemo(() => routerData?.habitLink, [routerData]);
  const habitLinkItem = useMemo(() => routerData?.habitLinkItem, [routerData]);

  // Derived IDs and Flags
  const hasHabitStackData = !!habitStack;
  const hasHabitData = !!habit;
  const hasHabitLinkData = !!habitLink;
  const hasHabitLinkItemData = !!habitLinkItem;

  // Derive a unique key to trigger the load whenever the relevant ID changes
  const currentEntityKey = useMemo(() => {
    if (habitStack) return `stack:${habitStack.id}`;
    if (habit) return `habit:${habit.id}`;
    if (habitLink) return `link:${habitLink.id}`;
    if (habitLinkItem) return `item:${habitLinkItem.id}`;
    return "none";
  }, [habitStack, habit, habitLink, habitLinkItem]);

  // --- GENERAL APP STATE (Remaining unchanged for simplicity) ---

  const originScreen = route.params?.originScreen;
  const canEdit = canEditScreen(originScreen);
  const cameFromDrawerTab =
    originScreen == undefined || originScreen === "drawer" ? true : false;
  const destinationScreenTitle =
    routerData?.destinationScreenTitle || "Calendar";
  const costSymbol = routerData?.costSymbol || "";

  //Calendar Data
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const [calendarType, setCalendarType] =
    useState<IHabitCalendarCalendarType>("Monthly");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month - 1);
  const [selectedWeek, setSelectedWeek] = useState<number[] | null>(null);
  const [habitCalendarData, setHabitCalendarData] = useState<IHabitCalendar[]>(
    []
  );
  // Add to your hook's state
  const [progressLogs, setProgressLogs] = useState<string[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  // --- LOADING STATE ---
  const [loading, setLoading] = useState(false);

  // --- DATA FETCHING (Dependencies updated to use derived entities) ---

  // Helper function to add log
  const addProgressLog = (message: string) => {
    setProgressLogs((prev) => [...prev, message]);
    console.log(message);
  };

  // Clear logs when starting new load
  const clearProgressLogs = () => {
    setProgressLogs([]);
  };

  const fetchHabitStackCalendarData = useCallback(async () => {
    if (!habitStack || !userId) return;

    setLoading(true);
    setIsLoadingProgress(true);
    clearProgressLogs();

    try {
      const calendar: ICalendarDate = getHabitCalendarCalculatedDates(
        calendarType,
        selectedYear,
        selectedMonth + 1,
        selectedWeek
      );

      if (calendar.dates.length === 0) {
        addProgressLog("⚠️ No dates calculated");
        setHabitCalendarData([]);
        setIsLoadingProgress(false);
        return;
      }

      addProgressLog(`📅 Processing ${calendar.dates.length} dates in batches`);

      const BATCH_SIZE = 5;
      const allFetchedData: IHabitCalendar[] = [];
      const totalBatches = Math.ceil(calendar.dates.length / BATCH_SIZE);

      for (let i = 0; i < calendar.dates.length; i += BATCH_SIZE) {
        const batch = calendar.dates.slice(i, i + BATCH_SIZE);
        const currentBatch = Math.floor(i / BATCH_SIZE) + 1;

        addProgressLog(
          `🔄 Fetching batch ${currentBatch}/${totalBatches} (${batch.length} dates)`
        );

        try {
          const payload = {
            id: habitStack.id,
            data: { dates: batch },
          };

          const fetchedData: IHabitCalendar[] =
            await getHabitStackCalendarByHabitStackIdAndDays(payload);

          allFetchedData.push(...fetchedData);
          setHabitCalendarData([...allFetchedData]);

          addProgressLog(
            `✅ Batch ${currentBatch} complete (${fetchedData.length} items)`
          );

          if (i + BATCH_SIZE < calendar.dates.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } catch (batchError) {
          addProgressLog(`❌ Error in batch ${currentBatch}: ${batchError}`);
        }
      }

      addProgressLog(
        `🎉 All batches complete. Total items: ${allFetchedData.length}`
      );
    } catch (e) {
      addProgressLog(`❌ Error: ${e}`);
      Toast.show("Failed to load habit stack calendar data");
    } finally {
      setLoading(false);
      setTimeout(() => setIsLoadingProgress(false), 1000); // Hide after 1 second
    }
  }, [
    habitStack,
    userId,
    calendarType,
    selectedYear,
    selectedMonth,
    selectedWeek,
  ]);

  const fetchHabitCalendarData = useCallback(async () => {
    if (!habit || !userId) return;

    setLoading(true);
    setIsLoadingProgress(true);
    clearProgressLogs();

    try {
      const calendar: ICalendarDate = getHabitCalendarCalculatedDates(
        calendarType,
        selectedYear,
        selectedMonth + 1,
        selectedWeek
      );

      if (calendar.dates.length === 0) {
        addProgressLog("⚠️ No dates calculated");
        setHabitCalendarData([]);
        setIsLoadingProgress(false);
        return;
      }

      addProgressLog(`📅 Processing ${calendar.dates.length} dates in batches`);

      const BATCH_SIZE = 5;
      const allFetchedData: IHabitCalendar[] = [];
      const totalBatches = Math.ceil(calendar.dates.length / BATCH_SIZE);

      for (let i = 0; i < calendar.dates.length; i += BATCH_SIZE) {
        const batch = calendar.dates.slice(i, i + BATCH_SIZE);
        const currentBatch = Math.floor(i / BATCH_SIZE) + 1;

        addProgressLog(
          `🔄 Fetching batch ${currentBatch}/${totalBatches} (${batch.length} dates)`
        );

        try {
          const payload = {
            id: habit.id,
            data: { dates: batch },
          };

          const fetchedData: IHabitCalendar[] =
            await getHabitCalendarByHabitIdAndDays(payload);

          allFetchedData.push(...fetchedData);
          setHabitCalendarData([...allFetchedData]);

          addProgressLog(
            `✅ Batch ${currentBatch} complete (${fetchedData.length} items)`
          );

          if (i + BATCH_SIZE < calendar.dates.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } catch (batchError) {
          addProgressLog(`❌ Error in batch ${currentBatch}: ${batchError}`);
        }
      }

      addProgressLog(
        `🎉 All batches complete. Total items: ${allFetchedData.length}`
      );
    } catch (e) {
      addProgressLog(`❌ Error: ${e}`);
      Toast.show("Failed to load habit calendar data");
    } finally {
      setLoading(false);
      setTimeout(() => setIsLoadingProgress(false), 1000);
    }
  }, [habit, userId, calendarType, selectedYear, selectedMonth, selectedWeek]);

  const fetchHabitLinkCalendarData = useCallback(async () => {
    if (!habitLink || !userId) return;

    setLoading(true);
    setIsLoadingProgress(true);
    clearProgressLogs();

    try {
      const calendar: ICalendarDate = getHabitCalendarCalculatedDates(
        calendarType,
        selectedYear,
        selectedMonth + 1,
        selectedWeek
      );

      if (calendar.dates.length === 0) {
        addProgressLog("⚠️ No dates calculated");
        setHabitCalendarData([]);
        setIsLoadingProgress(false);
        return;
      }

      addProgressLog(`📅 Processing ${calendar.dates.length} dates in batches`);

      const BATCH_SIZE = 5;
      const allFetchedData: IHabitCalendar[] = [];
      const totalBatches = Math.ceil(calendar.dates.length / BATCH_SIZE);

      for (let i = 0; i < calendar.dates.length; i += BATCH_SIZE) {
        const batch = calendar.dates.slice(i, i + BATCH_SIZE);
        const currentBatch = Math.floor(i / BATCH_SIZE) + 1;

        addProgressLog(
          `🔄 Fetching batch ${currentBatch}/${totalBatches} (${batch.length} dates)`
        );

        try {
          const payload = {
            id: habitLink.id,
            data: { dates: batch },
          };

          const fetchedData: IHabitCalendar[] =
            await getHabitLinkCalendarByHabitLinkIdAndDays(payload);

          allFetchedData.push(...fetchedData);
          setHabitCalendarData([...allFetchedData]);

          addProgressLog(
            `✅ Batch ${currentBatch} complete (${fetchedData.length} items)`
          );

          if (i + BATCH_SIZE < calendar.dates.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } catch (batchError) {
          addProgressLog(`❌ Error in batch ${currentBatch}: ${batchError}`);
        }
      }

      addProgressLog(
        `🎉 All batches complete. Total items: ${allFetchedData.length}`
      );
    } catch (e) {
      addProgressLog(`❌ Error: ${e}`);
      Toast.show("Failed to load habit link calendar data");
    } finally {
      setLoading(false);
      setTimeout(() => setIsLoadingProgress(false), 1000);
    }
  }, [
    habitLink,
    userId,
    calendarType,
    selectedYear,
    selectedMonth,
    selectedWeek,
  ]);

  const fetchHabitLinkItemCalendarData = useCallback(async () => {
    if (!habitLinkItem || !userId) return;

    setLoading(true);
    setIsLoadingProgress(true);
    clearProgressLogs();

    try {
      const calendar: ICalendarDate = getHabitCalendarCalculatedDates(
        calendarType,
        selectedYear,
        selectedMonth + 1,
        selectedWeek
      );

      if (calendar.dates.length === 0) {
        addProgressLog("⚠️ No dates calculated");
        setHabitCalendarData([]);
        setIsLoadingProgress(false);
        return;
      }

      addProgressLog(`📅 Processing ${calendar.dates.length} dates in batches`);

      const BATCH_SIZE = 5;
      const allFetchedData: IHabitCalendar[] = [];
      const totalBatches = Math.ceil(calendar.dates.length / BATCH_SIZE);

      for (let i = 0; i < calendar.dates.length; i += BATCH_SIZE) {
        const batch = calendar.dates.slice(i, i + BATCH_SIZE);
        const currentBatch = Math.floor(i / BATCH_SIZE) + 1;

        addProgressLog(
          `🔄 Fetching batch ${currentBatch}/${totalBatches} (${batch.length} dates)`
        );

        try {
          const payload = {
            id: habitLinkItem.id,
            data: { dates: batch },
          };

          const fetchedData: IHabitCalendar[] =
            await getHabitLinkItemCalendarByHabitLinkItemIdAndDays(payload);

          allFetchedData.push(...fetchedData);
          setHabitCalendarData([...allFetchedData]);

          addProgressLog(
            `✅ Batch ${currentBatch} complete (${fetchedData.length} items)`
          );

          if (i + BATCH_SIZE < calendar.dates.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } catch (batchError) {
          addProgressLog(`❌ Error in batch ${currentBatch}: ${batchError}`);
        }
      }

      addProgressLog(
        `🎉 All batches complete. Total items: ${allFetchedData.length}`
      );
    } catch (e) {
      addProgressLog(`❌ Error: ${e}`);
      Toast.show("Failed to load habit link item calendar data");
    } finally {
      setLoading(false);
      setTimeout(() => setIsLoadingProgress(false), 1000);
    }
  }, [
    habitLinkItem,
    userId,
    calendarType,
    selectedYear,
    selectedMonth,
    selectedWeek,
  ]);

  // --- DATA HYDRATION / REFRESHING ---
  // hydrate
  const load = useCallback(async () => {
    if (!userId || currentEntityKey === "none") return;

    // Clear old data immediately to prevent flicker
    setHabitCalendarData([]);

    // The individual fetch functions handle setting and clearing loading state
    try {
      if (hasHabitStackData) {
        await fetchHabitStackCalendarData();
      } else if (hasHabitData) {
        await fetchHabitCalendarData();
      } else if (hasHabitLinkData) {
        await fetchHabitLinkCalendarData();
      } else if (hasHabitLinkItemData) {
        await fetchHabitLinkItemCalendarData();
      }
    } catch (e) {
      console.error(e);
      // The individual fetch functions will have already shown a toast and set loading=false
    }
  }, [
    userId,
    currentEntityKey, // NEW: Use the single derived key for optimization
    calendarType,
    selectedYear,
    selectedMonth,
    selectedWeek,
    hasHabitStackData,
    hasHabitData,
    hasHabitLinkData,
    hasHabitLinkItemData,
    fetchHabitStackCalendarData,
    fetchHabitCalendarData,
    fetchHabitLinkCalendarData,
    fetchHabitLinkItemCalendarData,
  ]);

  // --- LIFECYCLE MANAGEMENT (Simplified) ---

  // Trigger load when the entity ID changes (Initial load and deep navigation)
  useEffect(() => {
    if (currentEntityKey !== "none" && userId) {
      console.log(
        `🔄 Entity key changed to ${currentEntityKey}, calling load()`
      );
      load();
    }
  }, [currentEntityKey, userId, load]);

  // Refetch when screen focuses (e.g., coming back from another tab)
  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);

  // actions
  const onOpenLinkItem = (habitLink: HabitLinkComponent) => {
    navigation.navigate("habitlinks", {
      originScreen: "habit-calendar",
      habitLink,
      multiple: false,
    });
  };

  return {
    loading,
    user,
    userId,
    canEdit,
    cameFromDrawerTab,
    destinationScreenTitle,
    habitStack,
    habit,
    habitLink,
    habitLinkItem,
    load,
    onOpenLinkItem,
    costSymbol,
    //Calendar Data
    calendarType,
    setCalendarType,
    showTypeDropdown,
    setShowTypeDropdown,
    showCalendarPicker,
    setShowCalendarPicker,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedWeek,
    setSelectedWeek,
    habitCalendarData,
    setHabitCalendarData,
    progressLogs,
    isLoadingProgress,
  };
}
