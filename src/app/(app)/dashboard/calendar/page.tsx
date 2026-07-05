"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  fetchCalendarByDays,
  type CalendarEntityType,
  type CalendarYMD,
  type HabitCalendarEntry,
} from "@/lib/api/section-b/calendar";

// Mobile's HabitCalendar colorMap — identical to the score tier map.
const COLOR_MAP: Record<string, string> = {
  gray: "#4b5563",
  red: "#f87171",
  purple: "#a855f7",
  orange: "#fb923c",
  green: "#22c55e",
  gold: "#fbbf24",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const LEGEND: { code: string; color: string }[] = [
  { code: "BAD", color: COLOR_MAP.red },
  { code: "POOR", color: COLOR_MAP.purple },
  { code: "AVERAGE", color: COLOR_MAP.orange },
  { code: "GOOD", color: COLOR_MAP.green },
  { code: "EXCELLENT", color: COLOR_MAP.gold },
  { code: "UNKNOWN", color: COLOR_MAP.gray },
];

/**
 * Mirrors mobile's HabitCalendarScreen + HabitCalendar component: a monthly
 * 7-column grid, day cells tinted by the day's scoreInfo color, month/year
 * navigation, and score-count legend. Data is fetched in 5-day batches
 * exactly like mobile's useHabitCalendarForm.
 */
function CalendarContent() {
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as CalendarEntityType) || "habit-stack";
  const id = searchParams.get("id");
  const title = searchParams.get("title") ?? "Habit Calendar";

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [entries, setEntries] = useState<HabitCalendarEntry[]>([]);
  const [loadingCount, setLoadingCount] = useState(0);

  const load = useCallback(async () => {
    if (!id) return;
    setEntries([]);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates: CalendarYMD[] = Array.from({ length: daysInMonth }, (_, i) => ({
      year,
      month: month + 1,
      day: i + 1,
    }));

    const BATCH_SIZE = 5;
    setLoadingCount(Math.ceil(dates.length / BATCH_SIZE));
    for (let i = 0; i < dates.length; i += BATCH_SIZE) {
      const batch = dates.slice(i, i + BATCH_SIZE);
      const res = await fetchCalendarByDays({ type, id, dates: batch });
      if (Array.isArray(res.data)) {
        setEntries((prev) => [...prev, ...(res.data as HabitCalendarEntry[])]);
      }
      setLoadingCount((prev) => Math.max(0, prev - 1));
    }
  }, [id, type, year, month]);

  useEffect(() => {
    load();
  }, [load]);

  const entryByDay = useMemo(() => {
    const map: Record<number, HabitCalendarEntry> = {};
    for (const entry of entries) {
      if (entry.year === year && entry.month === month + 1) map[entry.day] = entry;
    }
    return map;
  }, [entries, year, month]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const entry of entries) {
      const code = entry.scoreInfo?.scoreCode?.toUpperCase() ?? "UNKNOWN";
      c[code] = (c[code] ?? 0) + 1;
    }
    return c;
  }, [entries]);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  if (!id) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-center">
        <p className="text-base font-semibold text-white">Habit Calendar</p>
        <p className="max-w-xs text-sm text-white/50">
          Open a habit stack and tap its calendar icon to see its day-by-day score history here.
        </p>
      </div>
    );
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  return (
    <div className="mx-auto max-w-xl pb-8">
      <h1 className="mb-1 text-[20px] font-bold text-white">{title}</h1>

      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-full bg-white/5 p-2 text-white">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-[15px] font-semibold text-white">
          {MONTHS[month]} {year}
          {loadingCount > 0 ? <span className="ml-2 text-[11px] text-white/40">loading…</span> : null}
        </span>
        <button onClick={nextMonth} className="rounded-full bg-white/5 p-2 text-white">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}${i}`} className="pb-1 text-[11px] font-bold text-white/40">
            {d}
          </span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const entry = entryByDay[day];
          const color = entry ? COLOR_MAP[entry.scoreInfo?.color?.toLowerCase() ?? "gray"] : undefined;
          return (
            <div
              key={day}
              className="flex aspect-square items-center justify-center rounded-lg text-[13px] font-semibold"
              style={{
                backgroundColor: color ? `${color}33` : "rgba(255,255,255,0.04)",
                color: color ?? "rgba(242,242,242,0.5)",
                border: color ? `1px solid ${color}` : "1px solid transparent",
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Score counts legend */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-white/[0.03] px-3 py-2">
        {LEGEND.map((tier) => (
          <span key={tier.code} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tier.color }} />
            <span className="text-[9px] font-semibold tracking-wide text-[#9CA3AF]">
              {tier.code} {counts[tier.code] ? `(${counts[tier.code]})` : ""}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HabitCalendarPage() {
  return (
    <Suspense fallback={null}>
      <CalendarContent />
    </Suspense>
  );
}
