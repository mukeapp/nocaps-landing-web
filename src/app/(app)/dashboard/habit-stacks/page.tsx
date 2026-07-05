"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bot, CircleUserRound, Plus, Store, UsersRound, X, Zap } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectDefaultSelection, makeSelectModelById } from "@/redux/ai-models-cost-multiplier";
import { selectGenerateHabitStackCost } from "@/redux/habit-intelligence-cost";
import { selectRevenueCat, RevenueCatAction } from "@/redux/user-revenue-cat";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { DecreaseRemainingCreditsByUserId } from "@/lib/api/section-b/revenue-cat";
import { DeleteHabitStack, getHabitStackComponentsByUserId } from "@/lib/api/section-b/habit-stack";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { Button } from "@/components/ui/button";
import { HabitStackCard } from "@/components/dashboard/habit-stack-card";
import { AIModelSelector } from "@/components/dashboard/ai-model-selector";
import { DataState } from "@/components/dashboard/data-state";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const ensureMinTotalCost = (cost: number) => (cost === 0 ? 1 : cost);

// Score legend on mobile's MyHabitStacksScreen uses its own literal hex values,
// distinct from the tier-color map used by the card's ScoreDial — a real
// inconsistency in mobile itself, replicated as-is rather than "fixed".
const LEGEND = [
  { label: "BAD", color: "#e74c3c" },
  { label: "POOR", color: "#8e44ad" },
  { label: "AVERAGE", color: "#e67e22" },
  { label: "GOOD", color: "#27ae60" },
  { label: "EXCELLENT", color: "#f1c40f" },
  { label: "UNKNOWN", color: "#6B7280" },
];

// Mobile's RBSheet addOptions, exact titles/subtitles/order
// (MyHabitStacksScreen lines ~205-265).
const ADD_OPTIONS = [
  {
    id: 1,
    title: "Add Habit Stack From Market",
    subtitle: "Browse and add habit stacks from the marketplace",
    icon: Store,
    href: "/dashboard/market",
  },
  {
    id: 2,
    title: "Add Habit Stack From Friends",
    subtitle: "Browse and copy habit stacks from your friends",
    icon: UsersRound,
    href: "/dashboard/friends",
  },
  {
    id: 3,
    title: "Add Habit Stack From My Library",
    subtitle: "Browse and copy habit stacks from your library",
    icon: CircleUserRound,
    href: "/dashboard/habit-library",
  },
  {
    id: 4,
    title: "Add Habit Stack With AI",
    subtitle: "Let AI help you build a personalized habit stack",
    icon: Bot,
    href: null, // opens the AI confirm modal, like mobile
  },
];

export default function HabitStacksPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userId = useCurrentUserId();
  const [stacks, setStacks] = useState<HabitStackComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // AI confirm modal state — mirrors mobile's showAIConfirmModal flow.
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [steerDescription, setSteerDescription] = useState("");
  const defaults = useAppSelector(selectDefaultSelection);
  const [companyName, setCompanyName] = useState(defaults.companyName);
  const [modelId, setModelId] = useState(defaults.modelId);
  const baseCost = useAppSelector(selectGenerateHabitStackCost);
  const revenueCat = useAppSelector(selectRevenueCat);
  const selectedModel = useAppSelector(makeSelectModelById(modelId));
  const totalCost = ensureMinTotalCost(baseCost * (selectedModel?.noCapCostMultiplier ?? 1));
  const [charging, setCharging] = useState(false);

  const load = useCallback(() => {
    if (!userId) return;
    setLoading(true);
    getHabitStackComponentsByUserId({ id: userId })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          setStacks(Array.isArray(res.data) ? res.data : []);
          setError(null);
        } else {
          setError("Unable to load your habit stacks.");
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    const res = await DeleteHabitStack({ id });
    if (res.status >= 200 && res.status < 300) {
      toast.success("Habit stack deleted.");
      load();
    } else {
      toast.error("Unable to delete habit stack.");
    }
  }

  // Mirrors mobile's handleGoToHabitStackAI: charge credits first, then
  // navigate to the AI screen which runs the generation.
  async function handleGoToHabitStackAI() {
    if (!userId) return;
    if (!steerDescription.trim()) return void toast.error("Describe what you want to build.");
    if (revenueCat.remainingCredits < totalCost)
      return void toast.error("Not enough AI credits. Add credits from your Account page.");

    setCharging(true);
    try {
      const res = await DecreaseRemainingCreditsByUserId({ userId, amount: totalCost });
      if (res.status >= 200 && res.status < 300) {
        dispatch(RevenueCatAction.subtractCredits(totalCost));
        setAiModalOpen(false);
        router.push(
          `/dashboard/ai/generate/habit-stack?steer=${encodeURIComponent(
            steerDescription.trim(),
          )}&model=${encodeURIComponent(modelId)}&charged=1`,
        );
      } else {
        toast.error("Could not charge AI credits. Please try again.");
      }
    } finally {
      setCharging(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-[23px] font-semibold text-white">Build Better habits, one day at a time.</h1>
      <p className="-mt-2 text-[16px] font-bold text-[rgba(242,242,242,0.5)]">Let NoCap guide your journey!</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-white/[0.03] px-3 py-2">
        {LEGEND.map((tier) => (
          <span key={tier.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tier.color }} />
            <span className="text-[9px] font-semibold tracking-wide text-[#9CA3AF]">{tier.label}</span>
          </span>
        ))}
      </div>

      <DataState loading={loading || !userId} error={error}>
        {stacks.length === 0 ? (
          <div className="flex h-[45vh] items-center justify-center">
            <p className="text-base font-semibold text-white">No Habit Stack Found.</p>
          </div>
        ) : (
          <div>
            {stacks.map((stack) => {
              const id = stack.documentId ?? stack.id;
              return (
                <HabitStackCard
                  key={id}
                  stack={stack}
                  editHref={`/dashboard/habit-stacks/${id}/edit`}
                  onDelete={() => handleDelete(id)}
                  showHabitLinkNav={false}
                  showExpandedButton={false}
                />
              );
            })}
          </div>
        )}
      </DataState>

      {/* Bottom buttons — mobile's ButtonSignIn design: 45%-width dark buttons
          with white border, then a full-width white "Next" → posts screen */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setSheetOpen(true)}
          className="h-[50px] w-[45%] rounded-xl border border-[#F2F2F2] bg-[#0D0D0D] text-[14px] font-bold tracking-wider text-[#F2F2F2]"
        >
          Add Habit Stack
        </button>
        <Link
          href="/dashboard/habit-stacks/new"
          className="flex h-[50px] w-[45%] items-center justify-center rounded-xl border border-[#F2F2F2] bg-[#0D0D0D] text-[14px] font-bold tracking-wider text-[#F2F2F2]"
        >
          Create Habit Stack
        </Link>
      </div>
      <div className="py-2">
        <Link
          href="/dashboard/posts"
          className="flex h-[50px] w-full items-center justify-center rounded-xl bg-[#F2F2F2] text-[14px] font-bold tracking-wider text-[#0D0D0D]"
        >
          Next
        </Link>
      </div>

      {/* Add Habit Stack bottom sheet — mirrors mobile's RBSheet exactly */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl border-none bg-[#2C2C2E] px-4 pb-6 pt-3">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#898B9A]" />
          <p className="mb-4 font-poppins text-[18px] font-semibold text-white">Add Habit Stack</p>
          <div className="space-y-2">
            {ADD_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    setSheetOpen(false);
                    if (option.href) {
                      router.push(option.href);
                    } else {
                      setSteerDescription("");
                      setTimeout(() => setAiModalOpen(true), 250);
                    }
                  }}
                  className="flex w-full items-start gap-3 rounded-xl bg-[rgba(25,25,25,1)] px-3 py-4 text-left hover:bg-white/[0.07]"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                  <span className="min-w-0">
                    <span className="block font-poppins text-[15px] font-semibold text-white">
                      {option.title}
                    </span>
                    <span className="block font-poppins text-[13px] leading-5 text-[#898B9A]">
                      {option.subtitle}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      {/* Generate with AI confirm modal — mirrors mobile's aiConfirmModal */}
      {aiModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => !charging && setAiModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[20px] border border-[#333333] bg-[#1C1C1E] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[17px] font-semibold text-white">Generate with AI</p>
                <p className="text-[13px] text-[#6B7280]">
                  Let AI help you build a personalized habit stack
                </p>
              </div>
              <button
                onClick={() => !charging && setAiModalOpen(false)}
                className="rounded-full bg-white/5 p-1.5 text-[#6B7280]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3">
              <span className="text-[13px] text-white/60">Your credits</span>
              <span className="flex items-center gap-1 text-[14px] font-bold text-white">
                <Zap className="h-4 w-4 text-[#f59e0b]" />
                {revenueCat.remainingCredits.toLocaleString()}
              </span>
            </div>

            <textarea
              className="mb-4 min-h-24 w-full resize-y rounded-lg border border-[#3A3A3A] bg-[rgba(41,41,41,1)] px-3 py-2.5 text-[14px] text-white placeholder:text-white/40 outline-none focus:border-[rgba(45,156,219,1)]"
              placeholder="Describe the habit stack you want…"
              value={steerDescription}
              onChange={(e) => setSteerDescription(e.target.value)}
            />

            <div className="mb-4">
              <AIModelSelector
                companyName={companyName}
                modelId={modelId}
                onCompanyChange={(name, defModel) => {
                  setCompanyName(name);
                  setModelId(defModel);
                }}
                onModelChange={setModelId}
              />
            </div>

            <div className="mb-4 flex items-center justify-between text-[13px] text-white/60">
              <span>Cost</span>
              <span className="font-bold text-[#fbbf24]">{totalCost.toFixed(0)} credits</span>
            </div>

            <Button className="w-full" disabled={charging} onClick={handleGoToHabitStackAI}>
              {charging ? "Charging credits…" : "Generate"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
