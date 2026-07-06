import {Colors} from "@/core/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, {useCallback, useEffect, useState} from "react";
import Purchases from "react-native-purchases";
import {
  FlatList,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import {SafeAreaView} from "react-native-safe-area-context";

const SETTINGS_ITEMS = [
  // {
  //   id: "notifications",
  //   label: "Notifications & Alerts",
  //   icon: "bell-outline",
  // },
  // {
  //   id: "appearance",
  //   label: "Appearance",
  //   icon: "brush-outline",
  // },
  // {
  //   id: "advanced",
  //   label: "Advanced",
  //   icon: "cog-outline",
  // },
  // {
  //   id: "calendars",
  //   label: "Calendars",
  //   icon: "calendar-outline",
  // },
  // {
  //   id: "reminders",
  //   label: "Reminders",
  //   icon: "format-list-checks",
  // },
  // Account
  {
    id: "account",
    label: "Account",
    icon: "account-outline",
  },
  {
    id: "manage-subscriptions",
    label: "Manage Subscriptions",
    icon: "credit-card-outline",
  },
  {
    id: "purchase-history",
    label: "Purchase History",
    icon: "receipt-outline",
  },
  {
    id: "help",
    label: "Help & Feedback",
    icon: "help-circle-outline",
  },
  // {
  //   id: "analytics",
  //   label: "Analytics",
  //   icon: "chart-bar",
  // },
  {
    id: "terms",
    label: "Terms of Service",
    icon: "file-document-outline",
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    icon: "shield-outline",
  },
];

const SettingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const openUrl = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {});
  }, []);

  // UI Settings (approved web addition): Light/Dark toggle, persisted in
  // localStorage and applied via the data-nocap-theme attribute.
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    setDarkMode(localStorage.getItem("nocap_ui_theme") !== "light");
  }, []);
  const toggleDarkMode = useCallback((value: boolean) => {
    setDarkMode(value);
    const theme = value ? "dark" : "light";
    localStorage.setItem("nocap_ui_theme", theme);
    document.documentElement.setAttribute("data-nocap-theme", theme);
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.root_background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={wp(6)}
            color={Colors.white}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Settings List */}
      <FlatList
        data={SETTINGS_ITEMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => {
              if (item.id === "account") navigation.navigate("account");
              else if (item.id === "manage-subscriptions") {
                const url =
                  Platform.OS === "ios"
                    ? "https://apps.apple.com/account/subscriptions"
                    : "https://play.google.com/store/account/subscriptions";
                Linking.openURL(url).catch(() => {});
              } else if (item.id === "purchase-history") {
                const url =
                  Platform.OS === "ios"
                    ? "https://reportaproblem.apple.com"
                    : "https://play.google.com/store/account/orderhistory";
                Linking.openURL(url).catch(() => {});
              } else if (item.id === "terms")
                openUrl("https://www.donocap.com/terms-and-conditions");
              else if (item.id === "privacy")
                openUrl("https://www.donocap.com/privacy-policy");
              else if (item.id === "help")
                openUrl("https://discord.gg/g3ceKGYA");
            }}
          >
            <View style={styles.itemLeft}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={wp(5.5)}
                color={Colors.white}
              />
              <Text style={styles.itemLabel}>{item.label}</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={wp(5.5)}
              color={Colors.text_color}
            />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <View>
            <Text style={styles.sectionTitle}>UI SETTINGS</Text>
            <View style={styles.item}>
              <View style={styles.itemLeft}>
                <MaterialCommunityIcons
                  name="theme-light-dark"
                  size={wp(5.5)}
                  color={Colors.white}
                />
                <Text style={styles.itemLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: Colors.inuptborder, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.root_background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: wp(4.5),
    fontFamily: "bold",
    color: Colors.white,
    letterSpacing: 1,
  },
  headerRight: {
    width: wp(10),
  },
  listContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.content_back,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderRadius: wp(3),
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  itemLabel: {
    fontSize: wp(3.8),
    fontFamily: "regular",
    color: Colors.white,
  },
  separator: {
    height: hp(1),
  },
  sectionTitle: {
    fontSize: wp(3.2),
    fontFamily: "bold",
    color: Colors.text_color,
    letterSpacing: 1,
    marginTop: hp(3),
    marginBottom: hp(1),
    paddingHorizontal: wp(1),
  },
});
