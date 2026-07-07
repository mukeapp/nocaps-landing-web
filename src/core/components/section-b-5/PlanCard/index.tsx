import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {
  heightPercentageToDP as _hp,
  widthPercentageToDP as _wp,
} from "@/core/utils/responsive";
import {Plan} from "../types";

const isWeb = Platform.OS === "web";
const wp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _wp(p));
const hp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _hp(p));

interface Props {
  plan: Plan;
  selected: boolean;
  onPress: () => void;
  onInfo: () => void;
}

const PlanCard = ({plan, selected, onPress, onInfo}: Props) => (
  <TouchableOpacity
    style={[s.planCard, selected && s.planCardSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    {/* radio */}
    <View style={[s.planRadio, selected && s.planRadioSelected]}>
      {selected && <Text style={s.planRadioCheck}>✓</Text>}
    </View>

    {/* info button */}
    <TouchableOpacity
      style={s.planInfoBtn}
      onPress={onInfo}
      hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}
    >
      <MaterialIcons name="info-outline" size={wp(3.5)} color="#6b7280" />
    </TouchableOpacity>

    {/* plan name */}
    <TouchableOpacity onPress={onInfo} activeOpacity={0.7}>
      <Text
        style={[s.planDuration, selected && s.planDurationSelected]}
        numberOfLines={1}
      >
        {plan.name}
      </Text>
    </TouchableOpacity>

    {/* price */}
    <TouchableOpacity onPress={onInfo} activeOpacity={0.7}>
      <Text style={[s.planPrice, selected && s.planPriceSelected]}>
        {plan.price}
      </Text>
    </TouchableOpacity>

    {/* credits badge */}
    {plan.credits > 0 && (
      <TouchableOpacity onPress={onInfo} activeOpacity={0.7}>
        <View style={[s.planLabelPill, selected && s.planLabelPillSelected]}>
          <Text style={[s.planLabelText, selected && {color: "#fff"}]}>
            {plan.credits.toLocaleString()} credits
          </Text>
        </View>
      </TouchableOpacity>
    )}
  </TouchableOpacity>
);

export default PlanCard;

const s = StyleSheet.create({
  planCard: {
    flex: 1,
    borderRadius: wp(4),
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: wp(3.5),
    paddingTop: wp(5),
    position: "relative",
  },
  planCardSelected: {
    backgroundColor: "#e8e8e8",
    borderColor: "#d1d5db",
    borderWidth: 2,
  },
  planRadio: {
    position: "absolute",
    top: -wp(2.8),
    alignSelf: "center",
    width: wp(5.5),
    height: wp(5.5),
    borderRadius: wp(2.75),
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  planRadioSelected: {backgroundColor: "#111", borderColor: "#111"},
  planRadioCheck: {color: "#fff", fontSize: wp(2.5), fontFamily: "bold"},
  planLabelPill: {
    backgroundColor: "#2a2a3a",
    borderRadius: wp(2),
    paddingHorizontal: wp(1),
    paddingVertical: hp(0.4),
    alignSelf: "flex-start",
    marginBottom: hp(0.8),
  },
  planLabelPillSelected: {backgroundColor: "#111"},
  planLabelText: {fontSize: wp(2), fontFamily: "bold", color: "#ccc"},
  planDuration: {
    fontSize: wp(5.5),
    fontFamily: "bold",
    color: "#fff",
    lineHeight: wp(9),
  },
  planDurationSelected: {color: "#111"},
  planPrice: {fontSize: wp(3), fontFamily: "bold", color: "#fff"},
  planPriceSelected: {color: "#111"},
  planInfoBtn: {
    position: "absolute",
    top: wp(2),
    right: wp(2),
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
});
