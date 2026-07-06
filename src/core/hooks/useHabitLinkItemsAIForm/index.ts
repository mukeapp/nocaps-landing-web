import {GetGeneratedHabitLinkItems} from "@/core/api/section-d/swap";
import {
  HabitComponent,
  HabitLinkComponent,
  HabitLinkItemComponent,
} from "@/core/models/section-b";
import {processGenHabitLinkItem} from "@/core/services/section-d";
import {useCallback, useEffect, useState} from "react";

import TEST_DATA from "@/app/src/screens/section-d/section-d-2/HabitLinkItemsAIScreen/TEST-DATA/index.json";

interface Args {
  navigation: any;
  route: any;
}

const normalizeItems = (
  list: HabitLinkItemComponent[],
): HabitLinkItemComponent[] => {
  let counter = 1;
  return list.map((item) => {
    const hasDocId = !!item.documentId;
    const hasId = !!item.id;
    if (!hasDocId && hasId) return { ...item, documentId: item.id };
    if (hasDocId && !hasId) return { ...item, id: item.documentId as string };
    if (!hasDocId && !hasId) {
      const gen = `gen${String(counter).padStart(3, "0")}`;
      counter++;
      return { ...item, documentId: gen, id: gen };
    }
    return item;
  });
};

export default function useHabitLinkItemsAIForm({ navigation, route }: Args) {
  const [habit, setHabit] = useState<HabitComponent | null>(null);
  const [habitLink, setHabitLink] = useState<HabitLinkComponent | null>(null);
  const [habitLinkItem, setHabitLinkItem] =
    useState<HabitLinkItemComponent | null>(null);

  const [currentItem, setCurrentItem] = useState<HabitLinkItemComponent | null>(
    null,
  );
  const [generatedItems, setGeneratedItems] = useState<
    HabitLinkItemComponent[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");
  const [addedItem, setAddedItem] = useState<HabitLinkItemComponent | null>(
    null,
  );
  const [steerDescription, setSteerDescription] = useState<string>('');
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  const [costSymbol, setCostSymbol] = useState<string>("");

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const processGen = useCallback(
    async (
      habitLinkDocumentId: string,
      item: HabitLinkItemComponent,
    ): Promise<boolean> => {
      const itemId = item.id ?? item.documentId ?? null;
      setProcessingItemId(itemId);
      try {
        const success = await processGenHabitLinkItem(habitLinkDocumentId, {
          genCandidate: item,
        });
        if (success) {
          setAddedItem(item);
        }
        return success;
      } catch (err) {
        console.log("processGen error:", err);
        return false;
      } finally {
        setProcessingItemId(null);
      }
    },
    [],
  );

  const addItem = useCallback(async (item: HabitLinkItemComponent) => {
    console.log("[HabitLinkItemsAI] adding item:", item);
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setAddedItem(item);
    } catch (err) {
      console.log("addItem error:", err);
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    const routeData = route?.params?.routeData;
    if (!routeData) return;

    const { habit: h, habitLink: hl, habitLinkItem: hli, steerDescription: sd, modelId: mid } = routeData;

    setHabit(h ?? null);
    setHabitLink(hl ?? null);
    setHabitLinkItem(hli ?? null);
    setCurrentItem(hli ?? null);
    setSteerDescription(sd ?? '');
    setCostSymbol(routeData.costSymbol ?? "");

    // API takes the habitLink documentId
    const lookupId = hl?.documentId ?? hl?.id;
    if (!lookupId) return;

    const fetchGenerated = async () => {
      setLoading(true);
      try {
        const aiOn =
          process.env.EXPO_PUBLIC_FEATURE_FLAG_AI_GENERATOR_HABITLINKITEM_ON ===
          "TRUE";

        if (aiOn) {
          const { data } = await GetGeneratedHabitLinkItems(lookupId, sd ?? '', mid ?? 'claude-sonnet-4-6');
          if (data) {
            setGeneratedItems(normalizeItems(data.generatedList ?? []));
            setSummary(data.summary ?? "");
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const data = TEST_DATA as any;
          setGeneratedItems(
            normalizeItems(
              (data.generatedList ?? []) as unknown as HabitLinkItemComponent[],
            ),
          );
          setSummary(data.summary ?? "");
        }
      } catch (err) {
        console.log("useHabitLinkItemsAIForm fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenerated();
  }, [route]);

  return {
    habit,
    habitLink,
    habitLinkItem,
    currentItem,
    generatedItems,
    loading,
    saving,
    summary,
    addedItem,
    addItem,
    processGen,
    processingItemId,
    goBack,
    steerDescription,
    costSymbol,
  };
}
