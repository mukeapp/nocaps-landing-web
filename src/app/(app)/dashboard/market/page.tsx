"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Settings2 } from "lucide-react";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { ConstantsUtils, MARKET_SECTIONS } from "@/lib/constants";
import { getHabitStackComponentsMarketIsOwnedByAdminUserId } from "@/lib/api/section-b/market";
import { CopyHabitStackToAnotherUser } from "@/lib/api/section-b/habit-stack";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { FeaturedCarousel } from "@/components/dashboard/featured-carousel";
import { HabitStackCard } from "@/components/dashboard/habit-stack-card";
import { DataState } from "@/components/dashboard/data-state";

const SECTOR_PILLS = [
  { id: "sector-all-000", label: "All" },
  ...MARKET_SECTIONS.map((s) => ({ id: s.sectorId, label: s.title })),
];

/**
 * Mirrors mobile's HabitMarketScreen (app/src/screens/section-b/section-b-3/
 * HabitMarketScreen): FeaturedCarousel, filters (sector pills + manager
 * shortcut), then one MarketSection per named sector with a "See All" link
 * and copyable admin-owned stacks.
 */
export default function MarketPage() {
  const userId = useCurrentUserId();
  const [stacksBySector, setStacksBySector] = useState<Record<string, HabitStackComponent[]>>({});
  const [activeSector, setActiveSector] = useState("sector-all-000");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      MARKET_SECTIONS.map((section) =>
        getHabitStackComponentsMarketIsOwnedByAdminUserId({
          marketAdminUserId: ConstantsUtils.marketAdminUserId,
          isMarketOwned: true,
          sectorId: section.sectorId,
          pageSize: ConstantsUtils.pageSize,
          pageNumber: 1,
        }).then((res) => ({
          sectorId: section.sectorId,
          stacks: (res.data as any)?.habitStackComponents ?? [],
        })),
      ),
    )
      .then((results) => {
        const map: Record<string, HabitStackComponent[]> = {};
        for (const r of results) map[r.sectorId] = r.stacks;
        setStacksBySector(map);
      })
      .finally(() => setLoading(false));
  }, []);

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

  const visibleSections = MARKET_SECTIONS.filter(
    (s) => activeSector === "sector-all-000" || activeSector === s.sectorId,
  );

  return (
    <div className="mx-auto max-w-xl pb-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-white">Habit Market</h1>
        <Link
          href="/dashboard/market/manager"
          className="flex items-center gap-1.5 rounded-full border border-white/[0.04] bg-[#252525] px-3 py-1.5 text-[12px] text-white/70 hover:text-white"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Manager
        </Link>
      </div>

      <FeaturedCarousel />

      {/* Sector pills */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {SECTOR_PILLS.map((pill) => {
          const active = activeSector === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setActiveSector(pill.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] ${
                active
                  ? "bg-[rgba(45,156,219,1)] font-semibold text-white"
                  : "border border-white/[0.04] bg-[#252525] text-white/50"
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      <DataState loading={loading} error={null}>
        {visibleSections.map((section) => {
          const stacks = stacksBySector[section.sectorId] ?? [];
          if (stacks.length === 0) return null;
          return (
            <div key={section.sectorId} className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[16px] font-semibold text-white">{section.title}</span>
                <Link
                  href={`/dashboard/market/see-all?sectorId=${section.sectorId}&title=${encodeURIComponent(
                    `${section.title} Stacks`,
                  )}`}
                  className="text-[12px] font-semibold text-[rgba(45,156,219,1)] hover:underline"
                >
                  See All
                </Link>
              </div>
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
            </div>
          );
        })}
      </DataState>
    </div>
  );
}
