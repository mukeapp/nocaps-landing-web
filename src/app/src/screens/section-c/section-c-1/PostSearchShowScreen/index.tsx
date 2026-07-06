import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
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
  DefaultLoader as Loader,
} from "@/core/components/section-a";
import {
  usePostSearchShowScreenForm,
} from "@/core/hooks";
import { HabitStackPill, PostBottomNavigation, PostHeader, UserRow } from "@/core/components/section-c";
import PostItem from "@/core/components/section-c/PostItem";
import { NocapPost } from "@/core/models/section-c";
import {
  HabitStacksRow,
  HabitsRow,
  HabitLinksRow,
  HabitLinkItemsRow,
} from "@/core/components/section-b-1";
import Ionicons from "@expo/vector-icons/Ionicons";

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

const PostSearchShowScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = usePostSearchShowScreenForm({ navigation, route });
  const [selectedPost, setSelectedPost] = useState<NocapPost | null>(null);

  const handleHabitPress = useCallback((post: NocapPost) => {
    setSelectedPost(post);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const handleEndReached = useCallback(() => {
    if (
      form.postsFetcher &&
      !form.postsFetcher.loading &&
      form.postsFetcher.hasMore &&
      (form.postsFetcher.data?.length ?? 0) > 0
    ) {
      form.postsFetcher.loadNext();
    }
  }, [form.postsFetcher]);

  const keyExtractor = useCallback(
    (item: NocapPost, idx: number) => `${item?.id ?? item?.documentId ?? idx}`,
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: NocapPost }) => (
      <PostItem
        post={item}
        canEdit={form.userId === item.userId}
        currentUserId={form.userId ?? ""}
        onHabitPress={handleHabitPress}
        onDeletePost={form.deletePurgeNoCapPost}
      />
    ),
    [form.userId, handleHabitPress, form.deletePurgeNoCapPost]
  );

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={styles.backCircle}>
            <Ionicons name="arrow-back" size={18} color={Colors.white} />
          </View>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{form.destinationScreenTitle}</Text>
          {form.sector?.label ? (
            <View style={styles.sectorPill}>
              <Text style={styles.sectorPillText}>{form.sector.label}</Text>
            </View>
          ) : null}
          {form.postId ? (
            <View style={styles.sectorPill}>
              <Text style={styles.sectorPillText}>Post ID</Text>
            </View>
          ) : null}
          {form.habitStackSearchName ? (
            <View style={styles.sectorPill}>
              <Text style={styles.sectorPillText}>
                Search Name: {form.habitStackSearchName}
              </Text>
            </View>
          ) : null}
          {form.habitStacks.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {form.habitStacks.map((habitStack, idx) => (
                <React.Fragment key={habitStack.id}>
                  <HabitStackPill habitStack={habitStack} />
                  {idx < form.habitStacks.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              ))}
            </ScrollView>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {form.users.map((user, idx) => (
              <React.Fragment key={user.id}>
                <UserRow
                  user={user}
                  hideOptions={true}
                  hideSelect={true}
                />
                {idx < form.users.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }, [navigation, form.destinationScreenTitle, form.sector, form.users, form.habitStacks, form.habitStackSearchName, form.postId]);

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
    if (form.postsFetcher.loading) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color={Colors.white} />
        </View>
      );
    }
    return null;
  }, [form.postsFetcher.loading]);

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
          mustReloadUser={false}
          userdata={undefined}
          habitCategoryId={1}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={noop}
          hideCalendar={true}
          isVerticalScroll={false}
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
          mustReloadUser={false}
          hideCalendar={true}
          isVerticalScroll={false}
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
        />
      );
    }

    if (categoryId === 4) {
      return (
        <HabitLinkItemsRow
          showCopyButton={false}
          showCopyButtonText="None"
          showHabitLinkBanner={true}
          userdata={null}
          habitCategoryId={4}
          sectorId={sectorId}
          stacks={stacks}
          onNeedFetch={noop}
          showHabitLinkItems={true}
          showHabitLinkNav={false}
          showExpandedButton={true}
          hideCalendar={true}
          isVerticalScroll={false}
        />
      );
    }

    return null;
  }, [selectedPost]);

  return (
    <View style={MainStyles.root2}>
      <FlatList
        data={form.postsFetcher.data ?? []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
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

      <Loader status={form.loading} />
    </View>
  );
};

export default PostSearchShowScreen;

const styles = StyleSheet.create({

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      paddingTop: Platform.OS === 'android' ? hp(1.5) : hp(1),
      paddingBottom: hp(2),
      gap: wp(3),
    },
    backBtn: { flexShrink: 0 },
    backCircle: {
      width: wp(9),
      height: wp(9),
      borderRadius: wp(4.5),
      backgroundColor: 'rgba(255,255,255,0.08)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    headerTitleContainer: {
      flexShrink: 1,
      flexDirection: 'column',
      gap: hp(0.5),
    },
    headerTitle: {
      color: '#f1f5f9',
      fontSize: wp(4.3),
      fontFamily: 'poppins_semibold',
    },
    sectorPill: {
      alignSelf: 'flex-start',
      backgroundColor: '#ffffff',
      borderRadius: wp(4),
      paddingHorizontal: wp(3),
      paddingVertical: hp(0.4),
    },
    sectorPillText: {
      color: '#000000',
      fontSize: wp(3),
      fontFamily: 'poppins_medium',
    },
  empty: {
    height: hp(30),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: Colors.gray || "#A9A9A9",
    fontSize: wp(3.6),
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
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    height: hp(90),
    paddingBottom: hp(4),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomColor: "#333",
    borderBottomWidth: 0.5,
  },
  modalTitle: {
    color: "#fff",
    fontSize: wp(4.5),
    fontWeight: "700",
  },
  modalClose: {
    fontSize: wp(6),
    color: "#fff",
  },
  modalScroll: {
    paddingHorizontal: wp(3),
    paddingTop: hp(1.5),
  },
  modalEmpty: {
    height: hp(15),
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: wp(3.5),
  },
});
