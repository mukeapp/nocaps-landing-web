// SubscriptionHeader.tsx

import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";

import {Colors} from "@/core/constants/Colors";
import {BillingType} from "@/core/redux/subscription-plan";

interface Props {
  billingType: BillingType;
  onChangeBillingType: (type: BillingType) => void;
  visibleBillingTypes: BillingType[];
}

const SubscriptionHeader: React.FC<Props> = ({
  billingType,
  onChangeBillingType,
  visibleBillingTypes,
}) => (
  <View style={styles.container}>
    <View style={styles.toggle}>
      {visibleBillingTypes.includes("personal") && (
        <TouchableOpacity
          style={[
            styles.toggleOption,
            billingType === "personal" && styles.toggleOptionActive,
          ]}
          onPress={() => onChangeBillingType("personal")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.toggleText,
              billingType === "personal" && styles.toggleTextActive,
            ]}
          >
            Personal
          </Text>
        </TouchableOpacity>
      )}
      {visibleBillingTypes.includes("business") && (
        <TouchableOpacity
          style={[
            styles.toggleOption,
            billingType === "business" && styles.toggleOptionActive,
          ]}
          onPress={() => onChangeBillingType("business")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.toggleText,
              billingType === "business" && styles.toggleTextActive,
            ]}
          >
            Business
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default SubscriptionHeader;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: hp(3),
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: wp(8),
    padding: wp(1),
  },
  toggleOption: {
    paddingHorizontal: wp(7),
    paddingVertical: hp(0.9),
    borderRadius: wp(7),
  },
  toggleOptionActive: {
    backgroundColor: "#3A3A3C",
  },
  toggleText: {
    fontSize: wp(3.8),
    fontFamily: "poppins_regular",
    color: Colors.gray,
  },
  toggleTextActive: {
    fontFamily: "poppins_semibold",
    color: Colors.white,
  },
});
