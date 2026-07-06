import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { widthPercentageToDP as wp } from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { MainStyles } from "@/core/constants/styles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const Header = ({ txt = "", show = true, navigation = { navigation } }) => {
  const router = useRouter();

  return (
    <View style={styles.main}>
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
      <View style={styles.mid}>
        <Text
          style={
            show
              ? [MainStyles.text16white, { marginRight: wp(2) }]
              : [
                  MainStyles.text20semibold,
                  { marginRight: wp(2), letterSpacing: 1 },
                ]
          }
        >
          {txt}
        </Text>
        {show ? (
          <MaterialCommunityIcons
            name="eye-outline"
            size={21}
            color={Colors.white}
          />
        ) : null}
      </View>
      {show ? (
        <Ionicons name="settings-outline" size={22} color={Colors.white} />
      ) : null}
      {txt == "HABIT LINK" ? (
        <TouchableOpacity style={styles.icnviews} onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icnview: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(4),
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  mid: {
    flexDirection: "row",
    alignItems: "center",
  },
  icnviews: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    borderWidth: 1.5,
    borderColor: Colors.borderline,
    alignItems: "center",
    justifyContent: "center",
  },
});
