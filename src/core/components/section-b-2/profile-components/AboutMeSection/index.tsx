// src/screens/ProfileScreen/components/AboutMeSection.tsx
import React, { useState } from "react";
import { Platform, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";

const isWeb = Platform.OS === "web";
// On web, render at a fixed iPad Pro-equivalent size (1024×1366 × 0.55 cap) so
// the card doesn't inflate with the browser width; native keeps wp/hp.
const wwp = (p: number) => (isWeb ? +(p * 5.632).toFixed(1) : wp(`${p}%`));
const whp = (p: number) => (isWeb ? +(p * 7.513).toFixed(1) : hp(`${p}%`));

interface AboutMeSectionProps {
  about: string;
}

const AboutMeSection: React.FC<AboutMeSectionProps> = ({ about }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.sectionCard}>
      {/* gray line */}
      <View style={styles.divider} />
      <View style={[styles.sectionHeaderRow, !isExpanded && styles.headerCollapsed]}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <TouchableOpacity
          style={styles.collapseButton}
          onPress={toggleExpanded}
          activeOpacity={0.7}
        >
          <AntDesign
            name={isExpanded ? "up" : "down"}
            size={16}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>
      {isExpanded && <Text style={styles.aboutText}>{about}</Text>}
    </View>
  );
};

export default AboutMeSection;

const styles = StyleSheet.create({
  sectionCard: {
    marginTop: whp(0),
    backgroundColor: Colors.background_color,
    borderBottomLeftRadius: wwp(4),
    borderBottomRightRadius: wwp(4),
    paddingHorizontal: wwp(5),
    paddingVertical: whp(2.5),
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: whp(2),
  },
  headerCollapsed: {
    marginBottom: 0,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "semibold",
  },
  collapseButton: {
    width: wwp(8),
    height: wwp(8),
    borderRadius: wwp(4),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  aboutText: {
    color: "#9CA3AF",
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "regular",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.sub_title,
    marginBottom: whp(2),
  },
});