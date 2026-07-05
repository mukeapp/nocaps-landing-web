// Practical subset of core/models/section-b/habit/index.ts — the fields the
// web UI actually surfaces, not the full mobile interface (which also carries
// likes, comparisons, ratings and social fields out of scope for this pass).

export type HabitStatus = "STOP" | "PLAY" | "PAUSE" | "PREVIOUS" | "NEXT";

export type ScoreCode = "UNKNOWN" | "BAD" | "POOR" | "AVERAGE" | "GOOD" | "EXCELLENT";

export interface ScoreInfo {
  color?: string; // e.g. "GRAY", "GOLD"
  code?: ScoreCode;
  label?: string;
}

export interface ScoreComponent {
  documentId?: string;
  score?: number;
  cost?: number;
  scoreInfo?: ScoreInfo;
}

export interface HabitStackComponent {
  documentId?: string;
  id: string;
  userId?: string;
  name: string;
  searchName?: string;
  description?: string;
  sectorId?: string;
  icon?: string;
  iconColor?: string;
  isPublic?: boolean;
  hideFromFriends?: boolean;
  status?: HabitStatus;
  scoreComponent?: ScoreComponent;
  habitData?: HabitComponent[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface HabitComponent {
  documentId?: string;
  id?: string;
  userId?: string;
  habitStackId?: string;
  name?: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  interest?: string;
  status?: HabitStatus;
  frequency?: string;
  scoreComponent?: ScoreComponent;
  habitLinkData?: HabitLinkComponent[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface HabitLinkComponent {
  documentId?: string;
  id?: string;
  userId?: string;
  habitId?: string;
  name?: string;
  description?: string;
  company?: string;
  location?: string;
  unit?: string;
  icon?: string;
  iconColor?: string;
  scoreComponent?: ScoreComponent;
  habitLinkItemComponentsData?: HabitLinkItemComponent[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface HabitLinkItemComponent {
  documentId?: string;
  id: string;
  habitLinkId: string;
  name?: string;
  companyName?: string;
  location?: string;
  price?: number;
  quantity?: number;
  description?: string;
  itemUrl?: string;
  imageUrl?: string;
  score?: number;
  scoreCode?: string;
  cost?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
