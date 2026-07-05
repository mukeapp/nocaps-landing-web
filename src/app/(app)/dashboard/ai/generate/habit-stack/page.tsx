"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectDefaultSelection, makeSelectModelById } from "@/redux/ai-models-cost-multiplier";
import { selectGenerateHabitStackCost } from "@/redux/habit-intelligence-cost";
import { selectRevenueCat, RevenueCatAction } from "@/redux/user-revenue-cat";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { DecreaseRemainingCreditsByUserId } from "@/lib/api/section-b/revenue-cat";
import { GetGeneratedHabitStacks, PostGenHabitStack } from "@/lib/api/section-d/ai";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { AIModelSelector } from "@/components/dashboard/ai-model-selector";
import { Button } from "@/components/ui/button";

const ensureMinTotalCost = (cost: number) => (cost === 0 ? 1 : cost);

const inputClass =
  "w-full rounded-lg border border-[#3A3A3A] bg-[rgba(41,41,41,1)] px-3 py-2.5 text-[14px] text-white placeholder:text-white/40 outline-none focus:border-[rgba(45,156,219,1)]";

/**
 * Mirrors mobile's HabitStackAIScreen flow (reached from MyHabitStacksScreen's
 * AI confirm sheet): steer description + model pick, charge credits
 * (decreaseRemainingCreditsByUserId + subtractCredits), call the AI
 * generator, then apply chosen candidates via PostGenHabitStack.
 */
export default function HabitStackAIPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userId = useCurrentUserId();

  const baseCost = useAppSelector(selectGenerateHabitStackCost);
  const revenueCat = useAppSelector(selectRevenueCat);
  const defaults = useAppSelector(selectDefaultSelection);

  const [companyName, setCompanyName] = useState(defaults.companyName);
  const [modelId, setModelId] = useState(defaults.modelId);
  const [steerDescription, setSteerDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [candidates, setCandidates] = useState<HabitStackComponent[]>([]);

  const selectedModel = useAppSelector(makeSelectModelById(modelId));
  const totalCost = ensureMinTotalCost(baseCost * (selectedModel?.noCapCostMultiplier ?? 1));
  const canAfford = revenueCat.remainingCredits >= totalCost;

  async function handleGenerate() {
    if (!userId) return;
    if (!steerDescription.trim()) return void toast.error("Describe what you want to build.");
    if (!canAfford) return void toast.error("Not enough AI credits. Add credits from your Account page.");

    setLoading(true);
    try {
      const charge = await DecreaseRemainingCreditsByUserId({ userId, amount: totalCost });
      if (charge.status < 200 || charge.status >= 300) {
        toast.error("Could not charge AI credits. Please try again.");
        return;
      }
      dispatch(RevenueCatAction.subtractCredits(totalCost));

      const res = await GetGeneratedHabitStacks(steerDescription.trim(), modelId);
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

  async function applyCandidate(candidate: HabitStackComponent) {
    if (!userId) return;
    const key = candidate.id ?? candidate.name;
    setApplyingId(key);
    try {
      const res = await PostGenHabitStack(userId, candidate);
      if (res.status >= 200 && res.status < 300) {
        toast.success(`"${candidate.name}" added to your habit stacks.`);
        setCandidates((prev) => prev.filter((c) => (c.id ?? c.name) !== key));
      } else {
        toast.error("Failed to add this habit stack.");
      }
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-xl pb-8">
      <h1 className="text-[20px] font-bold text-white">AI Habit Stack Generator</h1>
      <p className="mb-5 text-[13px] text-white/50">
        Describe a goal and AI will design habit stacks for it.
      </p>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] text-white/50">What do you want to build?</label>
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            placeholder="e.g. Help me build a healthier weekly grocery routine on a budget"
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
          {loading ? "Generating… this can take a minute" : "Generate Habit Stacks"}
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
                <p className="mt-2 text-[12px] text-white/40">
                  {(candidate.habitData ?? []).length} habits included
                </p>
                <Button
                  size="sm"
                  className="mt-3"
                  disabled={applyingId === key}
                  onClick={() => applyCandidate(candidate)}
                >
                  {applyingId === key ? "Adding…" : "Add to my stacks"}
                </Button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
