import React, { useCallback, useState } from "react";
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
  HabitLinkCard,
} from "@/core/components/section-b";
import { getHabitDataByCategory } from "@/core/services/section-b";
import { Unit } from "@/core/models/section-b";

const HabitLinkItemsRowInfiniteLoader: React.FC<StacksRowProps> = React.memo(
  ({
    showCopyButton = false,
    showCopyButtonText = "Copy HabitLink",
    showCopyButtonForItem = false,
    showCopyButtonTextForItem = "Copy HabitLinkItem",
    onCopyPress = (id: string, parentId: string, dataType: string) =>
      console.log("Copy pressed"),
    showHabitLinkBanner = false,
    userdata,
    sectorId,
    onNeedFetch,
    onOpenLinkItem,
    costSymbol = "",
    showHabitLinkNav = true,
    showExpandedButton = false,
    hideCalendar = false,
    selectedMarketActionId = 0,
    mustReloadUser = false,
    stacksFetcher,
    isVerticalScroll = false,
  }) => {
    const [costUnit, setCostUnit] = useState<Unit | undefined>(undefined);
    const [finalCostSymbol, setFinalCostSymbol] = useState(costSymbol);

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
            <Text style={styles.emptyText}>No habit link items yet.</Text>
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
          <HabitLinkCard
            showCopyButton={showCopyButton}
            showCopyButtonText={showCopyButtonText}
            showCopyButtonForItem={showCopyButtonForItem}
            showCopyButtonTextForItem={showCopyButtonTextForItem}
            onCopyPress={onCopyPress}
            showHabitLinkBanner={showHabitLinkBanner}
            key={item.documentId ?? item.id ?? Math.random()}
            link={item}
            onOpenItem={onOpenLinkItem}
            costSymbol={finalCostSymbol}
            showHabitLinkNav={showHabitLinkNav}
            showExpandedButton={showExpandedButton}
            hideCalendar={hideCalendar}
            selectedMarketActionId={selectedMarketActionId}
            marketOwnerId={item?.marketOwnerId}
            mustReloadUser={mustReloadUser}
          />
        </TouchableOpacity>
      ),
      [
        showCopyButton,
        showCopyButtonText,
        showCopyButtonForItem,
        showCopyButtonTextForItem,
        onCopyPress,
        showHabitLinkBanner,
        onOpenLinkItem,
        finalCostSymbol,
        showHabitLinkNav,
        showExpandedButton,
        hideCalendar,
        selectedMarketActionId,
        mustReloadUser,
      ]
    );

    if (!stacksFetcher) {
      return <View style={{ height: hp(1) }} />;
    }

    return (
      <FlatList
        data={getHabitDataByCategory(stacksFetcher.data, 3)}
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

export default HabitLinkItemsRowInfiniteLoader;

const styles = StyleSheet.create({
  // content
  content: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(0.5),
  },

  // stacks card
  stackCard: {
    width: wp(90),
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