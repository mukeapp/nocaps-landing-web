import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";
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
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: wp(2),
  },
  userName: {
    fontSize: 13,
    color: Colors.white,
    fontFamily: "poppins_semibold",
    marginRight: wp(2),
    maxWidth: 120,
  },
  rating: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: "poppins_semibold",
  },
  price: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: "poppins_semibold",
  },
});

export default MarketSectionHeader;
