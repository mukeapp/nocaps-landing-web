import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  fs,
} from "@/core/utils/responsive";

type Props = {
  preview?: string | null;
  onPick: () => void;
  size?: number; // Size in wp units (default: 35)
};

const ProfileImageUpload: React.FC<Props> = ({
  preview,
  onPick,
  size = 35,
}) => {
  const circleSize = wp(size);

  if (preview) {
    return (
      <View style={[s.container, { width: circleSize, height: circleSize }]}>
        <Image
          source={{ uri: preview }}
          style={[s.profileImage, { width: circleSize, height: circleSize, borderRadius: circleSize / 2 }]}
          resizeMode="cover"
        />
        <TouchableOpacity onPress={onPick} style={s.editButton}>
          <Entypo name="camera" size={fs(18)} color={Colors.white} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[s.uploadCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2 }]}
      onPress={onPick}
    >
      <View style={s.uploadIconWrap}>
        <Image
          source={Images.i14}
          resizeMode="contain"
          style={{ width: wp(10), height: wp(10), tintColor: Colors.white }}
        />
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "center",
    marginVertical: hp(2),
  },
  profileImage: {
    borderWidth: 3,
    borderColor: Colors.white,
  },
  editButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: Colors.green,
    borderRadius: wp(5),
    width: wp(10),
    height: wp(10),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  uploadCircle: {
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: hp(2),
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  uploadIconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileImageUpload;