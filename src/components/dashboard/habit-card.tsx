"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeftRight, CalendarDays, ChevronDown, ChevronUp, Heart, Pencil } from "lucide-react";
import type { HabitComponent } from "@/types/section-b/habit";
import { StatusIcon } from "@/components/dashboard/status-icon";
import { ScoreDial } from "@/components/dashboard/score-dial";
import { HabitLinkRow } from "@/components/dashboard/habit-link-row";
import { scoreHex, withOpacity, formatCost } from "@/lib/score-colors";

/**
 * Mirrors mobile's HabitCard (core/components/section-b/habits/HabitCard):
 * #212426 card with a 2.5px top border in the habit's iconColor;
 * HabitHeaderSection (icon box + star badge, name, likes pill, expand
 * control; MetaRow: cost pill, interest pill, status circle); expanded →
 * HabitSubHeader (frequency/time chips + weekday letters, score dial) and
 * the habit's HabitLink rows.
 */
export function HabitCard({
  habit,
  costSymbol = "$",
  editHref,
  onOpenLink,
  defaultExpanded = false,
  showHabitLinkNav = true,
  showExpandedButton = true,
}: {
  habit: HabitComponent;
  costSymbol?: string;
  editHref?: string;
  onOpenLink?: (linkId: string) => void;
  defaultExpanded?: boolean;
  showHabitLinkNav?: boolean;
  showExpandedButton?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const scoreColor = scoreHex(habit.scoreComponent?.scoreInfo?.color);
  const iconColor = habit.iconColor ?? "rgba(128,128,128,0.5)";
  const likesCount = (habit as any)?.habitLikes?.length ?? 0;
  const cost = habit.scoreComponent?.cost ?? 0;
  const rawScore = habit.scoreComponent?.score ?? 0;
  const days: any[] = (habit as any)?.habitDayComponents ?? [];

  return (
    <div
      className="mt-6 rounded-xl bg-[#212426] px-2 pb-2"
      style={{ borderTop: `2.5px solid ${habit.iconColor ?? "#0000FF"}` }}
    >
      {/* Header row */}
      <div className="mb-4 mt-2 flex items-center">
        {/* Icon box + star badge */}
        <div
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: withOpacity(iconColor, 0.2) }}
        >
          <Image
            src={habit.icon?.startsWith("http") ? habit.icon : "/assets/images/cup.png"}
            alt=""
            width={28}
            height={28}
          />
          <span className="absolute -right-1.5 -top-1.5 flex items-center rounded-full bg-[#252525] p-1">
            <Image
              src="/assets/images/star.png"
              alt=""
              width={11}
              height={11}
              style={{ filter: "grayscale(1) brightness(1.6)" }}
            />
          </span>
        </div>

        {/* Name + likes + controls + meta */}
        <div className="ml-2 min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-[14px] font-semibold text-white">{habit.name}</span>
              {likesCount > 0 ? (
                <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/70">
                  <Heart className="h-3 w-3" />
                  {likesCount}
                </span>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/dashboard/calendar?type=habit&id=${habit.id ?? habit.documentId}&title=${encodeURIComponent(
                  `${habit.name ?? "Habit"} Calendar`,
                )}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.07] text-white hover:bg-white/10"
              >
                <CalendarDays className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`/dashboard/ai/swap/habit?id=${habit.documentId ?? habit.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:opacity-80"
                style={{ backgroundColor: scoreColor }}
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </Link>
              {editHref ? (
                <Link
                  href={editHref}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.07] text-white hover:bg-white/10"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
              ) : null}
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: scoreColor }}
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* MetaRow: cost pill, interest pill, status circle */}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white">
              {costSymbol}
              {formatCost(cost)}
            </span>
            {habit.interest ? (
              <span className="max-w-[40%] truncate rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white">
                {habit.interest}
              </span>
            ) : null}
            <StatusIcon status={habit.status} />
          </div>
        </div>
      </div>

      {expanded ? (
        <>
          {/* HabitSubHeader: schedule chips left, score dial right */}
          <div className="flex items-center justify-between px-1 pb-1">
            <div className="flex flex-col items-start gap-1">
              {habit.frequency ? (
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white">
                  {habit.frequency}
                </span>
              ) : null}
              {days.length > 0 ? (
                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold text-white">
                  {days.map((d) => d?.day?.label?.charAt(0)).join(" ")}
                </span>
              ) : null}
            </div>
            <ScoreDial score={rawScore} scoreInfo={habit.scoreComponent?.scoreInfo} size={50} />
          </div>

          {/* Habit links */}
          {(habit.habitLinkData ?? []).map((link) => (
            <HabitLinkRow
              key={link.documentId ?? link.id}
              link={link}
              costSymbol={costSymbol}
              onOpen={(lk) => onOpenLink?.(lk.documentId ?? lk.id ?? "")}
              showHabitLinkNav={showHabitLinkNav}
              showExpandedButton={showExpandedButton}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}
