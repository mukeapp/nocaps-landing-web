import React, { useRef, useState } from "react";
import { Platform, View, Image, StyleSheet, Pressable, Text, ImageSourcePropType } from "react-native";
import { useSelector } from "react-redux";
import { widthPercentageToDP as wp } from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import { HabitComponent } from "@/core/models/section-b";
import { HabitRating } from "@/core/models/section-b/habit";
import BottomSheetHabitReview, { SCORE_COLORS } from "../BottomSheetHabitReview";

type RootState = any;

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

type Props = {
  iconSource: ImageSourcePropType;
  starTint: string;
  iconColor?: string;
  habit?: HabitComponent;
};

const HeaderIcon: React.FC<Props> = ({ iconSource, starTint, iconColor = 'rgba(128, 128, 128, 1)', habit = null }) => {
  const currentUserId = useSelector(
    (state: RootState) => state?.user?.userdata?.collectdata?.userId
  );

  const reviewSheetRef = useRef<RBSheetRef>(null);

  const [localRatings, setLocalRatings] = useState<HabitRating[]>(
    habit?.rateScoreComponent?.habitRatings ?? []
  );

  const rateScore =
    localRatings.length > 0
      ? localRatings.reduce((sum, r) => sum + (r.rating ?? 0), 0) / localRatings.length
      : 0;
  const scoreIdx = Math.max(0, Math.min(5, Math.round(rateScore)));
  const starColor = SCORE_COLORS[scoreIdx];

  return (
    <View style={[s.iconWrap, { backgroundColor: iconColor }]}>
      <Image source={iconSource} resizeMode="contain" style={s.icon} />

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

      <BottomSheetHabitReview
        ref={reviewSheetRef}
        habit={habit}
        habitRatings={localRatings}
        onRatingsChange={setLocalRatings}
        currentUserId={currentUserId}
      />
    </View>
  );
};

const s = StyleSheet.create({
  iconWrap: {
    width: isWeb ? 44 : wp("12%"),
    height: isWeb ? 44 : wp("12%"),
    borderRadius: isWeb ? 10 : wp("3%"),
    backgroundColor: Colors.icon_back,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { width: isWeb ? 26 : wp("7%"), height: isWeb ? 26 : wp("7%") },
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

export default HeaderIcon;
