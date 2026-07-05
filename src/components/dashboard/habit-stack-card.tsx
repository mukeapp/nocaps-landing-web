"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Heart, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { ScoreDial } from "@/components/dashboard/score-dial";
import { StatusIcon } from "@/components/dashboard/status-icon";
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

function withOpacity(hex: string | undefined, opacity: number): string {
  if (!hex) return `rgba(45,156,219,${opacity})`;
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const value = parseInt(full, 16);
  if (Number.isNaN(value)) return `rgba(45,156,219,${opacity})`;
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r},${g},${b},${opacity})`;
}

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/70">
      {children}
    </span>
  );
}

/**
 * Mirrors mobile's HabitStackCard (core/components/section-b/habits/HabitStackCard) exactly:
 * banner, icon box + name + person pill + menu, meta pills + status circle, score dial,
 * like/edit footer. Expand chevron and card click both go to the detail page rather than
 * expanding inline (mobile's inline HabitCard list isn't ported this pass).
 */
export function HabitStackCard({
  stack,
  href,
  editHref,
  onDelete,
  onCopy,
  copyLabel = "Copy",
}: {
  stack: HabitStackComponent;
  href: string;
  editHref: string;
  onDelete: () => void;
  /** Renders mobile's banner copy button (market/friends flows) when provided */
  onCopy?: (stack: HabitStackComponent) => void | Promise<void>;
  copyLabel?: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied">("idle");
  const borderColor = withOpacity(stack.iconColor, 0.5);
  const iconTint = withOpacity(stack.iconColor, 0.2);

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

  return (
    <div
      className="mb-3 overflow-hidden rounded-xl bg-[rgba(25,25,25,1)] p-2"
      style={{ border: `1px solid ${borderColor}` }}
    >
      <div className="relative">
        <Link href={href} className="relative block h-[180px] w-full overflow-hidden rounded-lg bg-white/5">
          <Image
            src={stack.bannerImage || "/assets/images/default_banner_image_000.png"}
            alt=""
            fill
            className="object-cover"
          />
        </Link>
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

      <div className="flex items-start gap-3 pt-3">
        <div
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconTint }}
        >
          <Image
            src={stack.icon?.startsWith("http") ? stack.icon : "/assets/images/dollar.png"}
            alt=""
            width={30}
            height={30}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Link href={href} className="truncate text-[15px] font-medium text-white hover:underline">
              {stack.name}
            </Link>
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
              <Link href={href} className="rounded p-1 text-white/50 hover:text-white">
                <ChevronRight className="h-4 w-4" />
              </Link>
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

      <div className="flex items-center justify-between pt-3">
        <span className="text-xs text-white/50">{stack.habitData?.length ?? 0} habits</span>
        <ScoreDial score={stack.scoreComponent?.score} scoreInfo={stack.scoreComponent?.scoreInfo} />
      </div>

      <div className="mt-2 flex items-center gap-4 border-t border-white/[0.04] pt-2">
        <button className="flex items-center gap-1.5 text-white/50 hover:text-white">
          <Heart className="h-4 w-4" />
          <span className="text-xs">0</span>
        </button>
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
