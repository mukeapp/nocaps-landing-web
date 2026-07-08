import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import {
    heightPercentageToDP as _hp,
    widthPercentageToDP as _wp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _wp(p);
const hp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _hp(p);
import { HabitStackMarketCardProps } from "./HabitStackMarketCard";

const MarketSectionHeader: React.FC<HabitStackMarketCardProps> = ({
  name,
  avatar,
  rating,
  price,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
         <Image source={avatar} style={styles.avatar} resizeMode="cover" />
         <Text style={styles.userName} numberOfLines={1}>{name}</Text>
         <AntDesign name="star" size={12} color="#FFD700" style={{ marginRight: 4 }} />
         <Text style={styles.rating}>{rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.price}>${price.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(0),

    padding: wp(3),
    backgroundColor: Colors.title_background,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    marginRight: wp(2),
  },
  userName: {
    ...MainStyles.text12,
    color: Colors.white,
    marginRight: wp(2),
    maxWidth: wp(15),
  },
  rating: {
    ...MainStyles.text12,
    color: Colors.white,
  },
  price: {
    ...MainStyles.text12,
    color: Colors.white,
  },
});

export default MarketSectionHeader;
