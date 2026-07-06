import React from "react";
import { Platform, View, Text, Image, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "@/core/utils/responsive";
import moment from "moment";
import AntDesign from "@expo/vector-icons/AntDesign";

const isWeb = Platform.OS === "web";

import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { SemiCircleProgress } from "@/core/components/section-b";
import { HabitComponent } from "@/core/models/section-b";
import { Images } from "@/core/constants/Images";
import {formatCost, formatCostAsNumber} from "@/core/utils/utilities/numberUtils";

type Props = {
  habit: HabitComponent;
  scoreColor?: string;
};

const HabitSubHeader: React.FC<Props> = ({ habit, scoreColor }) => {
  const friends = habit?.friendHabits ?? [];
  const days = habit?.habitDayComponents ?? [];
  const fewDays = days.length >= 0 && days.length < 3;

  const score = habit?.scoreComponent?.score ?? 0;

  return (
    <View style={s.scheduleRow}>
      {/* frequency left */}
      <View style={s.frequencyColumn}>
        {!!habit?.frequency && (
          <View style={s.chip}>
            <Text style={MainStyles.text10}>{habit.frequency}</Text>
          </View>
        )}

        {!!habit?.startTime && !!habit?.endTime && (
          <View style={s.chip}>
            <Text style={MainStyles.text10}>
              {moment(habit.startTime).local().format("h:mm A")} - {moment(habit.endTime).local().format("h:mm A")}
            </Text>
          </View>
        )}

        <View style={s.daysRow}>
          {fewDays ? (
            days.map((d, i) => (
              <View style={s.day} key={i}>
                <Text style={MainStyles.text10}>{d?.day?.label?.charAt(0)}</Text>
              </View>
            ))
          ) : (
            <View style={s.dayFull}>
              <Text style={MainStyles.text10}>
                {days.map((d) => d?.day?.label?.charAt(0)).join(" ")}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* friends center */}
      {/* <View style={s.friendsWrap}>
        {friends.slice(0, 2).map((f, idx) => (
          <View key={f.id ?? idx} style={[s.proview, { right: idx ? wp(2.3 * idx) : 0 }]}>
            <Image source={Images.profile} resizeMode="contain" style={s.proshow} />
          </View>
        ))}

        {friends.length > 2 && (
          <View style={[s.plus2, { right: wp(2.3 * 2) }]}>
            <Text style={MainStyles.text14}>{friends.length - 2}+</Text>
          </View>
        )}

        <View style={[s.onlyplus, { right: wp(2.3 * 2 + (friends.length > 2 ? 2.7 : 2.3)) }]}>
          <AntDesign name="plus" size={24} color={Colors.black} />
        </View>
      </View> */}

      {/* score right */}
      <SemiCircleProgress
        progress={ score < 1 ? formatCostAsNumber(score * 100,false) : formatCostAsNumber(score,false)}
        size={45}
        strokeWidth={4}
        backgroundColor={Colors.white}
        progressColor={scoreColor ?? Colors.inputback}
        statustxt={habit?.scoreComponent?.scoreInfo?.label ?? ""}
      />
    </View>
  );
};

const s = StyleSheet.create({
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  frequencyColumn: {
    flexDirection: "column",
    alignItems: "center",
  },
  chip: {
    backgroundColor: Colors.text_background,
    paddingHorizontal: isWeb ? 8 : wp("2%"),
    paddingVertical: isWeb ? 3 : hp("0.3%"),
    borderRadius: isWeb ? 999 : wp("10%"),
    marginBottom: isWeb ? 4 : hp("0.5%"),
  },
  daysRow: { flexDirection: "row", alignItems: "center" },
  day: {
    width: isWeb ? 26 : wp("7%"),
    height: isWeb ? 26 : hp("3%"),
    borderRadius: isWeb ? 999 : wp("10%"),
    backgroundColor: Colors.text_background,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: isWeb ? 4 : wp("1%"),
  },
  dayFull: {
    height: isWeb ? 26 : hp("3%"),
    paddingHorizontal: isWeb ? 16 : wp("4%"),
    borderRadius: isWeb ? 999 : wp("10%"),
    backgroundColor: Colors.text_background,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: isWeb ? 4 : wp("1%"),
  },
  friendsWrap: {
    width: wp(29),
    height: hp(6),
    backgroundColor: "transparent",
    borderRadius: wp(3),
    marginTop: hp(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  proview: {
    width: wp(10.5),
    height: wp(10.5),
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: Colors.black,
    overflow: "hidden",
    position: "relative",
  },
  proshow: { width: wp(10), height: wp(10), borderRadius: wp(5) },
  plus2: {
    backgroundColor: "rgba(70, 70, 70, 1)",
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  onlyplus: {
    backgroundColor: Colors.white,
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
});

export default HabitSubHeader;
