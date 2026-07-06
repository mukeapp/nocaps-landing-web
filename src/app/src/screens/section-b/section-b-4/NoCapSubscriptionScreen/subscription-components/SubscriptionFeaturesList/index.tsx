// SubscriptionFeaturesList.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/core/constants/Colors";

interface SubscriptionFeaturesListProps {
  features: string[];
}

const SubscriptionFeaturesList: React.FC<SubscriptionFeaturesListProps> = ({
  features,
}) => {
  return (
    <View style={styles.featuresContainer}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureRow}>
          <MaterialIcons name="check" size={20} color={Colors.white} />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  featuresContainer: {
    marginBottom: hp(3),
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(1.5),
    gap: wp(3),
  },
  featureText: {
    fontSize: wp(3.5),
    fontFamily: "poppins_regular",
    color: Colors.white,
    flex: 1,
  },
});

export default SubscriptionFeaturesList;