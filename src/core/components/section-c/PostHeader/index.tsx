import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import Feather from "@expo/vector-icons/Feather";
import Ionic from "@expo/vector-icons/Ionicons";
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
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("1.2%"),
        backgroundColor: "#000",
        borderBottomColor: "#222",
        borderBottomWidth: 0.5,
      }}
    >
      {/* NoCapLogo & Text */}
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <TouchableOpacity style={{ marginRight: wp("5%") }}>
            <Feather
              name="plus-square"
              style={{ fontSize: wp("6%"), color: "#fff" }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: wp("5%") }}>
          <Ionic
            name="heart-outline"
            style={{ fontSize: wp("6%"), color: "#fff" }}
          />
        </TouchableOpacity> */}
        {/* <TouchableOpacity>
          <Feather
            name="send"
            style={{ fontSize: wp("5.5%"), color: "#fff" }}
          />
        </TouchableOpacity> */}
      </View>
        )}
    </View>
  );
};

export default PostHeader;

const styles = StyleSheet.create({
  logo: {
    width: wp(7),
    height: wp(7),
  },
  logoBox: {
    width: wp(12),
    height: wp(12),
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp(3),
    marginRight: wp(3),
  },
  logoText: {
    fontSize: wp("6.5%"),
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Georgia",
    letterSpacing: -0.5,
  },
});