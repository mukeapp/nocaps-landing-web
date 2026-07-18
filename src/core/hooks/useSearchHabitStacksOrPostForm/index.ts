import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { fetchInterestSectors } from "@/core/services/section-a";
import { fetchUserAreFriendsAndMapForPagination } from "@/core/services/section-b/section-b-1";
import { useInfiniteList } from "../useInfiniteList";
import { RouterData, Sector } from "@/core/models/section-b";
import type { AvatarUser } from "@/core/components/section-c/Avatar";

type SearchMode = "Post" | "HabitStacks";
type Args = { navigation: any; route: any };

export default function useSearchHabitStacksOrPostForm({ navigation }: Args) {
  const userId: string = useSelector(
    (s: any) => s?.user?.userdata?.collectdata?.userId
  );

  // ── UI mode ──────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<SearchMode>("HabitStacks");

  // ── Loading ───────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);

  // ── Sectors ───────────────────────────────────────────────────────────────
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [activeSector, setActiveSector] = useState<string>("");

  const toggleSector = useCallback((id: string) => {
    setIdSearchValue('');
    setActiveSector((prev) => (prev === id ? "" : id));
  }, []);

  // ── Recommendations (empty for now) ──────────────────────────────────────
  const recommendations: AvatarUser[] = [];

  // ── Users search (empty for now) ─────────────────────────────────────────
  const users: AvatarUser[] = [];
  const [userQuery, setUserQuery] = useState("");

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.displayName.toLowerCase().includes(userQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(userQuery.toLowerCase())
      ),
    [users, userQuery]
  );

  // ── Friends (from backend) ────────────────────────────────────────────────
  const [friendQuery, setFriendQuery] = useState("");

  const fetcher = useCallback(
    (uid: string, page: number, pageSize: number) =>
      fetchUserAreFriendsAndMapForPagination(uid, page, pageSize),
    []
  );

  const friendsList = useInfiniteList<any>(fetcher);

  const mappedFriends: AvatarUser[] = useMemo(
    () =>
      (friendsList.data ?? []).map((item: any) => ({
        id: item.userId ?? item.id ?? item.documentId ?? "",
        displayName:
          [item.firstName, item.lastName].filter(Boolean).join(" ") ||
          item.username ||
          "",
        username: item.username ?? "",
        photo: item.photo ?? "",

      })),
    [friendsList.data]
  );

  const filteredFriends = useMemo(
    () =>
      mappedFriends.filter(
        (f) =>
          f.displayName.toLowerCase().includes(friendQuery.toLowerCase()) ||
          f.username.toLowerCase().includes(friendQuery.toLowerCase())
      ),
    [mappedFriends, friendQuery]
  );

  // ── Selection ─────────────────────────────────────────────────────────────
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const toggleUser = useCallback((id: string) => {
    setIdSearchValue('');
    setSelectedHabitStackIds([]);
    setHabitStackSearchName('');
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  }, []);

  const toggleFriend = useCallback((id: string) => {
    setIdSearchValue('');
    setSelectedHabitStackIds([]);
    setHabitStackSearchName('');
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  // ── ID search ─────────────────────────────────────────────────────────────
  const [idSearchValue, setIdSearchValue] = useState("");

  const onIdSearchValueChange = useCallback((text: string) => {
    setIdSearchValue(text);
    if (text.trim()) {
      setActiveSector('');
      setSelectedUsers([]);
      setSelectedFriends([]);
      setHabitStackSearchName('');
      setSelectedHabitStackIds([]);
    }
  }, []);

  // ── HabitStack search ─────────────────────────────────────────────────────
  const [habitStackSearchName, setHabitStackSearchName] = useState("");
  const [habitStackPickerVisible, setHabitStackPickerVisible] = useState(false);

  const onHabitStackSearchNameChange = useCallback((text: string) => {
    setIdSearchValue('');
    setHabitStackSearchName(text);
    if (text.trim()) {
      setSelectedUsers([]);
      setSelectedFriends([]);
    }
  }, []);
  const [selectedHabitStackIds, setSelectedHabitStackIds] = useState<string[]>([]);

  const openHabitStackPicker = useCallback(() => {
    const trimmed = habitStackSearchName.trim();
    if (trimmed.length < 3) {
      setErrorModal([
        "HabitStack name must be at least 3 characters long",
        trimmed.length === 0
          ? "Type a name to search HabitStacks"
          : `"${trimmed}" is too short — keep typing`,
      ]);
      return;
    }
    setHabitStackPickerVisible(true);
  }, [habitStackSearchName]);

  const onApplyHabitStacks = useCallback((ids: string[]) => {
    setIdSearchValue('');
    setSelectedHabitStackIds(ids);
    if (ids.length > 0) {
      setSelectedUsers([]);
      setSelectedFriends([]);
    }
  }, []);

  // ── Validation / GO ───────────────────────────────────────────────────────
  const [errorModal, setErrorModal] = useState<string[]>([]);

  const handleGo = useCallback(() => {
    const trimmedId = idSearchValue.trim();
    if (trimmedId) {
      if (mode === "HabitStacks") {
        navigation.navigate("habit-stack-search-show", {
          originScreen: "search-habitstacks-or-posts",
          routerData: { habitStackIds: [trimmedId] },
        });
      } else {
        navigation.navigate("post-search-show", {
          originScreen: "search-habitstacks-or-posts",
          routerData: { postId: trimmedId },
        });
      }
      return;
    }

    const allUserIds = [...selectedUsers, ...selectedFriends];
    const targetScreen =
      mode === "HabitStacks" ? "HabitStacksShowScreen" : "postShowScreen";

    // // HabitStack(s) selected → no other requirements
    // if (selectedHabitStackIds.length > 0) {
    //   console.log(`Going to ${targetScreen}`, {
    //     sectorId: activeSector,
    //     userIds: allUserIds,
    //     habitStackIds: selectedHabitStackIds,
    //     habitStackSearchName,
    //   });
    //   return;
    // }

    // HabitStack name must be empty OR at least 3 characters
    const trimmedName = habitStackSearchName.trim();
    if (trimmedName.length > 0 && trimmedName.length <= 2) {
      setErrorModal([
        "HabitStack name must be at least 3 characters long",
        `"${trimmedName}" is too short — type more or clear the field`,
      ]);
      return;
    }

    const missing: string[] = [];

    // Nothing selected at all
    if (!activeSector && allUserIds.length === 0) {
      missing.push("Select at least a Sector or a HabitStack");
    }

    // User/Friend selected → Sector is required
    if (allUserIds.length > 0 && !activeSector) {
      missing.push("Select a Sector when choosing a User or Friend");
    }

    if (missing.length > 0) {
      setErrorModal(missing);
      return;
    }

    console.log(`Going to ${targetScreen}`, {
      sectorId: activeSector,
      userIds: allUserIds,
      habitStackIds: selectedHabitStackIds,
      habitStackSearchName,
    });

    // search-habitstacks-or-posts
    // post-search-show
    const routerData: RouterData = {
        sectorId: activeSector,
        userIds: allUserIds,
        habitStackIds: selectedHabitStackIds,
        habitStackSearchName,
    };

    if( targetScreen === "postShowScreen") {
      navigation.navigate("post-search-show", {
        originScreen: 'search-habitstacks-or-posts',
        routerData,
      });
    } else if (targetScreen === "HabitStacksShowScreen") {
      navigation.navigate("habit-stack-search-show", {
        originScreen: 'search-habitstacks-or-posts',
        routerData,
      });
    }

  }, [activeSector, selectedUsers, selectedFriends, selectedHabitStackIds, habitStackSearchName, mode, idSearchValue]);

  // ── Data loading ──────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const result = await fetchInterestSectors();
      setSectors(result ?? []);
      if (result?.length) setActiveSector(result[0].documentId ?? result[0].id);
      await friendsList.reset();
      await friendsList.loadNext();
    } catch (e) {
      Toast.show("Failed to load");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);

  return {
    // ID search
    idSearchValue,
    onIdSearchValueChange,
    // mode
    mode,
    setMode,
    // sectors
    sectors,
    activeSector,
    toggleSector,
    // recommendations
    recommendations,
    // users (search)
    filteredUsers,
    userQuery,
    setUserQuery,
    // friends
    friendsList,
    filteredFriends,
    friendQuery,
    setFriendQuery,
    // selection
    selectedUsers,
    toggleUser,
    selectedFriends,
    toggleFriend,
    // habit stack search
    habitStackSearchName,
    setHabitStackSearchName,
    onHabitStackSearchNameChange,
    habitStackPickerVisible,
    setHabitStackPickerVisible,
    selectedHabitStackIds,
    openHabitStackPicker,
    onApplyHabitStacks,
    // go / validation
    handleGo,
    errorModal,
    setErrorModal,
    // loading
    loading,
  };
}
