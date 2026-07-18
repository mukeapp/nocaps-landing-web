import React from "react";
import { View, StyleSheet } from "react-native";
import { HabitsSummary, ScoreDial } from "@/core/components/section-b";
import {HabitComponent} from "@/core/models/section-b/habit";

type Props = {
  color: string;
  habits: Array<HabitComponent>;
  score?: number;
  progressColor: string;
  label: string;
  costSymbol?: string;
  hideScore?: boolean;
};

const HabitStackSummary: React.FC<Props> = ({
  color,
  habits,
  score,
  progressColor,
  label,
  costSymbol = "",
  hideScore = false,
}) => {
  return (
    <View style={s.row}>
      <HabitsSummary color={color} habits={habits} costSymbol={costSymbol} />
      {!hideScore && <ScoreDial score={score} progressColor={progressColor} label={label} />}
    </View>
  );
};

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    //backgroundColor: "blue", // For debugging layout
  },
});

export default HabitStackSummary;
