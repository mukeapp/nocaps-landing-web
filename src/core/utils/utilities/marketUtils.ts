import { Action, HabitCategory } from "@/core/models/section-b";

const habitMarketActions: Action[] = [
  {
    id: 1,
    name: "In Progress",
  },
  {
    id: 2,
    name: "Pending",
  },
  {
    id: 3,
    name: "Ready to Publish",
  },
  {
    id: 4,
    name: "Market Published",
  }
];


export const getHabitMarketActions = (): Action[] => {
  return habitMarketActions;
}