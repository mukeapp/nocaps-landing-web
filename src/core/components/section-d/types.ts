// ─── Shared Interfaces ────────────────────────────────────────────────────────

import { HabitComponent, HabitLinkComponent, HabitLinkItemComponent } from "@/core/models/section-b/habit";

export interface ScoreInfo {
  documentId?: string;
  code?: string;
  color?: string;
  label?: string;
  rgb?: string;
  range?: string;
  createdAt?: Date | { _seconds: number; _nanoseconds: number };
  updatedAt?: Date | { _seconds: number; _nanoseconds: number };
}

export interface ScoreComponent {
  documentId?: string;
  id?: string;
  userId?: string;
  habitStackId?: string | null;
  habitId?: string | null;
  habitLinkId?: string | null;
  habitLinkItemId?: string | null;
  scoreInfoId?: string;
  score?: number;
  cost?: number;
  scoreInfo?: ScoreInfo;
  createdAt?: Date | string;
  updatedAt?: Date | { _seconds: number; _nanoseconds: number };
}

export interface HabitLinkItemLikes {
  id: string;
  userId: string;
  habitLinkItemId?: string;
  createdAt?: Date | string;
}

export interface ScoreTier {
  code: string;
  label: string;
  minPct: number;
  maxPct: number;
  rgb: string;
  hex: string;
}

export interface ConfirmState {
  item: HabitLinkItemComponent;
  tier: ScoreTier;
  scorePct: number;
  type: 'confirm' | 'warn';
}

export interface LinkConfirmState {
  link: HabitLinkComponent;
  tier: ScoreTier;
  type: 'confirm' | 'warn';
}

export interface HabitConfirmState {
  habit: HabitComponent;
  tier: ScoreTier;
  type: 'confirm' | 'warn';
}
