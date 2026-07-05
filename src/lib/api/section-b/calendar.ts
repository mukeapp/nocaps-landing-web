import { API } from "@/lib/api/client";

// Ported from mobile core/api/section-b/section-b-2/calendar/index.ts.
// Each endpoint POSTs { dates: [{year, month, day}, ...] } and returns
// IHabitCalendar entries (day + scoreInfo {color, scoreCode}).

export interface CalendarYMD {
  year: number;
  month: number;
  day: number;
}

export interface HabitCalendarEntry {
  year: number;
  month: number;
  day: number;
  scoreInfo: { color: string; scoreCode: string };
  habitLinkItemDataCount?: number;
}

const CALENDAR_PATHS = {
  "habit-stack": (id: string) =>
    `/habit-stack-calendar-components/habit-stack-calendar/habit-calendar/by-habitStackId/${id}/by-days`,
  habit: (id: string) => `/habit-calendar-components/habit-calendar/habit-calendar/by-habitId/${id}/by-days`,
  "habit-link": (id: string) =>
    `/habit-link-calendar-components/habit-link-calendar/habit-calendar/by-habitLinkId/${id}/by-days`,
  "habit-link-item": (id: string) =>
    `/habit-link-item-calendar-components/habit-link-item-calendar/habit-calendar/by-habitLinkItemId/${id}/by-days`,
} as const;

export type CalendarEntityType = keyof typeof CALENDAR_PATHS;

export const fetchCalendarByDays = async (payload: {
  type: CalendarEntityType;
  id: string;
  dates: CalendarYMD[];
}) => {
  try {
    const response = await API.post(CALENDAR_PATHS[payload.type](payload.id), {
      dates: payload.dates,
    });
    return { data: response.data as HabitCalendarEntry[], status: response.status };
  } catch (err) {
    console.log("fetchCalendarByDays error:", err);
    return { data: null, status: 500 };
  }
};
