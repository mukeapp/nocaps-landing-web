import React from "react";
import { wp, isTablet } from "@/core/utils/responsive";
// ----------drawer
import { createDrawerNavigator } from "@react-navigation/drawer";

import {
  AccountScreen,
  HabitCalendarScreen,
  HabitMarketScreen,
  MyFriendsAndHabitsScreen,
  MyHabitLibraryScreen,
  MyHabitStacksScreen,
  ProfileScreen,
  SettingScreen,
} from "@/app/src/screens/section-b";
import CustomDrawerContent from "../CustomDrawerContent";
import NoCapSubscriptionScreen from "@/app/src/screens/section-b/section-b-4/NoCapSubscriptionScreen";
import NoCapPostHomeScreen from "@/app/src/screens/section-c/section-c-1/NoCapPostHomeScreen";
import {NoCapPostCreateScreen} from "@/app/src/screens/section-c";
import {SwapHabitLinkItemScreen, SwapHabitLinkScreen, SwapHabitScreen} from "@/app/src/screens/section-d";

const Drawer = createDrawerNavigator();

const Drawertab = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
              width: isTablet ? wp(100) : wp(100),
              height: '100%'
            },
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="nocap-drawer"
        component={MyHabitStacksScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="my-habit-library"
        component={MyHabitLibraryScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="my-friends-and-habits"
        component={MyFriendsAndHabitsScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="habit-market"
        component={HabitMarketScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="habit-calendar"
        component={HabitCalendarScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="no-cap-subscription"
        component={NoCapSubscriptionScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="no-cap-post-home"
        component={NoCapPostHomeScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="no-cap-post-create"
        component={NoCapPostCreateScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="settings"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="account"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="swap-habit-link-item"
        component={SwapHabitLinkItemScreen}
        options={{ headerShown: false }}
      />
      < Drawer.Screen
        name="swap-habit-link"
        component={SwapHabitLinkScreen}
        options={{ headerShown: false }}
      />
      < Drawer.Screen
        name="swap-habit"
        component={SwapHabitScreen}
        options={{ headerShown: false }}
      />

    </Drawer.Navigator>
  );
};

export default Drawertab;
