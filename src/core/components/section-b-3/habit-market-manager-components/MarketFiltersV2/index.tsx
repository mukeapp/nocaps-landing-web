// FILE 4: MarketFilters.tsx
import { HabitCategory, Sector } from "@/core/models/section-b";
import React from "react";
import { StyleSheet, View } from "react-native";
import { heightPercentageToDP as hp } from "@/core/utils/responsive";
import HabitSectorsScroll from "../HabitSectorsScroll";
import HabitCategoryButtons from "../ActionsButtons";
import ActionNavigationIcons from "../ActionNavigationIcons";
import ActionsButtons from "../ActionsButtons";

interface MarketFiltersProps {
  habitCategoryFilters: HabitCategory[];
  habitCategory: string;
  onHabitCategoryChange: (category: string) => void;
  onSelectedCategoryIdChange: (categoryId: number) => void;
  sectorFilters: Sector[];
  activeSector: string;
  onSectorChange: (sector: string) => void;
  navigateToHabitMarketManager: () => void;
}

const MarketFiltersV2: React.FC<MarketFiltersProps> = ({
  habitCategoryFilters,
  habitCategory,
  onHabitCategoryChange,
  onSelectedCategoryIdChange,
  sectorFilters,
  activeSector,
  onSectorChange,
  navigateToHabitMarketManager = () => {
    console.log("Navigate to Habit Market Manager");
  },
}) => {
  return (
    <View style={styles.container}>
      <ActionNavigationIcons navigateToHabitMarketManager={navigateToHabitMarketManager} />

      <ActionsButtons
        actionButtonFilters={habitCategoryFilters}
        actionButtonString={habitCategory}
        onActionButtonChange={onHabitCategoryChange}
        onActionButtonIdChange={onSelectedCategoryIdChange}
      />

      <HabitSectorsScroll
        sectorFilters={sectorFilters}
        activeSector={activeSector}
        onSectorChange={onSectorChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1),
  },
});

export default MarketFiltersV2;