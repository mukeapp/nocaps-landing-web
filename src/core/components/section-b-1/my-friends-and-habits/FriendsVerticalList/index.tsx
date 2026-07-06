import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import FriendCard from "../FriendCard";
import { Colors } from "@/core/constants/Colors";

type InfiniteFriends = {
  data: any[];
  loading: boolean;
  hasMore: boolean;
  loadNext: () => Promise<void>;
  reset: () => Promise<void>;
};

type Props = {
  friends: InfiniteFriends;
  showEmail?: boolean;
  btnAddText?: string;
  btnRemoveText?: string;
  showBtnAdd?: boolean;
  showBtnRemove?: boolean;
  show3dotsBtn?: boolean;
  btnAddOutlined?: boolean;
  bottomSheetMode?: "friends" | "suggestions" | "requests";
  onAddFriend?: (friend: any) => void;
  onRemoveFriend?: (friend: any) => void;
  onOpenProfile?: (friend: any) => void;
};

const FriendsVerticalList: React.FC<Props> = ({
  friends,
  showEmail = false,
  btnAddText,
  btnRemoveText,
  showBtnAdd = true,
  showBtnRemove = true,
  show3dotsBtn = false,
  btnAddOutlined = false,
  bottomSheetMode = "friends",
  onAddFriend,
  onRemoveFriend,
  onOpenProfile,
}) => {

  const getButtonText = (item: any) => {
    if(!item?.friend)
      return btnAddText || "Add";
    if (item?.friend?.isReceiver) {
      return btnAddText || "Add";
    }
    return "Pending";
  }

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <FriendCard
        showEmail={showEmail}
        firstName={item.firstName}
        lastName={item.lastName}
        username={item.username}
        email={item.email}
        photo={item.photo}
        btnAddText={getButtonText(item)}
        showBtnAdd={showBtnAdd}
        showBtnRemove={showBtnRemove}
        btnRemoveText={btnRemoveText}
        show3dotsBtn={show3dotsBtn}
        btnAddOutlined={btnAddOutlined}
        bottomSheetMode={bottomSheetMode}
        isReceiver={!!item?.friend?.isReceiver}
        btnAddColor={
          bottomSheetMode === "requests"
            ? item?.friend?.isReceiver
              ? Colors.green
              : Colors.primary
            : undefined
        }
        onAdd={() => onAddFriend?.(item)}
        onRemove={() => onRemoveFriend?.(item)}
        onPress={() => onOpenProfile?.(item)}
      />
    ),
    [onAddFriend, onRemoveFriend, onOpenProfile]
  );

  const keyExtractor = useCallback(
    (it: any, idx: number) => String(it.documentId || it.id || idx),
    []
  );

  const handleEndReached = useCallback(() => {
    if (!friends.loading && friends.hasMore) {
      friends.loadNext();
    }
  }, [friends]);

  return (
    <FlatList
      data={friends.data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.4}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        !friends.loading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No suggestions yet.</Text>
          </View>
        ) : null
      }
      ListFooterComponent={
        friends.loading ? (
          <View style={styles.footer}>
            <ActivityIndicator color={Colors.white} />
          </View>
        ) : null
      }
    />
  );
};

export default FriendsVerticalList;

const styles = StyleSheet.create({
  content: {
    paddingTop: hp(0.5),
    paddingBottom: hp(4),
  },
  separator: {
    height: 0,
  },
  empty: {
    height: hp(20),
    borderRadius: wp(3),
    backgroundColor: Colors.text_background,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: Colors.gray || "#A9A9A9",
    fontSize: wp(3.6),
    fontFamily: "poppins_regular",
  },
  footer: {
    paddingTop: hp(1),
  },
});
