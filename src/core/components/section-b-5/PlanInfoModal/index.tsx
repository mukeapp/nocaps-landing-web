import {selectSubscriptionPlans} from "@/core/redux/subscription-plan";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
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
  planId: string | null;
  onClose: () => void;
}

const PlanInfoModal = ({ planId, onClose }: Props) => {
  const plans = useSelector(selectSubscriptionPlans);
  const plan = planId ? (plans.find((p) => p.id === planId) ?? null) : null;
  const isPlus = plan?.id === "plus";
  const bgColor = isPlus ? "#2D2B6B" : "#1C1C2E";

  return (
    <Modal
      visible={!!planId}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={s.modalBackdrop} onPress={onClose}>
        <View
          style={[s.planInfoSheet, { backgroundColor: bgColor }]}
          onStartShouldSetResponder={() => true}
        >
          <View style={s.modalHandle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* header */}
            <View style={s.planInfoHeaderRow}>
              <Text style={s.planInfoName}>{plan?.name}</Text>
              {plan?.isPopular && (
                <View style={s.planInfoPopularBadge}>
                  <Text style={s.planInfoPopularText}>POPULAR</Text>
                </View>
              )}
            </View>

            {/* price */}
            {plan?.price === 0 ? (
              <Text style={s.planInfoFreeText}>Free</Text>
            ) : (
              <View style={s.planInfoPriceRow}>
                <Text style={s.planInfoCurrency}>$</Text>
                <Text style={s.planInfoPrice}>{plan?.price.toFixed(2)}</Text>
                <View style={s.planInfoPriceUnit}>
                  <Text style={s.planInfoPriceUnitText}>USD /</Text>
                  <Text style={s.planInfoPriceUnitText}>month</Text>
                </View>
              </View>
            )}

            {/* tagline */}
            <Text style={s.planInfoTagline}>{plan?.tagline}</Text>

            {/* description */}
            {plan?.description ? (
              <Text style={s.planInfoDescription}>{plan.description}</Text>
            ) : null}

            {/* features */}
            <View style={s.planInfoFeatures}>
              {(plan?.features ?? []).map((f, i) => (
                <View key={i} style={s.planInfoFeatureRow}>
                  <MaterialIcons
                    name="auto-awesome"
                    size={14}
                    color={isPlus ? "#A09FE8" : "#6b7280"}
                    style={{ marginRight: wp(2.5), marginTop: hp(0.2) }}
                  />
                  <Text style={s.planInfoFeatureText}>{f}</Text>
                </View>
              ))}
            </View>

            {/* close */}
            <TouchableOpacity
              style={s.planInfoCloseBtn}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={s.planInfoCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

export default PlanInfoModal;

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
  planInfoSheet: {
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    padding: wp(6),
    paddingBottom: hp(5),
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    maxHeight: "85%",
  },
  planInfoHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(1.5),
  },
  planInfoName: { fontSize: wp(6), fontFamily: "bold", color: "#f1f5f9" },
  planInfoPopularBadge: {
    backgroundColor: "#3D3B8E",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: wp(2),
  },
  planInfoPopularText: {
    fontSize: wp(2.8),
    fontFamily: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  planInfoFreeText: {
    fontSize: wp(12),
    fontFamily: "bold",
    color: "#f1f5f9",
    lineHeight: wp(14),
    marginBottom: hp(0.5),
  },
  planInfoPriceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(0.5),
  },
  planInfoCurrency: {
    fontSize: wp(5),
    fontFamily: "bold",
    color: "#f1f5f9",
    marginTop: hp(0.8),
  },
  planInfoPrice: {
    fontSize: wp(12),
    fontFamily: "bold",
    color: "#f1f5f9",
    lineHeight: wp(14),
  },
  planInfoPriceUnit: { marginLeft: wp(1.5), marginTop: hp(1) },
  planInfoPriceUnitText: {
    fontSize: wp(3),
    fontFamily: "regular",
    color: "#9ca3af",
  },
  planInfoTagline: {
    fontSize: wp(3.8),
    fontFamily: "bold",
    color: "#f1f5f9",
    marginBottom: hp(1),
  },
  planInfoDescription: {
    fontSize: wp(3.5),
    fontFamily: "regular",
    color: "#9ca3af",
    lineHeight: wp(5.2),
    marginBottom: hp(2),
  },
  planInfoFeatures: { gap: hp(1.2), marginBottom: hp(3) },
  planInfoFeatureRow: { flexDirection: "row", alignItems: "flex-start" },
  planInfoFeatureText: {
    fontSize: wp(3.5),
    fontFamily: "regular",
    color: "#d1d5db",
    flex: 1,
  },
  planInfoCloseBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: wp(3.5),
    paddingVertical: hp(1.8),
    alignItems: "center",
  },
  planInfoCloseBtnText: {
    fontSize: wp(3.8),
    fontFamily: "medium",
    color: "#f1f5f9",
  },
});
