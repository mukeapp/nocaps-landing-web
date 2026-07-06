import {GetGeneratedHabitLinks} from "@/core/api/section-d/swap";
import {HabitLinkComponent} from "@/core/models/section-b";
import {processGenHabitLink} from "@/core/services/section-d";
import {fetchCostSymbolByHabitId} from "@/core/services/section-b/section-b-0/units";
import {useCallback, useEffect, useState} from "react";

import TEST_DATA from "@/app/src/screens/section-d/section-d-2/HabitLinksAIScreen/TEST-DATA/index.json";

interface Args {
  navigation: any;
  route: any;
}

const normalizeLinks = (list: HabitLinkComponent[]): HabitLinkComponent[] => {
  let counter = 1;
  return list.map((link) => {
    const hasDocId = !!link.documentId;
    const hasId = !!link.id;
    if (!hasDocId && hasId) return { ...link, documentId: link.id };
    if (hasDocId && !hasId) return { ...link, id: link.documentId as string };
    if (!hasDocId && !hasId) {
      const gen = `gen${String(counter).padStart(3, "0")}`;
      counter++;
      return { ...link, documentId: gen, id: gen };
    }
    return link;
  });
};

export default function useHabitLinksAIForm({ navigation, route }: Args) {
  const [generatedLinks, setGeneratedLinks] = useState<HabitLinkComponent[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");
  const [addedLink, setAddedLink] = useState<HabitLinkComponent | null>(null);
  const [processingLinkId, setProcessingLinkId] = useState<string | null>(null);
  const [costSymbol, setCostSymbol] = useState<string>("");

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const processGen = useCallback(
    async (
      habitDocumentId: string,
      link: HabitLinkComponent,
    ): Promise<boolean> => {
      const linkId = link.id ?? link.documentId ?? null;
      setProcessingLinkId(linkId);
      try {
        const success = await processGenHabitLink(habitDocumentId, {
          genCandidate: link,
        });
        if (success) {
          setAddedLink(link);
        }
        return success;
      } catch (err) {
        console.log("processGen error:", err);
        return false;
      } finally {
        setProcessingLinkId(null);
      }
    },
    [],
  );

  const addLink = useCallback(async (link: HabitLinkComponent) => {
    console.log("[HabitLinksAI] adding link:", link);
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setAddedLink(link);
    } catch (err) {
      console.log("addLink error:", err);
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    const habitId = route?.params?.habitId;
    if (!habitId) return;
    fetchCostSymbolByHabitId(habitId).then(symbol => setCostSymbol(symbol));
  }, [route?.params?.habitId]);

  useEffect(() => {
    const habitId = route?.params?.habitId;
    if (!habitId) return;

    const sd: string = route?.params?.steerDescription ?? '';
    const modelId: string = route?.params?.modelId ?? 'claude-sonnet-4-6';

    const fetchGenerated = async () => {
      setLoading(true);
      try {
        const aiOn =
          process.env.EXPO_PUBLIC_FEATURE_FLAG_AI_GENERATOR_HABITLINK_ON ===
          "TRUE";

        if (aiOn) {
          const { data } = await GetGeneratedHabitLinks(habitId, sd, modelId);
          if (data) {
            setGeneratedLinks(normalizeLinks(data.generatedList ?? []));
            setSummary(data.summary ?? "");
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const data = TEST_DATA as any;
          setGeneratedLinks(
            normalizeLinks(
              (data.generatedList ?? []) as unknown as HabitLinkComponent[],
            ),
          );
          setSummary(data.summary ?? "");
        }
      } catch (err) {
        console.log("useHabitLinksAIForm fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenerated();
  }, [route]);

  return {
    generatedLinks,
    loading,
    saving,
    summary,
    addedLink,
    addLink,
    processGen,
    processingLinkId,
    goBack,
    costSymbol,
  };
}
