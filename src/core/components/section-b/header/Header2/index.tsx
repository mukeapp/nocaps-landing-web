import { Platform, StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import React from "react";
import { widthPercentageToDP as wp } from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { MainStyles } from "@/core/constants/styles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Images } from "@/core/constants/Images";
import WebDashboardHeader from "@/core/components/section-b/header/WebDashboardHeader";

const isWeb = Platform.OS === "web";

const Header2 = ({
  title = "",
  titleTextFormat = 1,
  titleVisibilityIcon = true,
  showSettingsIcon = true,
  navigation = null,
  cameFromDrawerTab = false,
  originScreen = "",
}) => {
  const router = useRouter();

  // On web, every Header2 screen shows the shared sticky dashboard bar:
  // hamburger (drawer-level screens) or back arrow (pushed screens) + brand + title.
  if (isWeb) {
    return (
      <WebDashboardHeader
        title={title}
        onOpenDrawer={
          cameFromDrawerTab ? () => (navigation as any)?.openDrawer?.() : undefined
        }
        onBack={
          !cameFromDrawerTab ? () => (navigation as any)?.goBack?.() : undefined
        }
      />
    );
  }

  return (
    <View style={styles.main}>
      {!cameFromDrawerTab && (
        <TouchableOpacity
          style={styles.icnview}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome6
            name="arrow-left"
            size={17}
            color={Colors.background_color}
          />
        </TouchableOpacity>
      )}
      {cameFromDrawerTab && (
        <TouchableOpacity
          style={[MainStyles.viewone, isWeb && { marginBottom: 0 }]}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.85}
        >
          <View style={originScreen == 'ProfileScreen' ? styles.logoBoxDark : styles.logoBox}>
            <Image
              source={Images.logo}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.mid}>
        <Text
          style={
            titleTextFormat === 1
              ? [MainStyles.text16white, { marginRight: isWeb ? 8 : wp(2) }, isWeb && { fontSize: 16 }]
              : [
                  MainStyles.text20semibold,
                  { marginRight: isWeb ? 8 : wp(2), letterSpacing: 1 },
                  isWeb && { fontSize: 20 },
                ]
          }
        >
          {title}
        </Text>
        {titleVisibilityIcon ? (
          <MaterialCommunityIcons
            name="eye-outline"
            size={21}
            color={Colors.white}
          />
        ) : null}
      </View>
      {showSettingsIcon ? (
        <Ionicons name="settings-outline" size={22} color={Colors.white} />
      ) : null}
    </View>
  );
};

export default Header2;

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icnview: {
    width: isWeb ? 36 : wp(7),
    height: isWeb ? 36 : wp(7),
    borderRadius: isWeb ? 8 : wp(4),
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  mid: {
    flexDirection: "row",
    alignItems: "center",
  },
  icnviews: {
    width: isWeb ? 36 : wp(8),
    height: isWeb ? 36 : wp(8),
    borderRadius: isWeb ? 8 : wp(4),
    borderWidth: 1.5,
    borderColor: Colors.borderline,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBox: {
    width: isWeb ? 36 : wp(12),
    height: isWeb ? 36 : wp(12),
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: isWeb ? 8 : wp(3),
    marginRight: isWeb ? 10 : wp(3),
  },
  logoBoxDark: {
    width: isWeb ? 36 : wp(12),
    height: isWeb ? 36 : wp(12),
    backgroundColor: Colors.background_color,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: isWeb ? 8 : wp(3),
    marginRight: isWeb ? 10 : wp(3),
  },
  logo: {
    width: isWeb ? 22 : wp(7),
    height: isWeb ? 22 : wp(7),
  },
});
