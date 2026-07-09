import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";

import {
    HabitStackCard
} from "@/core/components/section-b";
import { BigBinaryActionButton } from "@/core/components/section-b-3";
import { Colors } from "@/core/constants/Colors";
import {
    StacksRowProps
} from "@/core/models/section-b/habit";
import { getHabitDataByCategory } from "@/core/services/section-b";

const HabitStacksRow: React.FC<StacksRowProps> = React.memo(
  ({
    showCopyButton = false,
    showCopyButtonText = "Copy Item",
    onCopyPress = (id: string, parentId: string, dataType: string) =>
      console.log("Copy pressed"),
    habitCategoryId,
    mustReloadUser,
    userdata,
    sectorId,
    stacks,
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
    stacksFetcher
  }) => {
    React.useEffect(() => {
      if (!stacks && sectorId) {
        onNeedFetch(sectorId);
      }
    }, [stacks, sectorId, onNeedFetch]);

    if (!stacks) {
      return <View style={{ height: hp(1) }} />;
    }

    if (!stacks.length) {
      return (
        <View style={styles.emptyRow}>
          <Text style={styles.emptyRowText}>No habit stacks yet.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={getHabitDataByCategory(stacks, 1)}
        keyExtractor={(it) => `${it?.id ?? it?.documentId ?? Math.random()}`}
        horizontal={!isVerticalScroll}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        numColumns={isVerticalScroll ? 1 : undefined}
        key={isVerticalScroll ? 'vertical' : 'horizontal'} // Force remount when switching
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.stackCard,
              isVerticalScroll && styles.stackCardVertical,
            ]}
            onPress={() => console.log("stack tap:", item?.id)}
            activeOpacity={0.9}
          >
            {/* BigBinaryActionButtons */}
            {showMarketActionButtons && (
              <BigBinaryActionButton
                onSend={onMarketSend}
                onDelete={onMarketDelete}
                showSend={true}
                showDelete={true}
                data={item}
                selectedActionId={selectedMarketActionId}
              />
            )}

            <HabitStackCard
              showCopyButton={showCopyButton}
              showCopyButtonText={showCopyButtonText}
              onCopyPress={onCopyPress}
              key={item.documentId ?? item.id ?? Math.random()}
              stack={item}
              canEdit={false}
              username={userdata?.collectdata?.username}
              onOpenLinkItem={onOpenLinkItem}
              mustReloadUser={mustReloadUser}
              hideCalendar={hideCalendar}
              selectedMarketActionId={selectedMarketActionId}
              showExpandedButton={true}
              showHabitLinkNav={false}
            />
          </TouchableOpacity>
        )}
        style={isVerticalScroll ? { flex: 1 } : undefined}
      />
    );
  }
);

export default HabitStacksRow;

const styles = StyleSheet.create({
  // header
  logoBox: {
    width: wp(12),
    height: wp(12),
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp(3),
    marginRight: wp(3),
  },
  logo: {
    width: wp(7),
    height: wp(7),
  },

  // search
  searchContainer: {
    flexDirection: "row",
    height: hp(6),
    alignItems: "center",
    marginHorizontal: wp(6),
    marginVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: wp(3),
    backgroundColor: "#F5F5F8",
  },
  searchIcon: {
    height: hp(2.5),
    width: wp(5),
    tintColor: "#000",
  },
  searchInput: {
    flex: 1,
    marginLeft: wp(3),
    fontFamily: "poppins_regular",
    fontSize: wp(4),
    lineHeight: hp(3),
    color: Colors.black || "#000",
  },
  filterButton: {
    padding: wp(2),
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    height: hp(2.5),
    width: wp(5),
    tintColor: "#000",
  },

  // categories row
  listContent: {
    paddingVertical: hp(1.5),
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    height: hp(6.5),
    paddingHorizontal: wp(2.4),
    borderRadius: wp(3),
  },
  chipText: {
    alignSelf: "center",
    fontSize: wp(3.6),
    fontFamily: "poppins_semibold",
  },

  // sectors
  sectorBlock: {
    marginHorizontal: wp(4),
    marginBottom: hp(1.2),
  },
  sectorLabel: {
    color: Colors.white,
    fontSize: wp(4),
    fontFamily: "poppins_semibold",
    marginBottom: hp(0.8),
  },

  // stacks row
  stacksContent: {
    paddingVertical: hp(1),
    paddingLeft: wp(0.5),
    paddingRight: wp(0.5),
  },
  stackCard: {
    width: wp(140),
    minHeight: hp(10),
    marginRight: wp(3),
    borderRadius: 12,
    backgroundColor: Colors.text_background,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
  },
  stackCardVertical: {
    width: "100%",
    marginRight: 0,
    marginBottom: hp(2),
  },
  stackTitle: {
    color: Colors.white,
    fontSize: wp(3.8),
    fontFamily: "poppins_semibold",
  },
  stackMeta: {
    marginTop: hp(0.6),
    color: Colors.gray || "#A9A9A9",
    fontSize: wp(3.2),
    fontFamily: "poppins_regular",
  },

  // empty row
  emptyRow: {
    paddingVertical: hp(1.5),
  },
  emptyRowText: {
    color: Colors.gray || "#A9A9A9",
    fontSize: 13,
    fontFamily: "poppins_regular",
  },

  // list empty
  notfound: {
    alignItems: "center",
    justifyContent: "center",
    height: hp(40),
  },
  notfoundText: {
    color: Colors.white,
    fontSize: wp(4),
    fontFamily: "poppins_semibold",
  },
});