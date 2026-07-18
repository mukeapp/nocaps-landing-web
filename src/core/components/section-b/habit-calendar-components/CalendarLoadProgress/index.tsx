// CalendarLoadProgress.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Modal } from "react-native";
import { Colors } from "@/core/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";

type Props = {
  visible: boolean;
  logs: string[];
};

const CalendarLoadProgress: React.FC<Props> = ({ visible, logs }) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Loading Calendar Data...</Text>
          <ScrollView style={styles.logsContainer}>
            {logs.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log}
              </Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarLoadProgress;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: wp(85),
    maxHeight: hp(60),
    backgroundColor: Colors.title_background,
    borderRadius: wp(3),
    padding: wp(4),
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: hp(2),
    textAlign: "center",
  },
  logsContainer: {
    maxHeight: hp(50),
  },
  logText: {
    fontSize: 12,
    color: Colors.text_color,
    marginBottom: hp(0.5),
    fontFamily: "monospace",
  },
});