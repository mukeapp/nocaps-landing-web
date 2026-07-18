import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { formatCost } from "@/core/utils/utilities/numberUtils";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  fs,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";

type Props = {
  cost: number;
  focus?: string;
  priority?: string;
  statusIcon?: string;
  costSymbol?: string;
  hideHabitStackCost?: boolean; // If true, the cost of the habit stack will be hidden
};

const MetaRow: React.FC<Props> = ({ cost, focus, priority, statusIcon = "play", costSymbol = "", hideHabitStackCost = false }) => {
  return (
    <View style={s.metaRow}>
      <View style={s.tagsWrap}>
        {!hideHabitStackCost && (
          <View style={s.costTag}>
            <Text style={MainStyles.text10}>
              {costSymbol} {formatCost(cost)}
            </Text>
          </View>
        )}

        {!!focus && (
          <View style={s.costTag}>
            <Text style={MainStyles.text10}>{focus}</Text>
          </View>
        )}

        {!!priority && (
          <View style={s.tag}>
            <Text style={MainStyles.text10} numberOfLines={1} ellipsizeMode="tail">
              {priority}
            </Text>
          </View>
        )}
      </View>

      {statusIcon && statusIcon === "play" && (
        <View style={s.status}>
          <Feather name={statusIcon} size={fs(13)} color={Colors.white} />
        </View>
      )}

      {statusIcon && statusIcon === "stop" && (
        <View style={s.status}>
          <FontAwesome name={statusIcon} size={fs(13)} color={Colors.white} />
        </View>
      )}

      {statusIcon && statusIcon === "pause" && (
        <View style={s.status}>
          <Feather name={statusIcon} size={fs(13)} color={Colors.white} />
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: isWeb ? 6 : hp(1),
  },
  tagsWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  costTag: {
    backgroundColor: Colors.text_background,
    paddingHorizontal: isWeb ? 8 : wp(2),
    height: isWeb ? 22 : hp(3),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginRight: isWeb ? 6 : wp(1.5),
    flexShrink: 0,
  },
  tag: {
    backgroundColor: Colors.text_background,
    paddingHorizontal: isWeb ? 8 : wp(2),
    height: isWeb ? 22 : hp(3),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginRight: isWeb ? 6 : wp(1.5),
    flexShrink: 1,
    minWidth: isWeb ? 60 : wp(10),
  },
  status: {
    backgroundColor: Colors.text_background,
    width: isWeb ? 26 : wp(7),
    height: isWeb ? 26 : wp(7),
    borderRadius: isWeb ? 13 : wp(3.5),
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginLeft: isWeb ? 6 : wp(1.5),
  },
});

export default MetaRow;
