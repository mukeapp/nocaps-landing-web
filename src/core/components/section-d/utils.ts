import { HabitComponent, HabitLinkComponent, HabitLinkItemComponent } from '@/core/models/section-b/habit';
import { ScoreTier } from './types';

export const SCORE_TIERS: ScoreTier[] = [
  { code: 'UNKNOWN',   label: 'Unknown',   minPct: 0,  maxPct: 0,   rgb: 'rgb(128,128,128)', hex: '#808080' },
  { code: 'BAD',       label: 'Bad',       minPct: 1,  maxPct: 50,  rgb: 'rgb(255,0,0)',     hex: '#ff0000' },
  { code: 'POOR',      label: 'Poor',      minPct: 50, maxPct: 60,  rgb: 'rgb(128,0,128)',   hex: '#800080' },
  { code: 'AVERAGE',   label: 'Average',   minPct: 60, maxPct: 80,  rgb: 'rgb(255,165,0)',   hex: '#ffa500' },
  { code: 'GOOD',      label: 'Good',      minPct: 80, maxPct: 90,  rgb: 'rgb(0,128,0)',     hex: '#008000' },
  { code: 'EXCELLENT', label: 'Excellent', minPct: 90, maxPct: 100, rgb: 'rgb(255,215,0)',   hex: '#ffd700' },
];

/** score on HabitLinkItemComponent is 0.0–1.0, convert to 0–100 */
export const toPercent = (score?: number): number =>
  score != null ? Math.round(score * 100) : 0;

export const getScoreTier = (scorePct: number): ScoreTier => {
  if (!scorePct || scorePct === 0) return SCORE_TIERS[0];
  return (
    SCORE_TIERS.slice(1).find(t => scorePct >= t.minPct && scorePct <= t.maxPct)
    ?? SCORE_TIERS[0]
  );
};

// ─── HabitLinkComponent helpers ───────────────────────────────────────────────

export const getLinkScore = (link: HabitLinkComponent): number =>
  toPercent(link.scoreComponent?.score ?? link.comparisonHabitLink?.score);

export const getLinkItems = (link: HabitLinkComponent): HabitLinkItemComponent[] =>
  link.habitLinkItemComponentsData
  ?? link.comparisonHabitLink?.swapItem?.habitLinkItemComponentsData
  ?? [];

export const getLinkCost = (link: HabitLinkComponent): number =>
  link.scoreComponent?.cost
  ?? getLinkItems(link).reduce((sum, item) => sum + (item.cost ?? 0), 0);

export const getLinkScoreCode = (link: HabitLinkComponent): string =>
  link.scoreComponent?.scoreInfo?.code
  ?? link.comparisonHabitLink?.scoreCode
  ?? 'UNKNOWN';

// ─── HabitComponent helpers ───────────────────────────────────────────────────

export const getHabitScore = (habit: HabitComponent): number =>{
  let score = habit.scoreComponent?.score ?? 0;
  // console.log("getHabitScore", { habitName: habit.name, score });
  if (score > 1 ) {
    score = score / 100;
  }

  return toPercent(score ?? 0);

}


export const getHabitCost = (habit: HabitComponent): number =>
  habit.scoreComponent?.cost ?? 0;

export const getHabitScoreCode = (habit: HabitComponent): string =>
  habit.scoreComponent?.scoreInfo?.code ?? 'UNKNOWN';

export const getHabitLinks = (habit: HabitComponent): HabitLinkComponent[] =>
  habit.habitLinkData ?? [];
