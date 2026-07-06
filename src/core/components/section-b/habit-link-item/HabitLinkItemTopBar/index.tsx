import React from "react";
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp } from "@/core/utils/responsive";
import { View, TouchableOpacity, Image, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { MainStyles } from "@/core/constants/styles";
import { Images } from "@/core/constants/Images";
import { Colors } from "@/core/constants/Colors";
import {TopBar} from "../..";

type Props = {
  title: string;
  onBack: () => void;
};

const HabitLinkItemTopBar: React.FC<Props> = ({ title, onBack }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.icnview} onPress={onBack}>
        <FontAwesome6 name="arrow-left" size={17} color={Colors.background_color} />
      </TouchableOpacity>

      <Text style={[MainStyles.text16white, styles.title]}>{title}</Text>

      <TouchableOpacity style={[styles.icnview, styles.icnGhost]} onPress={onBack}>
        <Image source={Images.file} resizeMode="contain" style={styles.file} />
      </TouchableOpacity>
    </View>
  );
};

export default HabitLinkItemTopBar;


export const styles = StyleSheet.create({
  container: {
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
  icnGhost: { backgroundColor: "transparent" },
  file: { width: wp(6), height: wp(6) },
  title: { marginLeft: wp(2) },
});
