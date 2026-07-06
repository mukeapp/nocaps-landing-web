import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
  Linking,
  Modal,
  Platform,
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

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DowngradeSheet = ({ visible, onClose, onConfirm }: Props) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <Pressable style={s.backdrop} onPress={onClose}>
      <View style={s.sheet} onStartShouldSetResponder={() => true}>
        <View style={s.handle} />

        <View style={s.iconRow}>
          <MaterialIcons name="warning-amber" size={wp(10)} color="#f59e0b" />
        </View>

        <Text style={s.title}>Switching to Free Plan</Text>

        <Text style={s.body}>
          Your plan will be updated to Free (0 credits) inside the app.
        </Text>
        <Text style={s.bodyEmphasis}>
          To stop being billed, you must cancel your subscription directly
          through the App Store or Google Play.
        </Text>

        <TouchableOpacity
          style={s.manageBtn}
          onPress={() => {
            const url =
              Platform.OS === "ios"
                ? "https://apps.apple.com/account/subscriptions"
                : "https://play.google.com/store/account/subscriptions";
            Linking.openURL(url).catch(() => {});
          }}
          activeOpacity={0.85}
        >
          <MaterialIcons name="open-in-new" size={wp(4.5)} color="#111" />
          <Text style={s.manageBtnText}>Manage Subscriptions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.confirmBtn}
          onPress={onConfirm}
          activeOpacity={0.85}
        >
          <Text style={s.confirmBtnText}>Confirm Downgrade</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.cancelBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={s.cancelBtnText}>Not Now</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);

export default DowngradeSheet;

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1C1C2E",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    padding: wp(6),
    paddingBottom: hp(5),
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  handle: {
    width: wp(9),
    height: hp(0.5),
    borderRadius: 2,
    backgroundColor: "#374151",
    alignSelf: "center",
    marginBottom: hp(2.5),
  },
  iconRow: {
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  title: {
    fontSize: wp(5),
    fontFamily: "bold",
    color: "#f1f5f9",
    textAlign: "center",
    marginBottom: hp(1.5),
  },
  body: {
    fontSize: wp(3.5),
    fontFamily: "regular",
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: wp(5.5),
    marginBottom: hp(1),
  },
  bodyEmphasis: {
    fontSize: wp(3.5),
    fontFamily: "medium",
    color: "#f59e0b",
    textAlign: "center",
    lineHeight: wp(5.5),
    marginBottom: hp(3),
  },
  manageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    backgroundColor: "#f1f5f9",
    borderRadius: wp(3.5),
    paddingVertical: hp(2),
    marginBottom: hp(1.5),
  },
  manageBtnText: {
    fontSize: wp(4.2),
    fontFamily: "bold",
    color: "#111",
  },
  confirmBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: wp(3.5),
    paddingVertical: hp(1.8),
    alignItems: "center",
    marginBottom: hp(1.2),
  },
  confirmBtnText: {
    fontSize: wp(3.8),
    fontFamily: "medium",
    color: "#d1d5db",
  },
  cancelBtn: {
    paddingVertical: hp(1),
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: wp(3.5),
    fontFamily: "regular",
    color: "#6b7280",
  },
});
