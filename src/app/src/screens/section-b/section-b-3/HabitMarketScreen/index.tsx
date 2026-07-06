import React from "react";
import {ActivityIndicator, ScrollView, StyleSheet, View} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import {Header2} from "@/core/components/section-b";
import {MainStyles} from "@/core/constants/styles";
import {useHabitMarketForm} from "@/core/hooks";
import FeaturedCarousel from "../../../../../../core/components/section-b-3/habit-market-components/FeaturedCarousel";
import MarketFilters from "../../../../../../core/components/section-b-3/habit-market-components/MarketFilters";
import MarketSection from "../../../../../../core/components/section-b-3/habit-market-components/MarketSection";

const HabitMarketScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useHabitMarketForm({ navigation, route });

  return (
    <View style={MainStyles.root2}>
      <Header2
        title={form.destinationScreenTitle}
        titleTextFormat={1}
        titleVisibilityIcon={false}
        showSettingsIcon={true}
        navigation={navigation}
        cameFromDrawerTab={form.cameFromDrawerTab}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(5) }}
      >
        <FeaturedCarousel />

        <MarketFilters
          habitCategoryFilters={form.habitCategories}
          habitCategory={form.habitCategory}
          onHabitCategoryChange={form.setHabitCategory}
          onSelectedCategoryIdChange={form.setSelectedCategoryId}
          sectorFilters={form.sectors}
          activeSector={form.activeSector}
          onSectorChange={form.setActiveSector}
          navigateToHabitMarketManager={form.navigateToHabitMarketManager}
        />

        {/* Finance */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-finance-000") &&
          form.doesSectorExist("sector-finance-000") && (
          <MarketSection
            title="Finance"
            stacks={form.financeStacks.habitStackComponents || []}
            onSeeAll={() => form.navigateToSeeAll("sector-finance-000", "Finance Stacks")}
            sectorId="sector-finance-000"
            showCopyButton={form.selectedCategoryId === 1 ? true : form.showCopyButton}
            onCopyPress={form.copyItem}
            habitCategoryId={form.selectedCategoryId}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            selectedMarketActionId={4}
          />
        )}

        {/* Health and Fitness */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-health-fitness-000") &&
          form.doesSectorExist("sector-health-fitness-000") && (
          <MarketSection
            title="Health and Fitness"
            stacks={form.healthFitnessStacks.habitStackComponents || []}
            onSeeAll={() => form.navigateToSeeAll("sector-health-fitness-000", "Health & Fitness Stacks")}
            sectorId="sector-health-fitness-000"
            showCopyButton={form.selectedCategoryId === 1 ? true : form.showCopyButton}
            onCopyPress={form.copyItem}
            habitCategoryId={form.selectedCategoryId}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            selectedMarketActionId={4}
          />
        )}

        {/* Lifestyle and Recreation */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-lifestyle-recreation-000") &&
          form.doesSectorExist("sector-lifestyle-recreation-000") && (
          <MarketSection
            title="Lifestyle and Recreation"
            stacks={form.lifestyleRecreationStacks.habitStackComponents || []}
            onSeeAll={() => form.navigateToSeeAll("sector-lifestyle-recreation-000", "Lifestyle & Recreation Stacks")}
            sectorId="sector-lifestyle-recreation-000"
            showCopyButton={form.selectedCategoryId === 1 ? true : form.showCopyButton}
            onCopyPress={form.copyItem}
            habitCategoryId={form.selectedCategoryId}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            selectedMarketActionId={4}
          />
        )}

        {/* Personal Growth */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-personal-growth-000") &&
          form.doesSectorExist("sector-personal-growth-000") && (
          <MarketSection
            title="Personal Growth"
            stacks={form.personalGrowthStacks.habitStackComponents || []}
            onSeeAll={() => form.navigateToSeeAll("sector-personal-growth-000", "Personal Growth Stacks")}
            sectorId="sector-personal-growth-000"
            showCopyButton={form.selectedCategoryId === 1 ? true : form.showCopyButton}
            onCopyPress={form.copyItem}
            habitCategoryId={form.selectedCategoryId}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            selectedMarketActionId={4}
          />
        )}

        {/* Productivity */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-productivity-000") &&
          form.doesSectorExist("sector-productivity-000") && (
          <MarketSection
            title="Productivity"
            stacks={form.productivityStacks.habitStackComponents || []}
            onSeeAll={() => form.navigateToSeeAll("sector-productivity-000", "Productivity Stacks")}
            sectorId="sector-productivity-000"
            showCopyButton={form.selectedCategoryId === 1 ? true : form.showCopyButton}
            onCopyPress={form.copyItem}
            habitCategoryId={form.selectedCategoryId}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            selectedMarketActionId={4}
          />
        )}

        {/* Relationships */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-relationships-000") &&
          form.doesSectorExist("sector-relationships-000") && (
          <MarketSection
            title="Relationships"
            stacks={form.relationshipsStacks.habitStackComponents || []}
            onSeeAll={() => form.navigateToSeeAll("sector-relationships-000", "Relationships Stacks")}
            sectorId="sector-relationships-000"
            showCopyButton={form.selectedCategoryId === 1 ? true : form.showCopyButton}
            onCopyPress={form.copyItem}
            habitCategoryId={form.selectedCategoryId}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            selectedMarketActionId={4}
          />
        )}

      </ScrollView>

      {form.loading && (
        <View style={styles.loaderOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

export default HabitMarketScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(0),
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
});