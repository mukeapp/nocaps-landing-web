import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import StatusIcon from "../StatusIcon";
import {formatCost} from "@/core/utils/utilities/numberUtils";

const isWeb = Platform.OS === "web";

type Props = {
  costSymbol?: string;
  cost: number;
  focus?: string;
  priority?: string;
  status?: string; // STOP | PLAY | PAUSE | PREVIOUS | NEXT
  interest?: string;
};

const MetaRow: React.FC<Props> = ({ costSymbol = "", cost, focus, priority, status, interest }) => {
  return (
    <View style={s.metaRow}>
      <View style={s.tag}>
        <Text style={MainStyles.text10}>{costSymbol}{formatCost(cost)}</Text>
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
        <View style={[s.tag, { maxWidth: "40%" }]}>
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
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: isWeb ? 6 : hp("1%") },
  tag: {
    backgroundColor: Colors.text_background,
    paddingHorizontal: isWeb ? 8 : wp("2%"),
    height: isWeb ? 22 : hp("2.5%"),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginRight: isWeb ? 4 : wp("1%"),
  },
  status: {
    backgroundColor: Colors.text_background,
    paddingHorizontal: isWeb ? 6 : hp("0.7%"),
    paddingVertical: isWeb ? 6 : hp("0.7%"),
    borderRadius: isWeb ? 8 : wp("4%"),
  },
});

export default MetaRow;
