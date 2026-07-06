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
import { useFriendRequestForm, useHabitCalendarForm, useHabitMarketManagerForm, useNewFriendsForm, useYourFriendsForm } from "@/core/hooks";
import { FriendsVerticalList } from "@/core/components/section-b-1";
import {ActionsButtons, MarketFilters, MarketSection} from "@/core/components/section-b-3";


const HabitMarketManagerScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useHabitMarketManagerForm({ navigation, route });
    const [key, setKey] = useState(0);

    // Force reload FlatList when screen is focused
    useFocusEffect(
      useCallback(() => {
        // Reset the stacks and reload
        form.load?.();
        // Force FlatList to remount by changing key
        setKey((prev) => prev + 1);
      }, [form.load])
    );

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
       <View style={{ height: hp(2) }} />

        <ActionsButtons
        actionButtonFilters={form.habitMarketActions}
        actionButtonString={form.habitMarketAction}
        onActionButtonChange={form.setHabitMarketAction}
        onActionButtonIdChange={form.setSelectedMarketActionId}
       />

        <MarketFilters
          habitCategoryFilters={form.habitCategories}
          sectorFilters={form.sectors}
          activeSector={form.activeSector}
          onSectorChange={form.setActiveSector}
          hideActionIcons={true}
          hideHabitCategories={true}
        />

        {/* Show below if activeSector is "All" or "Finance" */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-finance-000") && (
          <MarketSection
            title="Finance"
            stacks={form.financeStacks.habitStackComponents || []}
            onSeeAll={() => console.log("See all finance")}
            sectorId="sector-finance-000"
            showCopyButton={form.showCopyButton}
            habitCategoryId={1}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            showMarketActionButtons={true}
            selectedMarketActionId={form.selectedMarketActionId}
            onMarketSend={form.submitMarketActionChange}
            onMarketDelete={form.submitMarketActionChange}
          />
        )}

        {/* Show below if activeSector is "All" or "Health and Fitness" */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-health-fitness-000") && (
          <MarketSection
            title="Health and Fitness"
            stacks={form.healthFitnessStacks.habitStackComponents || []}
            onSeeAll={() => console.log("See all health")}
            sectorId="sector-health-fitness-000"
            showCopyButton={form.showCopyButton}
            habitCategoryId={1}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            showMarketActionButtons={true}
            selectedMarketActionId={form.selectedMarketActionId}
            onMarketSend={form.submitMarketActionChange}
            onMarketDelete={form.submitMarketActionChange}
          />
        )}

        {/* Show below if activeSector is "All" or "Lifestyle and Recreation" */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-lifestyle-recreation-000") && (
          <MarketSection
            title="Lifestyle and Recreation"
            stacks={form.lifestyleRecreationStacks.habitStackComponents || []}
            onSeeAll={() => console.log("See all lifestyle")}
            sectorId="sector-lifestyle-recreation-000"
            showCopyButton={form.showCopyButton}
            habitCategoryId={1}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            showMarketActionButtons={true}
            selectedMarketActionId={form.selectedMarketActionId}
            onMarketSend={form.submitMarketActionChange}
            onMarketDelete={form.submitMarketActionChange}
          />
        )}

        {/* Show below if activeSector is "All" or "Personal Growth" */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-personal-growth-000") && (
          <MarketSection
            title="Personal Growth"
            stacks={form.personalGrowthStacks.habitStackComponents || []}
            onSeeAll={() => console.log("See all personal growth")}
            sectorId="sector-personal-growth-000"
            showCopyButton={form.showCopyButton}
            habitCategoryId={1}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            showMarketActionButtons={true}
            selectedMarketActionId={form.selectedMarketActionId}
            onMarketSend={form.submitMarketActionChange}
            onMarketDelete={form.submitMarketActionChange}
          />
        )}

        {/* Show below if activeSector is "All" or "Productivity" */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-productivity-000") && (
          <MarketSection
            title="Productivity"
            stacks={form.productivityStacks.habitStackComponents || []}
            onSeeAll={() => console.log("See all productivity")}
            sectorId="sector-productivity-000"
            showCopyButton={form.showCopyButton}
            habitCategoryId={1}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            showMarketActionButtons={true}
            selectedMarketActionId={form.selectedMarketActionId}
            onMarketSend={form.submitMarketActionChange}
            onMarketDelete={form.submitMarketActionChange}
          />
        )}

        {/* Show below if activeSector is "All" or "Relationships" */}
        {(form.activeSector === "sector-all-000" ||
          form.activeSector === "sector-relationships-000") && (
          <MarketSection
            title="Relationships"
            stacks={form.relationshipsStacks.habitStackComponents || []}
            onSeeAll={() => console.log("See all relationships")}
            sectorId="sector-relationships-000"
            showCopyButton={form.showCopyButton}
            habitCategoryId={1}
            hideCalendar={true}
            onOpenLinkItem={form.onOpenLinkItem}
            showMarketActionButtons={true}
            selectedMarketActionId={form.selectedMarketActionId}
            onMarketSend={form.submitMarketActionChange}
            onMarketDelete={form.submitMarketActionChange}
          />
        )}


      </ScrollView>

      <Loader status={form.loading} />
    </View>
  );
};

export default HabitMarketManagerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(0), // Full width scrolling, padding inside components
  },
});
