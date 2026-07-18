
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
import {getHabitDataByCategory} from "@/core/services/section-b";




type Props = {
  form?: any;
};


const HabitFilter: React.FC<Props> = ({ form }) => {
  return (
      <View style={styles.searchContainer}>
        <Image
          source={Images.search}
          style={styles.searchIcon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search habits..."
          placeholderTextColor={Colors.gray || "#999"}
          value={form.searchQuery}
          onChangeText={form.setSearchQuery}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => console.log("Filter")}
          activeOpacity={0.85}
        >
          <Image
            source={Images.filter2}
            style={styles.filterIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
  );
};

export default HabitFilter;


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

