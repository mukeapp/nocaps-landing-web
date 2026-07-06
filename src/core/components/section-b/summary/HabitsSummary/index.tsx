import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MainStyles } from "@/core/constants/styles";
import { formatCost, truncateString } from "@/core/utils";
import { Unit } from "@/core/models/section-b/unit";
import { HabitComponent } from "@/core/models/section-b";
import { fetchUnitsByDocumentId } from "@/core/services/section-b/section-b-0/units";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";

type Props = {
  costSymbol?: string;
  color: string;
  habits: Array<HabitComponent>;
};

const HabitsSummary: React.FC<Props> = ({ costSymbol = "", color, habits }) => {
  const [costUnit, setCostUnit] = React.useState<Unit | undefined>(undefined);

  useEffect(() => {
    const fetchUnit = async () => {
      if (costSymbol && costSymbol !== "") {
        return;
      }
      if (habits.length === 0) {
        return;
      }
      const unit = habits[0]?.unit;
      const fetchedUnits = await fetchUnitsByDocumentId(unit || "");
      if (fetchedUnits && fetchedUnits.length > 0) {
        setCostUnit(fetchedUnits[0]);
      }
    };
    fetchUnit();
  }, [habits]);

  if (habits.length === 0) return null;

  return (
    <View style={s.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {habits.map((habit, index) => {
          const isLast = index === habits.length - 1;
          return (
            <View
              key={`${habit?.name ?? index}-${index}`}
              style={[s.card, !isLast && s.cardSpacing]}
            >
              {/* Gradient-like top accent bar */}
              <View style={[s.accentBar, { backgroundColor: color }]} />

              <View style={s.cardBody}>
                {/* Habit name row */}
                <View style={s.nameRow}>
                  <View style={[s.dot, { backgroundColor: color }]} />
                  <Text style={s.habitName} numberOfLines={1}>
                    {truncateString(habit?.name ?? "", 18)}
                  </Text>
                </View>

                {/* Cost display */}
                <View style={s.costRow}>
                  <Text style={s.costLabel}>Cost</Text>
                  <Text style={[s.costValue, { color }]}>
                    {costUnit?.symbol || costSymbol}{" "}
                    {formatCost(habit?.scoreComponent?.cost)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  wrap: {
    width: "80%",
  },
  scrollContent: {
    paddingRight: wp(4),
    paddingVertical: hp(0.5),
  },
  card: {
    backgroundColor: Colors.content_back,
    borderRadius: 12,
    overflow: "hidden",
    minWidth: wp(28),
    maxWidth: wp(40),
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  cardSpacing: {
    marginRight: wp(2.5),
  },
  accentBar: {
    height: 3,
    width: "100%",
  },
  cardBody: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.8),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  habitName: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: "semibold",
    flexShrink: 1,
  },
  costRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 14,
  },
  costLabel: {
    fontSize: 10,
    color: Colors.text_color,
    fontFamily: "regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  costValue: {
    fontSize: 13,
    fontFamily: "bold",
  },
});

export default HabitsSummary;