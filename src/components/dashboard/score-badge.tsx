import { cn } from "@/lib/utils";
import type { ScoreInfo } from "@/types/section-b/habit";

// Mirrors mobile's ScoreInfo color-coded tiers (GRAY/RED/ORANGE/YELLOW/GREEN/GOLD).
const TIER_STYLES: Record<string, string> = {
  GRAY: "bg-score-gray/15 text-score-gray",
  RED: "bg-score-red/15 text-score-red",
  ORANGE: "bg-score-orange/15 text-score-orange",
  YELLOW: "bg-score-yellow/15 text-score-yellow",
  GREEN: "bg-score-green/15 text-score-green",
  GOLD: "bg-score-gold/15 text-score-gold",
};

export function ScoreBadge({ scoreInfo }: { scoreInfo?: ScoreInfo }) {
  const color = scoreInfo?.color?.toUpperCase() ?? "GRAY";
  const label = scoreInfo?.label ?? scoreInfo?.code ?? "Unscored";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        TIER_STYLES[color] ?? TIER_STYLES.GRAY,
      )}
    >
      {label.toLowerCase()}
    </span>
  );
}
