import {
  Boxes,
  Calendar,
  Library,
  Settings,
  Sparkles,
  Store,
  UserCircle,
  UsersRound,
  CreditCard,
  Newspaper,
} from "lucide-react";

// Mirrors mobile's CustomDrawerContent menu (core/components/section-b/drawer),
// in the same order. `builtOut: true` items are fully implemented this pass;
// everything else renders the shared ComingSoon placeholder.
export const DASHBOARD_NAV = [
  { label: "My Habit Stacks", href: "/dashboard/habit-stacks", icon: Boxes, builtOut: true },
  { label: "Habit Library", href: "/dashboard/habit-library", icon: Library, builtOut: false },
  { label: "Habit Market", href: "/dashboard/market", icon: Store, builtOut: false },
  { label: "Habit Calendar", href: "/dashboard/calendar", icon: Calendar, builtOut: false },
  { label: "AI Tools", href: "/dashboard/ai", icon: Sparkles, builtOut: false },
  { label: "Friends & Habits", href: "/dashboard/friends", icon: UsersRound, builtOut: false },
  { label: "My Posts", href: "/dashboard/posts", icon: Newspaper, builtOut: false },
  { label: "Subscribe", href: "/dashboard/subscription", icon: CreditCard, builtOut: true },
  { label: "My Profile", href: "/dashboard/profile", icon: UserCircle, builtOut: false },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, builtOut: true },
] as const;
