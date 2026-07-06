import {
  HabitStackComponent,
} from "@/core/models/section-b";

/**
 * Item enriched with parent IDs up the hierarchy chain.
 * Every item always has _habitStackId.
 * Lower-level items additionally carry their ancestor IDs.
 */
export type HabitItemWithParentIds = {
  _habitStackId: string;
  _habitId: string;
  _habitLinkId: string;
  _habitLinkItemId: string;
  [key: string]: any;
};

/**
 * Like getHabitDataByCategory but enriches every flattened item with
 * parent IDs so the caller always has the full chain:
 *
 *   Category 1 (HabitStacks)     → _habitStackId
 *   Category 2 (Habits)          → _habitStackId, _habitId
 *   Category 3 (HabitLinks)      → _habitStackId, _habitId, _habitLinkId
 *   Category 4 (HabitLinkItems)  → _habitStackId, _habitId, _habitLinkId, _habitLinkItemId
 */
export const getHabitDataByCategoryWithParentIds = (
  stacks: HabitStackComponent[],
  habitCategoryId?: number
): HabitItemWithParentIds[] => {
  const items: HabitItemWithParentIds[] = [];

  if (habitCategoryId === 1) {
    stacks.forEach((stack) => {
      const stackId = stack.documentId ?? stack.id ?? "";
      items.push({
        ...stack,
        _habitStackId: stackId,
        _habitId: "",
        _habitLinkId: "",
        _habitLinkItemId: "",
      });
    });
    return items;
  }

  if (habitCategoryId === 2) {
    stacks.forEach((stack) => {
      const stackId = stack.documentId ?? stack.id ?? "";
      (stack.habitData ?? []).forEach((h: any) => {
        const hId = h.documentId ?? h.id ?? "";
        items.push({
          ...h,
          _habitStackId: stackId,
          _habitId: hId,
          _habitLinkId: "",
          _habitLinkItemId: "",
        });
      });
    });
    return items;
  }

  if (habitCategoryId === 3) {
    stacks.forEach((stack) => {
      const stackId = stack.documentId ?? stack.id ?? "";
      (stack.habitData ?? []).forEach((h: any) => {
        const hId = h.documentId ?? h.id ?? "";
        (h.habitLinkData ?? []).forEach((hl: any) => {
          const hlId = hl.documentId ?? hl.id ?? "";
          items.push({
            ...hl,
            _habitStackId: stackId,
            _habitId: hId,
            _habitLinkId: hlId,
            _habitLinkItemId: "",
          });
        });
      });
    });
    return items;
  }

  if (habitCategoryId === 4) {
    stacks.forEach((stack) => {
      const stackId = stack.documentId ?? stack.id ?? "";
      (stack.habitData ?? []).forEach((h: any) => {
        const hId = h.documentId ?? h.id ?? "";
        (h.habitLinkData ?? []).forEach((hl: any) => {
          const hlId = hl.documentId ?? hl.id ?? "";
          const linkItems = hl.habitLinkItemComponentsData ?? hl.items ?? [];
          linkItems.forEach((hli: any) => {
            const hliId = hli.documentId ?? hli.id ?? "";
            items.push({
              ...hli,
              _habitStackId: stackId,
              _habitId: hId,
              _habitLinkId: hlId,
              _habitLinkItemId: hliId,
            });
          });
        });
      });
    });
    return items;
  }

  return items;
};
