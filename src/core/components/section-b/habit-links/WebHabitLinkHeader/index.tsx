"use client";

import React from "react";
import { Platform } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";

const isWeb = Platform.OS === "web";

type Props = {
  title?: string;
  onBack?: () => void;
  canEdit?: boolean;
  canAdd?: boolean;
  onAdd?: () => void;
  gotoUpload?: () => void;
  handleAddHabitLinkItemPress?: () => void;
};

/**
 * WebHabitLinkHeader — a sticky top bar for the habit-links page on web.
 * Combines the sticky backdrop-blur style of WebDashboardHeader with the
 * action buttons (upload, copy, add) from TopBar.
 * On native, renders null (use TopBar instead).
 */
const WebHabitLinkHeader: React.FC<Props> = ({
  title = "",
  onBack,
  canEdit = false,
  canAdd = false,
  onAdd,
  gotoUpload,
  handleAddHabitLinkItemPress,
}) => {
  if (!isWeb) return null;

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-background/80 backdrop-blur-lg border-b border-border">
      {/* Left: back button + logo + title */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onBack}
          className="grid place-items-center h-9 w-9 rounded-lg hover:bg-accent transition-colors"
          aria-label="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.white} />
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

      {/* Center: screen title */}
      {title ? (
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      ) : null}

      {/* Right: action buttons */}
      <div className="flex items-center gap-2">
        {canEdit && gotoUpload && (
          <button
            onClick={gotoUpload}
            className="grid place-items-center h-9 w-9 rounded-lg hover:bg-accent transition-colors"
            aria-label="Upload"
          >
            <AntDesign name="cloud-upload" size={20} color={Colors.white} />
          </button>
        )}
        {canEdit && handleAddHabitLinkItemPress && (
          <button
            onClick={handleAddHabitLinkItemPress}
            disabled={!canAdd}
            className="grid place-items-center h-9 w-9 rounded-lg hover:bg-accent transition-colors disabled:opacity-40"
            aria-label="Copy from library"
          >
            <AntDesign name="copy" size={20} color={Colors.white} />
          </button>
        )}
        {canEdit && onAdd && (
          <button
            onClick={onAdd}
            disabled={!canAdd}
            className="grid place-items-center h-9 w-9 rounded-lg hover:bg-accent transition-colors disabled:opacity-40"
            aria-label="Add"
          >
            <AntDesign name="plus" size={20} color={Colors.white} />
          </button>
        )}
      </div>
    </div>
  );
};

export default WebHabitLinkHeader;