// FILE 3: HabitSectors.tsx
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { Sector } from "@/core/models/section-b";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";

interface HabitSectorsProps {
  sectorFilters: Sector[];
  activeSector: string;
  onSectorChange: (sector: string) => void;
}

const HabitSectorsScroll: React.FC<HabitSectorsProps> = ({
  sectorFilters,
  activeSector,
  onSectorChange,
}) => {
  return (
    <View style={styles.bottomRowContainer}>
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
  );
};

const styles = StyleSheet.create({
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

export default HabitSectorsScroll;