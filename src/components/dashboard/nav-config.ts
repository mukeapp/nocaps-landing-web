import { BookOpen, CircleUserRound, Layers, LogOut, Newspaper } from "lucide-react";

// Ported 1:1 from mobile's CustomDrawerContent
// (core/components/section-b/drawer/CustomDrawerContent/index.tsx) — same items,
// same order, same routes. Do not add items that aren't in that file: mobile's
// drawer has no "AI Tools" or "Habit Calendar" entry (those screens exist but
// aren't linked from the drawer), and "Home" and "My Habit Stacks" are two
// separate entries that both point at the same route — that's how mobile is
// built, not a bug to dedupe away.
export type NavItem = {
  label: string;
  href: string;
  icon?: typeof Layers;
  /** Path under public/, mirrors mobile's custom Image-based drawer icons */
  image?: string;
};

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Home", href: "/dashboard/habit-stacks", image: "/assets/images/hm.png" },
  { label: "Subscribe", href: "/dashboard/subscription", image: "/assets/images/taj.png" },
  { label: "My Profile", href: "/dashboard/profile", icon: CircleUserRound },
  { label: "Market", href: "/dashboard/market", image: "/assets/images/box.png" },
  { label: "MyPosts", href: "/dashboard/posts", icon: Newspaper },
  { label: "Friends & Habits", href: "/dashboard/friends", image: "/assets/images/per.png" },
  { label: "My Habit Stacks", href: "/dashboard/habit-stacks", icon: Layers },
  { label: "My Habit Library", href: "/dashboard/habit-library", icon: BookOpen },
  { label: "Settings", href: "/dashboard/settings", image: "/assets/images/set.png" },
];

export const LOGOUT_ICON = LogOut;
