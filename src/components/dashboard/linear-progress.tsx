// Mirrors mobile's LinearProgress (core/components/section-b/progress-bar):
// a thin rounded track with the score-tier color as the fill.
export function LinearProgress({
  progress,
  progressColor,
  backgroundColor = "#ddd",
  width = 120,
}: {
  progress: number; // 0-100
  progressColor: string;
  backgroundColor?: string;
  width?: number;
}) {
  const clamped = Math.max(0, Math.min(100, progress));
  return (
    <div className="h-1.5 overflow-hidden rounded-full" style={{ width, backgroundColor }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${clamped}%`, backgroundColor: progressColor }}
      />
    </div>
  );
}
