import {GetSwapHabitLinkCandidates} from "@/core/api/section-d/swap";
import {
  HabitLinkComponent,
  HabitLinkItemComponent,
} from "@/core/models/section-b";
import {swapHabitLink} from "@/core/services/section-d";
import {useCallback, useEffect, useState} from "react";

import TEST_DATA from "@/app/src/screens/section-d/section-d-1/SwapHabitLinkScreen/TEST-DATA/index.json";

interface Args {
  navigation: any;
  route: any;
}

function normalizeLinks(list: HabitLinkComponent[]): HabitLinkComponent[] {
  let counter = 1;
  return list.map((link) => {
    const hasDocId = !!link.documentId;
    const hasId = !!link.id;
    if (!hasDocId && hasId) return { ...link, documentId: link.id };
    if (hasDocId && !hasId) return { ...link, id: link.documentId as string };
    if (!hasDocId && !hasId) {
      const gen = `swap${String(counter).padStart(3, "0")}`;
      counter++;
      return { ...link, documentId: gen, id: gen };
    }
    return link;
  });
}

export default function useSwapHabitLinkForm({ navigation, route }: Args) {
  const [habitLink, setHabitLink] = useState<HabitLinkComponent | null>(null);
  const [currentItem, setCurrentItem] = useState<HabitLinkComponent | null>(
    null,
  );
  const [swapItems, setSwapItems] = useState<HabitLinkComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");
  const [swapDone, setSwapDone] = useState<boolean>(false);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    const routeData = route?.params?.routeData;
    if (!routeData) return;

    const { habitLink: hl, modelId } = routeData;

    setHabitLink(hl ?? null);
    setCurrentItem(hl ?? null);

    const lookupId = hl?.documentId ?? hl?.id;
    if (!lookupId) return;

    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const aiOn =
          process.env.EXPO_PUBLIC_FEATURE_FLAG_AI_SWAP_HABITLINK_ON === "TRUE";

        if (aiOn) {
          // LIVE API CALL
          const { data } = await GetSwapHabitLinkCandidates(lookupId, modelId ?? 'claude-sonnet-4-6');
          if (data) {
            const normalized = normalizeLinks(
              data.habitLinkSwapCandidateList ?? [],
            );
            setSwapItems(normalized);
            setSummary(data.summary ?? "");
          }
        } else {
          // TEST WITH STATIC DATA
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const data = TEST_DATA as any;
          const normalized = normalizeLinks(
            (data.habitLinkSwapCandidateList ??
              []) as unknown as HabitLinkComponent[],
          );
          setSwapItems(normalized);
          setSummary(data.summary ?? "");
        }
      } catch (err) {
        console.log("useSwapHabitLinkForm fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [route]);

  const getHabitLinkItemComponentsFromHabitLinkComponentAISwapCandidate =
    useCallback(
      (swapCandidate: HabitLinkComponent): HabitLinkItemComponent[] => {
        const items: HabitLinkItemComponent[] = [];

        swapCandidate.comparisonHabitLink?.comparisonHabitLinkItems?.forEach(
          (item) => {
            if (!item.swapItem) return;

            const formattedItem: HabitLinkItemComponent = {
              ...item.swapItem,
              score: item.score,
              aiScored: true,
              scoreCode: item.scoreCode,
              price: item.swapItem.cost,
              quantity:  item.swapItem.quantity ?? 1,
            };
            items.push(formattedItem);
          },
        );

        return items;
      },
      [],
    );

  const processSwap = useCallback(
    async (
      ci: HabitLinkComponent,
      swapCandidate: HabitLinkComponent,
    ): Promise<boolean> => {
      const candidate: HabitLinkComponent = {
        ...swapCandidate,
        habitLinkItemComponentsData:
          getHabitLinkItemComponentsFromHabitLinkComponentAISwapCandidate(
            swapCandidate,
          ),
      };

      const success = await swapHabitLink({
        currentItem: ci,
        swapCandidate: candidate,
      });
      if (success) setSwapDone(true);
      return success;
    },
    [getHabitLinkItemComponentsFromHabitLinkComponentAISwapCandidate],
  );

  return {
    habitLink,
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
