import {GetGeneratedHabitStacks} from "@/core/api/section-d/swap";
import {HabitStackComponent} from "@/core/models/section-b";
import {processGenHabitStack} from "@/core/services/section-d";
import {useCallback, useEffect, useState} from "react";
import {useSelector} from "react-redux";

import TEST_DATA from "@/app/src/screens/section-d/section-d-2/HabitStacksAIScreen/TEST-DATA/index.json";

interface Args {
  navigation: any;
  route: any;
}

type RootState = any; // replace with your real RootState

const normalizeStacks = (
  list: HabitStackComponent[],
): HabitStackComponent[] => {
  let counter = 1;
  return list.map((stack) => {
    const hasDocId = !!stack.documentId;
    const hasId = !!stack.id;
    if (!hasDocId && hasId) return { ...stack, documentId: stack.id };
    if (hasDocId && !hasId) return { ...stack, id: stack.documentId as string };
    if (!hasDocId && !hasId) {
      const gen = `gen${String(counter).padStart(3, "0")}`;
      counter++;
      return { ...stack, documentId: gen, id: gen };
    }
    return stack;
  });
};

export default function useHabitStacksAIForm({ navigation, route }: Args) {
  const userId: string | undefined = useSelector(
    (s: RootState) => s?.user?.userdata?.collectdata?.userId,
  );
  const [generatedStacks, setGeneratedStacks] = useState<HabitStackComponent[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");
  const [addedStack, setAddedStack] = useState<HabitStackComponent | null>(
    null,
  );
  const [processingStackId, setProcessingStackId] = useState<string | null>(
    null,
  );

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const processGen = useCallback(
    async (stack: HabitStackComponent): Promise<boolean> => {
      const id = stack.documentId ?? stack.id ?? "";
      setProcessingStackId(id);
      try {
        const success = await processGenHabitStack(userId ?? "", {
          genCandidate: stack,
        });
        if (success) setAddedStack(stack);
        return success;
      } catch (err) {
        console.log("[HabitStacksAI] processGen error:", err);
        return false;
      } finally {
        setProcessingStackId(null);
      }
    },
    [userId],
  );

  const addStack = useCallback(async (stack: HabitStackComponent) => {
    console.log("[HabitStacksAI] adding stack:", stack);
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setAddedStack(stack);
    } catch (err) {
      console.log("addStack error:", err);
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    const steerDescription: string = route?.params?.routeData?.steerDescription ?? '';
    const modelId: string = route?.params?.routeData?.modelId ?? 'claude-sonnet-4-6';

    const fetchGenerated = async () => {
      setLoading(true);
      try {
        const aiOn =
          process.env.EXPO_PUBLIC_FEATURE_FLAG_AI_GENERATOR_HABITSTACK_ON ===
          "TRUE";

        if (aiOn) {
          const { data } = await GetGeneratedHabitStacks(steerDescription, modelId);
          if (data) {
            setGeneratedStacks(normalizeStacks(data.generatedList ?? []));
            setSummary(data.summary ?? "");
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const data = TEST_DATA as any;
          setGeneratedStacks(
            normalizeStacks(
              (data.generatedList ?? []) as unknown as HabitStackComponent[],
            ),
          );
          setSummary(data.summary ?? "");
        }
      } catch (err) {
        console.log("useHabitStacksAIForm fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenerated();
  }, [route]);

  return {
    generatedStacks,
    loading,
    saving,
    summary,
    addedStack,
    addStack,
    processGen,
    processingStackId,
    goBack,
  };
}
