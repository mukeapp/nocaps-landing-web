import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import React, {useCallback, useRef, useState} from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import {
  DefaultLoader as Loader
} from "@/core/components/section-a";
import {Header2} from "@/core/components/section-b";
import {
  AboutMeSection,
  HabitStacksChipsRow,
  PostHabitToggle,
  ProfileHero,
  StatsRow,
  TabBar,
} from "@/core/components/section-b-2";
import TabContent from "@/core/components/section-b-2/profile-components/TabContent";
import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";
import {
  useProfileForm
} from "@/core/hooks";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {useFocusEffect} from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";

const ProfileScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useProfileForm({ navigation, route });
  const rbSheetRef = useRef<any>(null);

  const [key, setKey] = useState(0);

  // Force reload FlatList when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Reset the stacks and reload
      form.load?.();
      // Force FlatList to remount by changing key
      setKey((prev) => prev + 1);
    }, [form.load]),
  );

  return (
    <View style={MainStyles.root3}>
      <Header2
        title={form.destinationScreenTitle}
        titleTextFormat={1}
        titleVisibilityIcon={false}
        showSettingsIcon={true}
        navigation={navigation}
        cameFromDrawerTab={form.cameFromDrawerTab}
        originScreen="ProfileScreen"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHero
          user={form.user}
          navigation={navigation}
          editProfile={form.navigateToEditMyProfile}
          canEditProfile={form.canEditProfile}
        />

        {/* Friendship action row - only for other users' profiles.
            Web-adapted (July 2026 direction): compact centered pills instead of
            flex-1 full-width mobile buttons; spinner replaces the "..." label
            swap so buttons keep their width while friendshipLoading. */}
        {!form.isMyUserProfile && (
          <div className="flex items-center justify-center gap-2 px-4 py-4">
            {form.friendshipStatus === "none" && (
              <button
                onClick={form.sendFriendRequest}
                disabled={form.friendshipLoading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2D9CDB] px-6 py-2 text-sm font-semibold text-white min-w-[11rem] hover:bg-[#2D9CDB]/85 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {form.friendshipLoading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <MaterialCommunityIcons
                    name="account-plus-outline"
                    size={18}
                    color={Colors.white}
                  />
                )}
                Add Friend
              </button>
            )}

            {form.friendshipStatus === "pending-sent" && (
              <button
                onClick={form.cancelFriendRequest}
                disabled={form.friendshipLoading}
                title="Cancel friend request"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-2 text-sm font-semibold text-muted-foreground min-w-[11rem] hover:bg-white/10 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {form.friendshipLoading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={18}
                    color={Colors.gray}
                  />
                )}
                Pending
              </button>
            )}

            {form.friendshipStatus === "pending-received" && (
              <button
                onClick={form.acceptFriendRequest}
                disabled={form.friendshipLoading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#27AE60] px-6 py-2 text-sm font-semibold text-white min-w-[11rem] hover:bg-[#27AE60]/85 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {form.friendshipLoading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <MaterialCommunityIcons
                    name="account-check-outline"
                    size={18}
                    color={Colors.white}
                  />
                )}
                Accept
              </button>
            )}

            {form.friendshipStatus === "friends" && (
              <button
                onClick={form.unfriend}
                disabled={form.friendshipLoading}
                title="Unfriend"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-2 text-sm font-semibold text-foreground min-w-[11rem] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {form.friendshipLoading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <MaterialCommunityIcons
                    name="check"
                    size={18}
                    color={Colors.white}
                  />
                )}
                Friends
              </button>
            )}

            {/* 3-dots button */}
            {form.friendshipStatus !== "none" && (
              <button
                onClick={() => rbSheetRef.current?.open()}
                aria-label="More options"
                className="grid place-items-center h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={20}
                  color={Colors.white}
                />
              </button>
            )}
          </div>
        )}

        <HabitStacksChipsRow habitStacksChips={form.habitStacksChips} isOwnProfile={form.canEditProfile} />
        
        <AboutMeSection about={form.aboutText} />
        <PostHabitToggle
          activeToggle={form.activeToggle}
          setActiveToggle={form.setActiveToggle}
        />
        <StatsRow stats={form.stats} activeToggle={form.activeToggle} />

        <TabBar
          activeToggle={form.activeToggle}
          activeTab={form.activeTab}
          setActiveTab={form.setActiveTab}
        />

        <TabContent
          navigation={navigation}
          form={form}
          friendshipStatus={ form.isMyUserProfile ? true : form.friendshipStatus === "friends"}
          isOwnProfile={form.canEditProfile}
        />

        {/* Friendship Action Bottom Sheet */}
        <RBSheet
          ref={rbSheetRef}
          useNativeDriver={false}
          height={hp(55)}
          customStyles={{
            container: {
              backgroundColor: "#2C2C2E",
              borderTopLeftRadius: wp(5),
              borderTopRightRadius: wp(5),
            },
            wrapper: {
              backgroundColor: "#000000ab",
            },
            draggableIcon: {
              backgroundColor: Colors.gray,
              width: wp(10),
            },
          }}
          customModalProps={{
            animationType: "fade",
            statusBarTranslucent: true,
          }}
          customAvoidingViewProps={{
            enabled: false,
          }}
        >
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHeader}>
              <Image
                source={{
                  uri:
                    form.user?.photo ||
                    "https://www.mtsolar.us/wp-content/uploads/2020/04/avatar-placeholder.png",
                }}
                style={styles.bottomSheetAvatar}
                resizeMode="cover"
              />
              <Text style={styles.bottomSheetTitle}>
                {form.user?.firstName || "User"}
              </Text>
            </View>

            <View style={styles.bottomSheetOptions}>
              {form.friendshipStatus === "pending-sent" && (
                <>
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      rbSheetRef.current?.close();
                      setTimeout(() => form.cancelFriendRequest(), 400);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="account-cancel-outline"
                      size={24}
                      color={Colors.white}
                    />
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>Cancel Request</Text>
                      <Text style={styles.optionSubtitle}>
                        Cancel your friend request
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      rbSheetRef.current?.close();
                      setTimeout(() => {
                        Alert.alert("Report", "Thanks for letting us know.");
                      }, 400);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="flag-outline"
                      size={24}
                      color={Colors.white}
                    />
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>Report</Text>
                      <Text style={styles.optionSubtitle}>
                        Report this account for inappropriate content or
                        behavior
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}

              {form.friendshipStatus === "pending-received" && (
                <>
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      rbSheetRef.current?.close();
                      setTimeout(() => form.acceptFriendRequest(), 400);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="account-check-outline"
                      size={24}
                      color={Colors.green}
                    />
                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[styles.optionTitle, { color: Colors.green }]}
                      >
                        Approve
                      </Text>
                      <Text style={styles.optionSubtitle}>
                        Accept their friend request
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      rbSheetRef.current?.close();
                      setTimeout(() => form.rejectFriendRequest(), 400);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="account-remove-outline"
                      size={24}
                      color={Colors.colorred}
                    />
                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[styles.optionTitle, { color: Colors.colorred }]}
                      >
                        Reject
                      </Text>
                      <Text style={styles.optionSubtitle}>
                        Remove this friend request
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      rbSheetRef.current?.close();
                      setTimeout(() => {
                        Alert.alert("Report", "Thanks for letting us know.");
                      }, 400);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="flag-outline"
                      size={24}
                      color={Colors.white}
                    />
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>Report</Text>
                      <Text style={styles.optionSubtitle}>
                        Report this account for inappropriate content or
                        behavior
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}

              {form.friendshipStatus === "friends" && (
                <>
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      rbSheetRef.current?.close();
                      setTimeout(() => form.unfriend(), 400);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="account-remove-outline"
                      size={24}
                      color={Colors.white}
                    />
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>Unfriend</Text>
                      <Text style={styles.optionSubtitle}>
                        Remove them as a friend
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      rbSheetRef.current?.close();
                      setTimeout(() => {
                        Alert.alert("Blocked", "This user has been blocked.");
                      }, 400);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="block-helper"
                      size={24}
                      color={Colors.white}
                    />
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>Block</Text>
                      <Text style={styles.optionSubtitle}>
                        They won't be able to see you or contact you
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      rbSheetRef.current?.close();
                      setTimeout(() => {
                        Alert.alert("Report", "Thanks for letting us know.");
                      }, 400);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="flag-outline"
                      size={24}
                      color={Colors.white}
                    />
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>Report</Text>
                      <Text style={styles.optionSubtitle}>
                        Report this account for inappropriate content or
                        behavior
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </RBSheet>
      </ScrollView>

      <Loader status={form.loading} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp("0%"),
    paddingBottom: hp(8),
  },
  // Bottom sheet styles
  bottomSheetContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
  },
  bottomSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: "#444",
    marginBottom: hp(1),
  },
  bottomSheetAvatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },
  bottomSheetTitle: {
    color: Colors.white,
    fontSize: wp(4.5),
    fontWeight: "700",
  },
  bottomSheetOptions: {
    paddingTop: hp(0.5),
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.8),
    borderBottomWidth: 0.5,
    borderBottomColor: "#3a3a3a",
  },
  optionTextContainer: {
    marginLeft: wp(3),
    flex: 1,
  },
  optionTitle: {
    color: Colors.white,
    fontSize: wp(4),
    fontWeight: "600",
  },
  optionSubtitle: {
    color: "#888",
    fontSize: wp(3.2),
    marginTop: hp(0.3),
  },
});
