import React from "react";
import { Platform, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Images } from "@/core/constants/Images";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getDefaultImageUrl, getDefaultImageUrl2 } from "@/core/utils";

const isWeb = Platform.OS === "web";
// On web, render at a fixed iPad Pro-equivalent size (1024×1366 × 0.55 cap) so
// elements don't inflate with the browser width; native keeps responsive wp/hp.
const wwp = (p: number) => (isWeb ? +(p * 5.632).toFixed(1) : wp(`${p}%`));
const whp = (p: number) => (isWeb ? +(p * 7.513).toFixed(1) : hp(`${p}%`));

interface ProfileHeroProps {
  user: any;
  navigation: any;
  editProfile?: () => void;
  canEditProfile?: boolean;
}

const ProfileHero: React.FC<ProfileHeroProps> = ({
  user,
  navigation,
  editProfile,
  canEditProfile = false,
}) => {
  const firstName = user?.firstName || "Bonnie";
  const lastName = user?.lastName || "Stehr";
  const fullName = `${firstName} ${lastName}`;
  const username = user?.username || "@bonniestehr";
  const isOnline = user?.isOnline ?? true;

  return (
    <View style={styles.heroContainer}>
      {/* Cover / Banner */}
      <View style={styles.coverWrapper}>
        <Image
          source={
            user?.bannerImage
              ? { uri: user.bannerImage }
              : { uri: getDefaultImageUrl2() }
          }
          style={styles.coverImage}
          resizeMode="cover"
        />

        {/* Top right icons - positioned higher on banner */}
        <View style={styles.topRightIcons}>
          {canEditProfile && (
            <TouchableOpacity style={styles.iconButton} onPress={editProfile}>
              <Feather name="edit-2" size={16} color={Colors.white} />
            </TouchableOpacity>
          )}

          {/* {canEditProfile && (
            <View style={styles.notificationWrapper}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={Colors.white}
                />
              </TouchableOpacity>
              <View style={styles.notificationBadge} />
            </View>
          )}

          {canEditProfile && (
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="settings-outline"
                size={18}
                color={Colors.white}
              />
            </TouchableOpacity>
          )} */}
        </View>

        {/* Avatar overlapping banner and profile section */}
        <View style={styles.avatarWrapper}>
          <Image
            source={
              user?.photo
                ? { uri: user.photo }
                : (Images as any).userPlaceholder || Images.logo
            }
            style={styles.avatar}
          />
          {canEditProfile && (
            <TouchableOpacity style={styles.cameraButton} onPress={editProfile}>
              <Feather name="camera" size={10} color={Colors.black} />
            </TouchableOpacity>
           )}
        </View>
      </View>

      {/* Profile info section - below the banner */}
      <View style={styles.profileSection}>
        {/* Left side: Info (with space for avatar) */}
        <View style={styles.leftSection}>
          <View style={styles.infoWrapper}>
            <Text style={styles.name}>{fullName}</Text>
            <View style={styles.statusRow}>
              <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">{username}</Text>
              <Text style={styles.separator}> • </Text>
              <Text style={styles.statusText}>Available Now</Text>
              <View style={styles.statusDot} />
            </View>
          </View>
        </View>

        {/* Right side: Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="star-o" size={18} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="share" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileHero;

const styles = StyleSheet.create({
  heroContainer: {
    marginTop: whp(0),
    marginBottom: whp(0),
  },

  /* Cover wrapper */
  coverWrapper: {
    borderTopLeftRadius: wwp(4),
    borderTopRightRadius: wwp(4),
    overflow: "visible",
    backgroundColor: Colors.title_background,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: whp(28),
    borderTopLeftRadius: wwp(4),
    borderTopRightRadius: wwp(4),
  },

  /* Top right icons */
  topRightIcons: {
    position: "absolute",
    bottom: whp(1),
    right: wwp(4),
    flexDirection: "row",
    alignItems: "center",
    gap: wwp(2.5),
  },
  iconButton: {
    width: wwp(9),
    height: wwp(9),
    borderRadius: wwp(4.5),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationWrapper: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -whp(0.4),
    right: -wwp(0.6),
    width: wwp(2.5),
    height: wwp(2.5),
    borderRadius: wwp(1.25),
    backgroundColor: "#FF4444",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.5)",
  },

  /* Profile section - below banner */
  profileSection: {
    backgroundColor: Colors.title_background,
    paddingLeft: wwp(4),
    paddingRight: wwp(4),
    paddingTop: whp(5),
    paddingBottom: whp(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // borderBottomLeftRadius: wwp(4),
    // borderBottomRightRadius: wwp(4),
    marginTop: -wwp(1),
  },

  /* Left section with avatar and info */
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: wwp(28),
  },

  /* Avatar */
  avatarWrapper: {
    position: "absolute",
    bottom: -whp(4),
    left: wwp(4),
    width: wwp(18),
    height: wwp(18),
    borderRadius: wwp(9),
    borderWidth: 3,
    borderColor: Colors.white,
    overflow: "visible",
    backgroundColor: Colors.black,
    zIndex: 10,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: wwp(9),
  },
  cameraButton: {
    position: "absolute",
    bottom: -wwp(0.5),
    right: -wwp(0.5),
    width: wwp(6),
    height: wwp(6),
    borderRadius: wwp(3),
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 11,
  },

  /* Info wrapper */
  infoWrapper: {
    flex: 1,
    flexShrink: 1,
  },

  /* Name and status */
  name: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "semibold",
    marginBottom: whp(0.4),
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: Colors.text_color,
    fontSize: 13,
    fontFamily: "regular",
    flexShrink: 1,
  },
  separator: {
    color: Colors.text_color,
    fontSize: 13,
  },
  statusText: {
    color: Colors.text_color,
    fontSize: 13,
    fontFamily: "regular",
  },
  statusDot: {
    width: wwp(2),
    height: wwp(2),
    borderRadius: wwp(1),
    backgroundColor: Colors.green || "#32D74B",
    marginLeft: wwp(1.5),
  },

  /* Action buttons */
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: wwp(2),
    position: "absolute",
    right: wwp(4),
    bottom: whp(2),
  },
  actionButton: {
    width: wwp(10),
    height: wwp(10),
    borderRadius: wwp(5),
    backgroundColor: Colors.content_back,
    justifyContent: "center",
    alignItems: "center",
  },
});
