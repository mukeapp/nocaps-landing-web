"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Heart, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { ScoreDial } from "@/components/dashboard/score-dial";
import { StatusIcon } from "@/components/dashboard/status-icon";
import { HabitCard } from "@/components/dashboard/habit-card";
import { withOpacity } from "@/lib/score-colors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/70">
      {children}
    </span>
  );
}

/**
 * Mirrors mobile's HabitStackCard (core/components/section-b/habits/HabitStackCard)
 * including its interaction model: the card holds `expanded` state and, when
 * expanded, renders a HabitCard for every habit INLINE inside the card —
 * clicking the card/chevron toggles expansion, exactly like mobile (which has
 * no separate stack-detail screen). Edit/Delete live in the ⋮ menu.
 */
export function HabitStackCard({
  stack,
  href,
  editHref,
  onDelete,
  onCopy,
  copyLabel = "Copy",
  defaultExpanded = false,
}: {
  stack: HabitStackComponent;
  /** Retained for deep-link compatibility; card click expands instead of navigating. */
  href?: string;
  editHref: string;
  onDelete: () => void;
  /** Renders mobile's banner copy button (market/friends flows) when provided */
  onCopy?: (stack: HabitStackComponent) => void | Promise<void>;
  copyLabel?: string;
  defaultExpanded?: boolean;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied">("idle");
  const borderColor = withOpacity(stack.iconColor, 0.5);
  const iconTint = withOpacity(stack.iconColor, 0.2);
  const stackId = stack.documentId ?? stack.id;

  async function handleCopy() {
    if (!onCopy || copyState !== "idle") return;
    setCopyState("copying");
    try {
      await onCopy(stack);
      setCopyState("copied");
    } catch {
      setCopyState("idle");
    }
  }

  const toggleExpand = () => setExpanded((v) => !v);

  return (
    <div
      className="mb-3 overflow-hidden rounded-xl bg-[rgba(25,25,25,1)] p-2"
      style={{ border: `1px solid ${borderColor}` }}
    >
      {/* Banner — click toggles expansion, like tapping the card on mobile */}
      <div className="relative">
        <button
          onClick={toggleExpand}
          className="relative block h-[180px] w-full overflow-hidden rounded-lg bg-white/5"
        >
          <Image
            src={stack.bannerImage || "/assets/images/default_banner_image_000.png"}
            alt=""
            fill
            className="object-cover"
          />
        </button>
        {onCopy ? (
          <button
            onClick={handleCopy}
            disabled={copyState !== "idle"}
            className={`absolute right-2 top-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white ${
              copyState === "copied" ? "bg-[rgba(34,197,94,0.8)]" : "bg-black/50 hover:bg-black/70"
            } ${copyState === "copying" ? "opacity-60" : ""}`}
          >
            {copyState === "copying" ? "Processing..." : copyState === "copied" ? "Copied" : copyLabel}
          </button>
        ) : null}
      </div>

      {/* Header row */}
      <div className="flex items-start gap-3 pt-3">
        <button
          onClick={toggleExpand}
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconTint }}
        >
          <Image
            src={stack.icon?.startsWith("http") ? stack.icon : "/assets/images/dollar.png"}
            alt=""
            width={30}
            height={30}
          />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={toggleExpand}
              className="min-w-0 truncate text-left text-[15px] font-medium text-white"
            >
              {stack.name}
            </button>
            <div className="flex shrink-0 items-center gap-1">
              {typeof stack.personsCount === "number" ? (
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                  {stack.personsCount}
                </span>
              ) : null}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded p-1 text-white/50 hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={editHref}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setConfirmOpen(true)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Expand chevron — mobile's keyboard-arrow-down/up */}
              <button onClick={toggleExpand} className="rounded p-1 text-white/50 hover:text-white">
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {stack.scoreComponent?.cost != null ? <MetaPill>${stack.scoreComponent.cost}</MetaPill> : null}
            {stack.focus ? <MetaPill>{stack.focus}</MetaPill> : null}
            {stack.priority ? <MetaPill>{stack.priority}</MetaPill> : null}
            <span className="ml-auto">
              <StatusIcon status={stack.status} />
            </span>
          </div>
        </div>
      </div>

      {/* Summary row: habit count + score dial (always visible, like mobile) */}
      <div className="flex items-center justify-between pt-3">
        <span className="text-xs text-white/50">{stack.habitData?.length ?? 0} habits</span>
        <ScoreDial score={stack.scoreComponent?.score} scoreInfo={stack.scoreComponent?.scoreInfo} />
      </div>

      {/* Expanded: nested HabitCards inline, exactly like mobile */}
      {expanded
        ? (stack.habitData ?? []).map((habit) => {
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
          })
        : null}

      {/* Footer row */}
      <div className="mt-2 flex items-center gap-4 border-t border-white/[0.04] pt-2">
        <button className="flex items-center gap-1.5 text-white/50 hover:text-white">
          <Heart className="h-4 w-4" />
          <span className="text-xs">0</span>
        </button>
        <Link href={editHref} className="flex items-center text-white/50 hover:text-white">
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this habit stack?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes &quot;{stack.name}&quot; and every habit, link and item inside it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
