import {Colors} from "@/core/constants/Colors";
import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import {ModalConfig} from "../types";

interface Props {
  visible: boolean;
  config: ModalConfig | null;
  onCancel: () => void;
}

const ConfirmModal = ({ visible, config, onCancel }: Props) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onCancel}
  >
    <Pressable style={s.modalBackdrop} onPress={onCancel}>
      <View style={s.modalSheet}>
        <View style={s.modalHandle} />
        <Text style={s.modalTitle}>{config?.title}</Text>
        <Text style={s.modalMessage}>{config?.message}</Text>
        <TouchableOpacity
          style={s.modalConfirmBtn}
          onPress={config?.onConfirm}
          activeOpacity={0.85}
        >
          <Text style={s.modalConfirmText}>{config?.confirmLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.modalCancelBtn}
          onPress={onCancel}
          activeOpacity={0.85}
        >
          <Text style={s.modalCancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);

export default ConfirmModal;

const s = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#1c1c28",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    padding: wp(6),
    paddingBottom: hp(5),
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  modalHandle: {
    width: wp(9),
    height: hp(0.5),
    borderRadius: 2,
    backgroundColor: "#374151",
    alignSelf: "center",
    marginBottom: hp(3),
  },
  modalTitle: {
    fontSize: wp(4.5),
    fontFamily: "bold",
    color: "#f1f5f9",
    marginBottom: hp(1.2),
  },
  modalMessage: {
    fontSize: wp(3.3),
    fontFamily: "regular",
    color: "#9ca3af",
    lineHeight: wp(5),
    marginBottom: hp(3.5),
  },
  modalConfirmBtn: {
    backgroundColor: Colors.colorred,
    borderRadius: wp(3.5),
    paddingVertical: hp(1.9),
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  modalConfirmText: { fontSize: wp(3.8), fontFamily: "bold", color: "#fff" },
  modalCancelBtn: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: wp(3.5),
    paddingVertical: hp(1.9),
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: wp(3.8),
    fontFamily: "medium",
    color: "#9ca3af",
  },
});
