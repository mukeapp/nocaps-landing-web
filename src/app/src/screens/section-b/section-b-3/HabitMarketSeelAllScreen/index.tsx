import { setUserLogout, selectUser } from "@/core/redux/user-data";
import { useDispatch } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { useFocusEffect } from "@react-navigation/native";

import { MainStyles } from "@/core/constants/styles";
import { Images } from "@/core/constants/Images";
import { Colors } from "@/core/constants/Colors";
import { HabitStackCard, Header2 } from "@/core/components/section-b";
import {
  DefaultLoader as Loader,
  ButtonSignIn as Button,
} from "@/core/components/section-a";
import {
  getHabitStackComponentsByUserId,
  DeleteHabitStack,
} from "@/core/api/section-b";
import Toast from "react-native-root-toast";
import { HabitStackComponent } from "@/core/models/section-b";
import { useFriendRequestForm, useHabitCalendarForm, useHabitMarketSeelAllForm, useNewFriendsForm, useYourFriendsForm } from "@/core/hooks";
import { FriendsVerticalList } from "@/core/components/section-b-1";
import FeaturedCarousel from "@/core/components/section-b-3/habit-market-components/FeaturedCarousel";
import MarketFilters from "@/core/components/section-b-3/habit-market-components/MarketFilters";
import MarketSection from "@/core/components/section-b-3/habit-market-components/MarketSection";


const HabitMarketSeelAllScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useHabitMarketSeelAllForm({ navigation, route });
  // const [key, setKey] = useState(0);

  // // Force reload FlatList when screen is focused
  // useFocusEffect(
  //   useCallback(() => {
  //     // Reset the stacks and reload
  //     form.load?.();
  //     // Force FlatList to remount by changing key
  //     setKey((prev) => prev + 1);
  //   }, [form.load])
  // );

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

        {/* <FeaturedCarousel /> */}

        <MarketFilters
          habitCategoryFilters={form.habitCategories}
          habitCategory={form.habitCategory}
          onHabitCategoryChange={form.setHabitCategory}
          onSelectedCategoryIdChange={form.setSelectedCategoryId}
          sectorFilters={form.sectors}
          activeSector={form.activeSector}
          onSectorChange={form.setActiveSector}
          hideActionIcons={true}
        />



        {/* Finance */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-finance-000") &&
          form.doesSectorExist("sector-finance-000") && (
          <MarketSection
            title="Finance"
            stacks={form.financeStacks.habitStackComponents || []}
            onSeeAll={() => console.log("See all finance stacks")}
            sectorId="sector-finance-000"
            showCopyButton={form.selectedCategoryId === 1 ? true : form.showCopyButton}
            onCopyPress={form.copyItem}
            habitCategoryId={form.selectedCategoryId}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            selectedMarketActionId={4}
            hideSeeAllButton={true}
            isVerticalScroll={true}
            stacksFetcher={form.stacksFetcher}
            isInfiniteScroll={true}
          />
        )}

        {/* Health and Fitness */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-health-fitness-000") &&
          form.doesSectorExist("sector-health-fitness-000") && (
          <MarketSection
            title="Health and Fitness"
            stacks={form.healthFitnessStacks.habitStackComponents || []}
            onSeeAll={() => console.log("See all health and fitness stacks")}
            sectorId="sector-health-fitness-000"
            showCopyButton={form.selectedCategoryId === 1 ? true : form.showCopyButton}
            onCopyPress={form.copyItem}
            habitCategoryId={form.selectedCategoryId}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            selectedMarketActionId={4}
            hideSeeAllButton={true}
            isVerticalScroll={true}
            stacksFetcher={form.stacksFetcher}
            isInfiniteScroll={true}
          />
        )}

        {/* Lifestyle and Recreation */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-lifestyle-recreation-000") &&
          form.doesSectorExist("sector-lifestyle-recreation-000") && (
          <MarketSection
            title="Lifestyle and Recreation"
            stacks={form.lifestyleRecreationStacks.habitStackComponents || []}
            onSeeAll={() => console.log("See all lifestyle and recreation stacks")}
            sectorId="sector-lifestyle-recreation-000"
            showCopyButton={form.selectedCategoryId === 1 ? true : form.showCopyButton}
            onCopyPress={form.copyItem}
            habitCategoryId={form.selectedCategoryId}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            selectedMarketActionId={4}
            hideSeeAllButton={true}
            isVerticalScroll={true}
            stacksFetcher={form.stacksFetcher}
            isInfiniteScroll={true}
          />
        )}

        {/* Personal Growth */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-personal-growth-000") &&
          form.doesSectorExist("sector-personal-growth-000") && (
          <MarketSection
            title="Personal Growth"
            stacks={form.personalGrowthStacks.habitStackComponents || []}
            onSeeAll={() => console.log("See all personal growth stacks")}
            sectorId="sector-personal-growth-000"
            showCopyButton={form.selectedCategoryId === 1 ? true : form.showCopyButton}
            onCopyPress={form.copyItem}
            habitCategoryId={form.selectedCategoryId}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            selectedMarketActionId={4}
            hideSeeAllButton={true}
            isVerticalScroll={true}
            stacksFetcher={form.stacksFetcher}
            isInfiniteScroll={true}
          />
        )}

        {/* Productivity */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-productivity-000") &&
          form.doesSectorExist("sector-productivity-000") && (
          <MarketSection
            title="Productivity"
            stacks={form.productivityStacks.habitStackComponents || []}
            onSeeAll={() => console.log("See all productivity stacks")}
            sectorId="sector-productivity-000"
            showCopyButton={form.selectedCategoryId === 1 ? true : form.showCopyButton}
            onCopyPress={form.copyItem}
            habitCategoryId={form.selectedCategoryId}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            selectedMarketActionId={4}
            hideSeeAllButton={true}
            isVerticalScroll={true}
            stacksFetcher={form.stacksFetcher}
            isInfiniteScroll={true}
          />
        )}

        {/* Relationships */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-relationships-000") &&
          form.doesSectorExist("sector-relationships-000") && (
          <MarketSection
            title="Relationships"
            stacks={form.relationshipsStacks.habitStackComponents || []}
            onSeeAll={() => console.log("See all relationships stacks")}
            sectorId="sector-relationships-000"
            showCopyButton={form.selectedCategoryId === 1 ? true : form.showCopyButton}
            onCopyPress={form.copyItem}
            habitCategoryId={form.selectedCategoryId}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            selectedMarketActionId={4}
            hideSeeAllButton={true}
            isVerticalScroll={true}
            stacksFetcher={form.stacksFetcher}
            isInfiniteScroll={true}
          />
        )}

      <Loader status={form.loading} />
    </View>
  );
};

export default HabitMarketSeelAllScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(0),
  },
});
