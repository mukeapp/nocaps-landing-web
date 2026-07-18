import React, { useRef, useState } from "react";
import { View, Image, StyleSheet, Pressable, Text } from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import { resolveImageSource } from "@/core/utils";
import { HabitStackComponent } from "@/core/models/section-b";
import { HabitStackRating } from "@/core/models/section-b/habit";
import BottomSheetHabitStackReview, {
  SCORE_COLORS,
} from "../BottomSheetHabitStackReview";

type RootState = any;

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

type Props = {
  icon?: string;
  color: string;
  iconColor?: string;
  habitStack?: HabitStackComponent;
};

const HeaderLeft: React.FC<Props> = ({ icon, iconColor, habitStack = null }) => {
  const currentUserId = useSelector(
    (state: RootState) => state?.user?.userdata?.collectdata?.userId
  );

  const reviewSheetRef = useRef<RBSheetRef>(null);

  const [localRatings, setLocalRatings] = useState<HabitStackRating[]>(
    habitStack?.rateScoreComponent?.habitStackRatings ?? []
  );

  const rateScore =
    localRatings.length > 0
      ? localRatings.reduce((sum, r) => sum + (r.rating ?? 0), 0) / localRatings.length
      : 0;
  const scoreIdx = Math.max(0, Math.min(5, Math.round(rateScore)));
  const starColor = SCORE_COLORS[scoreIdx];

  return (
    <View style={[s.iconWrap, { backgroundColor: iconColor }]}>
      <Image
        source={resolveImageSource(icon, Images.dollar)}
        resizeMode="contain"
        style={s.icon}
      />

      <Pressable
        style={s.starBadgeRow}
        onPress={() => reviewSheetRef.current?.open()}
      >
        <Image
          source={Images.star}
          resizeMode="contain"
          style={[s.star, { tintColor: starColor }]}
        />
        {rateScore > 0 && (
          <View style={s.scorePill}>
            <Text style={s.scoreText}>{scoreIdx}</Text>
          </View>
        )}
      </Pressable>

      <BottomSheetHabitStackReview
        ref={reviewSheetRef}
        habitStack={habitStack}
        habitStackRatings={localRatings}
        onRatingsChange={setLocalRatings}
        currentUserId={currentUserId}
      />
    </View>
  );
};

const s = StyleSheet.create({
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.icon_back,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { width: 30, height: 30 },
  starBadgeRow: {
    position: "absolute",
    right: -6,
    top: -6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: Colors.title_background,
    borderRadius: 11,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  star: { width: 11, height: 11 },
  scorePill: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    color: "#000",
    fontSize: 9,
    fontWeight: "700",
  },
});

export default HeaderLeft;
