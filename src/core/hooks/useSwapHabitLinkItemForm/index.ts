import {GetSwapHabitLinkItemCandidates} from "@/core/api/section-d/swap";
import {
  HabitComponent,
  HabitLinkComponent,
  HabitLinkItemComponent,
} from "@/core/models/section-b";
import {Unit} from "@/core/models/section-b/unit";
import {swapHabitLinkItem} from "@/core/services/section-d";
import {fetchUnitsByDocumentId} from "@/core/services/section-b/section-b-0/units";
import {useCallback, useEffect, useState} from "react";

import TEST_DATA from "@/app/src/screens/section-d/section-d-1/SwapHabitLinkItemScreen/TEST-DATA/index.json";
interface Args {
  navigation: any;
  route: any;
}

function normalizeItems(
  list: HabitLinkItemComponent[],
): HabitLinkItemComponent[] {
  let counter = 1;
  return list.map((item) => {
    const hasDocId = !!item.documentId;
    const hasId = !!item.id;
    if (!hasDocId && hasId) return { ...item, documentId: item.id };
    if (hasDocId && !hasId) return { ...item, id: item.documentId as string };
    if (!hasDocId && !hasId) {
      const gen = `swap${String(counter).padStart(3, "0")}`;
      counter++;
      return { ...item, documentId: gen, id: gen };
    }
    return item;
  });
}

export default function useSwapHabitLinkItemForm({ navigation, route }: Args) {
  const [habit, setHabit] = useState<HabitComponent | null>(null);
  const [habitLink, setHabitLink] = useState<HabitLinkComponent | null>(null);
  const [habitLinkItem, setHabitLinkItem] =
    useState<HabitLinkItemComponent | null>(null);

  const [currentItem, setCurrentItem] = useState<HabitLinkItemComponent | null>(
    null,
  );
  const [swapItems, setSwapItems] = useState<HabitLinkItemComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");
  const [swapDone, setSwapDone] = useState<boolean>(false);
  const [costUnit, setCostUnit] = useState<Unit | undefined>(undefined);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    const routeData = route?.params?.routeData;
    if (!routeData) return;

    const { habit: h, habitLink: hl, habitLinkItem: hli, modelId } = routeData;

    setHabit(h ?? null);
    setHabitLink(hl ?? null);
    setHabitLinkItem(hli ?? null);
    setCurrentItem(hli ?? null);

    const lookupId = hli?.documentId ?? hli?.id;
    if (!lookupId) return;

    const fetchSwapCandidates = async () => {
      setLoading(true);
      try {
        const aiOn =
          process.env.EXPO_PUBLIC_FEATURE_FLAG_AI_SWAP_HABITLINKITEM_ON ===
          "TRUE";

        if (aiOn) {
          // LIVE API CALL
          const { data } = await GetSwapHabitLinkItemCandidates(lookupId, modelId ?? 'claude-sonnet-4-6');
          if (data) {
            const normalized = normalizeItems(
              data.habitLinkItemSwapCandidateList ?? [],
            );
            setSwapItems(normalized);
            setSummary(data.summary ?? "");
          }
        } else {
          // TEST WITH STATIC DATA
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const data = TEST_DATA;
          const normalized = normalizeItems(
            (data.habitLinkItemSwapCandidateList ??
              []) as unknown as HabitLinkItemComponent[],
          );
          setSwapItems(normalized);
          setSummary(data.summary ?? "");
        }
      } catch (err) {
        console.log("useSwapHabitLinkItemForm fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSwapCandidates();
  }, [route]);

  useEffect(() => {
    const unitId = habit?.unit as string | undefined;
    if (!unitId) return;
    fetchUnitsByDocumentId(unitId).then((units) => {
      if (units?.[0]) setCostUnit(units[0]);
    });
  }, [habit]);

  const processSwap = useCallback(
    async (
      ci: HabitLinkItemComponent,
      swapCandidate: HabitLinkItemComponent,
    ): Promise<boolean> => {
      const success = await swapHabitLinkItem({
        currentItem: ci,
        swapCandidate,
      });
      if (success) setSwapDone(true);
      return success;
    },
    [],
  );

  return {
    habit,
    habitLink,
    habitLinkItem,
    currentItem,
    swapItems,
    loading,
    summary,
    swapDone,
    goBack,
    processSwap,
    costSymbol: costUnit?.symbol ?? "",
  };
}
