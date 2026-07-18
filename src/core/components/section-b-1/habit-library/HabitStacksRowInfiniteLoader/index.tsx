import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";

import { Colors } from "@/core/constants/Colors";
import {
  HabitStackComponent,
  StacksRowProps,
} from "@/core/models/section-b/habit";
import {
  HabitStackCard,
} from "@/core/components/section-b";
import { getHabitDataByCategory } from "@/core/services/section-b";
import { BigBinaryActionButton } from "@/core/components/section-b-3";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

type StackListItem =
  | { type: 'stack'; data: HabitStackComponent }
  | { type: 'ad'; id: string };

const HabitStacksRowInfiniteLoader: React.FC<StacksRowProps> = React.memo(
  ({
    showCopyButton = false,
    showCopyButtonText = "Copy Item",
    onCopyPress = (id: string, parentId: string, dataType: string) =>
      console.log("Copy pressed"),
    mustReloadUser,
    userdata,
    sectorId,
    onNeedFetch,
    onOpenLinkItem,
    hideCalendar = false,
    showMarketActionButtons = false,
    onMarketSend = (habitStackId: string, oldOwnerUserId: string, action: string, marketActionId: number) => {
      console.log("Send to pending:", habitStackId, oldOwnerUserId, action, marketActionId);
    },
    onMarketDelete = (habitStackId: string, oldOwnerUserId: string, action: string, marketActionId: number) => {
      console.log("Delete:", habitStackId, oldOwnerUserId, action, marketActionId);
    },
    selectedMarketActionId = 0,
    isVerticalScroll = false,
    stacksFetcher,
  }) => {

    const listData = useMemo<StackListItem[]>(() => {
      const rawStacks = getHabitDataByCategory(
        stacksFetcher?.data ?? [],
        1
      ) as HabitStackComponent[];

      if (!isVerticalScroll) {
        return rawStacks.map((data) => ({ type: 'stack' as const, data }));
      }

      const result: StackListItem[] = [];
      rawStacks.forEach((stack, i) => {
        result.push({ type: 'stack', data: stack });
        if ((i + 1) % 2 === 0 && i < rawStacks.length - 1) {
          result.push({ type: 'ad', id: `ad-${i}` });
        }
      });
      return result;
    }, [stacksFetcher?.data, isVerticalScroll]);

    const handleEndReached = useCallback(() => {
      if (stacksFetcher && !stacksFetcher.loading && stacksFetcher.hasMore) {
        stacksFetcher.loadNext();
      }
    }, [stacksFetcher]);

    const renderSeparator = useCallback(() => {
      return (
        <View
          style={isVerticalScroll ? styles.separatorVertical : styles.separatorHorizontal}
        />
      );
    }, [isVerticalScroll]);

    const renderEmpty = useCallback(() => {
      if (stacksFetcher && !stacksFetcher.loading) {
        return (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No habit stacks yet.</Text>
          </View>
        );
      }
      return null;
    }, [stacksFetcher]);

    const renderFooter = useCallback(() => {
      if (stacksFetcher && stacksFetcher.loading) {
        return (
          <View style={styles.footer}>
            <ActivityIndicator color={Colors.white} />
          </View>
        );
      }
      return null;
    }, [stacksFetcher]);

    const keyExtractor = useCallback(
      (item: StackListItem, idx: number) =>
        item.type === 'ad'
          ? item.id
          : `${item.data?.id ?? item.data?.documentId ?? idx}`,
      []
    );

    const renderItem = useCallback(({ item }: { item: StackListItem }) => {
      if (item.type === 'ad') {
        return (
          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        );
      }
      return (
        <TouchableOpacity
          style={[
            styles.stackCard,
            isVerticalScroll && styles.stackCardVertical,
          ]}
          onPress={() => console.log("stack tap:", item.data?.id)}
          activeOpacity={0.9}
        >
          {showMarketActionButtons && (
            <BigBinaryActionButton
              onSend={onMarketSend}
              onDelete={onMarketDelete}
              showSend={true}
              showDelete={true}
              data={item.data}
              selectedActionId={selectedMarketActionId}
            />
          )}
          <HabitStackCard
            showCopyButton={showCopyButton}
            showCopyButtonText={showCopyButtonText}
            onCopyPress={onCopyPress}
            key={item.data.documentId ?? item.data.id ?? Math.random()}
            stack={item.data}
            canEdit={false}
            username={userdata?.collectdata?.username}
            onOpenLinkItem={onOpenLinkItem}
            mustReloadUser={mustReloadUser}
            hideCalendar={hideCalendar}
            selectedMarketActionId={selectedMarketActionId}
          />
        </TouchableOpacity>
      );
    }, [
      isVerticalScroll,
      showMarketActionButtons,
      onMarketSend,
      onMarketDelete,
      selectedMarketActionId,
      showCopyButton,
      showCopyButtonText,
      onCopyPress,
      userdata,
      onOpenLinkItem,
      mustReloadUser,
      hideCalendar,
    ]);

    if (!stacksFetcher) {
      return <View style={{ height: hp(1) }} />;
    }

    return (
      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal={!isVerticalScroll}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        numColumns={isVerticalScroll ? 1 : undefined}
        key={isVerticalScroll ? 'vertical' : 'horizontal'}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
      />
    );
  }
);

export default HabitStacksRowInfiniteLoader;

const styles = StyleSheet.create({
  // content
  content: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(0.5),
  },

  // stacks card
  stackCard: {
    width: wp(140),
    minHeight: hp(10),
    marginRight: wp(3),
    borderRadius: wp(3),
    backgroundColor: Colors.text_background,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
  },
  stackCardVertical: {
    width: "100%",
    marginRight: 0,
    marginBottom: 0,
  },

  // separators
  separatorHorizontal: {
    width: wp(3),
  },
  separatorVertical: {
    height: hp(1.5),
  },

  // empty state
  empty: {
    height: hp(20),
    borderRadius: wp(3),
    backgroundColor: Colors.text_background,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: Colors.gray || "#A9A9A9",
    fontSize: wp(3.6),
    fontFamily: "poppins_regular",
  },

  // footer (loading indicator)
  footer: {
    paddingTop: hp(1),
  },
});