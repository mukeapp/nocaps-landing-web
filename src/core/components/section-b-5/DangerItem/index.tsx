import {Colors} from "@/core/constants/Colors";
import React from "react";
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    heightPercentageToDP as _hp,
    widthPercentageToDP as _wp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _wp(p));
const hp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _hp(p));

interface Props {
  icon: string;
  label: string;
  sublabel: string;
  onPress: () => void;
  loading?: boolean;
  hideBorder?: boolean;
}

const DangerItem = ({
  icon,
  label,
  sublabel,
  onPress,
  loading,
  hideBorder,
}: Props) => (
  <TouchableOpacity
    style={[s.dangerItem, hideBorder && { borderBottomWidth: 0 }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={s.dangerIconWrap}>
      {loading ? (
        <ActivityIndicator size="small" color={Colors.colorred} />
      ) : (
        <Text style={s.dangerEmoji}>{icon}</Text>
      )}
    </View>
    <View style={s.dangerTextCol}>
      <Text style={s.dangerTitle}>{label}</Text>
      <Text style={s.dangerSubtitle}>{sublabel}</Text>
    </View>
    <Text style={s.dangerChevron}>›</Text>
  </TouchableOpacity>
);

export default DangerItem;

const s = StyleSheet.create({
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.8),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    gap: wp(3.5),
  },
  dangerIconWrap: {
    width: wp(9.5),
    height: wp(9.5),
    borderRadius: wp(2.5),
    backgroundColor: "rgba(230,57,70,0.12)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dangerEmoji: { fontSize: wp(4.5) },
  dangerTextCol: { flex: 1 },
  dangerTitle: {
    fontSize: wp(3.5),
    fontFamily: "medium",
    color: Colors.colorred,
  },
  dangerSubtitle: {
    fontSize: wp(2.8),
    fontFamily: "regular",
    color: "#6b7280",
    marginTop: hp(0.3),
  },
  dangerChevron: { fontSize: wp(5), color: "#4b5563" },
});
