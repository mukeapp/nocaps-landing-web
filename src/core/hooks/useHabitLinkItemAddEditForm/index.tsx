import { useMediaUploadV3 } from "@/core/hooks";
import { HabitLinkItemComponent } from "@/core/models/section-b";
import {
  apiGetUnitByHabitLinkId,
  apiSaveHabitLinkItem,
  apiUpdateHabitLinkItem,
} from "@/core/services/section-b/section-b-0/habit-link-item";
import {getScoreCode} from "@/core/utils/utilities/score";
import { useCallback, useEffect, useState } from "react";
import Toast from "react-native-root-toast";
import v4 from "react-native-uuid";
import { useSelector } from "react-redux";

type RootState = any; // replace with your real RootState
type Nav = any;
type Route = { params?: { id: string; linkData: any; nm?: string } };

type Args = { navigation: Nav; route: Route };

export default function useHabitLinkItemAddEditForm({ navigation, route }: Args) {
  const habitLinkId: string = route?.params?.id;
  const habitLinkName: string = route?.params?.nm ?? "Habit";
  const routeData: any = route?.params?.linkData ?? {};
  const editing = Object.keys(routeData ?? {}).length !== 0;

  const userId: string | undefined = useSelector(
    (s: RootState) => s?.user?.userdata?.collectdata?.userId
  );

  const [name, setName] = useState<string>(editing ? routeData?.name ?? "" : "");
  const [company, setCompany] = useState<string>(
    editing ? routeData?.companyName ?? "" : ""
  );
  const [itemUrl, setItemUrl] = useState<string>(
    editing ? routeData?.itemUrl ?? "" : ""
  );

  const [location, setLocation] = useState<string>(
    editing ? routeData?.location ?? "" : ""
  );
  const [price, setPrice] = useState<string>(
    editing && routeData?.price != null ? String(routeData.price) : ""
  );
  const [quantity, setQuantity] = useState<number>(editing ? routeData?.quantity ?? 0 : 0);
  const [description, setDescription] = useState<string>(
    editing ? routeData?.description ?? "" : ""
  );

  // 👇 NEW: Score state (stored as string percentage 0-100)
  const [score, setScore] = useState<string>(
    editing && routeData?.score != null ? String(Math.round(routeData.score * 100)) : ""
  );

  const [symbol, setSymbol] = useState<{ symbol?: string }>({});

  const [loading, setLoading] = useState<boolean>(false);

  // image hook
  const {
    imageLocalUri,
    imageRemoteUrl,
    setRemoteUrl,
    pickAndUpload,
    uploading,
  } = useMediaUploadV3();

  // hydrate defaults (remote image if editing)
  useEffect(() => {
    if (editing && routeData?.imageUrl) {
      setRemoteUrl(routeData.imageUrl);
    }
  }, [editing, routeData?.imageUrl, setRemoteUrl]);

  // load unit symbol for habitLink
  const loadUnit = useCallback(async () => {
    try {
      setLoading(true);
      const unit = await apiGetUnitByHabitLinkId(habitLinkId);
      if (unit) setSymbol(unit);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [habitLinkId]);

  useEffect(() => {
    loadUnit();
  }, [loadUnit]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const validate = useCallback(() => {

    // if (!imageRemoteUrl) {
    //   Toast.show("Please upload images here");
    //   return false;
    // }
    if (!name?.trim()) {
      Toast.show("Please enter item name");
      return false;
    }

    if (!description?.trim()) {
      Toast.show("Please enter item description");
      return false;
    }

    // 👇 NEW: Score Validation
    // const scoreVal = parseInt(score, 10);
    // if (!score?.trim() || isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
    //   Toast.show("Please enter a valid score (0-100)");
    //   return false;
    // }

    return true;
  }, [imageRemoteUrl, name, description, score]);

  const buildPayload = useCallback((): HabitLinkItemComponent => {
    const id = editing ? routeData?.documentId : v4.v4().toString();
    const linkId = editing ? routeData?.habitLinkId : habitLinkId;

    // Convert percentage score (string 0-100) to decimal (0.0-1.0)
    const scoreVal = score ? parseInt(score, 10) : 0;
    const decimalScore = isNaN(scoreVal) ? 0.0 : scoreVal / 100;
    const scoreCode =  getScoreCode(decimalScore).scoreCode;

    return {
      id,
      userId: userId?.trim() ?? "",
      habitLinkId: linkId,
      name,
      companyName: company,
      itemUrl: itemUrl,
      location,
      price: price ? parseFloat(price) : 0,
      quantity,
      description,
      imageUrl: imageRemoteUrl!,
      score: decimalScore, // 👇 NEW: Include decimal score in payload
      scoreCode: scoreCode, // 👇 NEW: Include score code in payload
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }, [
    editing,
    routeData?.documentId,
    routeData?.habitLinkId,
    habitLinkId,
    userId,
    name,
    company,
    itemUrl,
    location,
    price,
    quantity,
    description,
    imageRemoteUrl,
    score, // 👇 NEW: Dependency for score
  ]);

  const save = useCallback(async () => {
    if (!validate()) return;
    const data = buildPayload();

    try {
      setLoading(true);
      if (editing) {
        await apiUpdateHabitLinkItem(data);
      } else {
        await apiSaveHabitLinkItem(data);
      }
      goBack();
    } catch (e) {
      Toast.show("Failed to save item");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [validate, buildPayload, editing, goBack]);

  const pickImageAndUpload = useCallback(async () => {
    await pickAndUpload();
  }, [pickAndUpload]);

  return {
    // route info
    habitLinkId,
    habitLinkName,
    editing,

    // state
    name,
    company,
    itemUrl,
    location,
    price,
    quantity,
    description,
    score, // 👇 NEW: Expose score state
    symbol,
    imageLocalUri,
    imageRemoteUrl,
    loading: loading || uploading,

    // setters
    setName,
    setCompany,
    setItemUrl,
    setLocation,
    setPrice,
    setQuantity,
    setDescription,
    setScore, // 👇 NEW: Expose score setter
    // actions
    pickImageAndUpload,
    save,
    goBack,
  };
}