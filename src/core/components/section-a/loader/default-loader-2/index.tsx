import { ActivityIndicator, Modal, View, StyleSheet } from "react-native";
import React from "react";

type Props = {
  status?: boolean;
  backgroundColor?: string;
  indicatorColor?: string;
  size?: "small" | "large";
};

const DefaultLoader2: React.FC<Props> = ({
  status = false,
  backgroundColor = "rgba(0, 0, 0, 0.5)",
  indicatorColor = "#ffffff",
  size = "large"
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={status}>
      <View style={[styles.container, { backgroundColor }]}>
        <ActivityIndicator size={size} color={indicatorColor} />
      </View>
    </Modal>
  );
};

export default DefaultLoader2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});