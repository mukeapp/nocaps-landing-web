import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import Feather from "@expo/vector-icons/Feather";

import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import {
  useNoCapPostHomeForm,
} from "@/core/hooks";
import { ALL_FRIENDS_ID } from "@/core/hooks/useNoCapPostHomeForm";
import { PostBottomNavigation, PostHeader } from "@/core/components/section-c";
import PostItem from "@/core/components/section-c/PostItem";
import { NocapPost } from "@/core/models/section-c";
import {
  HabitStacksRow,
  HabitsRow,
  HabitLinksRow,
  HabitLinkItemsRow,
  FriendsFilterRow,
} from "@/core/components/section-b-1";
import HabitLinkItemView from "@/core/components/section-b/habit-link-item/HabitLinkItemView";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

type PostListItem =
  | { type: 'post'; data: NocapPost }
  | { type: 'ad'; id: string };

function getHabitCategoryId(habitType?: string): number {
  switch (habitType) {
    case "HABIT-STACKS": return 1;
    case "HABITS": return 2;
    case "HABIT-LINKS": return 3;
    case "HABIT-LINK-ITEMS": return 4;
    default: return 1;
  }
}

function getHabitModalTitle(habitType?: string): string {
  switch (habitType) {
    case "HABIT-STACKS": return "Habit Stack";
    case "HABITS": return "Habit";
    case "HABIT-LINKS": return "Habit Link";
    case "HABIT-LINK-ITEMS": return "Habit Link Item";
    default: return "";
  }
}

const NoCapPostHomeScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useNoCapPostHomeForm({ navigation, route });
  const [currentTab, setCurrentTab] = useState("home");
  const [selectedPost, setSelectedPost] = useState<NocapPost | null>(null);

  const listData = useMemo<PostListItem[]>(() => {
    const result: PostListItem[] = [];
    const rawPosts = form.postsFetcher.data ?? [];
    rawPosts.forEach((post, i) => {
      result.push({ type: 'post', data: post });
      if ((i + 1) % 2 === 0 && i < rawPosts.length - 1) {
        result.push({ type: 'ad', id: `ad-${i}` });
      }
    });
    return result;
  }, [form.postsFetcher.data]);

  useFocusEffect(
    useCallback(() => {
      setCurrentTab("home");
    }, [])
  );

  const handleHabitPress = useCallback((post: NocapPost) => {
    setSelectedPost(post);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const handleEndReached = useCallback(() => {
    if (
      form.loadInProgressRef.current ||
      form.postsFetcher.loading ||
      !form.postsFetcher.hasMore
    ) return;
    form.postsFetcher.loadNext();
  }, [form.postsFetcher, form.loadInProgressRef]);

  const keyExtractor = useCallback(
    (item: PostListItem, idx: number) =>
      item.type === 'ad'
        ? item.id
        : `${item.data?.id ?? item.data?.documentId ?? idx}`,
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: PostListItem }) => {
      if (item.type === 'ad') {
        return (
          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        );
      }
      return (
        <PostItem
          post={item.data}
          canEdit={form.userId === item.data.userId}
          currentUserId={form.userId ?? ""}
          onHabitPress={handleHabitPress}
          onDeletePost={form.deletePurgeNoCapPost}
        />
      );
    },
    [form.userId, handleHabitPress, form.deletePurgeNoCapPost]
  );

  const handleSelectFriend = useCallback((id: string | null) => {
    const resolved = id ?? ALL_FRIENDS_ID;
    if (resolved === form.selectedFriendUserId) {
      form.reload();
    } else {
      form.setSelectedFriendUserId(resolved);
    }
  }, [form.selectedFriendUserId, form.setSelectedFriendUserId, form.reload]);

  const renderHeader = useCallback(() => {
    return (
      <>
        <PostHeader navigation={navigation} />
        <FriendsFilterRow
          friends={form.friends}
          selectedFriendUserId={
            form.selectedFriendUserId === ALL_FRIENDS_ID ? null : form.selectedFriendUserId
          }
          onSelectFriend={handleSelectFriend}
        />
      </>
    );
  }, [navigation, form.friends, form.selectedFriendUserId, handleSelectFriend]);

  const renderEmpty = useCallback(() => {
    if (!form.postsFetcher.loading) {
      return (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No posts yet.</Text>
        </View>
      );
    }
    return null;
  }, [form.postsFetcher.loading]);

  const renderFooter = useCallback(() => {
    if (form.postsFetcher.loading && !form.loading) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color={Colors.white} />
        </View>
      );
    }
    return null;
  }, [form.postsFetcher.loading, form.loading]);

  const renderHabitContent = useCallback(() => {
    if (!selectedPost?.habitStackComponent) {
      return (
        <View style={styles.modalEmpty}>
          <Text style={styles.emptyText}>No habit data available.</Text>
        </View>
      );
    }

    const stacks = [selectedPost.habitStackComponent];
    console.log("Selected habit type:", selectedPost.habitType);
    console.log("Rendering habit content for category:", getHabitCategoryId(selectedPost.habitType));
    const categoryId = getHabitCategoryId(selectedPost.habitType);
    const sectorId = selectedPost.sector ?? "";
    const noop = () => {};

    if (categoryId === 1) {
      return (
        <HabitStacksRow
          mustReloadUser={true}
          userdata={undefined}
          habitCategoryId={1}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={noop}
          hideCalendar={true}
          isVerticalScroll={false}
          showExpandedButton={true}
          showHabitLinkNav={false}
        />
      );
    }

    if (categoryId === 2) {
      return (
        <HabitsRow
          userdata={null}
          habitCategoryId={2}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={noop}
          showHabitBanner={true}
          mustReloadUser={true}
          hideCalendar={true}
          isVerticalScroll={false}
          showExpandedButton={true}
          showHabitLinkNav={false}
          filterByHabitId={true}
          postHabitId={selectedPost.habitId} // Pass the habitId of the first habit in the stack for filtering
        />
      );
    }

    if (categoryId === 3) {
      return (
        <HabitLinksRow
          showHabitLinkBanner={true}
          userdata={null}
          habitCategoryId={3}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={noop}
          hideCalendar={true}
          isVerticalScroll={false}
          mustReloadUser={true}
          showHabitLinkNav={false}
          showExpandedButton={true}
          filterByHabitLinkId={true}
          postHabitLinkId={selectedPost.habitLinkId} // Pass the habitLinkId of the first habit link in the stack for filtering
        />
      );
    }

    if (categoryId === 4) {
      return (
        // <HabitLinkItemsRow
        //   showCopyButton={false}
        //   showCopyButtonText="None"
        //   showHabitLinkBanner={true}
        //   userdata={null}
        //   habitCategoryId={4}
        //   sectorId={sectorId}
        //   stacks={stacks}
        //   onNeedFetch={noop}
        //   showHabitLinkItems={true}
        //   showHabitLinkNav={false}
        //   showExpandedButton={true}
        //   hideCalendar={true}
        //   isVerticalScroll={false}
        //   mustReloadUser={true}
        //   filterByHabitLinkItemId={true}
        //   postHabitLinkId={selectedPost.habitLinkId} // Pass the habitLinkId of the first habit link in the stack for filtering
        //   postHabitLinkItemId={selectedPost.habitLinkItemId} // Pass the habitLinkItemId of the first habit link item in the stack for filtering
        // />
        <HabitLinkItemView
          habitLinkItemId={selectedPost.habitLinkItemId ?? ""}
        />

      );
    }

    return null;
  }, [selectedPost]);

  return (
    <View style={MainStyles.root2}>
      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
      <PostBottomNavigation
        currentTab={currentTab}
        onTabPress={setCurrentTab}
        userPhoto={form.user?.photo}
      />

      {/* Habit Detail Modal */}
      <Modal
        visible={selectedPost !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {getHabitModalTitle(selectedPost?.habitType)}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Feather name="x" style={styles.modalClose} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {renderHabitContent()}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {form.loading && (
        <View style={styles.loaderOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

export default NoCapPostHomeScreen;

const styles = StyleSheet.create({
  empty: {
    height: hp(30),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: Colors.gray || "#A9A9A9",
    fontSize: 14,
    fontFamily: "poppins_regular",
  },
  footer: {
    paddingVertical: hp(2),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#000",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    paddingBottom: hp(4),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: "#333",
    borderBottomWidth: 0.5,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  modalClose: {
    fontSize: 24,
    color: "#fff",
  },
  modalScroll: {
    paddingHorizontal: wp(3),
    paddingTop: hp(1.5),
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalEmpty: {
    height: hp(15),
    alignItems: "center",
    justifyContent: "center",
  },
});
