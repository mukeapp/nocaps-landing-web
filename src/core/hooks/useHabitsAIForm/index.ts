import {GetGeneratedHabits} from "@/core/api/section-d/swap";
import {HabitComponent} from "@/core/models/section-b";
import {processGenHabit} from "@/core/services/section-d";
import {useCallback, useEffect, useState} from "react";

import TEST_DATA from "@/app/src/screens/section-d/section-d-2/HabitsAIScreen/TEST-DATA/index.json";

interface Args {
  navigation: any;
  route: any;
}

const normalizeHabits = (list: HabitComponent[]): HabitComponent[] => {
  let counter = 1;
  return list.map((habit) => {
    const hasDocId = !!habit.documentId;
    const hasId = !!habit.id;
    if (!hasDocId && hasId) return { ...habit, documentId: habit.id };
    if (hasDocId && !hasId) return { ...habit, id: habit.documentId as string };
    if (!hasDocId && !hasId) {
      const gen = `gen${String(counter).padStart(3, "0")}`;
      counter++;
      return { ...habit, documentId: gen, id: gen };
    }
    return habit;
  });
};

export default function useHabitsAIForm({ navigation, route }: Args) {
  const [generatedHabits, setGeneratedHabits] = useState<HabitComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");
  const [addedHabit, setAddedHabit] = useState<HabitComponent | null>(null);
  const [processingHabitId, setProcessingHabitId] = useState<string | null>(
    null,
  );

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const processGen = useCallback(
    async (habitStackId: string, habit: HabitComponent): Promise<boolean> => {
      const habitId = habit.id ?? habit.documentId ?? null;
      setProcessingHabitId(habitId);
      try {
        const success = await processGenHabit(habitStackId, {
          genCandidate: habit,
        });
        if (success) {
          setAddedHabit(habit);
        }
        return success;
      } catch (err) {
        console.log("processGen error:", err);
        return false;
      } finally {
        setProcessingHabitId(null);
      }
    },
    [],
  );

  const addHabit = useCallback(async (habit: HabitComponent) => {
    console.log("[HabitsAI] adding habit:", habit);
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setAddedHabit(habit);
    } catch (err) {
      console.log("addHabit error:", err);
    } finally {
      setSaving(false);
    }
  }, []);

  const costSymbol: string = route?.params?.routeData?.costSymbol ?? "";

  useEffect(() => {
    const habitStackId = route?.params?.routeData?.habitStackId;
    const steerDescription: string = route?.params?.routeData?.steerDescription ?? '';
    const modelId: string = route?.params?.routeData?.modelId ?? 'claude-sonnet-4-6';
    if (!habitStackId) return;

    const fetchGenerated = async () => {
      setLoading(true);
      try {
        const aiOn =
          process.env.EXPO_PUBLIC_FEATURE_FLAG_AI_GENERATOR_HABIT_ON === "TRUE";

        if (aiOn) {
          const { data } = await GetGeneratedHabits(habitStackId, steerDescription, modelId);
          if (data) {
            setGeneratedHabits(normalizeHabits(data.generatedList ?? []));
            setSummary(data.summary ?? "");
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const data = TEST_DATA as any;
          setGeneratedHabits(
            normalizeHabits(
              (data.generatedList ?? []) as unknown as HabitComponent[],
            ),
          );
          setSummary(data.summary ?? "");
        }
      } catch (err) {
        console.log("useHabitsAIForm fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenerated();
  }, [route]);

  return {
    generatedHabits,
    loading,
    saving,
    summary,
    addedHabit,
    addHabit,
    processGen,
    processingHabitId,
    goBack,
    costSymbol,
  };
}
