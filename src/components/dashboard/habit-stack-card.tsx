"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Copy, Heart, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/user-data";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { CreateHabitStackLike, DeleteHabitStackLike } from "@/lib/api/section-b/habit-stack";
import { ScoreDial } from "@/components/dashboard/score-dial";
import { StatusIcon } from "@/components/dashboard/status-icon";
import { HabitCard } from "@/components/dashboard/habit-card";
import { HabitsSummary } from "@/components/dashboard/habits-summary";
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
  username,
  showHabitLinkNav = false,
  showExpandedButton = false,
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
  /** Owner's username shown over the banner (mobile Banner's bottom-left overlay) */
  username?: string;
  /** Mobile's card flags — home screen passes both as false */
  showHabitLinkNav?: boolean;
  showExpandedButton?: boolean;
}) {
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { userdata } = useAppSelector(selectUser);
  const ownProfile = (userdata as any)?.collectdata ?? userdata ?? {};
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied">("idle");
  const borderColor = withOpacity(stack.iconColor, 0.5);
  const iconTint = withOpacity(stack.iconColor, 0.2);
  const stackId = stack.documentId ?? stack.id;

  // Accent color exactly like mobile: scoreInfo.rgb ?? iconColor ?? inuptborder.
  const accentColor = stack.scoreComponent?.scoreInfo?.rgb ?? stack.iconColor ?? "#3A3A3A";

  // Like state — mirrors mobile's HabitFooterRow toggle with optimistic revert.
  const existingLike = (stack.habitStackLikes ?? []).find(
    (l) => l.userId === currentUserId && l.isLike,
  );
  const [liked, setLiked] = useState(Boolean(existingLike));
  const [likeDocId, setLikeDocId] = useState<string | undefined>(
    existingLike?.documentId ?? existingLike?.id,
  );
  const serverCount = stack.habitStackLikes?.length ?? 0;
  const displayCount =
    serverCount + (liked && !existingLike ? 1 : 0) - (!liked && existingLike ? 1 : 0);

  async function toggleLike() {
    if (!currentUserId) return;
    const nowLiked = !liked;
    setLiked(nowLiked);
    try {
      if (nowLiked) {
        const newId = crypto.randomUUID();
        const res = await CreateHabitStackLike({
          id: newId,
          userId: currentUserId,
          habitStackId: stack.id ?? stack.documentId ?? "",
        });
        if (res.status >= 200 && res.status < 300) {
          setLikeDocId((res.data as any)?.id ?? (res.data as any)?.documentId ?? newId);
        } else {
          setLiked(!nowLiked);
        }
      } else if (likeDocId) {
        const res = await DeleteHabitStackLike(likeDocId);
        if (res.status >= 200 && res.status < 300) {
          setLikeDocId(undefined);
        } else {
          setLiked(!nowLiked);
        }
      }
    } catch {
      setLiked(!nowLiked);
    }
  }

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
            <Copy className="h-4 w-4" />
            {copyState === "copying" ? "Processing..." : copyState === "copied" ? "Copied" : copyLabel}
          </button>
        ) : null}
        {/* User info — bottom-left banner overlay, like mobile's Banner */}
        <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-2">
          <Image
            src={ownProfile?.photo || "/assets/images/profile.png"}
            alt=""
            width={33}
            height={33}
            className="h-[33px] w-[33px] rounded-full object-cover"
          />
          <span className="text-[16px] font-semibold tracking-wider text-[#F2F2F2]">
            {username || ownProfile?.username || "User"}
          </span>
        </div>
      </div>

      {/* Header row */}
      <div className="flex items-start gap-3 pt-3">
        <button
          onClick={toggleExpand}
          className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconTint }}
        >
          <Image
            src={stack.icon?.startsWith("http") ? stack.icon : "/assets/images/dollar.png"}
            alt=""
            width={30}
            height={30}
          />
          {/* Star rating badge — mobile HeaderLeft's pinned star pill */}
          <span className="absolute -right-1.5 -top-1.5 flex items-center rounded-full bg-[#252525] p-1">
            <Image
              src="/assets/images/star.png"
              alt=""
              width={11}
              height={11}
              style={{ filter: "grayscale(1) brightness(1.6)" }}
            />
          </span>
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

      {/* Summary row: per-habit mini-cards + score dial (mobile HabitStackSummary) */}
      <div className="flex items-center justify-between pt-4">
        <HabitsSummary habits={stack.habitData ?? []} color={accentColor} />
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
                showHabitLinkNav={showHabitLinkNav}
                showExpandedButton={showExpandedButton}
              />
            );
          })
        : null}

      {/* Footer row — mobile HabitFooterRow: like toggle + edit pencil */}
      <div className="mt-2 flex items-center justify-between pt-1">
        <button onClick={toggleLike} className="relative">
          <Heart
            className={liked ? "h-[30px] w-[30px] fill-[rgba(235,87,87,1)] text-[rgba(235,87,87,1)]" : "h-[25px] w-[25px] text-white"}
          />
          {displayCount > 0 ? (
            <span className="absolute -bottom-1 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-0.5 text-[10px] font-bold text-black">
              {displayCount}
            </span>
          ) : null}
        </button>
        <Link href={editHref} className="flex items-center text-white hover:text-white/70">
          <Pencil className="h-5 w-5" />
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
