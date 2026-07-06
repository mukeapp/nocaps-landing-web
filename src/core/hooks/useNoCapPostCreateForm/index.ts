import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { canEditScreen, ConstantsUtils, showToastSuccess, uuidUtils } from "@/core/utils";
import { RouterData, HabitStackComponent } from "@/core/models/section-b";
import { SelectionItem } from "@/core/components/section-c/SelectionModal";
import { NocapPost } from "@/core/models/section-c/post";
import { getHabitStackComponentsByUserAndSector } from "@/core/services/section-b/section-b-0/habitstack";
import { getHabitDataByCategoryWithParentIds, createNocapPost } from "@/core/services/section-c";

type RootState = any; // TODO: Replace with actual RootState type

type Props = {
  navigation: any;
  route: any;
};

const MENU_ITEMS = [
  { label: "Title", iconSet: "mci", icon: "format-pilcrow" },
  //{ label: "Camera", iconSet: "feather", icon: "camera" },
  { label: "Image", iconSet: "ionicons", icon: "images-outline" },
  //{ label: "Music", iconSet: "mci", icon: "music-note-outline" },
  { label: "Select Sector", iconSet: "mci", icon: "shape-outline" },
  { label: "Habit Type", iconSet: "feather", icon: "hash" },
  { label: "Select Habit", iconSet: "mci", icon: "link-variant" },
  { label: "Location", iconSet: "ionicons", icon: "location-outline" },
] as const;

const POST_VISIBILITY_OPTIONS = [
  { id: 0, label: "Public" },
  { id: 1, label: "Friends" },
  { id: 2, label: "Only Me" },
] as const;

const HABIT_TYPES = [
  { id: 1, name: "HABIT-STACKS", label: "Habit Stacks" },
  { id: 2, name: "HABITS", label: "Habits" },
  { id: 3, name: "HABIT-LINKS", label: "Habit Links" },
  { id: 4, name: "HABIT-LINK-ITEMS", label: "Habit Link Items" },
] as const;

const financeSectorId = ConstantsUtils.financeSectorId;
const healthFitnessSectorId = ConstantsUtils.healthFitnessSectorId;
const lifestyleRecreationSectorId =
  ConstantsUtils.lifestyleRecreationSectorId;
const personalGrowthSectorId = ConstantsUtils.personalGrowthSectorId;
const productivitySectorId = ConstantsUtils.productivitySectorId;
const relationshipsSectorId = ConstantsUtils.relationshipsSectorId;

const SECTORS = [
  { id: financeSectorId, name: "Finance" },
  { id: healthFitnessSectorId, name: "Health & Fitness" },
  { id: lifestyleRecreationSectorId, name: "Lifestyle & Recreation" },
  { id: personalGrowthSectorId, name: "Personal Growth" },
  { id: productivitySectorId, name: "Productivity" },
  { id: relationshipsSectorId, name: "Relationships" },
] as const;

export default function useNoCapPostCreateForm({ navigation, route }: Props) {
  const userId = useSelector(
    (state: RootState) => state?.user?.userdata?.collectdata?.userId
  ) as string | undefined;

  const user = useSelector((state: RootState) => state?.user?.userdata?.collectdata);

  const originScreen = route.params?.originScreen;
  const destinationScreenTitle = route.params?.destinationScreenTitle || "NoCaps Post Home";
  const cameFromDrawerTab = !originScreen || originScreen === "drawer";
  const canEdit = canEditScreen(originScreen);

  const [loading, setLoading] = useState(false);

  // Alert modal state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = useCallback((title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  }, []);

  const dismissAlert = useCallback(() => {
    setAlertVisible(false);
  }, []);

  /////  Form state and setters ////////////////////////////////////

    // Form state
    const [content, setContent] = useState("");
    const [postVisibility, setPostVisibility] = useState<
      (typeof POST_VISIBILITY_OPTIONS)[number]
    >(POST_VISIBILITY_OPTIONS[0]);
    const [title, setTitle] = useState("");
    //const [camera_image_url, setCamera_image_url] = useState("");
    const [image_video_url, setImage_video_url] = useState("");
    const [music_url, setMusic_url] = useState("");
    const [sector, setSector] = useState<SelectionItem | null>(null);
    const [habitType, setHabitType] = useState<SelectionItem | null>(null);
    const [habit, setHabit] = useState("");
    const [location, setLocation] = useState("");
    const [habitStackId, setHabitStackId] = useState("");
    const [habitId, setHabitId] = useState("");
    const [habitLinkId, setHabitLinkId] = useState("");
    const [habitLinkItemId, setHabitLinkItemId] = useState("");

  //////////////////////////////////////////////////////////////////////

  // Habit data fetching state
  const [habitStacks, setHabitStacks] = useState<HabitStackComponent[]>([]);
  const [selectedHabitItemId, setSelectedHabitItemId] = useState<string | null>(null);

  // Fetch habit stacks when sector changes
  useEffect(() => {
    if (!sector || !userId) {
      setHabitStacks([]);
      // Clear habit selection when sector changes
      setHabit("");
      setSelectedHabitItemId(null);
      setHabitStackId("");
      setHabitId("");
      setHabitLinkId("");
      setHabitLinkItemId("");
      return;
    }

    let cancelled = false;
    const fetchStacks = async () => {
      try {
        const sectorId = String(sector.id);
        const data = await getHabitStackComponentsByUserAndSector(userId, sectorId);
        if (!cancelled) {
          setHabitStacks(Array.isArray(data) ? data : []);
          // Clear habit selection when sector changes
          setHabit("");
          setSelectedHabitItemId(null);
          setHabitStackId("");
          setHabitId("");
          setHabitLinkId("");
          setHabitLinkItemId("");
        }
      } catch (error) {
        console.error("Failed to fetch habit stacks:", error);
        if (!cancelled) setHabitStacks([]);
      }
    };

    fetchStacks();
    return () => { cancelled = true; };
  }, [sector, userId]);

  // Clear habit selection when habit type changes
  useEffect(() => {
    setHabit("");
    setSelectedHabitItemId(null);
    setHabitStackId("");
    setHabitId("");
    setHabitLinkId("");
    setHabitLinkItemId("");
  }, [habitType]);

  // Derive the habit items list based on habitType selection,
  // enriched with parent IDs up the hierarchy chain.
  const habitItems = useMemo(() => {
    if (!habitType || habitStacks.length === 0) return [];
    const categoryId = Number(habitType.id);
    return getHabitDataByCategoryWithParentIds(habitStacks, categoryId);
  }, [habitStacks, habitType]);

  // Select a habit item — saves all parent IDs up the hierarchy chain
  const selectHabitItem = useCallback(
    (item: any) => {
      setHabit(item?.name ?? "");
      setSelectedHabitItemId(item?.documentId ?? item?.id ?? "");

      // Always save habitStackId; save deeper IDs when available
      setHabitStackId(item?._habitStackId ?? "");
      setHabitId(item?._habitId ?? "");
      setHabitLinkId(item?._habitLinkId ?? "");
      setHabitLinkItemId(item?._habitLinkItemId ?? "");
    },
    []
  );

  //////////////////////////////////////////////////////////////////////

  const navigateToHabitLink = useCallback(
    (routerData: RouterData) => {
      navigation.navigate("habitlinks", {
        originScreen: "my-habit-library",
        routerData,
      });
    },
    [navigation]
  );

  const canSelectHabit = useCallback((): boolean => {
    return sector !== null && habitType !== null;
  }, [sector, habitType]);

  const validate = useCallback((): string[] => {
    const errors: string[] = [];
    if (!title.trim()) errors.push("Title is required");
    if (!sector) errors.push("Sector is required");
    if (!habitType) errors.push("Habit Type is required");
    if (!habit.trim()) errors.push("Select Habit is required");
    if (!image_video_url && !content.trim()) {
      errors.push("Content is required when no Image is provided");
    }
    return errors;
  }, [title, sector, habitType, habit, image_video_url, content]);

  const checkPrerequisite = useCallback(
    (label: string): boolean => {
      if (label === "Select Habit" && !canSelectHabit()) {
        showAlert(
          "Prerequisite Required",
          "Please select a Sector and Habit Type before selecting a Habit."
        );
        return false;
      }
      return true;
    },
    [canSelectHabit, showAlert]
  );

//   curl -X 'POST' \
//   'http://localhost:3000/nocap-posts' \
//   -H 'accept: */*' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "id": "cd911f0f-6233-4287-97b3-86c98f7087ee",
//   "userId": "user-123",
//   "title": "My Post Title",
//   "content": "This is the content of the post",
//   "sector": "health",
//   "habitType": "daily",
//   "habitStackId": "stack-123",
//   "habitId": "habit-123",
//   "habitLinkId": "link-123",
//   "habitLinkItemId": "link-item-123",
//   "imageUrl": "https://example.com/image.png",
//   "videoUrl": "https://example.com/video.mp4",
//   "audioUrl": "https://example.com/audio.mp3",
//   "location": "New York, NY",
//   "createdAt": "2023-10-07T14:48:00.000Z",
//   "updatedAt": "2023-10-07T15:00:00.000Z"
// }'
  const createPost = useCallback(async () => {
    const errors = validate();
    if (errors.length > 0) {
      console.log("Post creation failed — missing fields:", errors);
      showAlert("Missing Required Fields", errors.join("\n"));
      return;
    }

    const noCapPost: NocapPost = {
      id: uuidUtils.generateUUID(),
      postVisibility: postVisibility.id,
      title: title.trim(),
      content: content.trim(),
      sector: sector?.id?.toString() ?? "",
      habitType: habitType?.name?.toString() ?? "",
      habitStackId,
      habitId,
      habitLinkId,
      habitLinkItemId,
      imageUrl: image_video_url || undefined,
      location: location.trim() || undefined,
      userId,
    };

    console.log("Creating NoCaps Post:", noCapPost);

    setLoading(true);
    try {
      const result = await createNocapPost(noCapPost);
      if (result?.status && result.status >= 200 && result.status < 300) {
        console.log("Post created successfully:", result.data);
        showToastSuccess("Post Successfully Created");
        navigation.navigate("no-cap-post-home");
      } else {
        console.log("Post creation failed:", result);
        showAlert("Error", "Failed to create post. Please try again.");
      }
    } catch (error) {
      console.log("Post creation error:", error);
      showAlert("Error", "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    validate, title, content, sector, habitType,
    habitStackId, habitId, habitLinkId, habitLinkItemId,
    image_video_url, location, userId, navigation, postVisibility, showAlert,
  ]);

  const load = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // TODO: Add actual loading logic here
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

  return {
    loading,
    user,
    userId,
    cameFromDrawerTab,
    canEdit,
    destinationScreenTitle,
    navigateToHabitLink,
    MENU_ITEMS,
    POST_VISIBILITY_OPTIONS,
    HABIT_TYPES,
    SECTORS,
    // Form state and setters
    content,
    setContent,
    postVisibility,
    setPostVisibility,
    title,
    setTitle,
    image_video_url,
    setImage_video_url,
    music_url,
    setMusic_url,
    sector,
    setSector,
    habitType,
    setHabitType,
    habit,
    setHabit,
    location,
    setLocation,
    habitStackId,
    setHabitStackId,
    habitId,
    setHabitId,
    habitLinkId,
    setHabitLinkId,
    habitLinkItemId,
    setHabitLinkItemId,
    canSelectHabit,
    checkPrerequisite,
    createPost,
    // Alert modal state
    alertVisible,
    alertTitle,
    alertMessage,
    dismissAlert,
    // Habit selection data
    habitItems,
    selectedHabitItemId,
    selectHabitItem,
  };
}
