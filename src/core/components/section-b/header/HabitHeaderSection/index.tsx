import {useNavigation} from "@react-navigation/native";
import React from "react";
import {ImageSourcePropType, StyleSheet, Text, View} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";

import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";

import {HabitComponent, RouterData} from "@/core/models/section-b";
import {truncateString} from "@/core/utils";
import HeaderControls from "./HeaderControls";
import HeaderIcon from "./HeaderIcon";
import LikesPill from "./LikesPill";
import MetaRow from "./MetaRow";

export type HabitHeaderSectionProps = {
  // header
  name?: string;
  iconSource: ImageSourcePropType;
  starTint: string; // used for the star tint
  reviewColor?: string; // used for the review dot color
  iconColor?: string; // used for the icon background color
  likesCount: number;
  expanded: boolean;
  onToggleExpand: () => void;

  // meta
  cost: number;
  costSymbol?: string;
  focus?: string;
  priority?: string;
  status?: string; // STOP | PLAY | PAUSE | PREVIOUS | NEXT
  // interest
  interest?: string;
  // controls
  accentColor?: string; // dynamic color for the sync button background
  //
  habit?: HabitComponent;
  hideCalendar?: boolean;
  canEdit?: boolean;
  canGoToSwapScreen?: boolean;
  onScoreComplete?: () => void;
};

const HabitHeaderSection: React.FC<HabitHeaderSectionProps> = ({
  name,
  iconSource,
  starTint,
  reviewColor = 'rgba(128, 128, 128, 1)',
  iconColor = 'rgba(128, 128, 128, 1)',
  likesCount,
  expanded,
  onToggleExpand,
  cost,
  costSymbol = "",
  focus,
  priority,
  status,
  accentColor,
  interest,
  habit,
  hideCalendar = false,
  canEdit = false,
  canGoToSwapScreen = false,
  onScoreComplete,
}) => {
  const navigation = useNavigation<any>();
  const goToHabitCalendar = () => {
    const routerData: RouterData = {
      destinationScreenTitle: "Habit Calendar",
      habit: habit,
    };
    navigation.navigate("habit-calendar", {
      OriginScreen: "habit-header-section",
      routerData,
    });
  };
  return (
    <View>
      <View style={s.row}>
        {/* LEFT: icon + star */}
        <HeaderIcon iconSource={iconSource} starTint={reviewColor} iconColor={iconColor} habit={habit} />

        {/* RIGHT: Header line + MetaRow (kept TOGETHER in this component) */}
        <View style={s.info}>
          {/* Header line */}
          <View style={s.header}>
            <View style={s.inline}>
              <Text style={MainStyles.text14Simple}>
                {truncateString(name || "", 18)}
              </Text>
              <LikesPill likesCount={likesCount} />
            </View>

            {/* Controls with corrected icons and dynamic sync background */}
            <HeaderControls
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              accentColor={accentColor ?? starTint ?? Colors.white}
              onClickOpenIcon3={goToHabitCalendar}
              hideCalendar={hideCalendar}
              habit={habit}
              canEdit={canEdit}
              canGoToSwapScreen={canGoToSwapScreen}
              onScoreComplete={onScoreComplete}
              costSymbol={costSymbol}
            />
          </View>

          {/* MetaRow lives inside s.info and below the header (as requested) */}
          <MetaRow
            cost={cost}
            costSymbol={costSymbol}
            focus={focus}
            priority={priority}
            status={status}
            interest={interest}
          />
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
    marginTop: hp("1%"),
  },
  info: { marginLeft: wp("2%"), flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inline: { flexDirection: "row", alignItems: "center" },
});

export default HabitHeaderSection;
