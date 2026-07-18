// FILE 3: HabitSectors.tsx
import { Colors } from "@/core/constants/Colors";
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
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(0.8),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginRight: wp(2),
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  categoryChipActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  categoryText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "poppins_semibold",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: Colors.black,
    fontWeight: "600",
  },
});

export default HabitSectorsScroll;