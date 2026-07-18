import { GetSwapHabitCandidates } from "@/core/api/section-d/swap";
import { HabitComponent } from "@/core/models/section-b";
import { swapHabit } from "@/core/services/section-d";
import { useCallback, useEffect, useState } from "react";

import TEST_DATA from "@/app/src/screens/section-d/section-d-1/SwapHabitScreen/TEST-DATA/index.json";

interface Args {
  navigation: any;
  route: any;
}

function normalizeHabits(list: HabitComponent[]): HabitComponent[] {
  let counter = 1;
  return list.map((habit) => {
    const hasDocId = !!habit.documentId;
    const hasId = !!habit.id;
    if (!hasDocId && hasId) return { ...habit, documentId: habit.id };
    if (hasDocId && !hasId) return { ...habit, id: habit.documentId as string };
    if (!hasDocId && !hasId) {
      const gen = `swap${String(counter).padStart(3, "0")}`;
      counter++;
      return { ...habit, documentId: gen, id: gen };
    }
    return habit;
  });
}

export default function useSwapHabitForm({ navigation, route }: Args) {
  const [habit, setHabit] = useState<HabitComponent | null>(null);
  const [currentItem, setCurrentItem] = useState<HabitComponent | null>(null);
  const [swapItems, setSwapItems] = useState<HabitComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");
  const [swapDone, setSwapDone] = useState<boolean>(false);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  useEffect(() => {
    const routeData = route?.params?.routeData;
    if (!routeData) return;

    const { habit: h, modelId } = routeData;
    setHabit(h ?? null);
    setCurrentItem(h ?? null);

    const lookupId = h?.documentId ?? h?.id;
    if (!lookupId) return;

    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const aiOn =
          process.env.EXPO_PUBLIC_FEATURE_FLAG_AI_SWAP_HABIT_ON === "TRUE";
        if (aiOn) {
          const { data } = await GetSwapHabitCandidates(lookupId, modelId ?? 'claude-sonnet-4-6');
          if (data) {
            setSwapItems(normalizeHabits(data.habitSwapCandidateList ?? []));
            setSummary(data.summary ?? "");
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const data = TEST_DATA as any;
          const normalized = normalizeHabits(
            (data.habitSwapCandidateList ?? []) as unknown as HabitComponent[],
          );
          setSwapItems(normalized);
          //setSwapItems(MOCK_DATA);
          setSummary(data.summary ?? "");
        }
      } catch (err) {
        console.log("useSwapHabitForm fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [route]);

  const processSwap = useCallback(
    async (
      ci: HabitComponent,
      swapCandidate: HabitComponent,
    ): Promise<boolean> => {
      const success = await swapHabit({ currentItem: ci, swapCandidate });
      if (success) setSwapDone(true);
      return success;
    },
    [],
  );

  return {
    habit,
    currentItem,
    swapItems,
    loading,
    summary,
    swapDone,
    processSwap,
    goBack,
    costSymbol: route?.params?.routeData?.costSymbol ?? "",
  };
}
