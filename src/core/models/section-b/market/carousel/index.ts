// types/featuredCarousel.ts

/**
 * Identifies whether a carousel slide is organic in-app content
 * promoting a habit stack, or a paid placement bought by a company.
 */
export type CarouselSlideType = "habitStack" | "sponsored";

/**
 * The billing model an advertiser is charged under for a sponsored slide.
 *
 * - "cpm"      → Cost Per Mille: advertiser pays per 1,000 impressions (views),
 *                regardless of clicks. Best for brand awareness campaigns.
 * - "cpc"      → Cost Per Click: advertiser only pays when a user taps the slide.
 *                Best for performance/conversion-driven campaigns.
 * - "flatRate" → Fixed price for a placement over a set period
 *                (e.g. "$500 to be slide #2 for the month"), regardless of
 *                impressions or clicks.
 *
 * This is a string union (not a plain `string`) so TypeScript rejects typos
 * like "cmp" at compile time and editors can autocomplete the valid values.
 */
export type PricingModel = "cpm" | "cpc" | "flatRate";

/**
 * A single slide in the Featured Carousel.
 *
 * Every slide — organic or sponsored — links back to a habit stack via
 * `habitStackId`. Sponsored-only fields (`sponsor`, `campaign`, `isSponsored`)
 * are optional and only populated when `type === "sponsored"`.
 */
export interface CarouselSlide {
  /** Unique identifier for this slide (e.g. uuid). */
  id: string;

  /** Whether this is organic habit-stack content or a paid sponsored slot. */
  type: CarouselSlideType;

  /** REQUIRED — every slide (organic or sponsored) links to a habit stack. */
  habitStackId: string;

  /** Image shown in the carousel. */
  imageUrl: string;

  /** Optional headline text overlaid on the slide. */
  title?: string;

  /** Optional secondary text overlaid on the slide. */
  subtitle?: string;

  /** Whether to visually render `title`. Defaults to true if omitted. */
  showTitle?: boolean;

  /** Whether to visually render `subtitle`. Defaults to true if omitted. */
  showSubtitle?: boolean;

  /** Display priority in the carousel — lower numbers show first. */
  order: number;

  /** Lets you disable a slide without deleting its record. */
  isActive: boolean;

  /** ISO date string — when this slide should start showing (for scheduled campaigns). */
  startAt?: string;

  /** ISO date string — when this slide should stop showing (for scheduled campaigns). */
  endAt?: string;

  /**
   * Optional destination URL when the slide is tapped.
   * If omitted, default behavior should navigate to `habitStackId`.
   */
  ctaUrl?: string;

  /** Present only when `type === "sponsored"` — who is paying for this slide. */
  sponsor?: {
    companyId: string;
    companyName: string;
    logoUrl?: string;
  };

  /** Present only when `type === "sponsored"` — billing & performance tracking. */
  campaign?: {
    campaignId: string;
    pricingModel: PricingModel;
    budgetTotal?: number;
    budgetSpent?: number;
    impressions?: number;
    clicks?: number;
  };

  /** Disclosure flag — when true, UI should render a "Sponsored" label. */
  isSponsored?: boolean;
}

/**
 * Fallback slides shown if no data is fetched from the backend yet
 * (e.g. while loading, or for local development/testing).
 * All marked as organic "habitStack" slides with placeholder habit stack IDs.
 */
export const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: "default_001",
    type: "habitStack",
    habitStackId: "stack_grocery_basics",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop", // Grocery
    title: "Healthy Grocery Habits",
    subtitle: "Build a smarter shopping routine",
    order: 1,
    isActive: true,
  },
  {
    id: "default_003",
    type: "habitStack",
    habitStackId: "stack_health_check",
    imageUrl:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2670&auto=format&fit=crop", // Health
    title: "Daily Health Check-In",
    subtitle: "5 minutes to track how you feel",
    order: 2,
    isActive: true,
  },
];