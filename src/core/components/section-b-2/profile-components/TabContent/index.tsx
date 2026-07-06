// src/screens/ProfileScreen/components/TabContent.tsx
import React from "react";
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { HabitStackComponent } from "@/core/models/section-b";
import { Colors } from "@/core/constants/Colors";
import { HabitStackCard } from "@/core/components/section-b";
import { IUser } from "@/core/models/section-a/user";

interface Form {
  user: IUser;
  activeTab: string;
  activeToggle: string;
  habitStacks: HabitStackComponent[];
  friendsHabitStacks?: HabitStackComponent[];
  likedHabitStacks?: HabitStackComponent[];
  recommendedHabitStacks?: HabitStackComponent[];
  posts?: any[];
  friendsPosts?: any[];
  likedPosts?: any[];
  recommendedPosts?: any[];
  navigateToHabitLink: (habitLink: any) => void;
}

interface TabContentProps {
  navigation: any;
  form: Form;
  friendshipStatus?: boolean; // true if the user is friends with the profile owner, false otherwise
  isOwnProfile?: boolean;
}

const TabContent: React.FC<TabContentProps> = ({ navigation, form, friendshipStatus = true, isOwnProfile = false }) => {


  // Only render for habitStacks toggle
  if (form.activeToggle !== "habitStacks" && form.activeToggle !== "post") {
    return null;
  }

  // Get data based on active tab
  const getDataByTabHabitStacks = (): { data: HabitStackComponent[]; emptyMessage: string } => {
    switch (form.activeTab) {
      case "MyHabitStacks":
        return { data: form.habitStacks, emptyMessage: "No habit stacks yet." };
      case "Friends":
        return { data: form.friendsHabitStacks || [], emptyMessage: "No friends' habit stacks yet." };
      case "Liked":
        return { data: form.likedHabitStacks || [], emptyMessage: "No liked habit stacks yet." };
      case "Recommended":
        return { data: form.recommendedHabitStacks || [], emptyMessage: "No recommended habit stacks yet." };
      default:
        return { data: [], emptyMessage: "No data available." };
    }
  };

  const getDataByTabPosts = (): { data: any[]; emptyMessage: string } => {
    switch (form.activeTab) {
      case "Posts":
        return { data: form.posts || [], emptyMessage: "No posts yet." };
      case "Friends":
        return { data: form.friendsPosts || [], emptyMessage: "No friends' posts yet." };
      case "Liked":
        return { data: form.likedPosts || [], emptyMessage: "No liked posts yet." };
      case "Recommended":
        return { data: form.recommendedPosts || [], emptyMessage: "No recommended posts yet." };
      default:
        return { data: [], emptyMessage: "No data available." };
    }
  };

  const { data, emptyMessage } = form.activeToggle === "habitStacks" ? getDataByTabHabitStacks() : getDataByTabPosts();

  const filteredData = isOwnProfile
    ? data
    : data.filter(
        (item) => item.hideFromFriends === false && item.isPublic === true
      );

  // Empty state
  if (!filteredData.length) {
    return (
      <View style={styles.emptyRow}>
        <Text style={styles.emptyRowText}>{emptyMessage}</Text>
      </View>
    );
  }

  // Render habit stacks list
  return (
    <FlatList
      data={filteredData}
      keyExtractor={(item) => `${item?.id ?? item?.documentId ?? Math.random()}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.stackCard}
          onPress={() => console.log("stack tap:", item?.id)}
          activeOpacity={0.9}
        >
          <HabitStackCard
            showCopyButton={false}
            stack={item}
            canEdit={false}
            username={form.user?.username || ""}
            onOpenLinkItem={form.navigateToHabitLink}
            mustReloadUser={true}
            hideLikeIcon={form.activeTab === "Friends"}
            hideScore={form.activeTab === "Friends"}
            hideChevron={form.activeTab === "Friends" ? true : !friendshipStatus}
            bannerImageShowIconGoToHabitAndFriends={form.activeTab === "Friends"}
            showExpandedButton={false}
            showHabitLinkNav={false}
            showBottomUpSheetItemList={true}
            hideHabitStackCost={form.activeTab === "Friends" ? true : false}
            friendshipStatus={friendshipStatus}

          />
        </TouchableOpacity>
      )}
    />
  );
};

export default TabContent;

const styles = StyleSheet.create({
  stackCard: {
    width: wp(90),
    minHeight: hp(10),
    marginRight: wp(3),
    borderRadius: wp(3),
    backgroundColor: Colors.text_background,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
  },
  emptyRow: {
    marginHorizontal: wp(10),
    paddingBottom: hp(2),
  },
  emptyRowText: {
    color: Colors.gray || "#A9A9A9",
    fontSize: wp(3.4),
    fontFamily: "poppins_regular",
  },
});