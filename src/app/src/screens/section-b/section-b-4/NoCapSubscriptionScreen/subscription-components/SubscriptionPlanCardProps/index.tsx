// SubscriptionPlanCard.tsx

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";

import {Colors} from "@/core/constants/Colors";
import {SubscriptionPlan} from "@/core/redux/subscription-plan";

const isWeb = Platform.OS === "web";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PLUS_BG = "#2D2B6B";
const PLUS_BUTTON_BG = "#5B58E2";
const CARD_BG = "#1C1C1E";
const POPULAR_BADGE_BG = "#3D3B8E";
const CURRENT_PLAN_BORDER = "#3A3A3A";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  isLoading?: boolean;
  onUpgrade: (planId: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getCtaLabel = (planId: string) => {
  if (planId === "free") return "Downgrade to Free";
  return `Upgrade to ${planId.charAt(0).toUpperCase() + planId.slice(1)}`;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SubscriptionPlanCard: React.FC<Props> = ({
  plan,
  isCurrentPlan,
  isLoading = false,
  onUpgrade,
}) => {
  const isPlus = plan.id === "plus";

  return (
    <View style={[styles.card, isPlus && styles.cardPlus]}>
      {/* Header row: name + Popular badge */}
      <View style={styles.headerRow}>
        <Text style={styles.planName}>{plan.name}</Text>
        {plan.isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>POPULAR</Text>
          </View>
        )}
      </View>

      {/* Price */}
      <View style={styles.priceRow}>
        <Text style={styles.priceCurrency}>$</Text>
        <Text style={styles.priceAmount}>{plan.price.toFixed(2)}</Text>
        <View style={styles.priceUnit}>
          <Text style={styles.priceUnitText}>USD /</Text>
          <Text style={styles.priceUnitText}>month</Text>
        </View>
      </View>

      {/* Tagline */}
      <Text style={styles.tagline}>{plan.tagline}</Text>

      {/* Description */}
      {plan.description && (
        <Text style={styles.description}>{plan.description}</Text>
      )}

      {/* CTA Button */}
      {isCurrentPlan ? (
        <View style={styles.currentPlanButton}>
          <Text style={styles.currentPlanButtonText}>Your current plan</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.upgradeButton,
            isPlus && styles.upgradeButtonPlus,
            isLoading && styles.upgradeButtonDisabled,
          ]}
          onPress={() => onUpgrade(plan.id)}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#151414" />
          ) : (
            <Text
              style={[
                styles.upgradeButtonText,
                isPlus && styles.upgradeButtonTextPlus,
              ]}
            >
              {getCtaLabel(plan.id)}
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* Feature list */}
      <View style={styles.featureList}>
        {plan.id === "pro" && (
          <Text style={styles.everythingInPlus}>Everything in Plus and:</Text>
        )}
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <MaterialIcons
              name="auto-awesome"
              size={14}
              color={isPlus ? "#A09FE8" : Colors.gray}
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Footer note */}
      {plan.footerNote && (
        <Text style={styles.footerNote}>{plan.footerNote}</Text>
      )}
    </View>
  );
};

export default SubscriptionPlanCard;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
    borderRadius: isWeb ? 16 : wp(4),
    padding: isWeb ? 24 : wp(5),
    marginBottom: isWeb ? 16 : hp(2),
  },
  cardPlus: {
    backgroundColor: PLUS_BG,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: isWeb ? 12 : hp(1.5),
  },
  planName: {
    fontSize: isWeb ? 28 : wp(6),
    fontFamily: "poppins_bold",
    color: Colors.white,
  },
  popularBadge: {
    backgroundColor: POPULAR_BADGE_BG,
    paddingHorizontal: isWeb ? 10 : wp(3),
    paddingVertical: isWeb ? 4 : hp(0.4),
    borderRadius: isWeb ? 6 : wp(2),
  },
  popularBadgeText: {
    fontSize: isWeb ? 11 : wp(2.8),
    fontFamily: "poppins_semibold",
    color: Colors.white,
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: isWeb ? 4 : hp(0.5),
  },
  priceCurrency: {
    fontSize: isWeb ? 20 : wp(5),
    fontFamily: "poppins_semibold",
    color: Colors.white,
    marginTop: isWeb ? 6 : hp(0.8),
  },
  priceAmount: {
    fontSize: isWeb ? 48 : wp(12),
    fontFamily: "poppins_bold",
    color: Colors.white,
    lineHeight: isWeb ? 56 : wp(14),
  },
  priceUnit: {
    marginLeft: isWeb ? 6 : wp(1.5),
    marginTop: isWeb ? 8 : hp(1),
  },
  priceUnitText: {
    fontSize: isWeb ? 13 : wp(3),
    fontFamily: "poppins_regular",
    color: Colors.gray,
  },
  tagline: {
    fontSize: isWeb ? 15 : wp(3.8),
    fontFamily: "poppins_semibold",
    color: Colors.white,
    marginBottom: isWeb ? 8 : hp(1),
  },
  description: {
    fontSize: isWeb ? 14 : wp(3.3),
    fontFamily: "poppins_regular",
    color: Colors.gray,
    lineHeight: isWeb ? 20 : wp(5),
    marginBottom: isWeb ? 16 : hp(2),
  },
  currentPlanButton: {
    borderWidth: 1,
    borderColor: CURRENT_PLAN_BORDER,
    borderRadius: isWeb ? 12 : wp(8),
    paddingVertical: isWeb ? 12 : hp(1.4),
    alignItems: "center",
    marginBottom: isWeb ? 20 : hp(2.5),
  },
  currentPlanButtonText: {
    fontSize: isWeb ? 15 : wp(3.8),
    fontFamily: "poppins_regular",
    color: Colors.gray,
  },
  upgradeButton: {
    backgroundColor: Colors.white,
    borderRadius: isWeb ? 12 : wp(8),
    paddingVertical: isWeb ? 12 : hp(1.4),
    alignItems: "center",
    marginBottom: isWeb ? 20 : hp(2.5),
  },
  upgradeButtonPlus: {
    backgroundColor: PLUS_BUTTON_BG,
  },
  upgradeButtonDisabled: {
    opacity: 0.5,
  },
  upgradeButtonText: {
    fontSize: isWeb ? 15 : wp(3.8),
    fontFamily: "poppins_semibold",
    color: Colors.black,
  },
  upgradeButtonTextPlus: {
    color: Colors.white,
  },
  featureList: {
    gap: isWeb ? 10 : hp(1.2),
  },
  everythingInPlus: {
    fontSize: isWeb ? 14 : wp(3.5),
    fontFamily: "poppins_semibold",
    color: Colors.white,
    marginBottom: isWeb ? 4 : hp(0.5),
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  featureIcon: {
    marginTop: isWeb ? 2 : hp(0.2),
    marginRight: isWeb ? 10 : wp(2.5),
  },
  featureText: {
    fontSize: isWeb ? 14 : wp(3.5),
    fontFamily: "poppins_regular",
    color: Colors.gray2,
    flex: 1,
  },
  footerNote: {
    fontSize: isWeb ? 13 : wp(3),
    fontFamily: "poppins_regular",
    color: Colors.gray,
    marginTop: isWeb ? 16 : hp(2),
  },
});
