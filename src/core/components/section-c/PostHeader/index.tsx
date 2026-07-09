import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";

const PostHeader = ({
    navigation = null,
    hideActionButtons = false,
 }) => {
  return (
    <View style={styles.container}>
      {/* NoCapLogo & Text */}
      <TouchableOpacity
        style={styles.logoRow}
        onPress={() => navigation?.openDrawer()}
        activeOpacity={0.85}
      >
        <View style={styles.logoBox}>
          <Image
            source={Images.logo}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
        <Text style={styles.logoText}>NoCaps</Text>
      </TouchableOpacity>

      {/* Nocap Action Buttons */}
      {!hideActionButtons && (
        <View style={{ flexDirection: "row", alignItems: "center" }} />
      )}
    </View>
  );
};

export default PostHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#000",
    borderBottomColor: "#222",
    borderBottomWidth: 0.5,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 22,
    height: 22,
  },
  logoBox: {
    width: 38,
    height: 38,
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginRight: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Georgia",
    letterSpacing: -0.5,
  },
});