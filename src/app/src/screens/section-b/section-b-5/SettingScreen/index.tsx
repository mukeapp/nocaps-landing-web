import { Colors } from "@/core/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useCallback, useEffect, useState } from "react";
import { Linking, Platform, Switch, View } from "react-native";
import { MainStyles } from "@/core/constants/styles";
import WebDashboardHeader from "@/core/components/section-b/header/WebDashboardHeader";

// Web-adapted rewrite (July 2026 direction: web UX over pixel-mobile parity),
// fifth screen on the pattern. Items, order, and onPress targets are unchanged;
// the Dark Mode toggle logic (the approved web addition) is kept verbatim.
// Settings lists read best narrow, hence max-w-2xl instead of the grid
// screens' max-w-screen-2xl.

type SettingsItem = {
  id: string;
  label: string;
  icon: string;
  external: boolean; // affordance: open-in-new vs chevron-right
};

const SETTINGS_GROUPS: { title: string; items: SettingsItem[] }[] = [
  {
    title: "Account & Billing",
    items: [
      // Previously offered (kept for reference, as in the mobile source):
      // notifications / appearance / advanced / calendars / reminders / analytics
      { id: "account", label: "Account", icon: "account-outline", external: false },
      {
        id: "manage-subscriptions",
        label: "Manage Subscriptions",
        icon: "credit-card-outline",
        external: true,
      },
      {
        id: "purchase-history",
        label: "Purchase History",
        icon: "receipt-outline",
        external: true,
      },
    ],
  },
  {
    title: "Support & Legal",
    items: [
      { id: "help", label: "Help & Feedback", icon: "help-circle-outline", external: true },
      { id: "terms", label: "Terms of Service", icon: "file-document-outline", external: true },
      { id: "privacy", label: "Privacy Policy", icon: "shield-outline", external: true },
    ],
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

  const onItemPress = (id: string) => {
    if (id === "account") navigation.navigate("account");
    else if (id === "manage-subscriptions") {
      const url =
        Platform.OS === "ios"
          ? "https://apps.apple.com/account/subscriptions"
          : "https://play.google.com/store/account/subscriptions";
      Linking.openURL(url).catch(() => {});
    } else if (id === "purchase-history") {
      const url =
        Platform.OS === "ios"
          ? "https://reportaproblem.apple.com"
          : "https://play.google.com/store/account/orderhistory";
      Linking.openURL(url).catch(() => {});
    } else if (id === "terms")
      openUrl("https://www.donocap.com/terms-and-conditions");
    else if (id === "privacy")
      openUrl("https://www.donocap.com/privacy-policy");
    else if (id === "help") openUrl("https://discord.gg/g3ceKGYA");
  };

  return (
    <View style={[MainStyles.root2, { paddingHorizontal: 0, paddingTop: 0 }]}>
      {/* Sticky top bar — shared web dashboard header */}
      <WebDashboardHeader title="Settings" onBack={() => navigation.goBack()} />

      <div className="px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Page header */}
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, subscriptions, and app preferences.
        </p>

        {SETTINGS_GROUPS.map((group) => (
          <div key={group.title} className="mt-7">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {group.title}
            </p>
            <div className="rounded-2xl bg-card ring-1 ring-white/10 divide-y divide-white/5 overflow-hidden">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onItemPress(item.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5">
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={19}
                      color={Colors.white}
                    />
                  </span>
                  <span className="flex-1 text-sm text-foreground">
                    {item.label}
                  </span>
                  <MaterialCommunityIcons
                    name={item.external ? "open-in-new" : "chevron-right"}
                    size={item.external ? 15 : 19}
                    color={Colors.text_color}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* UI Settings */}
        <div className="mt-7">
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            UI Settings
          </p>
          <div className="rounded-2xl bg-card ring-1 ring-white/10 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5">
                <MaterialCommunityIcons
                  name="theme-light-dark"
                  size={19}
                  color={Colors.white}
                />
              </span>
              <span className="flex-1 text-sm text-foreground">Dark Mode</span>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: Colors.inuptborder, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </div>
          </div>
        </div>
      </div>
    </View>
  );
};

export default SettingScreen;
