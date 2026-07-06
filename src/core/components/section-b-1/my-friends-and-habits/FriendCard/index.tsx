// core/components/section-b-1/friends/FriendCard.tsx
import React, { useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import {showToastSuccess} from "@/core/utils";

export type FriendCardProps = {
  firstName?: string;
  lastName?: string;
  username?: string;
  photo?: string;
  email?: string;
  showEmail?: boolean;
  btnAddText?: string;
  btnRemoveText?: string;
  showBtnAdd?: boolean;
  showBtnRemove?: boolean;
  show3dotsBtn?: boolean;
  btnAddOutlined?: boolean;
  btnAddColor?: string;
  isReceiver?: boolean;
  bottomSheetMode?: "friends" | "suggestions" | "requests";
  onPress?: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
  onUnfollow?: () => void;
  onBlock?: () => void;
  onUnfriend?: () => void;
  onReport?: () => void;
};

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
  firstName,
  lastName,
  username,
  photo,
  email,
  showEmail = false,
  onPress = () => console.log("FriendCard pressed"),
  onAdd = () => console.log("Add friend pressed"),
  onRemove = () => console.log("Remove friend pressed"),
  onUnfollow = () => console.log("Unfollow friend pressed"),
  onBlock = () => console.log("Block friend pressed"),
  onUnfriend = () => console.log("Unfriend pressed"),
  onReport = () => console.log("Report pressed"),
  btnAddText = "Add",
  btnRemoveText = "Remove",
  showBtnAdd = true,
  showBtnRemove = true,
  show3dotsBtn = false,
  btnAddOutlined = false,
  btnAddColor,
  isReceiver = false,
  bottomSheetMode = "friends",
}) => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const refRBSheet = useRef<RBSheetRef>(null);

  const handleOpen3dots = () => {
    refRBSheet.current?.open();
  };

  const handleUnfollow = () => {
    refRBSheet.current?.close();
    onUnfollow?.();
  };

  const handleBlock = () => {
    refRBSheet.current?.close();
    onBlock?.();
  };

  const handleUnfriend = () => {
    refRBSheet.current?.close();
    showToastSuccess("Friend Removed");
    onRemove?.();
    onUnfriend?.();
  };

  const handleReport = () => {
    refRBSheet.current?.close();
    onReport?.();
  };

  const handleAddFromSheet = () => {
    refRBSheet.current?.close();
    onAdd?.();
  };

  return (
    <>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
        {/* Avatar */}
        <Image
          source={{
            uri:
              photo ||
              "https://www.mtsolar.us/wp-content/uploads/2020/04/avatar-placeholder.png",
          }}
          style={styles.avatar}
          resizeMode="cover"
        />

        {/* Info */}
        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.name}>
            {fullName || username}
          </Text>
          {!!username && (
            <Text numberOfLines={1} style={styles.username}>
              @{username}
            </Text>
          )}
          {!!email && showEmail && (
            <Text numberOfLines={1} style={styles.email}>
              {email}
            </Text>
          )}
        </View>

        {/* Right actions */}
        <View style={styles.actions}>
          {/* Add Button */}
          {showBtnAdd && (
            <TouchableOpacity
              style={[
                btnAddOutlined ? styles.addBtnOutlined : styles.addBtn,
                !btnAddOutlined && btnAddColor ? { backgroundColor: btnAddColor } : undefined,
              ]}
              onPress={onAdd}
            >
              <Text style={styles.addText}>{btnAddText}</Text>
            </TouchableOpacity>
          )}

          {/* Remove / Cancel Button */}
          {showBtnRemove && (
            <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
              <Text style={styles.removeText}>{btnRemoveText}</Text>
            </TouchableOpacity>
          )}

          {/* 3 Dots Button */}
          {show3dotsBtn && (
            <TouchableOpacity onPress={handleOpen3dots} style={styles.dotsBtn}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={20}
                color={Colors.white}
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        height={bottomSheetMode === "suggestions" ? (isTablet ? hp(80) : hp(50)): (isTablet ? hp(80) : hp(60))}
        customStyles={{
          container: {
            backgroundColor: '#2C2C2E',
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
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{
                uri:
                  photo ||
                  "https://www.mtsolar.us/wp-content/uploads/2020/04/avatar-placeholder.png",
              }}
              style={styles.headerAvatar}
              resizeMode="cover"
            />
            <Text style={styles.headerTitle}>{fullName}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {bottomSheetMode === "requests" ? (
              <>
                {/* Approve or Pending */}
                <TouchableOpacity
                  onPress={isReceiver ? handleAddFromSheet : undefined}
                  style={[styles.optionItem, !isReceiver && styles.optionDisabled]}
                  activeOpacity={isReceiver ? 0.7 : 1}
                >
                  <MaterialCommunityIcons
                    name={isReceiver ? "account-check-outline" : "clock-outline"}
                    size={24}
                    color={isReceiver ? Colors.green : Colors.gray}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, !isReceiver && { color: Colors.gray }]}>
                      {isReceiver ? `Approve ${firstName}` : "Pending"}
                    </Text>
                    <Text style={styles.optionSubtitle}>
                      {isReceiver
                        ? `Accept ${firstName}'s friend request`
                        : "Waiting for them to respond"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Reject */}
                <TouchableOpacity onPress={handleUnfriend} style={styles.optionItem}>
                  <MaterialCommunityIcons
                    name="account-remove-outline"
                    size={24}
                    color={Colors.colorred}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, { color: Colors.colorred }]}>
                      Reject
                    </Text>
                    <Text style={styles.optionSubtitle}>
                      Remove this friend request
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Report */}
                <TouchableOpacity onPress={handleReport} style={styles.optionItem}>
                  <MaterialCommunityIcons
                    name="flag-outline"
                    size={24}
                    color={Colors.white}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Report {firstName}</Text>
                    <Text style={styles.optionSubtitle}>
                      Report this account for inappropriate content or behavior
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : bottomSheetMode === "suggestions" ? (
              <>
                {/* Add as Friend Option */}
                <TouchableOpacity onPress={handleAddFromSheet} style={styles.optionItem}>
                  <MaterialCommunityIcons
                    name="account-plus-outline"
                    size={24}
                    color={Colors.white}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Add as Friend</Text>
                    <Text style={styles.optionSubtitle}>
                      Send {firstName} a friend request
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Block Option */}
                <TouchableOpacity onPress={handleBlock} style={styles.optionItem}>
                  <MaterialCommunityIcons
                    name="block-helper"
                    size={24}
                    color={Colors.white}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Block {firstName}</Text>
                    <Text style={styles.optionSubtitle}>
                      {firstName} won't be able to see you or contact you
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Report Option */}
                <TouchableOpacity onPress={handleReport} style={styles.optionItem}>
                  <MaterialCommunityIcons
                    name="flag-outline"
                    size={24}
                    color={Colors.white}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Report {firstName}</Text>
                    <Text style={styles.optionSubtitle}>
                      Report this account for inappropriate content or behavior
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Unfollow Option */}
                <TouchableOpacity onPress={handleUnfollow} style={styles.optionItem}>
                  <MaterialCommunityIcons
                    name="account-remove"
                    size={24}
                    color={Colors.white}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Unfollow {firstName}</Text>
                    <Text style={styles.optionSubtitle}>
                      Stop seeing posts but stay friends. They won't be notified
                      that you unfollowed.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Block Option */}
                <TouchableOpacity onPress={handleBlock} style={styles.optionItem}>
                  <MaterialCommunityIcons
                    name="block-helper"
                    size={24}
                    color={Colors.white}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Block {firstName}</Text>
                    <Text style={styles.optionSubtitle}>
                      {firstName} won't be able to see you or contact you
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Unfriend Option */}
                <TouchableOpacity onPress={handleUnfriend} style={styles.optionItem}>
                  <MaterialCommunityIcons
                    name="account-remove-outline"
                    size={24}
                    color={Colors.white}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Unfriend {firstName}</Text>
                    <Text style={styles.optionSubtitle}>
                      Remove {firstName} as Friend
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </RBSheet>
    </>
  );
};

export default FriendCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderline,
  },
  avatar: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    backgroundColor: "#222",
  },
  info: {
    flex: 1,
    marginLeft: wp(3),
  },
  name: {
    color: Colors.white,
    fontSize: wp(4),
    fontFamily: "poppins_semibold",
  },
  username: {
    marginTop: hp(0.2),
    color: Colors.gray,
    fontSize: wp(3.4),
    fontFamily: "poppins_regular",
  },
  email: {
    marginTop: hp(0.2),
    color: Colors.gray,
    fontSize: wp(3.2),
    fontFamily: "poppins_regular",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  addBtn: {
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(3),
    backgroundColor: Colors.primary,
    borderRadius: wp(2),
    marginLeft: wp(1),
  },
  addBtnOutlined: {
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.gray,
    marginLeft: wp(1),
  },
  removeBtn: {
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.gray,
    marginLeft: wp(1),
  },
  dotsBtn: {
    marginLeft: wp(1),
    padding: wp(1),
  },
  addText: {
    color: Colors.white,
    fontSize: wp(3.4),
    fontFamily: "poppins_semibold",
  },
  removeText: {
    color: Colors.white,
    fontSize: wp(3.4),
    fontFamily: "poppins_regular",
  },
  del: {
    width: wp(5),
    height: wp(5),
  },
  // Bottom Sheet Styles
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  headerAvatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: "#222",
    marginRight: wp(3),
  },
  headerTitle: {
    color: Colors.white,
    fontSize: wp(4),
    fontFamily: "poppins_semibold",
  },
  optionsContainer: {
    marginTop: hp(2),
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2),
    marginBottom: hp(1),
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionTextContainer: {
    marginLeft: wp(3),
    flex: 1,
  },
  optionTitle: {
    color: Colors.white,
    fontSize: wp(3.8),
    fontFamily: "poppins_semibold",
    marginBottom: hp(0.5),
  },
  optionSubtitle: {
    color: Colors.gray,
    fontSize: wp(3.2),
    fontFamily: "poppins_regular",
    lineHeight: wp(4),
  },
});