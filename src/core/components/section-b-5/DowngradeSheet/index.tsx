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

const isWeb = Platform.OS === "web";

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
          <MaterialIcons name="warning-amber" size={isWeb ? 40 : wp(10)} color="#f59e0b" />
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
          <MaterialIcons name="open-in-new" size={isWeb ? 18 : wp(4.5)} color="#111" />
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
    borderTopLeftRadius: isWeb ? 20 : wp(6),
    borderTopRightRadius: isWeb ? 20 : wp(6),
    padding: isWeb ? 24 : wp(6),
    paddingBottom: isWeb ? 32 : hp(5),
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  handle: {
    width: isWeb ? 40 : wp(9),
    height: isWeb ? 4 : hp(0.5),
    borderRadius: 2,
    backgroundColor: "#374151",
    alignSelf: "center",
    marginBottom: isWeb ? 20 : hp(2.5),
  },
  iconRow: {
    alignItems: "center",
    marginBottom: isWeb ? 12 : hp(1.5),
  },
  title: {
    fontSize: isWeb ? 20 : wp(5),
    fontFamily: "bold",
    color: "#f1f5f9",
    textAlign: "center",
    marginBottom: isWeb ? 12 : hp(1.5),
  },
  body: {
    fontSize: isWeb ? 14 : wp(3.5),
    fontFamily: "regular",
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: isWeb ? 20 : wp(5.5),
    marginBottom: isWeb ? 8 : hp(1),
  },
  bodyEmphasis: {
    fontSize: isWeb ? 14 : wp(3.5),
    fontFamily: "medium",
    color: "#f59e0b",
    textAlign: "center",
    lineHeight: isWeb ? 20 : wp(5.5),
    marginBottom: isWeb ? 24 : hp(3),
  },
  manageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: isWeb ? 8 : wp(2),
    backgroundColor: "#f1f5f9",
    borderRadius: isWeb ? 12 : wp(3.5),
    paddingVertical: isWeb ? 14 : hp(2),
    marginBottom: isWeb ? 12 : hp(1.5),
  },
  manageBtnText: {
    fontSize: isWeb ? 16 : wp(4.2),
    fontFamily: "bold",
    color: "#111",
  },
  confirmBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: isWeb ? 12 : wp(3.5),
    paddingVertical: isWeb ? 14 : hp(1.8),
    alignItems: "center",
    marginBottom: isWeb ? 10 : hp(1.2),
  },
  confirmBtnText: {
    fontSize: isWeb ? 15 : wp(3.8),
    fontFamily: "medium",
    color: "#d1d5db",
  },
  cancelBtn: {
    paddingVertical: isWeb ? 8 : hp(1),
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: isWeb ? 14 : wp(3.5),
    fontFamily: "regular",
    color: "#6b7280",
  },
});
