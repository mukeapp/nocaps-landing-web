import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";

import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";

type Props = {
  form?: any;
};

const FriendsLinks: React.FC<Props> = ({ form }) => {
  const renderItem = ({ item }: { item: any }) => {
    const isSelected = form.selectedFriendLinkId === item?.id;

    return (
      <TouchableOpacity
        style={[
          styles.chip,
          isSelected ? styles.chipSelected : styles.chipUnselected,
        ]}
        onPress={() => {
          form.setSelectedFriendLinkId(item?.id);
          item.OnPress();
        }}
        activeOpacity={0.8}
      >
        <Text
          style={[
            MainStyles.text14,
            { color: isSelected ? Colors.black : Colors.gray2 },
          ]}
        >
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrap}>
      <FlatList
        data={form.friendLinks}
        horizontal
        renderItem={renderItem}
        keyExtractor={(item) => `${item?.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: hp(0.8), paddingHorizontal: wp(4) }}
      />
    </View>
  );
};

export default FriendsLinks;

const styles = StyleSheet.create({
  wrap: { marginTop: hp(0), marginBottom: hp(0.5) },
  chip: {
    height: hp(4.2),
    borderRadius: wp(5),
    paddingHorizontal: wp(3.5),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(2),
  },
  chipSelected: {
    backgroundColor: Colors.white,
    borderWidth: 0,
  },
  chipUnselected: {
    backgroundColor: Colors.title_background,
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
});