import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/core/constants/Colors";
import { SemiCircleProgress } from "@/core/components/section-b";
import {formatCost} from "@/core/utils/utilities/numberUtils";

type Props = {
  score?: number;
  progressColor: string;
  label: string;
};

const ScoreDial: React.FC<Props> = ({ score, progressColor, label }) => {
  return (
    <View style={s.wrap}>
      <SemiCircleProgress
        progress={formatCost(score, false)}
        size={45}
        strokeWidth={4}
        backgroundColor={Colors.white}
        progressColor={progressColor}
        statustxt={label}
      />
    </View>
  );
};

const s = StyleSheet.create({
  wrap: {
    marginTop: 4,
    //backgroundColor: "red", // For debugging layout
  },
});

export default ScoreDial;
