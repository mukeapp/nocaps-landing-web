"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeftRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectDefaultSelection, makeSelectModelById } from "@/redux/ai-models-cost-multiplier";
import { selectRevenueCat, RevenueCatAction } from "@/redux/user-revenue-cat";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { DecreaseRemainingCreditsByUserId } from "@/lib/api/section-b/revenue-cat";
import { getHabitStackComponentsByUserId } from "@/lib/api/section-b/habit-stack";
import {
  GetSwapHabitCandidates,
  GetSwapHabitLinkCandidates,
  GetSwapHabitLinkItemCandidates,
  PostSwapHabit,
  PostSwapHabitLink,
  PostSwapHabitLinkItem,
} from "@/lib/api/section-d/ai";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { AIModelSelector } from "@/components/dashboard/ai-model-selector";
import { ScoreBadge } from "@/components/dashboard/score-badge";
import { Button } from "@/components/ui/button";

export type SwapType = "habit" | "habit-link" | "habit-link-item";

const ensureMinTotalCost = (cost: number) => (cost === 0 ? 1 : cost);

const TITLES: Record<SwapType, string> = {
  habit: "AI Habit Swap",
  "habit-link": "AI Habit Link Swap",
  "habit-link-item": "AI Habit Link Item Swap",
};

/**
 * Shared port of mobile's SwapHabitScreen / SwapHabitLinkScreen /
 * SwapHabitLinkItemScreen (section-d-1): shows the current entity, charges
 * swap credits, fetches AI swap candidates with a summary, and applies the
 * chosen candidate via the matching /…-swap/swap endpoint.
 */
function SwapContent({ type }: { type: SwapType }) {
  const searchParams = useSearchParams();
  const currentId = searchParams.get("id");

  const dispatch = useAppDispatch();
  const userId = useCurrentUserId();
  const revenueCat = useAppSelector(selectRevenueCat);
  const defaults = useAppSelector(selectDefaultSelection);
  const costs = useAppSelector((s) => s.habitIntelligenceCost);

  const [stacks, setStacks] = useState<HabitStackComponent[]>([]);
  const [companyName, setCompanyName] = useState(defaults.companyName);
  const [modelId, setModelId] = useState(defaults.modelId);
  const [loading, setLoading] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;
    getHabitStackComponentsByUserId({ id: userId }).then((res) =>
      setStacks(Array.isArray(res.data) ? res.data : []),
    );
  }, [userId]);

  // Resolve the current entity from the user's stack tree by documentId/id.
  const currentItem = useMemo(() => {
    if (!currentId) return null;
    for (const stack of stacks) {
      for (const habit of stack.habitData ?? []) {
        if (type === "habit" && (habit.documentId === currentId || habit.id === currentId)) return habit;
        for (const link of habit.habitLinkData ?? []) {
          if (type === "habit-link" && (link.documentId === currentId || link.id === currentId)) return link;
          for (const item of link.habitLinkItemComponentsData ?? []) {
            if (type === "habit-link-item" && (item.documentId === currentId || item.id === currentId))
              return item;
          }
        }
      }
    }
    return null;
  }, [stacks, currentId, type]);

  const selectedModel = useAppSelector(makeSelectModelById(modelId));
  const totalCost = ensureMinTotalCost(costs.swapCostPerItem * (selectedModel?.noCapCostMultiplier ?? 1));
  const canAfford = revenueCat.remainingCredits >= totalCost;

  async function handleFetchCandidates() {
    if (!userId || !currentId) return;
    if (!canAfford) return void toast.error("Not enough AI credits. Add credits from your Account page.");

    setLoading(true);
    try {
      const charge = await DecreaseRemainingCreditsByUserId({ userId, amount: totalCost });
      if (charge.status < 200 || charge.status >= 300) {
        toast.error("Could not charge AI credits. Please try again.");
        return;
      }
      dispatch(RevenueCatAction.subtractCredits(totalCost));

      const res =
        type === "habit"
          ? await GetSwapHabitCandidates(currentId, modelId)
          : type === "habit-link"
            ? await GetSwapHabitLinkCandidates(currentId, modelId)
            : await GetSwapHabitLinkItemCandidates(currentId, modelId);

      if (res.status >= 200 && res.status < 300 && res.data) {
        setSummary(res.data.summary ?? "");
        const list =
          res.data.habitSwapCandidateList ??
          res.data.habitLinkSwapCandidateList ??
          res.data.habitLinkItemSwapCandidateList ??
          [];
        setCandidates(list);
        if (list.length === 0) toast.info("The AI returned no swap candidates.");
      } else {
        toast.error("AI swap failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function applySwap(candidate: any) {
    if (!currentItem) return;
    const key = candidate.id ?? candidate.name;
    setApplyingId(key);
    try {
      const payload = { currentItem: currentItem as any, swapCandidate: candidate };
      const res =
        type === "habit"
          ? await PostSwapHabit(payload)
          : type === "habit-link"
            ? await PostSwapHabitLink(payload)
            : await PostSwapHabitLinkItem(payload);

      if (res.status >= 200 && res.status < 300) {
        toast.success(`Swapped to "${candidate.name}".`);
        setCandidates([]);
      } else {
        toast.error("Failed to apply the swap.");
      }
    } finally {
      setApplyingId(null);
    }
  }

  if (!currentId) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-center">
        <p className="text-base font-semibold text-white">{TITLES[type]}</p>
        <p className="max-w-xs text-sm text-white/50">
          Open one of your habits, links or items and choose its swap action to start.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl pb-8">
      <h1 className="text-[20px] font-bold text-white">{TITLES[type]}</h1>
      <p className="mb-5 text-[13px] text-white/50">
        AI finds better-scoring alternatives and swaps them in.
      </p>

      {currentItem ? (
        <div className="mb-4 rounded-xl bg-[rgba(25,25,25,1)] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-white/40">Current</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="text-[15px] font-semibold text-white">{(currentItem as any).name}</p>
            <ScoreBadge scoreInfo={(currentItem as any).scoreComponent?.scoreInfo} />
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        <AIModelSelector
          companyName={companyName}
          modelId={modelId}
          onCompanyChange={(name, defModel) => {
            setCompanyName(name);
            setModelId(defModel);
          }}
          onModelChange={setModelId}
        />

        <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3">
          <span className="text-[13px] text-white/60">
            Cost: <span className="font-bold text-[#fbbf24]">{totalCost.toFixed(0)} credits</span>
          </span>
          <span className={`text-[13px] ${canAfford ? "text-white/60" : "text-[#f87171]"}`}>
            You have {revenueCat.remainingCredits.toLocaleString()} credits
          </span>
        </div>

        <Button className="w-full" disabled={loading || !canAfford} onClick={handleFetchCandidates}>
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          {loading ? "Finding candidates… this can take a minute" : "Find Swap Candidates"}
        </Button>
      </div>

      {summary ? (
        <div className="mt-6 rounded-xl bg-[rgba(45,156,219,0.1)] p-4 text-[13px] leading-5 text-white/80">
          {summary}
        </div>
      ) : null}

      {candidates.length > 0 ? (
        <div className="mt-4 space-y-3">
          {candidates.map((candidate) => {
            const key = candidate.id ?? candidate.name;
            return (
              <div key={key} className="rounded-xl bg-[rgba(25,25,25,1)] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[15px] font-semibold text-white">{candidate.name}</p>
                  <ScoreBadge scoreInfo={candidate.scoreComponent?.scoreInfo} />
                </div>
                {candidate.description ? (
                  <p className="mt-1 text-[13px] text-white/60">{candidate.description}</p>
                ) : null}
                <Button
                  size="sm"
                  className="mt-3"
                  disabled={applyingId === key || !currentItem}
                  onClick={() => applySwap(candidate)}
                >
                  {applyingId === key ? "Swapping…" : "Swap"}
                </Button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function SwapScreen({ type }: { type: SwapType }) {
  return (
    <Suspense fallback={null}>
      <SwapContent type={type} />
    </Suspense>
  );
}
