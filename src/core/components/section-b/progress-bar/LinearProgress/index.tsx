import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";

const isWeb = Platform.OS === "web";

interface LinearProgressProps {
  progress: number; // 0 - 100
  backgroundColor: string;
  progressColor: string;
}

const LinearProgress = ({
  progress,
  backgroundColor,
  progressColor,
}: LinearProgressProps) => {
  return (
    <View
      style={[styles.container, { borderWidth: 1, borderColor: progressColor }]}
    >
      <View
        style={[
          styles.progressBar,
          { width: `${progress}%`, backgroundColor: progressColor },
        ]}
      />
      <Text
        style={[
          MainStyles.text8,
          { position: "absolute", alignSelf: "center", color: Colors.white },
        ]}
      >{`${progress}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: isWeb ? 80 : wp(19),
    borderRadius: 5.5,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  progressBar: {
    height: isWeb ? 8 : hp(1.4),
  },
});

export default LinearProgress;
