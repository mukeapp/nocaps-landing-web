import {InfiniteFetching} from "../../section-a";

export interface ScoreInfo {
  documentId?: string; // Unique identifier for the document
  id?: string;         // Optional business-level ID
  range?: string;      // e.g., "0%" or "90-100%"
  color?: string;      // e.g., "GRAY", "GOLD"
  rgb?: string;        // e.g., "rgb(128,128,128)"
  code?: string;       // e.g., "UNKNOW", "EXCELENT"
  label?: string;      // e.g., "UNKNOW", "EXCELENT"
  createdAt?: Date;    // When the record was created
  updatedAt?: Date;    // Last update timestamp
}

export type StacksRowProps = {
  showHabitLinkBanner?: boolean;
  showHabitBanner?: boolean;
  showCopyButton?: boolean;
  showCopyButtonText?: string;
  showCopyButtonForItem?: boolean;
  showCopyButtonTextForItem?: string;
  onCopyPress?: (id:string, parentId:string, dataType:string) => void;
  mustReloadUser?: boolean;
  habitCategoryId?: number; // optional, for future use
  userdata: any;
  sectorId: string;
  stacks: any[] | undefined;
  onNeedFetch: (sectorId?: string) => void;
  onOpenLinkItem?: (link: any) => void;
  costSymbol?: string;
  showHabitLinkItems?: boolean;
  showHabitLinkNav?: boolean;
  showExpandedButton?: boolean;
  hideCalendar?: boolean;
  showMarketActionButtons?: boolean;
  onMarketSend?: (habitStackId: string, oldOwnerUserId: string, action: string) => void;
  onMarketDelete?: (habitStackId: string, oldOwnerUserId: string, action: string) => void;
  selectedMarketActionId?: number;
  isVerticalScroll?: boolean;
  stacksFetcher?: InfiniteFetching;
  filterByHabitId?: boolean; // optional habitId to filter by (for category 2)
  filterByHabitLinkId?: boolean; // optional habitLinkId to filter by (for category 3)
  filterByHabitLinkItemId?: boolean; // optional habitLinkItemId to filter by (for category 4)
  postHabitId?: string; // optional habitId from the post for filtering
  postHabitLinkId?: string; // optional habitLinkId from the post for filtering
  postHabitLinkItemId?: string; // optional habitLinkItemId from the post for filtering
};

export interface ScoreComponent {
  documentId?: string;
  id?: string;
  userId?: string;
  habitStackId?: string;
  habitId?: string;
  habitLinkId?: string;
  habitLinkItemId?: string;
  scoreInfoId?: string;
  score?: number;
  cost?: number;
  scoreInfo?: ScoreInfo;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface Score {
  documentId?: string;
  id?: string;
  userId?: string;
  habitStackId?: string;
  habitId?: string;
  habitLinkId?: string;
  habitLinkItemId?: string;
  scoreInfoId?: string;
  score?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HabitLinkItemLikes {
  documentId?: string;      // Unique identifier for the document
  id?: string;              // Unique identifier for the Like
  userId?: string;          // Unique identifier for the user
  habitLinkItemId?: string; // Unique identifier for the HabitLinkItem
  isLike?: boolean;
  emotionId?: string;       // Unique identifier for the emotion
  createdAt?: Date;         // When the Like was created
  updatedAt?: Date;         // Last update timestamp
}

// export type HabitLinkItem = {
//   documentId: string;
//   name: string;
//   cost?: number;
//   scoreObject?: { scoreInfo?: { color?: string } };
// };

export interface HabitLinkItemComponent {
  documentId?: string;               // Unique identifier for the document
  id: string;                       // Unique identifier for the component
  userId?: string;                   // User ID associated with the component
  habitLinkId: string;              // Parent HabitLink ID
  habitLinkItemConstantId?: string;  // HabitLinkItemConstant ID
  originId: string;                 // Original item ID
  icon?: string;                     // Icon key or URL
  iconLibrary?: string;                 // Icon library (e.g., "FontAwesome")

  isConstant?: boolean;              // Is a constant item
  isActive?: boolean;                // Is currently active
  yearActivated: number;            // Activation year
  monthActivated: number;           // Activation month
  dayActivated: number;             // Activation day
  canUpdate?: boolean;               // Can be updated

  name?: string;                     // Item name
  companyName?: string;              // Company name
  location?: string;                 // Location
  price?: number;                    // Price
  quantity?: number;                 // Quantity
  description?: string;              // Description
  itemUrl?: string;                  // Product URL
  imageUrl?: string;                 // Image URL
  videoUrl?: string;                 // Video URL

  score?: number;                    // Numeric score
  scoreCode?: string;                // Score code (e.g., EXCELLENT)
  cost?: number;
  aiScored?: boolean;                // Whether the item was scored by AI
  aiScoredDescription?: string;       // Description of AI scoring results

  scoreObject?: ScoreComponent;                // <-- typed as Score (required, matches class)
  habitLinkItemLikes?: HabitLinkItemLikes[]; // Associated likes
  comparisonHabitLinkItem?: ComparisonHabitLinkItem;

  noteText?: string; // Note text associated with the HabitLinkItem
  noteImageUrl?: string; // URL of the note image associated with the HabitLinkItem
  noteVideoUrl?: string; // URL of the note video associated with the HabitLinkItem

  createdAt?: Date;                  // Created timestamp
  updatedAt?: Date;                  // Updated timestamp
}

// If these exist elsewhere, import their types:
// import type { ScoreComponent } from "./score.types";
// import type { HabitLinkItemComponent } from "./habit-link-item.types";

export interface HabitLinkLikes {
  documentId?: string;     // Unique identifier for the document
  id?: string;             // Unique identifier for the Like
  userId?: string;         // User who liked
  habitLinkId?: string;    // Related HabitLink ID
  isLike?: boolean;        // Like flag
  emotionId?: string;      // Related emotion ID
  createdAt?: Date;        // Creation timestamp
  updatedAt?: Date;        // Last update timestamp
}

/** One-to-one item comparison between currentItem and swapItem by array index.
 *  currentItem.habitLinkItemComponentsData[i] is compared against
 *  swapItem.habitLinkItemComponentsData[i].
 */
export interface ComparisonHabitLink {
  currentItem: HabitLinkComponent;                    // The HabitLink being replaced
  swapItem: HabitLinkComponent;                       // The candidate replacement

  /** Index-matched item comparisons: ComparisonHabitLinkItems[i] compares
   *  currentItem.habitLinkItemComponentsData[i] vs swapItem.habitLinkItemComponentsData[i] */
  comparisonHabitLinkItems?: ComparisonHabitLinkItem[]; // 1-vs-1 for each item pair

  score: number;                                      // Comparison score (0–1), e.g. 0.85
  scoreCode: string;                                  // e.g. "GOOD", "EXCELLENT"
  save: number;                                       // Cost difference (positive = savings)
}

export interface ComparisonHabitLinkItem {
  currentItem?: HabitLinkItemComponent;   // The item being replaced
  swapItem?: HabitLinkItemComponent;      // The candidate replacement
  score: number;                         // Comparison score (0–1)
  scoreCode?: string;                     // e.g. "GOOD", "EXCELLENT"
  save: number;                          // Cost difference (positive = savings)
}

export interface HabitLinkComponent {
  documentId?: string;                     // Unique identifier for the document
  id?: string;                             // Unique identifier for the HabitLinkComponent
  userId?: string;                         // Owner/User ID
  habitId?: string;                        // Parent Habit ID
  name?: string;                           // Habit link name
  bannerImage?: string;                    // Banner image URL
  bannerVideos?: string;                   // Banner video URL
  icon?: string;                           // Icon key or URL
  iconColor?: string;                      // Icon color
  company?: string;                        // Company name
  location?: string;                       // Location text
  description?: string;                    // Description
  unit?: string;                           // Unit of measure

  scoreComponent?: ScoreComponent;
  scoreColor?: string;                      // Scoring color
  habitLinkLikes?: HabitLinkLikes[];        // Likes on this link
  habitLinkItemComponentsData?: HabitLinkItemComponent[]; // Child items
  items?: HabitLinkItemComponent[];         // Alias for child items (deprecated)

  comparisonHabitLink?: ComparisonHabitLink; // Comparison data vs a swap candidate

  createdAt?: Date;                        // Creation timestamp
  updatedAt?: Date;                        // Last update timestamp
}

export type HabitLinkGroup = {
  documentId: string;
  name: string;
  scoreComponent?: { cost?: number };
  items: HabitLinkItemComponent[];
  scoreColor?: string;
};

export interface Day {
  documentId?: string; // Unique identifier for the document
  id?: string;
  label?: string;      // e.g., "Mon"
  value?: string;      // e.g., "Mon"
  fontSize?: string;
  fontFamily?: string;
  createdAt?: Date;    // When the record was created
  updatedAt?: Date;    // Last update timestamp
}

export interface HabitDayComponent {
  documentId?: string; // Unique identifier for the document
  id?: string;         // Unique identifier for the HabitDayComponent
  habitId?: string;
  dayId?: string;
  day?: Day;
  createdAt?: Date;    // When the HabitDayComponent was created
  updatedAt?: Date;    // Last update timestamp
}

export class FriendHabit {
  documentId?: string; // Unique identifier for the document
  id?: string; // Unique identifier for the HabitTracker
  habitId?: string;
  userId?: string; // Unique identifier for the user associated with the HabitTracker
  friendUserId?: string;
  createdAt?: Date; // Timestamp for when the HabitTracker was created
  updatedAt?: Date; // Timestamp for the last update to the HabitTracker
}

export class FriendHabitStack {
  documentId?: string; // Unique identifier for the document
  id?: string; // Unique identifier for the HabitTracker
  habitStackId?: string; // Unique identifier for the
  userId?: string; // Unique identifier for the user associated with the HabitTracker
  friendUserId?: string;
  createdAt?: Date; // Timestamp for when the HabitTracker was created
  updatedAt?: Date; // Timestamp for the last update to the HabitTracker
}

export interface RateInfo {
  documentId?: string;  // Unique identifier for the document
  id?: string;          // Optional business-level ID
  range?: string;       // e.g., "0%" or "90-100%"
  color?: string;       // e.g., "GRAY", "GOLD"
  rgb?: string;         // e.g., "rgb(128,128,128)"
  code?: string;        // e.g., "UNKNOW", "EXCELENT"
  label?: string;       // e.g., "UNKNOW", "EXCELENT"
  createdAt?: Date;     // When the record was created
  updatedAt?: Date;     // Last update timestamp
}

export interface HabitStackRating {
  documentId?: string;  // Unique identifier for the document
  id?: string;          // Unique identifier for the Rating
  userId?: string;
  habitStackId?: string;
  rating?: number;      // Rating value
  comment?: string;     // Comment for the rating
  createdAt?: Date;     // Created timestamp
  updatedAt?: Date;     // Updated timestamp
}

export interface HabitRating {
  documentId?: string;  // Unique identifier for the document
  id?: string;          // Unique identifier for the Rating
  userId?: string;
  habitId?: string;
  rating?: number;      // Rating value
  comment?: string;     // Comment for the rating
  createdAt?: Date;     // Created timestamp
  updatedAt?: Date;     // Updated timestamp
}

export interface RateScoreComponent {
  documentId?: string;
  id?: string;
  userId?: string;
  habitStackId?: string;
  habitId?: string;
  habitLinkId?: string;
  habitLinkItemId?: string;
  rateInfoId?: string;
  rateScore?: number;

  habitRatings: HabitRating[];            // required
  habitStackRatings: HabitStackRating[];  // required

  rateInfo?: RateInfo;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface HabitLikes {
  documentId?: string;  // Unique identifier for the document
  id?: string;          // Unique identifier for the Like
  userId?: string;
  habitId?: string;
  isLike?: boolean;
  emotionId?: string;
  createdAt?: Date;     // Created timestamp
  updatedAt?: Date;     // Updated timestamp
}

export interface ComparisonHabit {
  currentItem: HabitComponent;                    // The Habit being replaced
  swapItem: HabitComponent;                       // The candidate replacement

  /** Index-matched item comparisons: ComparisonHabitLinkItems[i] compares
   *  currentItem.habitLinkItemComponentsData[i] vs swapItem.habitLinkItemComponentsData[i] */
  comparisonHabitLinks?: ComparisonHabitLink[]; // 1-vs-1 for each item pair

  score: number;                                      // Comparison score (0–1), e.g. 0.85
  scoreCode: string;                                  // e.g. "GOOD", "EXCELLENT"
  save: number;                                       // Cost difference (positive = savings)
}

export interface HabitComponent {
  documentId?: string;    // Unique identifier for the document
  id?: string;            // Unique identifier for the HabitObject
  userId?: string;        // User associated with the Habit
  habitStackId?: string;  // Parent HabitStack ID

  name?: string;          // Title of the habit
  icon?: string;          // Icon of the habit
  iconColor?: string;     // Icon color
  bannerImage?: string;   // Banner image URL
  bannerVideos?: string;  // Banner video URL
  description?: string;   // Description
  interest?: string;      // e.g., Groceries, Finance, Health
  status?: "STOP" | "PLAY" | "PAUSE" | "PREVIOUS" | "NEXT" | string;

  startDate?: Date;
  endDate?: Date;
  startTime?: Date;
  endTime?: Date;
  frequency?: string;

  focus?: string;
  unit?: string;
  priority?: string;

  habitDayComponents?: HabitDayComponent[];     // required
  friendHabits?: FriendHabit[];
  habitLikes?: HabitLikes[];

  rateScoreComponent?: RateScoreComponent;
  scoreComponent?: ScoreComponent;

  habitLinkData?: HabitLinkComponent[];        // child links

  comparisonHabit?: ComparisonHabit; // Comparison data vs a swap candidate

  createdAt?: Date;  // Created timestamp
  updatedAt?: Date;  // Updated timestamp
}

export class HabitStackLikes {
  documentId?: string; // Unique identifier for the document
  id?: string; // Unique identifier for the Like
  userId?: string; // Unique identifier for the user
  habitStackId?: string; // Unique identifier for the HabitStack
  isLike?: boolean; // Whether the user likes the HabitStack
  emotionId?: string; // Unique identifier for the
  createdAt?: Date; // Timestamp for when the Like was created
  updatedAt?: Date; // Timestamp for the last update to the Like
}

export interface HabitStackComponent {
  documentId?: string;
  id: string;
  userId?: string;

  isPublic?: boolean;
  hideFromFriends?: boolean; // Indicates if the HabitStack is hidden from friends

  /** Unique identifier for the sector associated with this HabitStack */
  sectorId?: string;

  name: string;
  searchName: string;
  icon?: string;
  iconColor?: string;
  bannerImage?: string;
  bannerVideos?: string;
  description?: string;

  marketOwnerId?: string; // Unique identifier for the market owner associated with the HabitStack
  isMarketOwned?: boolean; // Indicates if the HabitStack is owned by a market owner
  isDraft?: boolean; // Indicates if the HabitStack is a draft
  marketInProgress?: boolean; // Indicates if the HabitStack is in progress for the market
  marketPending?: boolean; // Indicates if the HabitStack is pending approval in the market
  marketPublished?: boolean; // Indicates if the HabitStack is published in the market

  /** e.g., area of focus/category tag */
  focus?: string;

  /** e.g., unit of measure for metrics */
  unit?: string;

  /** e.g., low/medium/high or custom */
  priority?: string;

  /** current status (e.g., active/paused/etc.) */
  status?: "STOP" | "PLAY" | "PAUSE" | "PREVIOUS" | "NEXT" | string;

  /** number of people associated with this stack */
  personsCount?: number;

  habitStackLikes?: HabitStackLikes[];
  friendHabitStacks?: FriendHabitStack[];

  rateScoreComponent?: RateScoreComponent;
  scoreComponent?: ScoreComponent;

  /** child habits within this stack */
  habitData?: HabitComponent[];

  createdAt?: Date | string;
  updatedAt?: Date | string;
}



export interface Action {
  id: number;
  name: string;
  navigateTo?: () => void;
  screenDestination?: string;
}

export interface HabitCategory {
  id: number;
  name: string;
}

export interface HabitChip {
  id: string;
  name: string;
}

export interface HabitStackChips {
  habitStackId: string;
  habitStackName: string;
  active: boolean;
  color: string;
  habits: HabitChip[];
  hideFromFriends?: boolean;
  isPublic?: boolean;
}

export interface HabitStacksChipsRowProps {
  habitStacksChips?: HabitStackChips[];
  isOwnProfile?: boolean;
}


// interface IHabittCalendarScoreCode {
//   color: 'green' | 'red' | 'orange' | 'gray';
// }

export type IHabitCalendarCalendarType = 'Monthly' | 'Weekly';

export interface IHabitCalendarScoreCode {
  color: string;
  scoreCode: string;
}

export interface IHabitCalendar {
  year: number;
  month: number;
  day: number;
  habitStackId?: string;
  habitId?: string;
  habitLinkId?: string;
  habitLinkItemId?: string;
  habitLinkItemConstantId?: string;
  userId: string;
  scoreInfo: IHabitCalendarScoreCode;
  habitLinkItemDataCount?: number;
}

export interface ScoreCounts {
  numUnknown: number;
  numBad: number;
  numPoor: number;
  numAverage: number;
  numGood: number;
  numExcellent: number;
}

export type PageFetcherHabitStack<T> = (
  sectorId: string,
  page: number,
  pageSize: number,
  userId: string,
) => Promise<{ items: T[]; hasMore: boolean }>;
