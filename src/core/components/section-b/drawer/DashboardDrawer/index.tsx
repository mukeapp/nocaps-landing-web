"use client";

import React from "react";
import { useDispatch } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDrawerOpen, useNavigation, useRoute } from "@/shims/react-navigation";
import { UserDataAction } from "@/core/redux/user-data";
import { setUserRevenuCatLogOut } from "@/core/redux/user-revenue-cat";
import { setWebBetaAccessLogOut } from "@/core/redux/web-beta-access";
import { auth } from "@/core/firebase";
import { Images } from "@/core/constants/Images";
import {
  Home,
  Crown,
  User,
  Store,
  FileText,
  Users,
  Layers,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string; // external route (e.g. "/" for marketing home)
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", route: "nocap-drawer", icon: Home, href: "/" },
  { label: "Subscribe", route: "no-cap-subscription", icon: Crown },
  { label: "My Profile", route: "profile", icon: User },
  { label: "Market", route: "habit-market", icon: Store },
  { label: "My Posts", route: "no-cap-post-home", icon: FileText },
  { label: "Friends & Habits", route: "my-friends-and-habits", icon: Users },
  { label: "My Habit Stacks", route: "nocap-drawer", icon: Layers },
  { label: "My Habit Library", route: "my-habit-library", icon: BookOpen },
  { label: "Settings", route: "settings", icon: Settings },
];

export default function DashboardDrawer() {
  const open = useDrawerOpen();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const currentRoute = route.name;

  const handleNavigate = (item: NavItem) => {
    navigation.closeDrawer();
    if (item.href) {
      window.location.href = item.href;
      return;
    }
    navigation.navigate(item.route);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch {
      // ignore
    }
    dispatch(UserDataAction.setTempData({}));
    dispatch(UserDataAction.setUserData({}));
    dispatch(UserDataAction.setUserAuth(""));
    dispatch(setUserRevenuCatLogOut());
    dispatch(setWebBetaAccessLogOut());
    navigation.closeDrawer();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) navigation.closeDrawer();
      }}
    >
      <SheetContent
        side="left"
        className="w-[300px] max-w-[85vw] border-r border-border bg-background/95 backdrop-blur-xl p-0"
      >
        {/* Header with logo */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-card grid place-items-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={(Images.logo as any)?.default ?? Images.logo}
                  alt="NoCaps"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <SheetTitle className="text-lg font-semibold text-foreground">
                NoCaps
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 px-3 py-4 overflow-y-auto flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              !item.href &&
              (currentRoute === item.route ||
                (item.route === "nocap-drawer" &&
                  currentRoute === "my-habit-stacks"));
            const Icon = item.icon;
            return (
              <button
                key={`${item.label}-${item.route}`}
                onClick={() => handleNavigate(item)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer: logout */}
        <div className="border-t border-border/60 px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span>Logout</span>
          </button>
          <p className="px-3 pt-3 text-[11px] text-muted-foreground/60">
            NoCaps v1.0.0
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}