"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectDefaultSelection, makeSelectModelById } from "@/redux/ai-models-cost-multiplier";
import { selectRevenueCat, RevenueCatAction } from "@/redux/user-revenue-cat";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { DecreaseRemainingCreditsByUserId } from "@/lib/api/section-b/revenue-cat";
import { getHabitStackComponentsByUserId } from "@/lib/api/section-b/habit-stack";
import {
  GetGeneratedHabits,
  GetGeneratedHabitLinks,
  GetGeneratedHabitLinkItems,
  PostGenHabit,
  PostGenHabitLink,
  PostGenHabitLinkItem,
} from "@/lib/api/section-d/ai";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { AIModelSelector } from "@/components/dashboard/ai-model-selector";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GenType = "habit" | "habit-link" | "habit-link-item";

const ensureMinTotalCost = (cost: number) => (cost === 0 ? 1 : cost);

const inputClass =
  "w-full rounded-lg border border-[#3A3A3A] bg-[rgba(41,41,41,1)] px-3 py-2.5 text-[14px] text-white placeholder:text-white/40 outline-none focus:border-[rgba(45,156,219,1)]";

const TYPE_META: Record<GenType, { title: string; parentLabel: string }> = {
  habit: { title: "AI Habit Generator", parentLabel: "Habit Stack" },
  "habit-link": { title: "AI Habit Link Generator", parentLabel: "Habit" },
  "habit-link-item": { title: "AI Habit Link Item Generator", parentLabel: "Habit Link" },
};

/**
 * Unified port of mobile's HabitsAIScreen / HabitLinksAIScreen /
 * HabitLinkItemsAIScreen: pick the parent entity, steer + model, charge
 * credits, generate candidates, apply via the matching PostGen endpoint.
 */
function GenerateContent() {
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as GenType) || "habit";
  const meta = TYPE_META[type] ?? TYPE_META.habit;

  const dispatch = useAppDispatch();
  const userId = useCurrentUserId();
  const revenueCat = useAppSelector(selectRevenueCat);
  const defaults = useAppSelector(selectDefaultSelection);
  const costs = useAppSelector((s) => s.habitIntelligenceCost);

  const baseCost =
    type === "habit"
      ? costs.generateHabitCost
      : type === "habit-link"
        ? costs.generateHabitLinkCost
        : costs.generateHabitLinkItemCost;

  const [stacks, setStacks] = useState<HabitStackComponent[]>([]);
  const [parentId, setParentId] = useState("");
  const [companyName, setCompanyName] = useState(defaults.companyName);
  const [modelId, setModelId] = useState(defaults.modelId);
  const [steerDescription, setSteerDescription] = useState("");
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

  // Parent options depend on type: stacks, habits, or links.
  const parentOptions = useMemo(() => {
    if (type === "habit") {
      return stacks.map((s) => ({ id: s.documentId ?? s.id, label: s.name }));
    }
    if (type === "habit-link") {
      return stacks.flatMap((s) =>
        (s.habitData ?? []).map((h) => ({
          id: h.documentId ?? h.id ?? "",
          label: `${s.name} → ${h.name}`,
        })),
      );
    }
    return stacks.flatMap((s) =>
      (s.habitData ?? []).flatMap((h) =>
        (h.habitLinkData ?? []).map((l) => ({
          id: l.documentId ?? l.id ?? "",
          label: `${h.name} → ${l.name}`,
        })),
      ),
    );
  }, [stacks, type]);

  const selectedModel = useAppSelector(makeSelectModelById(modelId));
  const totalCost = ensureMinTotalCost(baseCost * (selectedModel?.noCapCostMultiplier ?? 1));
  const canAfford = revenueCat.remainingCredits >= totalCost;

  async function handleGenerate() {
    if (!userId) return;
    if (!parentId) return void toast.error(`Pick a ${meta.parentLabel.toLowerCase()} first.`);
    if (!steerDescription.trim()) return void toast.error("Describe what you want to generate.");
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
          ? await GetGeneratedHabits(parentId, steerDescription.trim(), modelId)
          : type === "habit-link"
            ? await GetGeneratedHabitLinks(parentId, steerDescription.trim(), modelId)
            : await GetGeneratedHabitLinkItems(parentId, steerDescription.trim(), modelId);

      if (res.status >= 200 && res.status < 300 && res.data) {
        setSummary(res.data.summary ?? "");
        setCandidates(res.data.generatedList ?? []);
        if ((res.data.generatedList ?? []).length === 0) toast.info("The AI returned no candidates.");
      } else {
        toast.error("AI generation failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function applyCandidate(candidate: any) {
    const key = candidate.id ?? candidate.name;
    setApplyingId(key);
    try {
      const res =
        type === "habit"
          ? await PostGenHabit(parentId, candidate)
          : type === "habit-link"
            ? await PostGenHabitLink(parentId, candidate)
            : await PostGenHabitLinkItem(parentId, candidate);

      if (res.status >= 200 && res.status < 300) {
        toast.success(`"${candidate.name}" added.`);
        setCandidates((prev) => prev.filter((c) => (c.id ?? c.name) !== key));
      } else {
        toast.error("Failed to apply this candidate.");
      }
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-xl pb-8">
      <h1 className="text-[20px] font-bold text-white">{meta.title}</h1>
      <p className="mb-5 text-[13px] text-white/50">
        Pick a {meta.parentLabel.toLowerCase()}, describe what you want, and apply the candidates you like.
      </p>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] text-white/50">{meta.parentLabel}</label>
          <Select value={parentId} onValueChange={setParentId}>
            <SelectTrigger>
              <SelectValue placeholder={`Select a ${meta.parentLabel.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {parentOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] text-white/50">What do you want to generate?</label>
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            value={steerDescription}
            onChange={(e) => setSteerDescription(e.target.value)}
          />
        </div>

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

        <Button className="w-full" disabled={loading || !canAfford} onClick={handleGenerate}>
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Generating… this can take a minute" : "Generate"}
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
                <p className="text-[15px] font-semibold text-white">{candidate.name}</p>
                {candidate.description ? (
                  <p className="mt-1 text-[13px] text-white/60">{candidate.description}</p>
                ) : null}
                <Button
                  size="sm"
                  className="mt-3"
                  disabled={applyingId === key}
                  onClick={() => applyCandidate(candidate)}
                >
                  {applyingId === key ? "Adding…" : "Apply"}
                </Button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function AIGeneratePage() {
  return (
    <Suspense fallback={null}>
      <GenerateContent />
    </Suspense>
  );
}
