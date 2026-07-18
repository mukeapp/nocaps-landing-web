
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as _wp,
  heightPercentageToDP as _hp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _wp(p);
const hp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _hp(p);

import { MainStyles } from "@/core/constants/styles";
import { Images } from "@/core/constants/Images";
import { Colors } from "@/core/constants/Colors";
import { DefaultLoader as Loader } from "@/core/components/section-a";
import useMyHabitLibraryForm from "@/core/hooks/useMyHabitLibraryForm";
import {
  HabitComponent,
  HabitLinkComponent,
  HabitStackComponent,
  StacksRowProps,
} from "@/core/models/section-b/habit";
import { useSelector } from "react-redux";
import {
  HabitCard,
  HabitLinkCard,
  HabitStackCard,
} from "@/core/components/section-b";
import {getHabitDataByCategory} from "@/core/services/section-b";
import {Unit} from "@/core/models/section-b";




const HabitLinkItemsRow: React.FC<StacksRowProps> = React.memo(
  ({
    showCopyButton = false,
    showCopyButtonText = "Copy HabitLink",
    showCopyButtonForItem = false,
    showCopyButtonTextForItem = "Copy HabitLinkItem",
    onCopyPress = (id:string, parentId:string, dataType:string) => console.log("Copy pressed"),
    showHabitLinkBanner = false,
    habitCategoryId,
    userdata,
    sectorId,
    stacks,
    onNeedFetch,
    onOpenLinkItem,
    costSymbol = "",
    showHabitLinkNav = true,
    showExpandedButton = false,
    hideCalendar = false,
    selectedMarketActionId = 0,
    mustReloadUser = false,
    filterByHabitLinkItemId = false,
    postHabitId = undefined,
    postHabitLinkId = undefined,
    postHabitLinkItemId = undefined,
  }) => {
    const [costUnit, setCostUnit] = React.useState<Unit | undefined>(undefined);
    const [finalCostSymbol, setFinalCostSymbol] = useState(costSymbol);

    React.useEffect(() => {
      if (!stacks && sectorId) {
        onNeedFetch(sectorId);
      }
    }, [stacks, sectorId, onNeedFetch]);

    if (!stacks) {
      // render a small spacer so lists stay stable
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
        data={getHabitDataByCategory(stacks, 4, postHabitId, postHabitLinkId, postHabitLinkItemId, filterByHabitLinkItemId) as HabitLinkComponent[]}
        keyExtractor={(it) => `${it?.id ?? it?.documentId ?? Math.random()}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
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
        )}
      />
    );
  }
);

export default HabitLinkItemsRow;


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
    borderRadius: wp(3),
    backgroundColor: Colors.text_background,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
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
    fontSize: wp(3.4),
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
