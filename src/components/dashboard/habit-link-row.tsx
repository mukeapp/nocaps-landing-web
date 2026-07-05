"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeftRight, ChevronDown, ChevronUp } from "lucide-react";
import type { HabitLinkComponent } from "@/types/section-b/habit";
import { LinearProgress } from "@/components/dashboard/linear-progress";
import { HabitLinkItemCard } from "@/components/dashboard/habit-link-item-card";
import { scoreHex, formatCost } from "@/lib/score-colors";

/**
 * Mirrors mobile's HabitLinkItemRow (core/components/section-b/habits/
 * HabitLinkItemRow): dark blue-tinted row (rgba(31,35,158,0.5)), icon box
 * with a blue file badge, name + LinearProgress + cost pill on the left,
 * open (blue circle, file icon) + expand controls on the right; expanding
 * reveals the HabitLinkItemsList item cards.
 */
export function HabitLinkRow({
  link,
  costSymbol = "$",
  onOpen,
  defaultExpanded = false,
}: {
  link: HabitLinkComponent;
  costSymbol?: string;
  onOpen?: (link: HabitLinkComponent) => void;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const items = link.habitLinkItemComponentsData ?? [];
  const rawScore = link.scoreComponent?.score ?? 0;
  const progress = rawScore < 1 ? rawScore * 100 : rawScore;
  const color = scoreHex(link.scoreComponent?.scoreInfo?.color);
  const cost = link.scoreComponent?.cost ?? 0;

  return (
    <div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-[rgba(31,35,158,0.5)] p-2 pb-3">
        <div className="flex items-center">
          <button
            onClick={() => onOpen?.(link)}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(45,156,219,0.15)]"
          >
            <Image
              src={link.icon?.startsWith("http") ? link.icon : "/assets/images/dollar.png"}
              alt=""
              width={26}
              height={26}
            />
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-lg bg-[rgba(45,156,219,1)]">
              <Image src="/assets/images/file.png" alt="" width={12} height={12} className="brightness-0 invert" />
            </span>
          </button>

          <div className="ml-3">
            <p className="text-[10px] font-semibold text-white">{link.name}</p>
            <div className="mt-1">
              <LinearProgress progress={progress} progressColor={color} />
            </div>
            <span className="mt-1 inline-block rounded-full bg-white/5 px-2 py-0.5 text-[12px] font-semibold text-white">
              {costSymbol}
              {formatCost(cost)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pr-1">
          <Link
            href={`/dashboard/ai/swap/habit-link?id=${link.documentId ?? link.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:opacity-80"
            style={{ backgroundColor: color }}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onOpen?.(link)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(45,156,219,1)]"
          >
            <Image src="/assets/images/file.png" alt="" width={18} height={18} className="brightness-0 invert" />
          </button>
          {items.length > 0 ? (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D0D0D] text-white"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
      </div>

      {expanded
        ? items.map((item) => (
            <HabitLinkItemCard key={item.documentId ?? item.id} item={item} costSymbol={costSymbol} />
          ))
        : null}
    </div>
  );
}
