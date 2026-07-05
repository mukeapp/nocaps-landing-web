"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import {
  GetAllSectorComponents,
  fetchHabitStackComponentsByUserAndSector,
} from "@/lib/api/section-b/habit-stack";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { HabitStackCard } from "@/components/dashboard/habit-stack-card";
import { HabitCard } from "@/components/dashboard/habit-card";
import { HabitLinkRow } from "@/components/dashboard/habit-link-row";
import { DataState } from "@/components/dashboard/data-state";

// Mirrors mobile's useMyHabitLibraryForm categories exactly.
const HABIT_CATEGORIES = [
  { id: 1, name: "HabitStacks" },
  { id: 2, name: "Habits" },
  { id: 3, name: "HabitLinks" },
] as const;

interface Sector {
  documentId: string;
  label: string;
}

/**
 * Mirrors mobile's MyHabitLibraryScreen (app/src/screens/section-b/
 * section-b-2/MyHabitLibraryScreen): header with sector count, category
 * chips (HabitStacks/Habits/HabitLinks), sector pills ("All" + each sector),
 * then per-sector content with the blue accent header and category badge.
 */
export default function HabitLibraryPage() {
  const router = useRouter();
  const userId = useCurrentUserId();

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [stacksBySector, setStacksBySector] = useState<Record<string, HabitStackComponent[]>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [selectedSectorDocId, setSelectedSectorDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetAllSectorComponents()
      .then((res) => setSectors(Array.isArray(res.data) ? res.data : []))
      .finally(() => setLoading(false));
  }, []);

  const fetchStacks = useCallback(
    (sectorDocId: string) => {
      if (!userId || stacksBySector[sectorDocId]) return;
      fetchHabitStackComponentsByUserAndSector(userId, sectorDocId).then((res) => {
        setStacksBySector((prev) => ({
          ...prev,
          [sectorDocId]: Array.isArray(res.data) ? res.data : [],
        }));
      });
    },
    [userId, stacksBySector],
  );

  useEffect(() => {
    if (!userId) return;
    const targets = selectedSectorDocId ? [selectedSectorDocId] : sectors.map((s) => s.documentId);
    targets.forEach(fetchStacks);
  }, [userId, sectors, selectedSectorDocId, fetchStacks]);

  const categoryLabel =
    selectedCategoryId === 1 ? "HabitStacks" : selectedCategoryId === 2 ? "Habits" : "HabitLinks";
  const visibleSectors = selectedSectorDocId
    ? sectors.filter((s) => s.documentId === selectedSectorDocId)
    : sectors;

  function renderSectorContent(sectorDocId: string) {
    const stacks = stacksBySector[sectorDocId] ?? [];

    if (selectedCategoryId === 1) {
      return stacks.map((stack) => {
        const id = stack.documentId ?? stack.id;
        return (
          <HabitStackCard
            key={id}
            stack={stack}
            href={`/dashboard/habit-stacks/${id}`}
            editHref={`/dashboard/habit-stacks/${id}/edit`}
            onDelete={() => {}}
          />
        );
      });
    }

    if (selectedCategoryId === 2) {
      const habits = stacks.flatMap((s) =>
        (s.habitData ?? []).map((h) => ({ habit: h, stackId: s.documentId ?? s.id })),
      );
      return habits.map(({ habit, stackId }) => {
        const habitId = habit.documentId ?? habit.id;
        return (
          <HabitCard
            key={habitId}
            habit={habit}
            editHref={`/dashboard/habit-stacks/${stackId}/habits/${habitId}/edit`}
            onOpenLink={(linkId) =>
              router.push(`/dashboard/habit-stacks/${stackId}/habits/${habitId}/links/${linkId}`)
            }
          />
        );
      });
    }

    const links = stacks.flatMap((s) =>
      (s.habitData ?? []).flatMap((h) =>
        (h.habitLinkData ?? []).map((l) => ({
          link: l,
          stackId: s.documentId ?? s.id,
          habitId: h.documentId ?? h.id,
        })),
      ),
    );
    return links.map(({ link, stackId, habitId }) => (
      <HabitLinkRow
        key={link.documentId ?? link.id}
        link={link}
        onOpen={(lk) =>
          router.push(
            `/dashboard/habit-stacks/${stackId}/habits/${habitId}/links/${lk.documentId ?? lk.id}`,
          )
        }
        defaultExpanded={false}
      />
    ));
  }

  return (
    <div className="mx-auto max-w-xl pb-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-white">My Habit Library</h1>
        <p className="text-[12px] text-white/50">
          {sectors.length} sector{sectors.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Category chips */}
      <div className="mb-4 flex gap-2.5 overflow-x-auto">
        {HABIT_CATEGORIES.map((cat) => {
          const active = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] ${
                active
                  ? "bg-[rgba(45,156,219,1)] font-semibold text-white"
                  : "border border-white/[0.04] bg-[#252525] text-[#BBBDC1]"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Sector pills */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {[{ documentId: "__all__", label: "All" }, ...sectors].map((sector) => {
          const isAll = sector.documentId === "__all__";
          const active = isAll ? selectedSectorDocId === null : selectedSectorDocId === sector.documentId;
          return (
            <button
              key={sector.documentId}
              onClick={() => setSelectedSectorDocId(isAll ? null : sector.documentId)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] ${
                active
                  ? "bg-[rgba(45,156,219,1)] font-semibold text-white"
                  : "border border-white/[0.04] bg-[#252525] text-white/50"
              }`}
            >
              {sector.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <DataState loading={loading || !userId} error={null}>
        {sectors.length === 0 ? (
          <div className="flex flex-col items-center pt-16">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/[0.04] bg-[#252525]">
              <BookOpen className="h-10 w-10 text-white/50" />
            </div>
            <p className="text-[16px] font-semibold text-white">Library is empty</p>
            <p className="mt-1 text-center text-[13px] text-white/50">
              Your habit sectors will appear here once loaded.
            </p>
          </div>
        ) : (
          visibleSectors.map((sector) => (
            <div key={sector.documentId} className="mb-6">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="h-4 w-1 rounded-full bg-[rgba(45,156,219,1)]" />
                <span className="flex-1 text-[15px] font-semibold text-white">{sector.label}</span>
                <span className="rounded-lg border border-white/[0.04] bg-white/5 px-2.5 py-0.5 text-[10px] text-white/50">
                  {categoryLabel}
                </span>
              </div>
              {renderSectorContent(sector.documentId)}
            </div>
          ))
        )}
      </DataState>
    </div>
  );
}
