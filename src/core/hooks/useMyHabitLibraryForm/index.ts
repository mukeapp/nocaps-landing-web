import {HabitStackComponent} from "@/core/models/section-b/habit";
import {fetchInterestSectors} from "@/core/services/section-a";
import {getHabitStackComponentsBySectorId, getHabitStackComponentsByUserAndSector} from "@/core/services/section-b/section-b-0/habitstack";
import {useCallback, useEffect, useRef, useState} from "react";
import Toast from "react-native-root-toast";
import {useSelector} from "react-redux";

type RootState = any; // replace with your RootState
type Props = { navigation: any; route: any };

const _habitCategories = [
  { id: 1, name: "HabitStacks" },
  { id: 2, name: "Habits" },
  { id: 3, name: "HabitLinks" },
];

export default function useMyHabitLibraryForm({ navigation }: Props) {
  const userId: string | undefined = useSelector(
    (s: RootState) => s?.user?.userdata?.collectdata?.userId
  );

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [habitCategories] = useState(_habitCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [sectors, setSectors] = useState<any[]>([]);
  const [stacksBySector, setStacksBySector] = useState<Record<string, HabitStackComponent[]>>({});

  // Track fetched sectorIds to prevent duplicate fetches
  const fetchedSectorIdsRef = useRef<Set<string>>(new Set());

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const result = await fetchInterestSectors();
      setSectors(Array.isArray(result) ? result : []);
    } catch (e) {
      Toast.show("Failed to load sectors");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // stable fetch function (no changing deps)
  const fetchStacks = useCallback(async (sectorDocId?: string) => {
    if (!sectorDocId) return;
    if (fetchedSectorIdsRef.current.has(sectorDocId)) return;
    fetchedSectorIdsRef.current.add(sectorDocId);

    try {
      //const data = await getHabitStackComponentsBySectorId(sectorDocId);
      // console.log("Fetching stacks for sector:", sectorDocId, "and user:", userId);
      const data = await getHabitStackComponentsByUserAndSector(userId ?? "", sectorDocId);
      setStacksBySector((prev) => ({
        ...prev,
        [sectorDocId]: Array.isArray(data) ? data : [],
      }));
    } catch (e) {
      // If it fails, allow future retries
      fetchedSectorIdsRef.current.delete(sectorDocId);
    }
  }, [userId]);

  // Force refetch all data - clears cache and reloads everything
  const refetch = useCallback(async () => {
    // Clear the fetched sectors cache
    fetchedSectorIdsRef.current.clear();

    // Clear existing stacks data
    setStacksBySector({});

    // Reload sectors
    await load();

    // Optionally: Refetch stacks for all sectors immediately
    // Uncomment if you want to reload all stacks on refetch
    /*
    if (sectors.length > 0) {
      for (const sector of sectors) {
        if (sector?.documentId) {
          await fetchStacks(sector.documentId);
        }
      }
    }
    */
  }, [load]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);

  return {
    loading,
    setLoading,
    selectedCategoryId,
    setSelectedCategoryId,
    sectors,
    habitCategories,
    searchQuery,
    setSearchQuery,
    stacksBySector,
    fetchStacks,
    refetch, // Add refetch to return object
  };
}