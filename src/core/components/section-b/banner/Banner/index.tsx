import React, {useEffect, useState} from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import {Colors} from "@/core/constants/Colors";
import {Images} from "@/core/constants/Images";
import {MainStyles} from "@/core/constants/styles";
import {IUser} from "@/core/models/section-a";
import {RouterData} from "@/core/models/section-b/router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {useNavigation} from "@react-navigation/native";
import {useSelector} from "react-redux";

type Props = {
  dataType?: string;
  bannerImage?: string;
  username?: string;
  userProfileImage?: string;
  data?: any;
  showCopyButton?: boolean;
  showCopyButtonText?: string;
  onCopyPress?: (id?: string, parentId?: string, dataType?: string) => void;
  user?: IUser;
  bannerImageShowIconGoToHabitAndFriends?: boolean; // If true, clicking the banner image will navigate to the habit and friends screen
};

const Banner: React.FC<Props> = ({
  dataType,
  bannerImage,
  showCopyButton = false,
  showCopyButtonText = "Copy Item",
  username,
  userProfileImage,
  data = null,
  onCopyPress = (id?: string, parentId?: string, dataType?: string) => {
    console.log("Copy pressed");
  },
  user,
  bannerImageShowIconGoToHabitAndFriends = false,
}) => {
  //console.log("Rendering Banner for user:", user);
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    setImageLoadError(false);
  }, [bannerImage]);
  /* eslint-disable react-hooks/rules-of-hooks */
  const savedUserdata = useSelector((s: any) => s?.user?.userdata.collectdata);
  const userdata = user ? user : savedUserdata;
  const userId = userdata?.userId?.trim();
  const isSameUser = data?.userId?.trim() === userId;
  const userPhoto = isSameUser ? userdata?.photo : userProfileImage;

  const handleCopyPress = async () => {
    if (isProcessing || isCopied || !onCopyPress) return;

    setIsProcessing(true);
    try {
      if (dataType == "habit-stack") {
        await onCopyPress(data?.documentId, undefined, dataType);
      } else if (dataType == "habit") {
        console.log("Habit Copy Pressed");
        //console.log("data:", data);
        console.log("data.documentId:", data?.documentId);
        await onCopyPress(data?.documentId, undefined, dataType);
      } else if (dataType == "habit-link") {
        console.log("Habit Link Copy Pressed");
        //console.log("data:", data);
        console.log("data.documentId:", data?.documentId);
        await onCopyPress(data?.documentId, undefined, dataType);
      }
      setIsCopied(true);
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  const goToProfileScreen = () => {
    console.log("Navigating to Profile Screen from Banner :", userId);
    const routerData: RouterData = {
      destinationScreenTitle: "Profile",
      userId: userId,
    };
    navigation.navigate("profile", {
      originScreen: "banner",
      routerData,
    });
  };

  return (
    <ImageBackground
      source={
        bannerImage && !imageLoadError
          ? { uri: bannerImage }
          : Images.default_banner_000
      }
      resizeMode="cover"
      style={s.banner}
      imageStyle={s.bannerRadius}
      onError={() => setImageLoadError(true)}
    >
      {/* Friends & Habits Icon - Top Right */}
      {bannerImageShowIconGoToHabitAndFriends && (
        <TouchableOpacity
          style={s.friendsButton}
          onPress={() => navigation.navigate("my-friends-and-habits" as never)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="account-group-outline"
            size={22}
            color={Colors.white}
          />
        </TouchableOpacity>
      )}

      {/* Copy Button - Top Right */}
      {showCopyButton && (
        <TouchableOpacity
          style={[
            s.copyButton,
            isProcessing && s.copyButtonDisabled,
            isCopied && s.copyButtonSuccess,
          ]}
          onPress={handleCopyPress}
          disabled={isProcessing || isCopied}
          activeOpacity={isProcessing || isCopied ? 1 : 0.7}
        >
          <MaterialCommunityIcons
            name={isCopied ? "check" : "content-copy"}
            size={20}
            color={Colors.white}
          />
          <Text
            style={[s.copyButtonText, isProcessing && s.copyButtonTextDisabled]}
          >
            {isProcessing
              ? "Processing..."
              : isCopied
                ? "Copied"
                : showCopyButtonText}
          </Text>
        </TouchableOpacity>
      )}

      {/* User Info - Bottom Left */}
      <TouchableOpacity
        onPress={goToProfileScreen}
        activeOpacity={0.7}
        style={s.userRow} // Move style to TouchableOpacity
      >
        <Image
          source={
            userProfileImage
              ? { uri: userProfileImage }
              : userPhoto
                ? { uri: userPhoto }
                : Images.profile
          }
          resizeMode="contain"
          style={s.avatar}
        />
        <Text style={MainStyles.text16white}>{username ?? "User"}</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const s = StyleSheet.create({
  banner: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  bannerRadius: {
    borderRadius: 12,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 12,
    left: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  friendsButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 8,
    position: "absolute",
    top: 12,
    right: 12,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    position: "absolute",
    top: 12,
    right: 12,
  },
  copyButtonDisabled: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    opacity: 0.6,
  },
  copyButtonSuccess: {
    backgroundColor: "rgba(34, 197, 94, 0.8)", // Green transparent
  },
  copyButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "poppins_semibold",
    marginLeft: 6,
  },
  copyButtonTextDisabled: {
    color: Colors.gray,
  },
});

export default Banner;
