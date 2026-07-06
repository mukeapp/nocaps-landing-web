import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "@/core/utils/responsive";
import { Images } from "@/core/constants/Images";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { LinearProgress } from "@/core/components/section-b";

type HabitLink = any;

type Props = {
  links: HabitLink[];
  onOpen: (link: HabitLink) => void;
};

const HabitLinkListCard: React.FC<Props> = ({ links, onOpen }) => {
  if (!Array.isArray(links) || links.length === 0) return null;

  return (
    <>
      {links.map((habit, idx) => {
        const imageKey = habit?.icon?.split("/")?.pop()?.replace(".png", "");
        const icon = imageKey ? Images[imageKey] : Images.cup;

        // when no sub-items, show zero cost/score
        if (!habit?.habitLinkItemComponentsData?.length) {
          return (
            <View key={`${idx}-empty`} style={s.row}>
              <View style={s.left}>
                <View style={s.iconback}>
                  <Image source={icon} resizeMode="contain" style={s.dollar} />
                  <View style={s.fileview}>
                    <Image source={Images.file} resizeMode="contain" style={s.file} />
                  </View>
                </View>

                <View style={s.martview}>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={MainStyles.text14}>{habit?.name?.split(" ")[0]}</Text>
                    <View style={s.mrtview}>
                      <Text style={MainStyles.text12semibold}>$0.00</Text>
                    </View>
                  </View>

                  <View style={{ marginLeft: wp(3) }}>
                    <LinearProgress progress={0} backgroundColor="#ddd" progressColor={Colors.inputback} />
                  </View>
                </View>
              </View>

              <TouchableOpacity style={s.fileicon} onPress={() => onOpen(habit)}>
                <Image source={Images.file} resizeMode="contain" style={s.filesize} />
              </TouchableOpacity>
            </View>
          );
        }

        // with sub-items
        return habit.habitLinkItemComponentsData.map((habitlink: any, subIdx: number) => (
          <View key={`${idx}-${subIdx}`} style={s.row}>
            <View style={s.left}>
              <View style={s.iconback}>
                <Image source={icon} resizeMode="contain" style={s.dollar} />
                <View style={s.fileview}>
                  <Image source={Images.file} resizeMode="contain" style={s.file} />
                </View>
              </View>

              <View style={s.martview}>
                <View style={{ flexDirection: "column" }}>
                  <Text style={MainStyles.text14}>{habit?.name?.split(" ")[0]}</Text>
                  <View style={s.mrtview}>
                    <Text style={MainStyles.text12semibold}>${habitlink?.cost}</Text>
                  </View>
                </View>

                <View style={{ marginLeft: wp(3) }}>
                  <LinearProgress
                    progress={habit?.scoreComponent?.score}
                    backgroundColor="#ddd"
                    progressColor={
                      habit?.scoreComponent?.scoreInfo?.color
                        ? habit?.scoreComponent?.scoreInfo?.color?.toLowerCase()
                        : Colors.inputback
                    }
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={s.fileicon} onPress={() => onOpen(habit)}>
              <Image source={Images.file} resizeMode="contain" style={s.filesize} />
            </TouchableOpacity>
          </View>
        ));
      })}
    </>
  );
};

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: hp(1), marginTop: hp(1.5) },
  left: { flexDirection: "row", alignItems: "center" },
  iconback: {
    width: wp(12), height: wp(12), alignItems: "center", justifyContent: "center",
    backgroundColor: Colors.icon_back, borderRadius: wp(3),
  },
  dollar: { width: wp(7), height: wp(7) },
  fileview: {
    width: wp(5), height: wp(5), borderRadius: wp(3), backgroundColor: Colors.blueback,
    position: "absolute", alignItems: "center", justifyContent: "center", top: hp(-0.7), right: hp(-0.7),
  },
  file: { width: wp(4), height: wp(4), tintColor: Colors.white },
  fileicon: {
    width: wp(9), height: wp(9), borderRadius: wp(5), backgroundColor: Colors.blueback,
    alignItems: "center", justifyContent: "center",
  },
  filesize: { width: wp(6), height: wp(6), tintColor: Colors.white },
  martview: { flexDirection: "row", alignItems: "center", marginLeft: wp(4) },
  mrtview: {
    borderRadius: wp(10), backgroundColor: Colors.text_background, marginLeft: wp(0.4),
    alignItems: "center", justifyContent: "center", paddingVertical: hp(0.3), paddingHorizontal: wp(2),
    alignSelf: "flex-start", marginTop: hp(0.3),
  },
});

export default HabitLinkListCard;
