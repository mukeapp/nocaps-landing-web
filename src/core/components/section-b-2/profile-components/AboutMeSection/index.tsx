// src/screens/ProfileScreen/components/AboutMeSection.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";

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
    marginTop: hp("0%"),
    backgroundColor: Colors.background_color,
    borderBottomLeftRadius: wp("4%"),
    borderBottomRightRadius: wp("4%"),
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2.5%"),
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("2%"),
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
    width: wp("8%"),
    height: wp("8%"),
    borderRadius: wp("4%"),
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
    marginBottom: hp("2%"),
  },
});