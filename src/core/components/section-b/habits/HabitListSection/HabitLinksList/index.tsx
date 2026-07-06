import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import { Images } from "@/core/constants/Images";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { LinearProgress } from "@/core/components/section-b";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "@/core/utils/responsive";
import {truncateString} from "@/core/utils/utilities/string";
import {formatCost} from "@/core/utils/utilities/numberUtils";

type Props = {
  costSymbol?: string;
  links: any[];
  onOpenItem: (habitLink: any) => void;
};

const HabitLinksList: React.FC<Props> = ({ costSymbol = "", links, onOpenItem }) => {
  if (!links?.length) return null;

  return (
    <>
      {links.map((habit, index) => {
        const key = habit?.icon?.split("/").pop()?.replace(".png", "");
        const hasItems = habit?.habitLinkItemComponentsData?.length > 0;
        const cost = hasItems ? habit?.habitLinkItemComponentsData[0]?.cost : 0;
        const score = habit?.scoreComponent?.score || 0;

        return (
          <View style={s.row} key={`${habit?.documentId || index}`}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={s.iconback}>
                <Image source={key ? Images[key] : Images.cup} resizeMode="contain" style={s.dollar} />
                <View style={s.fileChip}><Image source={Images.file} resizeMode="contain" style={s.file} /></View>
              </View>

              <View style={s.mart}>
                <View>
                  <Text style={MainStyles.text14}>{truncateString(habit?.name ?? "", 20)}</Text>
                  <View style={{ marginLeft: wp(0) }}>
                    <LinearProgress
                      progress={score}
                      backgroundColor="#ddd"
                      progressColor={
                        habit?.scoreComponent?.scoreInfo?.color
                          ? habit?.scoreComponent?.scoreInfo?.color?.toLowerCase()
                          : Colors.inputback
                      }
                    />
                  </View>
                  <View style={s.cost}>
                    <Text style={MainStyles.text12semibold}>
                      {costSymbol} {formatCost(cost)}
                      </Text>
                  </View>
                </View>

                {/* <SafeAreaView>
                  <View style={{ marginLeft: wp(3) }}>
                    <LinearProgress
                      progress={score}
                      backgroundColor="#ddd"
                      progressColor={
                        habit?.scoreComponent?.scoreInfo?.color
                          ? habit?.scoreComponent?.scoreInfo?.color?.toLowerCase()
                          : Colors.inputback
                      }
                    />
                  </View>
                </SafeAreaView> */}
              </View>
            </View>

            <TouchableOpacity style={s.fileBtn} onPress={() => onOpenItem(habit)}>
              <Image source={Images.file} resizeMode="contain" style={s.fileBig} />
            </TouchableOpacity>
          </View>
        );
      })}
    </>
  );
};

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: hp(1), marginTop: hp(1.5) },
  iconback: {
    width: wp(12), height: wp(12), alignItems: "center", justifyContent: "center",
    backgroundColor: Colors.text_background, borderRadius: wp(3), marginTop: hp(1),
  },
  dollar: { width: wp(7), height: wp(7) },
  fileChip: {
    width: wp(5), height: wp(5), borderRadius: wp(3), backgroundColor: Colors.blueback,
    position: "absolute", alignItems: "center", justifyContent: "center", top: -hp(0.7), right: -hp(0.7),
  },
  file: { width: wp(4), height: wp(4), tintColor: Colors.white },
  mart: { flexDirection: "row", alignItems: "center", marginLeft: wp(4) },
  cost: {
    borderRadius: wp(10), backgroundColor: Colors.text_background, marginLeft: wp(1),
    alignItems: "center", justifyContent: "center", paddingVertical: hp(0.3), paddingHorizontal: wp(2), alignSelf: "flex-start", marginTop: hp(0.3),
  },
  fileBtn: { width: wp(9), height: wp(9), borderRadius: wp(5), backgroundColor: Colors.blueback, alignItems: "center", justifyContent: "center" },
  fileBig: { width: wp(6), height: wp(6), tintColor: Colors.white },
});

export default HabitLinksList;
