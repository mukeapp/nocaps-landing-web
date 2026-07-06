import {Colors} from "@/core/constants/Colors";
import {HabitLinkComponent} from "@/core/models/section-b";
import {formatCost} from "@/core/utils/utilities/numberUtils";
import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";

interface Props {
  habitLinkComponent: HabitLinkComponent;
  symbol?: string;
  total: string;
}

const HabitLinkCostBar: React.FC<Props> = ({
  habitLinkComponent,
  symbol = "",
  total,
}) => {
  const score = habitLinkComponent?.scoreComponent?.score ?? 0;
  const scoreLabel = habitLinkComponent?.scoreComponent?.scoreInfo?.label ?? "";
  const scoreRgb =
    habitLinkComponent?.scoreComponent?.scoreInfo?.rgb ?? "rgb(128,128,128)";
  const pct = Math.min(Math.max(score, 0), 100);

  return (
    <View style={styles.container}>
      {/* Progress bar row */}
      <View style={styles.barRow}>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              { width: `${pct}%` as any, backgroundColor: scoreRgb },
            ]}
          />
        </View>
        <Text style={[styles.pctText, { color: scoreRgb }]}>{formatCost(pct, false)}%</Text>
      </View>

      {/* Cost + score label row */}
      <View style={styles.bottomRow}>
        <View style={styles.costGroup}>
          <Text style={styles.amount}>
            {symbol}
            {total}
          </Text>
          <Text style={styles.costLabel}>total cost</Text>
        </View>

        {!!scoreLabel && (
          <View style={[styles.badge, { borderColor: scoreRgb }]}>
            <Text style={[styles.badgeText, { color: scoreRgb }]}>
              {scoreLabel}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default HabitLinkCostBar;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    paddingBottom: hp(1.5),
    marginHorizontal: wp(4),
    marginBottom: hp(1.5),
    borderRadius: 16,
    backgroundColor: Colors.content_back,
    gap: hp(1),
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  barTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
  },
  pctText: {
    fontSize: wp(3.2),
    fontFamily: "poppins_semibold",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  costGroup: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: wp(1.5),
  },
  amount: {
    color: Colors.white,
    fontSize: wp(5.5),
    fontFamily: "poppins_semibold",
  },
  costLabel: {
    color: Colors.text_color,
    fontSize: wp(3.5),
    fontFamily: "poppins_regular",
  },
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
  },
  badgeText: {
    fontSize: wp(3.2),
    fontFamily: "poppins_semibold",
  },
});
