import { IHabitCalendarCalendarType } from "@/core/models/section-b";
import { ICalendarDate, ICalendarYMD } from "@/core/models/section-b/calendar";
import { getDaysInMonth } from "@/core/utils/utilities/calendar";

/**
 * Generate calendar dates based on calendar type (Weekly or Monthly)
 * @param calendarType - Type of calendar view (Weekly or Monthly)
 * @param selectedYear - Selected year
 * @param selectedMonth - Selected month (1-12)
 * @param selectedWeek - Array of days for weekly view (optional)
 * @returns Calendar date object with all dates in the dates array
 */
export const getHabitCalendarCalculatedDates = (
  calendarType: IHabitCalendarCalendarType,
  selectedYear: number,
  selectedMonth: number, // 1-12
  selectedWeek: number[] | null
): ICalendarDate => {
  // Initialize empty dates array
  const dates: ICalendarYMD[] = [];

  // Validate required parameters
  if (!selectedYear || !selectedMonth) {
    return { dates };
  }

  // Validate month range (1-12)
  if (selectedMonth < 1 || selectedMonth > 12) {
    console.error(`Invalid month: ${selectedMonth}. Must be between 1-12.`);
    return { dates };
  }

  // Generate weekly dates
  if (calendarType === "Weekly") {
    if (!selectedWeek || !Array.isArray(selectedWeek) || selectedWeek.length === 0) {
      return { dates };
    }

    selectedWeek.forEach((day) => {
      dates.push({
        year: selectedYear,
        month: selectedMonth,
        day,
      });
    });

    return { dates };
  }

  // Generate monthly dates
  if (calendarType === "Monthly") {
    // Convert to 0-indexed for getDaysInMonth
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth - 1);

    for (let day = 1; day <= daysInMonth; day++) {
      dates.push({
        year: selectedYear,
        month: selectedMonth,
        day,
      });
    }

    return { dates };
  }

  // Unknown calendar type
  console.warn(`Unknown calendar type: ${calendarType}`);
  return { dates };
};