import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";

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
import { getHabitDataByCategory } from "@/core/services/section-b";

type Props = {
  form?: any;
};

const HabitCategories: React.FC<Props> = ({ form }) => {
  return (
    <FlatList
      data={form.habitCategories}
      keyExtractor={(item) => `${item?.id}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item, index }) => {
        const isSelected = form.selectedCategoryId === item?.id;
        const isFirst = index === 0;
        const isLast = index === form.habitCategories.length - 1;

        return (
          <TouchableOpacity
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? Colors.primary
                  : Colors.title_background,
                borderWidth: isSelected ? 0 : 1,
                borderColor: Colors.borderline,
                marginLeft: isFirst ? wp(4) : wp(2.5),
                marginRight: isLast ? wp(4) : 0,
                marginBottom: hp(2),
              },
            ]}
            onPress={() => form.setSelectedCategoryId(item?.id)}
            activeOpacity={0.8}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.chipText,
                { color: isSelected ? Colors.white : Colors.gray2 },
              ]}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default HabitCategories;

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
    paddingVertical: hp(1.2),
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    height: hp(5),
    paddingHorizontal: wp(3.5),
    borderRadius: wp(5),
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
    width: wp(90),
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
