import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import StatusIcon from "../StatusIcon";
import {formatCost} from "@/core/utils/utilities/numberUtils";

type Props = {
  costSymbol?: string | undefined;
  cost: number | undefined;
  focus?: string | undefined;
  priority?: string | undefined;
  status?: string | undefined; // STOP | PLAY | PAUSE | PREVIOUS | NEXT
  interest?: string | undefined;
};

const MetaRow: React.FC<Props> = ({ costSymbol = "", cost, focus, priority, status, interest }) => {
  return (
    <View style={s.metaRow}>
      <View style={s.tag}>
        <Text style={MainStyles.text10}>{costSymbol} {formatCost(cost)}</Text>
      </View>

      {/* {!!focus && (
        <View style={s.tag}>
          <Text style={MainStyles.text10}>{focus}</Text>
        </View>
      )} */}

      {/* {!!priority && (
        <View style={[s.tag, { maxWidth: "30%" }]}>
          <Text style={MainStyles.text10} numberOfLines={1}>
            {priority}
          </Text>
        </View>
      )} */}

      {!!interest && (
        <View style={[s.tag, { maxWidth: "100%" }]}>
          <Text style={MainStyles.text10} numberOfLines={1}>
            {interest}
          </Text>
        </View>
      )}

      <View style={s.status}>
        <StatusIcon status={status} />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: hp("1%") },
  tag: {
    backgroundColor: Colors.text_background,
    paddingHorizontal: wp("2%"),
    height: hp("2.5%"),
    borderRadius: wp("10%"),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("1%"),
  },
  status: {
    backgroundColor: Colors.text_background,
    paddingHorizontal: hp("0.7%"),
    paddingVertical: hp("0.7%"),
    borderRadius: wp("4%"),
  },
});

export default MetaRow;
