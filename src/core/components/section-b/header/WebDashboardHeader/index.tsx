"use client";

import React from "react";
import { Platform } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";

const isWeb = Platform.OS === "web";

type Props = {
  title?: string;
  onOpenDrawer?: () => void;
  onBack?: () => void;
};

/**
 * WebDashboardHeader — a sticky top bar for web dashboard screens.
 * Matches the design language of the my-habit-stacks page header.
 * Left control is a hamburger (opens the drawer) for top-level screens, or a
 * back arrow for pushed screens. On native, renders null (use Header2 instead).
 */
const WebDashboardHeader: React.FC<Props> = ({ title = "", onOpenDrawer, onBack }) => {
  if (!isWeb) return null;

  const showBack = !!onBack && !onOpenDrawer;

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center gap-2.5">
        <button
          onClick={showBack ? onBack : onOpenDrawer}
          className="grid place-items-center h-9 w-9 rounded-lg hover:bg-accent transition-colors"
          aria-label={showBack ? "Go back" : "Open menu"}
        >
          <MaterialCommunityIcons
            name={showBack ? "arrow-left" : "menu"}
            size={22}
            color={Colors.white}
          />
        </button>
        <div className="h-8 w-8 rounded-lg bg-card grid place-items-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={(Images.logo as any)?.default ?? Images.logo}
            alt="NoCaps"
            className="h-5 w-5 object-contain"
          />
        </div>
        <span className="text-base font-semibold text-foreground">NoCaps</span>
      </div>
      {title ? (
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      ) : null}
    </div>
  );
};

export default WebDashboardHeader;
