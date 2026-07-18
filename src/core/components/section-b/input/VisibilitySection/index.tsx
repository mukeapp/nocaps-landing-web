import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { MainStyles } from "@/core/constants/styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";

type Props = {
  isPublic: boolean;
  onTogglePublic: (v: boolean) => void;
  hideFromFriends: boolean;
  onToggleHideFromFriends: (v: boolean) => void;
};

const VisibilitySection: React.FC<Props> = ({
  isPublic,
  onTogglePublic,
  hideFromFriends,
  onToggleHideFromFriends,
}) => (
  <View style={s.container}>
    <Text style={MainStyles.text14}>Visibility</Text>

    <View style={s.row}>
      <View style={s.labelGroup}>
        <Text style={s.label}>Public</Text>
        <Text style={s.subtitle}>Visible to everyone</Text>
      </View>
      <Switch
        value={isPublic}
        onValueChange={onTogglePublic}
        trackColor={{ false: Colors.gray, true: Colors.white }}
        thumbColor={isPublic ? Colors.background_color : Colors.white}
      />
    </View>

    <View style={s.row}>
      <View style={s.labelGroup}>
        <Text style={s.label}>Hide From Friends</Text>
        <Text style={s.subtitle}>Friends won't see this stack</Text>
      </View>
      <Switch
        value={hideFromFriends}
        onValueChange={onToggleHideFromFriends}
        trackColor={{ false: Colors.gray, true: Colors.white }}
        thumbColor={hideFromFriends ? Colors.background_color : Colors.white}
      />
    </View>
  </View>
);

const s = StyleSheet.create({
  container: {
    marginTop: hp(2),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    marginTop: hp(1),
  },
  labelGroup: {
    flex: 1,
    marginRight: wp(3),
  },
  label: {
    color: Colors.white,
    fontFamily: "poppins_semibold",
    fontSize: wp(3.8),
  },
  subtitle: {
    color: Colors.gray,
    fontFamily: "poppins_regular",
    fontSize: wp(3.2),
    marginTop: hp(0.3),
  },
});

export default VisibilitySection;
