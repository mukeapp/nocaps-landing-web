import { ActivityIndicator, Modal, Platform, View } from "react-native";
import React from "react";

const DefaultLoader = ({ status = false }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={status}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          alignItems: "center",
          justifyContent: "center",
          ...(Platform.OS === "web" ? { backdropFilter: "blur(4px)" } : {}),
        }}
      >
        <ActivityIndicator size="large" color={"#ffffff"} />
      </View>
    </Modal>
  );
};

export default DefaultLoader;
