import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import { MainStyles } from "@/core/constants/styles";

type Props = {
  personsCount: number;
  onInc: () => void;
  onDec: () => void;

  friends: any[];
  onAddFriend: () => void;
};

const PersonsFriendsInputRow: React.FC<Props> = ({ personsCount, onInc, onDec, friends, onAddFriend }) => {
  return (
    <View style={{ marginTop: hp(2) }}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={MainStyles.text14}># of Persons</Text>
          <View style={styles.ofperson}>
            <TouchableOpacity style={styles.minus} onPress={onDec}>
              <AntDesign name="minus" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.mid}>
              <MaterialIcons name="person-outline" size={18} color={Colors.white} />
              <Text style={[MainStyles.text16white, { marginLeft: wp(2) }]}>{personsCount}</Text>
            </View>
            <TouchableOpacity style={styles.plus} onPress={onInc}>
              <AntDesign name="plus" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.col}>
          <Text style={MainStyles.text14}>Person Analogous</Text>
          <View style={styles.musicview}>
            {friends.slice(0, 2).map((_, index) => (
              <View key={index} style={[styles.proview, { right: index !== 0 ? wp(2.3 * index) : 0 }]}>
                <Image source={Images.profile} resizeMode="contain" style={styles.proshow} />
              </View>
            ))}

            {friends.length > 2 && (
              <View style={[styles.plus2, { right: wp(2.3 * 2) }]}>
                <Text style={MainStyles.text14}>{friends.length - 2}+</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.onlyplus, { right: wp(2.3 * 2 + (friends.length > 2 ? 2.7 : 2.3)) }]}
              onPress={onAddFriend}
            >
              <AntDesign name="plus" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  col: { },
  ofperson: {
    width: wp(44), height: hp(6), backgroundColor: Colors.content_back, borderRadius: wp(3),
    marginTop: hp(1), flexDirection: "row", alignItems: "center", justifyContent: "space-between", overflow: "hidden",
  },
  minus: { backgroundColor: Colors.text_background, width: wp(13), height: hp(6), alignItems: "center", justifyContent: "center" },
  mid: { height: hp(6), flexDirection: "row", alignItems: "center", justifyContent: "center" },
  plus: { backgroundColor: Colors.text_background, width: wp(13), height: hp(6), alignItems: "center", justifyContent: "center" },
  musicview: {
    width: wp(29), height: hp(6), backgroundColor: "transparent", borderRadius: wp(3),
    marginTop: hp(1), flexDirection: "row", alignItems: "center", justifyContent: "flex-end",
  },
  proview: { width: wp(10.5), height: wp(10.5), borderRadius: wp(6), borderWidth: 1, borderColor: Colors.black, overflow: "hidden" },
  proshow: { width: wp(10), height: wp(10), borderRadius: wp(5) },
  plus2: {
    backgroundColor: "rgba(70, 70, 70, 1)", width: wp(10), height: wp(10), borderRadius: wp(5),
    borderWidth: 1, borderColor: Colors.black, justifyContent: "center", alignItems: "center",
  },
  onlyplus: {
    backgroundColor: Colors.white, width: wp(10), height: wp(10), borderRadius: wp(5),
    borderWidth: 1, borderColor: Colors.black, justifyContent: "center", alignItems: "center", overflow: "hidden",
  },
});

export default PersonsFriendsInputRow;
