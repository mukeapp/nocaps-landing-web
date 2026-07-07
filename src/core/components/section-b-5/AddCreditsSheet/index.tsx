import {Colors} from "@/core/constants/Colors";
import {
  CreditPreset,
  selectCreditsPerDollar,
  selectFreshCreditPresets,
} from "@/core/redux/credit-presets";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as _hp,
  widthPercentageToDP as _wp,
} from "@/core/utils/responsive";
import {useSelector} from "react-redux";

const isWeb = Platform.OS === "web";
const wp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _wp(p));
const hp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _hp(p));

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (preset: CreditPreset, credits: number, usd: number) => void;
  costSymbol?: string;
  currencyName?: string;
}

const AddCreditsSheet = ({
  visible,
  onClose,
  onConfirm,
  costSymbol = "$",
  currencyName = "USD",
}: Props) => {
  const CREDIT_PRESETS = selectFreshCreditPresets();
  const creditsPerDollar = useSelector(selectCreditsPerDollar);
  const [usdInput, setUsdInput] = React.useState("");
  const [selectedPreset, setSelectedPreset] = React.useState<CreditPreset | null>(null);
  const usd = parseFloat(usdInput) || 0;
  const credits = Math.floor(usd * creditsPerDollar);

  const handleConfirm = () => {
    if (credits <= 0 || !selectedPreset) return;
    onConfirm(selectedPreset, credits, usd);
    setUsdInput("");
    setSelectedPreset(null);
  };
  const handleClose = () => {
    setUsdInput("");
    setSelectedPreset(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={s.modalBackdrop} onPress={handleClose}>
        <View style={s.addCreditsSheet} onStartShouldSetResponder={() => true}>
          <View style={s.modalHandle} />

          <Text style={s.addCreditsTitle}>Add Credits</Text>
          <Text style={s.addCreditsSubtitle}>
            {costSymbol}1 {currencyName} = {creditsPerDollar.toLocaleString()}{" "}
            credits
          </Text>

          {/* presets */}
          <View style={s.creditsPresetRow}>
            {CREDIT_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                style={[
                  s.creditsPresetBtn,
                  usd === preset.cost && s.creditsPresetBtnActive,
                ]}
                onPress={() => { setSelectedPreset(preset); setUsdInput(String(preset.cost)); }}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    s.creditsPresetName,
                    usd === preset.cost && s.creditsPresetBtnTextActive,
                  ]}
                >
                  {preset.name}
                </Text>
                <Text
                  style={[
                    s.creditsPresetBtnText,
                    usd === preset.cost && s.creditsPresetBtnTextActive,
                  ]}
                >
                  ${preset.cost}
                </Text>
                <Text
                  style={[
                    s.creditsPresetCreditsText,
                    usd === preset.cost && s.creditsPresetBtnTextActive,
                  ]}
                >
                  {(preset.cost * creditsPerDollar).toLocaleString()} cr
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* custom input */}
          {/* <View style={s.creditsInputRow}>
            <Text style={s.creditsInputPrefix}>{costSymbol}</Text>
            <TextInput
              style={s.creditsInput}
              value={usdInput}
              onChangeText={setUsdInput}
              keyboardType="decimal-pad"
              placeholder="Custom amount"
              placeholderTextColor="#6b7280"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
            <Text style={s.creditsInputSuffix}>{currencyName}</Text>
          </View> */}

          {/* preview */}
          {credits > 0 && (
            <View style={s.creditsPreview}>
              <MaterialIcons name="bolt" size={wp(4.5)} color="#f59e0b" />
              <Text style={s.creditsPreviewText}>
                You will receive{" "}
                <Text style={s.creditsPreviewBold}>
                  {credits.toLocaleString()} credits
                </Text>
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[s.addCreditsConfirmBtn, credits <= 0 && s.btnDisabled]}
            onPress={handleConfirm}
            disabled={credits <= 0}
            activeOpacity={0.85}
          >
            <Text style={s.addCreditsConfirmBtnText}>
              {credits > 0
                ? `Buy ${credits.toLocaleString()} credits — ${costSymbol}${usd} ${currencyName}`
                : "Select an amount"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.addCreditsCancelBtn}
            onPress={handleClose}
            activeOpacity={0.85}
          >
            <Text style={s.addCreditsCancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default AddCreditsSheet;

const s = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  modalHandle: {
    width: wp(9),
    height: hp(0.5),
    borderRadius: 2,
    backgroundColor: "#374151",
    alignSelf: "center",
    marginBottom: hp(3),
  },
  addCreditsSheet: {
    backgroundColor: "#1C1C2E",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    padding: wp(6),
    paddingBottom: hp(5),
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  addCreditsTitle: {
    fontSize: wp(5),
    fontFamily: "bold",
    color: "#f1f5f9",
    marginBottom: hp(0.5),
  },
  addCreditsSubtitle: {
    fontSize: wp(3.2),
    fontFamily: "regular",
    color: "#6b7280",
    marginBottom: hp(2.5),
  },
  creditsPresetRow: {
    flexDirection: "row",
    gap: wp(2.5),
    marginBottom: hp(2.5),
  },
  creditsPresetBtn: {
    flex: 1,
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    paddingVertical: hp(1.2),
  },
  creditsPresetBtnActive: {
    backgroundColor: Colors.colorred,
    borderColor: Colors.colorred,
  },
  creditsPresetName: {
    fontSize: wp(2.4),
    fontFamily: "medium",
    color: "#9ca3af",
    marginBottom: hp(0.2),
  },
  creditsPresetBtnText: {
    fontSize: wp(3.5),
    fontFamily: "bold",
    color: "#f1f5f9",
  },
  creditsPresetCreditsText: {
    fontSize: wp(2.6),
    fontFamily: "regular",
    color: "#9ca3af",
    marginTop: hp(0.2),
  },
  creditsPresetBtnTextActive: { color: "#fff" },
  creditsInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: wp(3),
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
    height: hp(6.5),
  },
  creditsInputPrefix: {
    fontSize: wp(4.5),
    fontFamily: "bold",
    color: "#f59e0b",
    marginRight: wp(2),
  },
  creditsInput: {
    flex: 1,
    fontSize: wp(4),
    fontFamily: "regular",
    color: "#f1f5f9",
  },
  creditsInputSuffix: {
    fontSize: wp(3),
    fontFamily: "regular",
    color: "#6b7280",
    marginLeft: wp(2),
  },
  creditsPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    backgroundColor: "rgba(245,158,11,0.1)",
    borderRadius: wp(2.5),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1),
    marginBottom: hp(2),
  },
  creditsPreviewText: {
    fontSize: wp(3.3),
    fontFamily: "regular",
    color: "#f1f5f9",
    flex: 1,
  },
  creditsPreviewBold: { fontFamily: "bold", color: "#f59e0b" },
  addCreditsConfirmBtn: {
    backgroundColor: Colors.colorred,
    borderRadius: wp(3.5),
    paddingVertical: hp(1.9),
    alignItems: "center",
    marginBottom: hp(1.2),
  },
  addCreditsConfirmBtnText: {
    fontSize: wp(3.8),
    fontFamily: "bold",
    color: "#fff",
  },
  addCreditsCancelBtn: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: wp(3.5),
    paddingVertical: hp(1.9),
    alignItems: "center",
  },
  addCreditsCancelBtnText: {
    fontSize: wp(3.8),
    fontFamily: "medium",
    color: "#9ca3af",
  },
  btnDisabled: { opacity: 0.6 },
});
