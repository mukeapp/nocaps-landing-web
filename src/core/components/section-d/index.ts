// ─── Item-level components ────────────────────────────────────────────────────
export { default as ScoreRing } from './ScoreRing';
export { default as SaveLoseTag } from './SaveLoseTag';
export { default as ItemRow } from './ItemRow';
export { default as CurrentItemCard } from './CurrentItemCard';
export { default as ConfirmSheet } from './ConfirmSheet';

// ─── Link-level components ────────────────────────────────────────────────────
export { default as ComparisonItemDiff } from './ComparisonItemDiff';
export { default as ItemPill } from './ItemPill';
export { default as ItemPills } from './ItemPills';
export { default as LinkRow } from './LinkRow';
export { default as CurrentLinkCard } from './CurrentLinkCard';
export { default as LinkConfirmSheet } from './LinkConfirmSheet';
export { default as ComparisonLinkDiff } from './ComparisonLinkDiff';
export { default as HabitLinkPill } from './HabitLinkPill';
export { default as HabitLinkPills } from './HabitLinkPills';
export { default as HabitLinkDetailSheet } from './HabitLinkDetailSheet/HabitLinkDetailSheet';

// ─── Habit-level components ───────────────────────────────────────────────────
export { default as CurrentHabitCard } from './CurrentHabitCard';
export { default as HabitSwapRow } from './HabitSwapRow';
export { default as HabitConfirmSheet } from './HabitConfirmSheet';

// ─── Prop types ───────────────────────────────────────────────────────────────
export type { ScoreRingProps } from './ScoreRing';
export type { SaveLoseTagProps } from './SaveLoseTag';
export type { ItemRowProps } from './ItemRow';
export type { CurrentItemCardProps } from './CurrentItemCard';
export type { ConfirmSheetProps } from './ConfirmSheet';
export type { ComparisonItemDiffProps } from './ComparisonItemDiff';
export type { ItemPillProps } from './ItemPill';
export type { ItemPillsProps } from './ItemPills';
export type { LinkRowProps } from './LinkRow';
export type { CurrentLinkCardProps } from './CurrentLinkCard';
export type { LinkConfirmSheetProps } from './LinkConfirmSheet';
export type { ComparisonLinkDiffProps } from './ComparisonLinkDiff';
export type { HabitLinkPillProps } from './HabitLinkPill';
export type { HabitLinkPillsProps } from './HabitLinkPills';
export type { HabitLinkDetailSheetProps } from './HabitLinkDetailSheet/HabitLinkDetailSheet';
export type { CurrentHabitCardProps } from './CurrentHabitCard';
export type { HabitSwapRowProps } from './HabitSwapRow';
export type { HabitConfirmSheetProps } from './HabitConfirmSheet';

// ─── Shared types ─────────────────────────────────────────────────────────────
export type {
  ScoreInfo,
  ScoreComponent,
  HabitLinkItemLikes,
  ScoreTier,
  ConfirmState,
  LinkConfirmState,
  HabitConfirmState,
} from './types';

// ─── Utilities ────────────────────────────────────────────────────────────────
export {
  SCORE_TIERS,
  toPercent,
  getScoreTier,
  getLinkScore,
  getLinkCost,
  getLinkScoreCode,
  getLinkItems,
  getHabitScore,
  getHabitCost,
  getHabitScoreCode,
  getHabitLinks,
} from './utils';
