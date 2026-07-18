import React, { useCallback } from "react";
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
  StacksRowProps,
} from "@/core/models/section-b/habit";
import {
  HabitCard,
} from "@/core/components/section-b";
import { getHabitDataByCategory } from "@/core/services/section-b";

const HabitsRowInfiniteLoader: React.FC<StacksRowProps> = React.memo(
  ({
    showCopyButton = false,
    showCopyButtonText = "Copy",
    onCopyPress = (id: string, parentId: string, dataType: string) =>
      console.log("Copy pressed"),
    mustReloadUser = false,
    showHabitBanner = false,
    userdata,
    sectorId,
    onNeedFetch,
    onOpenLinkItem,
    hideCalendar = false,
    selectedMarketActionId = 0,
    stacksFetcher,
    isVerticalScroll = false,
  }) => {
    const handleEndReached = useCallback(() => {
      if (stacksFetcher && !stacksFetcher.loading && stacksFetcher.hasMore) {
        stacksFetcher.loadNext();
      }
    }, [stacksFetcher]);

    const renderSeparator = useCallback(() => {
      return <View style={styles.separatorHorizontal} />;
    }, []);

    const renderEmpty = useCallback(() => {
      if (stacksFetcher && !stacksFetcher.loading) {
        return (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No habits yet.</Text>
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
      (it: any, idx: number) => `${it?.id ?? it?.documentId ?? idx}`,
      []
    );

    const renderItem = useCallback(
      ({ item }: { item: any }) => (
        <TouchableOpacity
          style={styles.stackCard}
          onPress={() => console.log("stack tap:", item?.id)}
          activeOpacity={0.9}
        >
          <HabitCard
            showCopyButton={showCopyButton}
            showCopyButtonText={showCopyButtonText}
            onCopyPress={onCopyPress}
            username={userdata?.collectdata?.username}
            mustReloadUser={mustReloadUser}
            showHabitBanner={showHabitBanner}
            key={item.documentId ?? item.id ?? Math.random()}
            habit={item}
            onOpenItem={onOpenLinkItem}
            hideCalendar={hideCalendar}
            selectedMarketActionId={selectedMarketActionId}
            marketOwnerId={item?.marketOwnerId}
          />
        </TouchableOpacity>
      ),
      [
        showCopyButton,
        showCopyButtonText,
        onCopyPress,
        userdata,
        mustReloadUser,
        showHabitBanner,
        onOpenLinkItem,
        hideCalendar,
        selectedMarketActionId,
      ]
    );

    if (!stacksFetcher) {
      return <View style={{ height: hp(1) }} />;
    }

    return (
      <FlatList
        data={getHabitDataByCategory(stacksFetcher.data, 2)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal={!isVerticalScroll}
        showsHorizontalScrollIndicator={false}
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

export default HabitsRowInfiniteLoader;

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
    borderRadius: wp(3),
    backgroundColor: Colors.text_background,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
  },

  // separator
  separatorHorizontal: {
    width: wp(3),
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