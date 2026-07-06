import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, ImageSourcePropType } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "@/core/utils/responsive";

import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import { HabitHeaderSection, HabitLinkCard, HabitLinkListCard, HabitSubHeader }  from "@/core/components/section-b";
import navigation from "@/app/navigation";

type Habit = any;

type Props = {
  habit: Habit;
  username?: string;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habit: Habit) => void;
};

const HabitPreviewCard: React.FC<Props> = ({ habit, username, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const iconKey = habit?.icon?.split?.("/")?.pop?.()?.replace?.(".png", "");
  const iconSource: ImageSourcePropType = iconKey ? Images[iconKey] : Images.cup;
  const starTint = habit?.scoreComponent?.scoreInfo?.color?.toLowerCase?.() ?? Colors.inuptborder;
  const accentColor = starTint;

  return (
    <View style={s.card}>
      {/* Header line + MetaRow together (your rule) */}
      <HabitHeaderSection
        name={habit?.name}
        iconSource={iconSource}
        starTint={starTint}
        likesCount={(habit?.habitLikes ?? []).length || 0}
        expanded={expanded}
        onToggleExpand={() => setExpanded(v => !v)}
        cost={habit?.scoreComponent?.cost ?? 0}
        focus={habit?.focus}
        priority={habit?.priority}
        status={habit?.status}
        accentColor={accentColor}
      />
      {expanded && (
        <>
          <View style={{ marginTop: hp(1.5) }}>
            <HabitSubHeader habit={habit} scoreColor={starTint} />
          </View>
          <View style={{ marginTop: hp(1.5) }}>
            <HabitLinkListCard
              links={habit?.habitLinkData ?? []}
              onOpen={() => navigation.navigate("habitlinks", { originScreen: 'my-habit-stacks' })}
            />
            {/* <HabitLinkCard
              link={habit}
              onOpenItem={() => navigation.navigate("habitlinks", { originScreen: 'my-habit-stacks' })}
            /> */}
          </View>
        </>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    width: wp(90),
    backgroundColor: Colors.content_back,
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    marginBottom: hp(0.5),
  },
  lasticon: {
    width: wp(6.5), height: wp(6.5), borderRadius: wp(7),
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)",
    alignItems: "center", justifyContent: "center", marginLeft: wp(1),
  },
  headerRight: { position: "absolute", right: wp(3), top: hp(1) },
});

export default HabitPreviewCard;
