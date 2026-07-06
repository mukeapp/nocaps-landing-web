"use client";

import React, { useEffect } from "react";
import { View } from "react-native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useRouter } from "next/navigation";

import { persistor, store } from "@/core/redux/store";
import { selectUserAuth } from "@/core/redux/user-data";
import CustomDrawerContent from "@/core/components/section-b/drawer/CustomDrawerContent";

import { NavigationProvider, useDrawerOpen, useScreenProps } from "./index";

type Section = "auth" | "app";

// Mobile switches stacks on redux auth (app/navigation/index.tsx
// `key={auth ? "app" : "auth"}`); the web equivalent is a cookie for the
// middleware guard plus a redirect.
function AuthStackSwitcher({ section }: { section: Section }) {
  const auth = useSelector(selectUserAuth);
  const router = useRouter();

  useEffect(() => {
    if (auth && section === "auth") {
      document.cookie = "nocap_session=1; path=/; max-age=31536000; samesite=lax";
      router.replace("/dashboard");
    } else if (!auth && section === "app") {
      document.cookie = "nocap_session=; path=/; max-age=0";
      router.replace("/login");
    } else if (auth) {
      document.cookie = "nocap_session=1; path=/; max-age=31536000; samesite=lax";
    }
  }, [auth, section, router]);

  return null;
}

function DrawerOverlay() {
  const drawerOpen = useDrawerOpen();
  const { navigation } = useScreenProps();
  if (!drawerOpen) return null;
  // Drawertab sets drawerStyle width wp(100) — a full-viewport drawer.
  return (
    <View
      style={{
        position: "fixed" as any,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: "#0D0D0D",
      }}
    >
      <CustomDrawerContent navigation={navigation} />
    </View>
  );
}

function ScreenRenderer({
  component: Component,
}: {
  component: React.ComponentType<any>;
}) {
  const { navigation, route } = useScreenProps();
  return <Component navigation={navigation} route={route} />;
}

export default function ScreenPage({
  name,
  component,
  section,
}: {
  name: string;
  component: React.ComponentType<any>;
  section: Section;
}) {
  // UI Settings (approved web addition): apply the persisted Light/Dark choice
  // on every page load. The toggle lives in SettingScreen.
  useEffect(() => {
    const theme = localStorage.getItem("nocap_ui_theme");
    document.documentElement.setAttribute(
      "data-nocap-theme",
      theme === "light" ? "light" : "dark"
    );
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationProvider routeName={name}>
          <AuthStackSwitcher section={section} />
          <View
            dataSet={{ nocaproot: "true" } as any}
            style={{ minHeight: "100vh" as any, backgroundColor: "#0D0D0D" }}
          >
            <ScreenRenderer component={component} />
          </View>
          {section === "app" ? <DrawerOverlay /> : null}
        </NavigationProvider>
      </PersistGate>
    </Provider>
  );
}
