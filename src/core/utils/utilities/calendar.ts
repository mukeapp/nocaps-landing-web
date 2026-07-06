export const getWeeksInMonth = (year: number, month: number): number[][] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const weeks: number[][] = [];
  let currentWeek: number[] = [];

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    currentWeek.push(day);

    if (date.getDay() === 6 || day === lastDay.getDate()) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  }

  return weeks;
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};
