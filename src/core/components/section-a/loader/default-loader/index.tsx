import { ActivityIndicator, Modal, Platform, View } from "react-native";
import React from "react";

const isWeb = Platform.OS === "web";

const DefaultLoader = ({ status = false }) => {
  if (!status) return null;

  // On web, use a simple conditional render instead of <Modal> to avoid
  // React Native Web's portal-based Modal which can cause
  // "Node.removeChild: The node to be removed is not a child of this node"
  // errors when visibility toggles during navigation or re-renders.
  if (isWeb) {
    return (
      <View
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
      >
        <ActivityIndicator size="large" color={"#ffffff"} />
      </View>
    );
  }

  return (
    <Modal animationType="fade" transparent={true} visible={status}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={"#ffffff"} />
      </View>
    </Modal>
  );
};

export default DefaultLoader;
