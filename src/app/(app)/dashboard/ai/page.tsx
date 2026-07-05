"use client";

import Link from "next/link";
import { Boxes, Link2, ListPlus, Sparkles } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectRevenueCat } from "@/redux/user-revenue-cat";

const TOOLS = [
  {
    title: "Generate Habit Stack",
    description: "Describe a goal and let AI build a full habit stack for you.",
    href: "/dashboard/ai/generate/habit-stack",
    icon: Boxes,
    costKey: "generateHabitStackCost" as const,
  },
  {
    title: "Generate Habits",
    description: "Add AI-generated habits to one of your habit stacks.",
    href: "/dashboard/ai/generate?type=habit",
    icon: Sparkles,
    costKey: "generateHabitCost" as const,
  },
  {
    title: "Generate Habit Links",
    description: "Add AI-generated links to one of your habits.",
    href: "/dashboard/ai/generate?type=habit-link",
    icon: Link2,
    costKey: "generateHabitLinkCost" as const,
  },
  {
    title: "Generate Habit Link Items",
    description: "Add AI-generated items to one of your habit links.",
    href: "/dashboard/ai/generate?type=habit-link-item",
    icon: ListPlus,
    costKey: "generateHabitLinkItemCost" as const,
  },
];

/**
 * AI tools hub — mobile reaches these screens from the habit-stack list's
 * "With AI" sheet and card-level actions; this page groups the same four
 * generators (swaps are reached from habit/link/item rows, same as mobile).
 */
export default function AIToolsPage() {
  const revenueCat = useAppSelector(selectRevenueCat);
  const costs = useAppSelector((s) => s.habitIntelligenceCost);

  return (
    <div className="mx-auto max-w-xl pb-8">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-white">NoCap AI</h1>
        <span className="rounded-full bg-white/5 px-3 py-1 text-[12px] font-semibold text-white">
          {revenueCat.remainingCredits.toLocaleString()} credits
        </span>
      </div>
      <p className="mb-5 text-[13px] text-white/50">
        Each run costs AI credits, adjusted by the model you pick.
      </p>

      <div className="space-y-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="flex items-center gap-4 rounded-xl bg-[rgba(25,25,25,1)] p-4 transition-colors hover:bg-white/[0.07]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(45,156,219,0.15)]">
                <Icon className="h-5 w-5 text-[rgba(45,156,219,1)]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-white">{tool.title}</span>
                <span className="block text-[12px] text-white/50">{tool.description}</span>
              </span>
              <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-bold text-[#fbbf24]">
                {costs[tool.costKey]} cr
              </span>
            </Link>
          );
        })}
      </div>

      <p className="mt-6 text-[12px] text-white/40">
        Looking for AI Swap? Open a habit, link or item and use its swap action — same as the mobile
        app.
      </p>
    </div>
  );
}
