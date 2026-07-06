// src/screens/ProfileScreen/components/PostHabitToggle.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";

interface PostHabitToggleProps {
  activeToggle: "post" | "habitStacks";
  setActiveToggle: (toggle: "post" | "habitStacks") => void;
}

const PostHabitToggle: React.FC<PostHabitToggleProps> = ({
  activeToggle,
  setActiveToggle
}) => {
  return (
    <View style={styles.toggleContainer}>
      <View style={styles.togglePill}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeToggle === "post" && styles.toggleButtonActive,
          ]}
          onPress={() => setActiveToggle("post")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.toggleText,
              activeToggle === "post" && styles.toggleTextActive,
            ]}
          >
            Post
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeToggle === "habitStacks" && styles.toggleButtonActive,
          ]}
          onPress={() => setActiveToggle("habitStacks")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.toggleText,
              activeToggle === "habitStacks" && styles.toggleTextActive,
            ]}
          >
            HabitStacks
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostHabitToggle;

const styles = StyleSheet.create({
  toggleContainer: {
    marginTop: hp("2%"),
    alignItems: "center",
  },
  togglePill: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: wp("10%"),
    padding: wp("1%"),
    width: wp("90%"),
  },
  toggleButton: {
    flex: 1,
    borderRadius: wp("9%"),
    paddingVertical: hp("1.8%"),
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: Colors.white,
  },
  toggleText: {
    color: "#6B7280",
    fontSize: 16,
    fontFamily: "semibold",
  },
  toggleTextActive: {
    color: Colors.black,
  },
});