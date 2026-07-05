"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { ConstantsUtils, MARKET_SECTIONS } from "@/lib/constants";
import {
  getHabitStacksMarketByStatus,
  postPublishHabitStackToMarket,
  postUnpublishHabitStackFromMarket,
  putMarkHabitStackAsMarketInProgress,
  putMarkHabitStackAsMarketPending,
} from "@/lib/api/section-b/market";
import { getHabitStackComponentsByUserId } from "@/lib/api/section-b/habit-stack";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { HabitStackCard } from "@/components/dashboard/habit-stack-card";
import { DataState } from "@/components/dashboard/data-state";
import { Button } from "@/components/ui/button";

type ManagerTab = "mine" | "in-progress" | "pending" | "published";

const TABS: { id: ManagerTab; label: string }[] = [
  { id: "mine", label: "My Stacks" },
  { id: "in-progress", label: "In Progress" },
  { id: "pending", label: "Pending" },
  { id: "published", label: "Published" },
];

/**
 * Mirrors mobile's HabitMarketManagerScreen workflow: move your own stacks
 * through the market states (in progress → pending → published) and
 * unpublish. Mobile presents this via action buttons per stack; the web
 * groups them under status tabs.
 */
export default function MarketManagerPage() {
  const userId = useCurrentUserId();
  const [tab, setTab] = useState<ManagerTab>("mine");
  const [stacks, setStacks] = useState<HabitStackComponent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      if (tab === "mine") {
        const res = await getHabitStackComponentsByUserId({ id: userId });
        setStacks(Array.isArray(res.data) ? res.data : []);
      } else {
        const status =
          tab === "in-progress"
            ? ("market-in-progress" as const)
            : tab === "pending"
              ? ("market-pending" as const)
              : ("market-published" as const);
        const results = await Promise.all(
          MARKET_SECTIONS.map((s) =>
            getHabitStacksMarketByStatus({
              userId,
              sectorId: s.sectorId,
              status,
              pageSize: 20,
              pageNumber: 1,
            }),
          ),
        );
        setStacks(results.flatMap((r) => (r.data as any)?.habitStackComponents ?? []));
      }
    } finally {
      setLoading(false);
    }
  }, [userId, tab]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(fn: () => Promise<{ status: number }>, successMsg: string) {
    const res = await fn();
    if (res.status >= 200 && res.status < 300) {
      toast.success(successMsg);
      load();
    } else {
      toast.error("Action failed. Please try again.");
    }
  }

  function actionsFor(stack: HabitStackComponent) {
    const id = stack.documentId ?? stack.id;
    if (tab === "mine") {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            act(() => putMarkHabitStackAsMarketInProgress({ valid: true, id }), "Moved to In Progress.")
          }
        >
          Start market prep
        </Button>
      );
    }
    if (tab === "in-progress") {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => act(() => putMarkHabitStackAsMarketPending({ valid: true, id }), "Sent to Pending.")}
        >
          Send to Pending
        </Button>
      );
    }
    if (tab === "pending") {
      return (
        <Button
          size="sm"
          onClick={() =>
            act(
              () =>
                postPublishHabitStackToMarket({
                  id,
                  newOwnerUserId: ConstantsUtils.marketAdminUserId,
                  oldOwnerUserId: userId ?? "",
                }),
              "Published to market.",
            )
          }
        >
          Publish
        </Button>
      );
    }
    return (
      <Button
        size="sm"
        variant="destructive"
        onClick={() => act(() => postUnpublishHabitStackFromMarket({ id }), "Unpublished from market.")}
      >
        Unpublish
      </Button>
    );
  }

  return (
    <div className="mx-auto max-w-xl pb-8">
      <h1 className="mb-4 text-[20px] font-bold text-white">Market Manager</h1>

      <div className="mb-4 flex gap-2 overflow-x-auto">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] ${
                active
                  ? "bg-[rgba(45,156,219,1)] font-semibold text-white"
                  : "border border-white/[0.04] bg-[#252525] text-white/50"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <DataState loading={loading || !userId} error={null}>
        {stacks.length === 0 ? (
          <div className="flex h-[40vh] items-center justify-center">
            <p className="text-base font-semibold text-white">No Habit Stack Found.</p>
          </div>
        ) : (
          stacks.map((stack) => {
            const id = stack.documentId ?? stack.id;
            return (
              <div key={id}>
                <HabitStackCard
                  stack={stack}
                  href={`/dashboard/habit-stacks/${id}`}
                  editHref={`/dashboard/habit-stacks/${id}/edit`}
                  onDelete={() => {}}
                />
                <div className="-mt-1 mb-3 flex justify-end">{actionsFor(stack)}</div>
              </div>
            );
          })
        )}
      </DataState>
    </div>
  );
}
