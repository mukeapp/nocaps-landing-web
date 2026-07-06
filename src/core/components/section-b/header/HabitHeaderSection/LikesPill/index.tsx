import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { widthPercentageToDP as wp } from "@/core/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";

type Props = {
  likesCount: number;
};

const LikesPill: React.FC<Props> = ({ likesCount }) => {
  return (
    <View style={s.likes}>
      {likesCount > 0 ? (
        <MaterialCommunityIcons name="cards-heart" size={13} color={Colors.colorred} />
      ) : (
        <FontAwesome5 name="heart" size={13} color={Colors.white} />
      )}
      {likesCount > 0 && <Text style={MainStyles.text10}> {likesCount}</Text>}
    </View>
  );
};

const s = StyleSheet.create({
  likes: { flexDirection: "row", alignItems: "center", marginLeft: wp("2%") },
});

export default LikesPill;
