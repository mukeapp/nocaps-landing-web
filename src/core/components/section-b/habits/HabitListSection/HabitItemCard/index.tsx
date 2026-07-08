import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import { MainStyles } from "@/core/constants/styles";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import {
    Image,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
import HabitItemDetails from "../HabitItemDetails";
import HabitItemHeader from "../HabitItemHeader";
import {IUser} from "@/core/models/section-a";
import {HabitComponent} from "@/core/models/section-b";

type Props = {
  costSymbol?: string;
  item: HabitComponent;
  username?: string;
  expanded: boolean;
  onToggleExpand: () => void;
  menuOpen: boolean;
  onOpenMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenItem: (habitLink: any) => void;
  user:IUser;
  hideSwap?: boolean;
};

const HabitItemCard: React.FC<Props> = ({
  costSymbol = "",
  item,
  username,
  expanded,
  onToggleExpand,
  menuOpen,
  onOpenMenu,
  onEdit,
  onDelete,
  onOpenItem,
  user = null,
  hideSwap = false,
}) => {
  const imageKey = item?.icon?.split("/").pop()?.replace(".png", "");
  const rgb = item?.scoreComponent?.scoreInfo?.rgb;
  const iconColor = item?.iconColor ?? 'rgba(128, 128, 128, 1)';
  //console.log(`user`,  user);
  const userPhotoURL = user?.photo;
  //console.log("HabitItemCard --> userPhotoURL:", userPhotoURL);

  return (
    <View style={s.card}>
      <ImageBackground
        source={item?.bannerImage ? { uri: item?.bannerImage } : Images.flatimg}
        resizeMode="cover"
        style={s.hero}
        imageStyle={{ borderRadius: wp(3) }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={userPhotoURL ? { uri: userPhotoURL } : Images.profile}
            resizeMode="contain"
            style={s.avatar}
          />
          <Text style={MainStyles.text16white}>{username}</Text>
        </View>
      </ImageBackground>

      <HabitItemHeader
        name={item?.name || "Untitled Habit"}
        iconKey={imageKey}
        starTint={rgb}
        interest={item?.interest}
        cost={item?.scoreComponent?.cost ?? 0}
        focus={item?.focus}
        priority={item?.priority}
        status={item?.status}

        onEdit={onEdit}
        onDelete={onDelete}
        onToggleExpand={onToggleExpand}
        costSymbol={costSymbol}
        habit={item}
        hideSwap={hideSwap}
        iconColor={iconColor}
      />

      {expanded && <HabitItemDetails item={item} onOpenItem={onOpenItem} costSymbol={costSymbol} />}

      <View style={s.footer}>
        <View style={isWeb ? { flex: 1 } : { width: wp(70) }} />
        <TouchableOpacity onPress={() => onEdit()}>
          <Feather name="edit-3" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    width: isWeb ? ("100%" as any) : wp(90),
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: isWeb ? 16 : wp(3),
    paddingHorizontal: isWeb ? 14 : wp(3),
    paddingVertical: isWeb ? 12 : hp(1),
    marginBottom: isWeb ? 16 : hp(1),
  },
  hero: {
    width: isWeb ? ("100%" as any) : wp(84),
    height: isWeb ? 180 : hp(17.4),
    padding: isWeb ? 10 : wp(2),
    justifyContent: "flex-end",
  },
  avatar: {
    width: isWeb ? 34 : wp(8.5),
    height: isWeb ? 34 : wp(8.5),
    borderRadius: isWeb ? 17 : wp(5),
    marginRight: isWeb ? 8 : wp(2),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(1),
  },
});

export default HabitItemCard;
