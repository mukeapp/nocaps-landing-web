"use client";

import Link from "next/link";
import { ArrowLeftRight, Info, Pencil, X } from "lucide-react";
import type { HabitLinkItemComponent } from "@/types/section-b/habit";
import { scoreHex, formatCost } from "@/lib/score-colors";

/**
 * Mirrors mobile's HabitLinkItemsList item card
 * (core/components/section-b/habit-links/HabitLinkItemsList): left score
 * accent bar, name + score pill, "company · cost" meta line, round action
 * icons on the right.
 */
export function HabitLinkItemCard({
  item,
  costSymbol = "$",
  canEdit = false,
  onEdit,
  onInfo,
  onDelete,
}: {
  item: HabitLinkItemComponent;
  costSymbol?: string;
  canEdit?: boolean;
  onEdit?: (item: HabitLinkItemComponent) => void;
  onInfo?: (item: HabitLinkItemComponent) => void;
  onDelete?: (item: HabitLinkItemComponent) => void;
}) {
  const accent = scoreHex(item.scoreCode ?? (item as any)?.scoreObject?.scoreInfo?.color);
  const scoreLabel = (item as any)?.scoreObject?.scoreInfo?.label as string | undefined;
  const metaParts = [item.companyName, `${costSymbol}${formatCost(item.cost ?? item.price)}`].filter(Boolean);

  return (
    <div className="mt-2 flex items-center overflow-hidden rounded-xl bg-white/[0.04] py-2.5 pr-3">
      <div className="mr-3 w-1 self-stretch rounded-sm" style={{ backgroundColor: accent }} />

      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-[13px] font-semibold text-white">{item.name}</span>
          {scoreLabel ? (
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider"
              style={{ backgroundColor: `${accent}33`, color: accent }}
            >
              {scoreLabel}
            </span>
          ) : null}
        </div>
        {metaParts.length > 0 ? (
          <p className="truncate text-[11px] text-[#6b7280]">{metaParts.join(" · ")}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5">
        {canEdit ? (
          <Link
            href={`/dashboard/ai/swap/habit-link-item?id=${item.documentId ?? item.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:opacity-80"
            style={{ backgroundColor: accent }}
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
        {canEdit && onEdit ? (
          <button
            onClick={() => onEdit(item)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.07] text-white hover:bg-white/10"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        ) : null}
        {onInfo ? (
          <button
            onClick={() => onInfo(item)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.07] text-white hover:bg-white/10"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        ) : null}
        {canEdit && onDelete ? (
          <button
            onClick={() => onDelete(item)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,23,23,0.15)] text-[#FF1717] hover:bg-[rgba(255,23,23,0.25)]"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
