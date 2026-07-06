import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { HabitCategory, Sector } from "@/core/models/section-b";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";

interface MarketFiltersProps {
  habitCategoryFilters: HabitCategory[];
  habitCategory?: string;
  onHabitCategoryChange?: (category: string) => void;
  onSelectedCategoryIdChange?: (categoryId: number) => void;
  sectorFilters: Sector[];
  activeSector: string;
  onSectorChange?: (sector: string) => void;
  navigateToHabitMarketManager?: () => void;
  hideActionIcons?: boolean;
  hideHabitCategories?: boolean;
}

const MarketFilters: React.FC<MarketFiltersProps> = ({
  habitCategoryFilters,
  habitCategory = "HabitStacks",
  onHabitCategoryChange = () => {
    console.log("Habit Category Changed");
  },
  onSelectedCategoryIdChange = () => {
    console.log("Selected Category ID Changed");
  },
  sectorFilters,
  activeSector,
  onSectorChange = () => {
    console.log("Sector Changed");
  },
  navigateToHabitMarketManager = () => {
    console.log("Navigate to Habit Market Manager");
  },
  hideActionIcons = false,
  hideHabitCategories = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Action Icons Section */}
      {!hideActionIcons && (
        <View style={styles.actionIcons}>
          {/* <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="swap-horizontal" size={20} color={Colors.white} />
        </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={navigateToHabitMarketManager}
          >
            <MaterialCommunityIcons
              name="arrow-up-circle"
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      )}
      {/* Habit Data Types */}
      {!hideHabitCategories && (
        <View style={styles.topRowContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statusScrollContent}
            style={styles.statusScrollView}
          >
            {habitCategoryFilters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.statusChip,
                  habitCategory === filter.name && styles.statusChipActive,
                ]}
                onPress={() => {
                  onHabitCategoryChange(filter.name);
                  onSelectedCategoryIdChange(filter.id);
                }}
              >
                <Text
                  style={[
                    styles.statusText,
                    habitCategory === filter.name && styles.statusTextActive,
                  ]}
                >
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Habit Sectors */}
      <View style={styles.bottomRowContainer}>
        {/* Habit Sectors Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScrollView}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {sectorFilters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.categoryChip,
                activeSector === filter.id && styles.categoryChipActive,
              ]}
              onPress={() => onSectorChange(filter.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeSector === filter.id && styles.categoryTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1),
  },
  topRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  statusScrollView: {
    flex: 1,
  },
  statusScrollContent: {
    paddingHorizontal: wp(1),
    alignItems: "center",
  },
  bottomRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: wp(2),
    marginBottom: hp(1.5),
  },
  categoryScrollView: {
    flex: 1,
  },
  categoryScrollContent: {
    paddingHorizontal: wp(1),
    alignItems: "center",
  },
  statusChip: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginRight: wp(2),
  },
  statusChipActive: {
    backgroundColor: "#29B6F6", // Cyan/Light Blue
  },
  statusText: {
    ...MainStyles.text10,
    color: Colors.black,
    fontWeight: "600",
  },
  statusTextActive: {
    color: Colors.black,
  },
  actionIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: hp(2),
    gap: wp(1),
    marginRight: wp(1),
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.title_background, // Assuming background needs to be distinctive or same as other dark bg
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderline,
  },

  categoryChip: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderline,
    marginRight: wp(2),
    backgroundColor: "transparent",
  },
  categoryChipActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  categoryText: {
    ...MainStyles.text14,
    color: Colors.gray,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: Colors.black,
  },
});

export default MarketFilters;
