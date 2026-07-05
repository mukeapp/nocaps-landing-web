import type { HabitComponent } from "@/types/section-b/habit";
import { formatCost } from "@/lib/score-colors";

/**
 * Mirrors mobile's HabitsSummary (core/components/section-b/summary/
 * HabitsSummary): a horizontally scrolling row of per-habit mini-cards —
 * content_back bg, 12px radius, thin borderline border, 3px top accent bar
 * in the stack accent color, colored dot + habit name, then "COST" label
 * with the cost value in the accent color.
 */
export function HabitsSummary({
  habits,
  color,
  costSymbol = "$",
}: {
  habits: HabitComponent[];
  color: string;
  costSymbol?: string;
}) {
  if (habits.length === 0) return null;

  return (
    <div className="flex w-[80%] gap-2.5 overflow-x-auto py-1 pr-4">
      {habits.map((habit, index) => (
        <div
          key={habit.documentId ?? habit.id ?? index}
          className="min-w-28 max-w-40 shrink-0 overflow-hidden rounded-xl border border-white/[0.04] bg-[rgba(25,25,25,1)]"
        >
          <div className="h-[3px] w-full" style={{ backgroundColor: color }} />
          <div className="px-3 py-2">
            <div className="mb-1.5 flex items-center">
              <span className="mr-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <span className="truncate text-[12px] font-semibold text-white">{habit.name}</span>
            </div>
            <div className="flex items-center justify-between pl-3.5">
              <span className="text-[10px] uppercase tracking-wide text-[rgba(242,242,242,0.5)]">
                Cost
              </span>
              <span className="text-[13px] font-bold" style={{ color }}>
                {costSymbol} {formatCost(habit.scoreComponent?.cost)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
