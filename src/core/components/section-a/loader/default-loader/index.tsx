import { ActivityIndicator, Modal, View } from "react-native";
import React, { useState } from "react";

const DefaultLoader = ({ status = false }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={status}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.64)",
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
