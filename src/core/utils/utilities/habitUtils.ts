import {
  HabitCategory,
  HabitComponent,
  HabitLinkComponent,
  HabitStackComponent,
} from "@/core/models/section-b";

const _habitCategories = [
  { id: 1, name: "HabitStacks" },
  { id: 2, name: "Habits" },
  { id: 3, name: "HabitLinks" },
  { id: 4, name: "HabitLinkItems" },
];

export const getHabitCategories = (
  screen: string | undefined,
): HabitCategory[] => {
  switch (screen) {
    case "my-habit-stacks":
      //console.log("getHabitCategories my-habit-stacks case");
      return [_habitCategories[0]];
    case "add_edit_habitstack":
      //console.log("getHabitCategories add_edit_habitstack case");
      return [_habitCategories[1]];
    case "add_edit_habit":
      //console.log("getHabitCategories add_edit_habit case");
      return [_habitCategories[2]];
    case "add_edit_habitlinkitem":
      //console.log("getHabitCategories add_edit_habitlinkitem case");
      return [_habitCategories[3]];
    case "habit-market-manager":
      //console.log("getHabitCategories my-habit-stacks case");
      return [_habitCategories[0]];
    default:
      //console.log("getHabitCategories default case");
      return _habitCategories;
  }
};

export const isHabitLinkAIScored = (
  habitLink?: HabitLinkComponent,
): boolean => {
  const items = habitLink?.habitLinkItemComponentsData;
  if (!items || items.length === 0) return false;
  return items.every((item) => item.aiScored === true);
};

export const isHabitAIScored = (habit?: HabitComponent): boolean => {
  const links = habit?.habitLinkData;
  if (!links || links.length === 0) return false;
  return links.every((link) => isHabitLinkAIScored(link));
};

export const isHabitStackAIScored = (stack?: HabitStackComponent): boolean => {
  const habits = stack?.habitData;
  if (!habits || habits.length === 0) return false;
  return habits.every((habit) => isHabitAIScored(habit));
};

export const countItemsForHabit = (habit?: HabitComponent): number => {
  const links = habit?.habitLinkData;
  if (!links || links.length === 0) return 0;
  return links.reduce(
    (total, link) => total + (link?.habitLinkItemComponentsData?.length ?? 0),
    0,
  );
};

export const countItemsForHabitStack = (
  stack?: HabitStackComponent,
): number => {
  const habits = stack?.habitData;
  if (!habits || habits.length === 0) return 0;
  return habits.reduce(
    (total, habit) => total + countItemsForHabit(habit),
    0,
  );
};

export const canShowCopyButton = (originScreen?: string): boolean => {
  switch (originScreen) {
    case "my-habit-stacks":
    case "add_edit_habitstack":
    case "add_edit_habit":
    case "add_edit_habitlinkitem":
      return true;
    default:
      return false;
  }
};
