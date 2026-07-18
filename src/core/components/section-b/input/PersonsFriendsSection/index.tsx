import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import { MainStyles } from "@/core/constants/styles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "@/core/utils/responsive";

type Props = {
  personsCount: number;
  inc: () => void;
  dec: () => void;
  friends: any[];
  onAddFriend: () => void;
  hideParteners?: boolean;
};

const PersonsFriendsSection: React.FC<Props> = ({ personsCount, inc, dec, friends, onAddFriend, hideParteners = false }) => (
  <View style={[MainStyles.viewtwo, { marginTop: hp(2) }]}>
    <View style={MainStyles.newview}>
      <Text style={MainStyles.text14}># of Persons</Text>
      <View style={s.ofperson}>
        <TouchableOpacity style={s.minus} onPress={dec}>
          <AntDesign name="minus" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={s.mid}>
          <MaterialIcons name="person-outline" size={18} color={Colors.white} />
          <Text style={[MainStyles.text16white, { marginLeft: wp(2) }]}>{personsCount}</Text>
        </View>
        <TouchableOpacity style={s.plus} onPress={inc}>
          <AntDesign name="plus" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>

    {!hideParteners && (
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Habit Stack Parteners</Text>
        <View style={[s.musicview, { paddingHorizontal: 0, backgroundColor: "transparent", justifyContent: "flex-end" }]}>
          {friends?.slice(0, 2).map((_, idx) => (
            <View key={idx} style={[s.proview, { right: idx ? wp(2.3 * idx) : 0 }]}>
              <Image source={Images.profile} resizeMode="contain" style={s.proshow} />
            </View>
        ))}

        {friends?.length > 2 && (
          <View style={[s.plus2, { right: wp(2.3 * 2) }]}>
            <Text style={MainStyles.text14}>{friends.length - 2}+</Text>
          </View>
        )}

        <TouchableOpacity
          style={[s.onlyplus, { right: wp(2.3 * 2 + (friends.length > 2 ? 2.7 : 2.3)) }]}
          onPress={onAddFriend}
        >
          <AntDesign name="plus" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>
    </View>
    )}
  </View>
);

const s = StyleSheet.create({
  ofperson: {
    width: wp(44), height: hp(6), backgroundColor: Colors.content_back, borderRadius: wp(3),
    marginTop: hp(1), flexDirection: "row", alignItems: "center", justifyContent: "space-between", overflow: "hidden",
  },
  minus: { backgroundColor: Colors.text_background, width: wp(13), height: hp(6), alignItems: "center", justifyContent: "center" },
  plus:  { backgroundColor: Colors.text_background, width: wp(13), height: hp(6), alignItems: "center", justifyContent: "center" },
  mid: { height: hp(6), flexDirection: "row", alignItems: "center", justifyContent: "center" },

  musicview: {
    width: wp(29), height: hp(6), backgroundColor: Colors.content_back, borderRadius: wp(3),
    marginTop: hp(1), flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  proview: {
    width: wp(10.5), height: wp(10.5), borderRadius: wp(6), borderWidth: 1, borderColor: Colors.black, overflow: "hidden",
  },
  proshow: { width: wp(10), height: wp(10), borderRadius: wp(5) },
  onlyplus: { backgroundColor: Colors.white, width: wp(10), height: wp(10), borderRadius: wp(5),
    borderWidth: 1, borderColor: Colors.black, justifyContent: "center", alignItems: "center", overflow: "hidden" },
  plus2: { backgroundColor: "rgba(70,70,70,1)", width: wp(10), height: wp(10), borderRadius: wp(5),
    borderWidth: 1, borderColor: Colors.black, justifyContent: "center", alignItems: "center" },
});

export default PersonsFriendsSection;
