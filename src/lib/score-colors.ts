// Mobile's real tier map (core/utils/utilities/score.ts colorMap). The server
// sends scoreInfo.color as a color word ("gray"/"red"/"purple"/"orange"/
// "green"/"gold", sometimes uppercase); this resolves it to the exact hex.
export const SCORE_COLOR_MAP: Record<string, string> = {
  gray: "#4b5563",
  red: "#f87171",
  purple: "#a855f7",
  orange: "#fb923c",
  green: "#22c55e",
  gold: "#fbbf24",
};

export function scoreHex(color?: string): string {
  return SCORE_COLOR_MAP[color?.toLowerCase() ?? "gray"] ?? SCORE_COLOR_MAP.gray;
}

export function withOpacity(color: string | undefined, opacity: number): string {
  if (!color) return `rgba(128,128,128,${opacity})`;
  if (color.startsWith("rgba") || color.startsWith("rgb")) return color;
  const clean = color.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const value = parseInt(full, 16);
  if (Number.isNaN(value)) return `rgba(128,128,128,${opacity})`;
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r},${g},${b},${opacity})`;
}

/** Mobile's formatCost (numberUtils): compact k/M suffixes for costs. */
export function formatCost(value?: number, compact = true): string {
  const n = value ?? 0;
  if (!compact) return String(Math.round(n));
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n % 1 === 0 ? String(n) : n.toFixed(2);
}
