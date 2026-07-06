import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { heightPercentageToDP as hp } from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";

interface SemiCircleProgressProps {
  progress: number;
  size: number;
  strokeWidth: number;
  backgroundColor: string;
  progressColor: string;
  statustxt: string;
}

const SemiCircleProgress = ({
  progress,
  size,
  strokeWidth,
  backgroundColor,
  progressColor,
  statustxt = "",
}: SemiCircleProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.inputback}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" // Optional: for rounded ends
          transform={`rotate(-180 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {/* Text inside the circle */}
      <View style={styles.textContainer}>
        <Text style={MainStyles.text8}>{`${progress}%`}</Text>
        {statustxt !== "UNKNOWN" ? (
          <Text
            style={[
              MainStyles.text8,
              { color: Colors.text_color, fontSize: 6 },
            ]}
          >
            {statustxt}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  text8: {
    fontSize: 8,
    color: "rgba(255, 255, 255, 1)",
    fontFamily: "medium",
  },
});

export default SemiCircleProgress;
