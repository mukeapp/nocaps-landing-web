import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import { MainStyles } from "@/core/constants/styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import moment from "moment";
import { SemiCircleProgress } from "@/core/components/section-b";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import HabitLinksList from "../HabitLinksList";
import {formatCost, formatCostAsNumber} from "@/core/utils/utilities/numberUtils";

const HabitItemDetails = ({
  costSymbol = "",
  item,
  onOpenItem,
}: {
  costSymbol?: string;
  item: any;
  onOpenItem: (habitLink: any) => void;
}) => (
  <>
    <View style={s.row}>
      <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <View style={s.pill}>
          <Text style={MainStyles.text10}>{item?.frequency}</Text>
        </View>
        {item?.startTime && item?.endTime && (
          <View style={s.pill}>
            <Text style={MainStyles.text10}>
              {moment(item.startTime).format("h:mm A")} -{" "}
              {moment(item.endTime).format("h:mm A")}
            </Text>
          </View>
        )}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {item?.habitDayComponents.length < 3 ? (
            item?.habitDayComponents?.map((d, i) => (
              <View style={s.day} key={i}>
                <Text style={MainStyles.text10}>
                  {d?.day?.label?.charAt(0)}
                </Text>
              </View>
            ))
          ) : (
            <View style={s.daysFull}>
              <Text style={MainStyles.text10}>
                {item?.habitDayComponents
                  ?.map((x) => x?.day?.label?.charAt(0))
                  .join(" ")}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={[s.friends]}>
        {item?.friendHabits.slice(0, 2).map((f, i) => (
          <View key={f.id} style={[s.friend, { right: i ? wp(2.3 * i) : 0 }]}>
            <Image
              source={Images.profile}
              resizeMode="contain"
              style={s.friendImg}
            />
          </View>
        ))}
        {item?.friendHabits.length > 2 && (
          <View style={[s.plus2, { right: wp(2.3 * 2) }]}>
            <Text style={MainStyles.text14}>
              {item?.friendHabits.length - 2}+
            </Text>
          </View>
        )}
      </View>

      <SafeAreaView style={{ top: hp(0.4) }}>
        <SemiCircleProgress
          progress={formatCostAsNumber(item?.scoreComponent?.score, true)}
          size={45}
          strokeWidth={4}
          backgroundColor={Colors.white}
          progressColor={
            item?.scoreComponent?.scoreInfo?.color
              ? item?.scoreComponent?.scoreInfo?.color?.toLowerCase()
              : Colors.inputback
          }
          statustxt={item?.scoreComponent?.scoreInfo?.label || ""}
        />
      </SafeAreaView>
    </View>

    <HabitLinksList links={item?.habitLinkData || []} onOpenItem={onOpenItem} costSymbol={costSymbol} />
  </>
);

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(2),
  },
  pill: {
    borderRadius: wp(10),
    backgroundColor: Colors.text_background,
    marginLeft: wp(1),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(0.3),
    paddingHorizontal: wp(2),
    marginBottom: hp(0.5),
  },
  day: {
    width: wp(7),
    height: hp(3),
    borderRadius: wp(10),
    backgroundColor: Colors.text_background,
    marginLeft: wp(1),
    alignItems: "center",
    justifyContent: "center",
  },
  daysFull: {
    height: hp(3),
    paddingHorizontal: wp(4),
    borderRadius: wp(10),
    backgroundColor: Colors.text_background,
    marginLeft: wp(1),
    alignItems: "center",
    justifyContent: "center",
  },
  friends: {
    width: wp(29),
    height: hp(6),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  friend: {
    width: wp(10.5),
    height: wp(10.5),
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: Colors.black,
    overflow: "hidden",
  },
  friendImg: { width: wp(10), height: wp(10), borderRadius: wp(5) },
  plus2: {
    backgroundColor: "rgba(70,70,70,1)",
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HabitItemDetails;