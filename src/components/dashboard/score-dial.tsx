import type { ScoreInfo } from "@/types/section-b/habit";

// Mirrors mobile's ScoreDial/SemiCircleProgress (core/components/section-b/score/ScoreDial,
// core/components/section-b/progress-bar/SemiCircleProgress): a semi-circle SVG arc, not a
// badge/pill. Tier colors from core/utils/utilities/score.ts's real map.
const TIER_HEX: Record<string, string> = {
  GRAY: "#4b5563",
  RED: "#f87171",
  PURPLE: "#a855f7",
  ORANGE: "#fb923c",
  GREEN: "#22c55e",
  GOLD: "#fbbf24",
};

export function ScoreDial({
  score,
  scoreInfo,
  size = 56,
}: {
  score?: number;
  scoreInfo?: ScoreInfo;
  size?: number;
}) {
  const percent = Math.max(0, Math.min(100, (score ?? 0) < 1 ? (score ?? 0) * 100 : score ?? 0));
  const color = TIER_HEX[scoreInfo?.color?.toUpperCase() ?? "GRAY"] ?? TIER_HEX.GRAY;
  const label = scoreInfo?.label ?? scoreInfo?.code ?? "Unscored";

  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const arc = `M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}>
        <path d={arc} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path
          d={arc}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <text
          x={size / 2}
          y={size / 2 - 2}
          textAnchor="middle"
          className="fill-white text-[10px] font-semibold"
        >
          {Math.round(percent)}%
        </text>
      </svg>
      <span className="mt-0.5 text-[10px] font-medium capitalize text-white/60">{label.toLowerCase()}</span>
    </div>
  );
}
