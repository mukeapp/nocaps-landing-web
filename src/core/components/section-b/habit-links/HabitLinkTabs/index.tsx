import React from "react";
import { Platform, StyleSheet } from "react-native";
import {
  heightPercentageToDP as _hp,
  widthPercentageToDP as _wp,
  isTablet,
  fs,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _wp(p);
const hp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _hp(p);
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import {HabitLinkComponent} from "@/core/models/section-b/habit";

type TabItem = { documentId: string; name: string };

type Props = {
  data: HabitLinkComponent[];
  activeId: string;
  onChange: (id: string, item: HabitLinkComponent) => void;
};

const HabitLinkTabs: React.FC<Props> = ({ data, activeId, onChange }) => {
  const renderItem = ({ item }: { item: HabitLinkComponent }) => {
    const active = activeId === item.documentId;
    return (
      <TouchableOpacity
        style={[
          styles.chip,
          { backgroundColor: active ? Colors.white : Colors.content_back },
        ]}
        onPress={() => onChange(item.documentId, item)}
      >
        <Text
          style={[
            MainStyles.text14,
            { color: active ? Colors.black : Colors.white },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrap}>
      <FlatList
        data={data}
        horizontal
        renderItem={renderItem}
        keyExtractor={(i) => i.documentId}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: hp(1) }}
      />
    </View>
  );
};

export default HabitLinkTabs;

export const styles = StyleSheet.create({
  wrap: { marginVertical: hp(2) },
  chip: {
    backgroundColor: Colors.white,
    height: isTablet ? 44 : hp(4),
    borderRadius: wp(5),
    paddingHorizontal: wp(3),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(2),
    borderWidth: fs(1.5),
    borderColor: Colors.borderline,
  },
});