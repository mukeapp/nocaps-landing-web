import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "@/core/constants/Colors";

type FriendFilterItem = { userId: string; username: string; photo?: string | null };

type Props = {
  friends: FriendFilterItem[];
  selectedFriendUserId: string | null;
  onSelectFriend: (userId: string | null) => void;
};

type ListItem = { type: "all" } | ({ type: "friend" } & FriendFilterItem);

const CIRCLE = wp(13);
const ITEM_W = CIRCLE + wp(4);

const FriendsFilterRow: React.FC<Props> = ({
  friends,
  selectedFriendUserId,
  onSelectFriend,
}) => {
  if (friends.length === 0) return null;

  const data: ListItem[] = [
    { type: "all" },
    ...friends.map((f) => ({ type: "friend" as const, ...f })),
  ];

  const renderItem = ({ item, index }: { item: ListItem; index: number }) => {
    const isFirst = index === 0;
    const isLast = index === data.length - 1;
    const isSelected =
      item.type === "all"
        ? selectedFriendUserId === null
        : selectedFriendUserId === item.userId;

    const marginLeft = isFirst ? wp(4) : wp(3);
    const marginRight = isLast ? wp(4) : 0;

    if (item.type === "all") {
      return (
        <TouchableOpacity
          style={[s.item, { marginLeft, marginRight }]}
          onPress={() => onSelectFriend(null)}
          activeOpacity={0.75}
        >
          <View
            style={[
              s.circle,
              isSelected ? s.circleActive : s.circleInactive,
              isSelected && { backgroundColor: "rgba(45,156,219,0.18)" },
            ]}
          >
            <MaterialCommunityIcons
              name="account-group-outline"
              size={wp(6.5)}
              color={isSelected ? Colors.primary : Colors.text_color}
            />
          </View>
          <Text
            style={[s.name, isSelected ? s.nameActive : s.nameInactive]}
            numberOfLines={1}
          >
            All
          </Text>
        </TouchableOpacity>
      );
    }

    const initial = (item.username?.[0] ?? "?").toUpperCase();
    const hasPhoto = !!item.photo;

    return (
      <TouchableOpacity
        style={[s.item, { marginLeft, marginRight }]}
        onPress={() => onSelectFriend(item.userId)}
        activeOpacity={0.75}
      >
        <View style={[s.circle, isSelected ? s.circleActive : s.circleInactive]}>
          {hasPhoto ? (
            <Image
              source={{ uri: item.photo! }}
              style={s.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={s.initialsCircle}>
              <Text style={s.initialsText}>{initial}</Text>
            </View>
          )}
        </View>
        <Text
          style={[s.name, isSelected ? s.nameActive : s.nameInactive]}
          numberOfLines={1}
        >
          {item.username}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.wrapper}>
      <FlatList
        data={data}
        keyExtractor={(item) =>
          item.type === "all" ? "__all__" : item.userId
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.list}
        renderItem={renderItem}
      />
    </View>
  );
};

const s = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderline,
  },
  list: {
    paddingVertical: hp(1.2),
  },
  item: {
    alignItems: "center",
    width: ITEM_W,
    height: CIRCLE + hp(4),
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  circleActive: {
    borderColor: Colors.primary,
  },
  circleInactive: {
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: Colors.title_background,
  },
  avatar: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
  },
  initialsCircle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    color: Colors.primary,
    fontSize: wp(5),
    fontFamily: "poppins_semibold",
  },
  name: {
    marginTop: hp(0.6),
    fontSize: wp(2.7),
    textAlign: "center",
    width: ITEM_W,
  },
  nameActive: {
    color: Colors.white,
    fontFamily: "poppins_semibold",
  },
  nameInactive: {
    color: Colors.text_color,
    fontFamily: "poppins_regular",
  },
});

export default FriendsFilterRow;
