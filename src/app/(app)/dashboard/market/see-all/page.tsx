"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { ConstantsUtils } from "@/lib/constants";
import { getHabitStackComponentsMarketIsOwnedByAdminUserId } from "@/lib/api/section-b/market";
import { CopyHabitStackToAnotherUser } from "@/lib/api/section-b/habit-stack";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { HabitStackCard } from "@/components/dashboard/habit-stack-card";
import { DataState } from "@/components/dashboard/data-state";
import { Button } from "@/components/ui/button";

/**
 * Mirrors mobile's HabitMarketSeelAllScreen: full paginated vertical list of
 * one sector's market stacks with copy buttons.
 */
function SeeAllContent() {
  const searchParams = useSearchParams();
  const sectorId = searchParams.get("sectorId") ?? ConstantsUtils.financeSectorId;
  const title = searchParams.get("title") ?? "Market Stacks";
  const userId = useCurrentUserId();

  const [stacks, setStacks] = useState<HabitStackComponent[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHabitStackComponentsMarketIsOwnedByAdminUserId({
      marketAdminUserId: ConstantsUtils.marketAdminUserId,
      isMarketOwned: true,
      sectorId,
      pageSize: ConstantsUtils.pageSize,
      pageNumber: page,
    })
      .then((res) => {
        const next = (res.data as any)?.habitStackComponents ?? [];
        setStacks((prev) => (page === 1 ? next : [...prev, ...next]));
        setHasMore(next.length >= ConstantsUtils.pageSize);
      })
      .finally(() => setLoading(false));
  }, [sectorId, page]);

  async function copyStack(stack: HabitStackComponent) {
    if (!userId) return;
    const res = await CopyHabitStackToAnotherUser({
      data: { habitStackId: stack.documentId ?? stack.id, newOwnerUserId: userId },
    });
    if (res.status >= 200 && res.status < 300) {
      toast.success(`"${stack.name}" copied to your habit stacks.`);
    } else {
      toast.error("Unable to copy this habit stack.");
      throw new Error("copy failed");
    }
  }

  return (
    <div className="mx-auto max-w-xl pb-8">
      <h1 className="mb-4 text-[20px] font-bold text-white">{title}</h1>
      <DataState loading={loading && page === 1} error={null}>
        {stacks.length === 0 ? (
          <div className="flex h-[40vh] items-center justify-center">
            <p className="text-base font-semibold text-white">No Habit Stack Found.</p>
          </div>
        ) : (
          <>
            {stacks.map((stack) => {
              const id = stack.documentId ?? stack.id;
              return (
                <HabitStackCard
                  key={id}
                  stack={stack}
                  href={`/dashboard/habit-stacks/${id}`}
                  editHref={`/dashboard/habit-stacks/${id}/edit`}
                  onDelete={() => {}}
                  onCopy={copyStack}
                />
              );
            })}
            {hasMore ? (
              <Button
                variant="outline"
                className="mt-2 w-full"
                disabled={loading}
                onClick={() => setPage((p) => p + 1)}
              >
                {loading ? "Loading..." : "Load more"}
              </Button>
            ) : null}
          </>
        )}
      </DataState>
    </div>
  );
}

export default function MarketSeeAllPage() {
  return (
    <Suspense fallback={null}>
      <SeeAllContent />
    </Suspense>
  );
}
