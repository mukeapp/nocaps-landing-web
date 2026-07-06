import { HabitLinkComponent } from "@/core/models/section-b";
import {
  apiGetColors,
  apiGetIcons,
  apiSaveHabitLink,
  apiUpdateHabitLink,
} from "@/core/services/section-b/section-b-0/habit-link";
import { imageKeyFromUrl } from "@/core/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import Toast from "react-native-root-toast";
import v4 from "react-native-uuid";
import { useSelector } from "react-redux";

type Props = {
  navigation: any;
  route: any;
  media: { local: string | null; preview: string | null; loading: boolean };
};

type RootState = any; // tighten with your actual store later

export default function useHabitLinkAddEditForm({ navigation, route, media }: Props) {
  const originScreen = route?.params?.originScreen;
  const uid: string = route?.params?.uuidnow;
  const routeData = route?.params?.habitLink || {};
  const userData = useSelector((s: RootState) => s?.user?.userdata);

  const isEditing = Object.keys(routeData).length > 0;

  // base state
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>(isEditing ? routeData?.name ?? "" : "");
  const [company, setCompany] = useState<string>(isEditing ? routeData?.company ?? "" : "");
  const [location, setLocation] = useState<string>(isEditing ? routeData?.location ?? "" : "");
  const [description, setDescription] = useState<string>(isEditing ? routeData?.description ?? "" : "");
  const [id] = useState<string>(isEditing ? routeData?.documentId : v4.v4().toString());

  // icon + color
  const [iconsList, setIconsList] = useState<any[]>([]);
  const [colorsList, setColorsList] = useState<any[]>([]);
  const [iconUrl, setIconUrl] = useState<string>("");
  const [iconName, setIconName] = useState<string>("");
  const [color, setColor] = useState<string>(isEditing ? routeData?.iconColor ?? "rgba(45, 156, 219, 1)" : "rgba(45, 156, 219, 1)");

  // modals
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [iconModalOpen, setIconModalOpen] = useState(false);

  // banner handling
  const routeBannerImage = useMemo<string | null>(() => (isEditing ? routeData?.bannerImage ?? null : null), [isEditing, routeData?.bannerImage]);
  const [bannerImage, setBannerImage] = useState<string | null>(routeBannerImage);

  // sync preview (uploaded) → banner
  useEffect(() => {
    if (media?.preview) setBannerImage(media.preview);
  }, [media?.preview]);

  // hydrate colors & icons
  useEffect(() => {
    (async () => {
      try {
        const [colors, icons] = await Promise.all([apiGetColors(), apiGetIcons()]);
        setColorsList(colors ?? []);
        setIconsList(icons ?? []);

        if (isEditing) {
          if (routeData?.icon) {
            setIconUrl(routeData.icon);
            setIconName(imageKeyFromUrl(routeData.icon) || "");
          } else if (icons?.[6]?.imageLocation || icons?.[0]?.imageLocation) {
            const def = icons[6]?.imageLocation ?? icons[0]?.imageLocation;
            setIconUrl(def);
            setIconName(imageKeyFromUrl(def) || "");
          }
        } else {
          const def = icons?.[6]?.imageLocation ?? icons?.[0]?.imageLocation;
          if (def) {
            setIconUrl(def);
            setIconName(imageKeyFromUrl(def) || "");
          }
        }
      } catch (e) {
        console.log("Error fetching colors/icons", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // modal triggers
  const openColorPicker = useCallback(() => setColorModalOpen(true), []);
  const openIconPicker = useCallback(() => setIconModalOpen(true), []);

  // modal picks
  const onPickColor = useCallback((_obj: string, clr: string) => {
    setColorModalOpen(false);
    setColor(clr);
  }, []);

  const onPickIcon = useCallback((_obj: string, icn: string) => {
    if (icn && icn !== "no") {
      setIconUrl(icn);
      setIconName(imageKeyFromUrl(icn) || "");
    }
    setIconModalOpen(false);
  }, []);

  const onSave = useCallback(async () => {
    // early validation before loading=true to avoid flicker
    if (!name?.trim()) return Toast.show("Habit link name is required");
    if (!description?.trim()) return Toast.show("Description is required");
    if (!bannerImage) return Toast.show("Please upload a banner image");
    if (!location?.trim()) return Toast.show("Please enter location");
    if (!iconUrl) return Toast.show("Please select an icon");

    setLoading(true);
    try {
      const data: HabitLinkComponent = {
        id,
        bannerImage,
        userId: userData?.collectdata?.userId?.trim(),
        habitId: uid,
        name,
        icon: iconUrl,
        iconColor: color,
        company,
        location,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (isEditing) {
        await apiUpdateHabitLink(routeData?.documentId, data);
      } else {
        await apiSaveHabitLink(data);
      }
      navigation.goBack();
    } catch (e) {
      Toast.show("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  }, [name, description, bannerImage, iconUrl, color, company, location, id, userData?.collectdata?.userId, uid, isEditing, routeData?.documentId, navigation]);

  return {
    // state
    name, setName,
    iconName,
    color,
    company, setCompany,
    location, setLocation,
    description, setDescription,
    loading,
    setLoading,
    // modal data
    colorsList, iconsList,

    // modal controls
    colorModalOpen, setColorModalOpen,
    iconModalOpen, setIconModalOpen,
    openColorPicker, openIconPicker,
    onPickColor, onPickIcon,

    // actions
    onSave,

    // banner
    routeBannerImage,
  };
}
