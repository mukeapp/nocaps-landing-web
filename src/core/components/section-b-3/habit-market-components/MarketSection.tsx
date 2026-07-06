import HabitLinkItemsRow from "@/core/components/section-b-1/habit-library/HabitLinkItemsRow";
import HabitLinksRow from "@/core/components/section-b-1/habit-library/HabitLinksRow";
import HabitsRow from "@/core/components/section-b-1/habit-library/HabitsRow";
import HabitStacksRow from "@/core/components/section-b-1/habit-library/HabitStacksRow";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import {InfiniteFetching} from "@/core/models/section-a";
import { HabitStackComponent } from "@/core/models/section-b/habit";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import {HabitLinkItemsRowInfiniteLoader, HabitLinksRowInfiniteLoader, HabitsRowInfiniteLoader, HabitStacksRowInfiniteLoader} from "../../section-b-1";



interface MarketSectionProps {
  title: string;
  stacks: HabitStackComponent[];
  onSeeAll: () => void;
  // Props required by HabitStacksRow
  sectorId: string;
  onNeedFetch?: (sectorId: string) => void;
  onOpenLinkItem?: (item: any) => void;
  showCopyButton?: boolean;
  onCopyPress?: (id: string, parentId: string, dataType: string) => void;
  habitCategoryId?: number;
  hideCalendar?: boolean;
  showMarketActionButtons?: boolean;
  selectedMarketActionId?: number;
  onMarketSend?: (
    habitStackId: string,
    oldOwnerUserId: string,
    action: string,
    marketActionId: number
  ) => void;
  onMarketDelete?: (
    habitStackId: string,
    oldOwnerUserId: string,
    action: string,
    marketActionId: number
  ) => void;
  hideSeeAllButton?: boolean;
  isVerticalScroll?: boolean;
  isInfiniteScroll?: boolean;
  stacksFetcher?: InfiniteFetching;
}

const MarketSection: React.FC<MarketSectionProps> = ({
  title,
  stacks,
  onSeeAll,
  sectorId,
  onNeedFetch = () => {
    console.log("Need to fetch stacks for sector");
  },
  onOpenLinkItem = () => {
    console.log("Open link item");
  },
  showCopyButton = false,
  onCopyPress = (id: string, parentId: string, dataType: string) => {
    console.log("Copy pressed");
  },
  habitCategoryId,
  hideCalendar = false,
  showMarketActionButtons = false,
  selectedMarketActionId = 0,
  onMarketSend = (
    habitStackId: string,
    oldOwnerUserId: string,
    action: string,
    marketActionId: number
  ) => {
    console.log("Send to pending:", habitStackId, oldOwnerUserId, action, marketActionId);
  },
  onMarketDelete = (
    habitStackId: string,
    oldOwnerUserId: string,
    action: string,
    marketActionId: number
  ) => {
    console.log("Delete:", habitStackId, oldOwnerUserId, action, marketActionId);
  },
  hideSeeAllButton = false,
  isVerticalScroll = false,
  isInfiniteScroll = false,
  stacksFetcher,
}) => {
  return (
    <View style={[styles.container, isVerticalScroll && { flex: 1 }]}>
      {!hideSeeAllButton && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
      )}

     {/* <Text style={{color: 'red'}}>habitCateoryId : {habitCategoryId}</Text> */}

      {habitCategoryId == 1 && !isInfiniteScroll && (
        <HabitStacksRow
          showCopyButton={showCopyButton}
          showCopyButtonText="Copy HabitStack"
          onCopyPress={onCopyPress}
          mustReloadUser={true}
          userdata={undefined}
          habitCategoryId={habitCategoryId}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={onNeedFetch}
          onOpenLinkItem={onOpenLinkItem}
          hideCalendar={hideCalendar}
          showMarketActionButtons={showMarketActionButtons}
          selectedMarketActionId={selectedMarketActionId}
          onMarketSend={onMarketSend}
          onMarketDelete={onMarketDelete}
          isVerticalScroll={isVerticalScroll}
          stacksFetcher={stacksFetcher}
        />
      )}

      {habitCategoryId == 1 && isInfiniteScroll && (
        <HabitStacksRowInfiniteLoader
          showCopyButton={showCopyButton}
          showCopyButtonText="Copy HabitStack"
          onCopyPress={onCopyPress}
          mustReloadUser={true}
          userdata={undefined}
          habitCategoryId={habitCategoryId}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={onNeedFetch}
          onOpenLinkItem={onOpenLinkItem}
          hideCalendar={hideCalendar}
          showMarketActionButtons={showMarketActionButtons}
          selectedMarketActionId={selectedMarketActionId}
          onMarketSend={onMarketSend}
          onMarketDelete={onMarketDelete}
          isVerticalScroll={isVerticalScroll}
          stacksFetcher={stacksFetcher}
        />
      )}

      {habitCategoryId == 2  && !isInfiniteScroll && (
        <HabitsRow
          showCopyButton={showCopyButton}
          showCopyButtonText="Copy Habit"
          onCopyPress={onCopyPress}
          userdata={null}
          habitCategoryId={habitCategoryId}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={onNeedFetch}
          onOpenLinkItem={onOpenLinkItem}
          showHabitBanner={true}
          mustReloadUser={true}
          hideCalendar={hideCalendar}
          selectedMarketActionId={selectedMarketActionId}
        />
      )}

      {habitCategoryId == 2  && isInfiniteScroll && (
        <HabitsRowInfiniteLoader
          showCopyButton={showCopyButton}
          showCopyButtonText="Copy Habit"
          onCopyPress={onCopyPress}
          userdata={null}
          habitCategoryId={habitCategoryId}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={onNeedFetch}
          onOpenLinkItem={onOpenLinkItem}
          showHabitBanner={true}
          mustReloadUser={true}
          hideCalendar={hideCalendar}
          selectedMarketActionId={selectedMarketActionId}
          isVerticalScroll={isVerticalScroll}
          stacksFetcher={stacksFetcher}
        />
      )}

      {habitCategoryId == 3 && !isInfiniteScroll && (
        <HabitLinksRow
          showCopyButton={showCopyButton}
          showCopyButtonText="Copy HabitLink"
          onCopyPress={onCopyPress}
          showHabitLinkBanner={true}
          userdata={null}
          habitCategoryId={habitCategoryId}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={onNeedFetch}
          onOpenLinkItem={onOpenLinkItem}
          hideCalendar={hideCalendar}
          selectedMarketActionId={selectedMarketActionId}
          mustReloadUser={true}
        />
      )}

      {habitCategoryId == 3 && isInfiniteScroll && (
        <HabitLinksRowInfiniteLoader
          showCopyButton={showCopyButton}
          showCopyButtonText="Copy HabitLink"
          onCopyPress={onCopyPress}
          showHabitLinkBanner={true}
          userdata={null}
          habitCategoryId={habitCategoryId}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={onNeedFetch}
          onOpenLinkItem={onOpenLinkItem}
          hideCalendar={hideCalendar}
          selectedMarketActionId={selectedMarketActionId}
          mustReloadUser={true}
          isVerticalScroll={isVerticalScroll}
          stacksFetcher={stacksFetcher}
        />
      )}

      {habitCategoryId == 4 && !isInfiniteScroll && (
        <HabitLinkItemsRow
          showCopyButton={false}
          showCopyButtonText="None"
          showCopyButtonForItem={showCopyButton}
          showCopyButtonTextForItem="Copy"
          onCopyPress={onCopyPress}
          showHabitLinkBanner={true}
          userdata={null}
          habitCategoryId={habitCategoryId}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={onNeedFetch}
          onOpenLinkItem={onOpenLinkItem}
          showHabitLinkItems={true}
          showHabitLinkNav={false}
          showExpandedButton={true}
          hideCalendar={hideCalendar}
          selectedMarketActionId={selectedMarketActionId}
          mustReloadUser={true}
        />
      )}

      {habitCategoryId == 4 && isInfiniteScroll && (
        <HabitLinkItemsRowInfiniteLoader
          showCopyButton={false}
          showCopyButtonText="None"
          showCopyButtonForItem={showCopyButton}
          showCopyButtonTextForItem="Copy"
          onCopyPress={onCopyPress}
          showHabitLinkBanner={true}
          userdata={null}
          habitCategoryId={habitCategoryId}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={onNeedFetch}
          onOpenLinkItem={onOpenLinkItem}
          showHabitLinkItems={true}
          showHabitLinkNav={false}
          showExpandedButton={true}
          hideCalendar={hideCalendar}
          selectedMarketActionId={selectedMarketActionId}
          mustReloadUser={true}
          isVerticalScroll={isVerticalScroll}
          stacksFetcher={stacksFetcher}
        />
      )}



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(2),
    paddingVertical: hp(1),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(0.5),
    paddingHorizontal: wp(3),
  },
  title: {
    ...MainStyles.text16,
    color: Colors.white,
    fontWeight: "600",
  },
  seeAll: {
    ...MainStyles.text12,
    color: Colors.gray,
    textDecorationLine: "underline",
  },
});

export default MarketSection;
