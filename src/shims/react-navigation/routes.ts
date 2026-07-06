// Route names copied verbatim from mobile app/navigation/index.tsx (source of truth).
// Web paths follow the approved migration table.
export const ROUTE_NAME_TO_PATH: Record<string, string> = {
  // Section A (auth)
  introduction: "/login",
  signin: "/login",
  signup: "/signup",
  recoverpassword: "/recover-password",
  termservice: "/term-service",
  interestsector: "/interest-sector",
  onboardlocation: "/onboard-location",
  // Drawer host (drawer home screen is MyHabitStacksScreen, name "nocap-drawer")
  drawertab: "/dashboard/my-habit-stacks",
  "nocap-drawer": "/dashboard/my-habit-stacks",
  // Section B1
  "my-habit-stacks": "/dashboard/my-habit-stacks",
  add_edit_habitstack: "/dashboard/my-habit-stacks-add-edit",
  add_edit_habit: "/dashboard/my-habit-add-edit",
  add_edit_habitlink: "/dashboard/habit-link-add-edit",
  habitlinks: "/dashboard/habit-links",
  add_edit_habitlinkitem: "/dashboard/habit-link-item-add-edit",
  selectfriend: "/dashboard/select-friend",
  // Section B2
  "my-habit-library": "/dashboard/my-habit-library",
  "my-friends-and-habits": "/dashboard/my-friends-and-habits",
  "new-friends": "/dashboard/new-friends",
  "friends-requests": "/dashboard/friends-request",
  "your-friends": "/dashboard/your-friends",
  // Section B3
  "habit-market": "/dashboard/habit-market",
  "habit-link-item-importer": "/dashboard/habit-link-item-importer",
  profile: "/dashboard/profile",
  "profile-edit": "/dashboard/profile-edit",
  "habit-calendar": "/dashboard/habit-calendar",
  "habit-market-manager": "/dashboard/habit-market-manager",
  "no-cap-subscription": "/dashboard/no-cap-subscription",
  "habit-market-see-all": "/dashboard/habit-market-see-all",
  // Section B5
  settings: "/dashboard/setting",
  account: "/dashboard/account",
  // Section C
  "no-cap-post-home": "/dashboard/no-cap-post-home",
  "no-cap-post-create": "/dashboard/no-cap-post-create",
  "search-habitstacks-or-posts": "/dashboard/search-habit-stacks-or-post",
  "post-search-show": "/dashboard/post-search-show",
  "habit-stack-search-show": "/dashboard/habit-stack-search-show",
  // Section D
  "habit-links-ai": "/dashboard/habit-links-ai",
  "habits-ai": "/dashboard/habits-ai",
  "habit-stack-ai": "/dashboard/habit-stacks-ai",
  "habit-link-items-ai": "/dashboard/habit-link-items-ai",
  "swap-habit-link-item": "/dashboard/swap-habit-link-item",
  "swap-habit-link": "/dashboard/swap-habit-link",
  "swap-habit": "/dashboard/swap-habit",
};
