import {HabitLinkGroup} from "@/core/models/section-b/habit";

export const getGroupTotalCost = (group?: HabitLinkGroup): number => {
  if (!group) return 0;
  // you can also sum over group.items if that's where cost lives for your dataset
  const itemTotal = group.items?.reduce((sum, it) => sum + (it?.cost ?? 0), 0);
  const groupCost = group?.scoreComponent?.cost ?? 0;
  return itemTotal || groupCost || 0;
};
