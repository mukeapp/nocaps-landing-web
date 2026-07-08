import { Platform, StyleSheet, Modal, TouchableOpacity, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";

const isWeb = Platform.OS === "web";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet,
} from "@/core/utils/responsive";
import { ButtonSignIn } from "@/core/components/section-a";
import { Colors } from "@/core/constants/Colors";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { MainStyles } from "@/core/constants/styles";
import { BlurView } from "expo-blur";

const ColorModalShow = ({
  popup = false,
  clor = (obj: string, clr: string) => {},
  data = [],
  onClose = () => {console.log("Closed")},
}) => {
  // const data = [
  //   {
  //     id: 1,
  //     clr: "rgba(45, 156, 219, 1)",
  //   },
  //   {
  //     id: 2,
  //     clr: "rgba(155, 81, 224, 1)",
  //   },
  //   {
  //     id: 3,
  //     clr: "rgba(242, 153, 74, 1)",
  //   },
  //   {
  //     id: 4,
  //     clr: "rgba(74, 242, 222, 1)",
  //   },
  //   {
  //     id: 5,
  //     clr: "rgba(242, 74, 195, 1)",
  //   },
  //   {
  //     id: 6,
  //     clr: "rgba(74, 111, 242, 1)",
  //   },
  //   {
  //     id: 7,
  //     clr: "rgba(218, 242, 74, 1)",
  //   },
  //   {
  //     id: 8,
  //     clr: "rgba(74, 242, 151, 1)",
  //   },
  //   {
  //     id: 9,
  //     clr: "rgba(101, 219, 45, 1)",
  //   },
  //   {
  //     id: 10,
  //     clr: "rgba(183, 232, 78, 1)",
  //   },
  //   {
  //     id: 11,
  //     clr: "rgba(224, 81, 124, 1)",
  //   },
  //   {
  //     id: 12,
  //     clr: "rgba(255, 128, 12, 1)",
  //   },
  // ];
  const [saveclr, setsaveclr] = useState("");
  return (
    <Modal animationType="slide" visible={popup} transparent={true}>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={35}
        tint="light"
        style={styles.main}
      >
        <View style={styles.container}>
          <View style={MainStyles.viewtwo}>
            <Text style={[MainStyles.text20, isWeb && { fontSize: 18 }]}>Select Color</Text>
            <TouchableOpacity
              style={styles.close}
              onPress={() => {
                //clor("false", "no");
                onClose();
              }}
            >
              <SimpleLineIcons name="close" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
            style={[
              { marginVertical: hp(2) },
              isWeb && { marginVertical: 16, maxHeight: "55vh" as any },
            ]}
          >
            {data?.map((obj) => {
              return (
                <TouchableOpacity
                  key={obj?.documentId}
                  style={[
                    styles.box,
                    {
                      backgroundColor: obj.rgba,
                      borderWidth: 2,
                      borderColor:
                        obj?.documentId == saveclr?.documentId
                          ? Colors.white
                          : "transparent",
                    },
                  ]}
                  onPress={() => setsaveclr(obj)}
                />
              );
            })}
          </ScrollView>
          {isWeb ? (
            <TouchableOpacity
              style={styles.webApply}
              onPress={() => {
                clor(false, saveclr?.rgba);
                onClose();
              }}
            >
              <Text style={styles.webApplyText}>Apply</Text>
            </TouchableOpacity>
          ) : (
            <ButtonSignIn
              text="Apply"
              wid="84"
              bg={Colors.white}
              bd={Colors.white}
              txcl={Colors.black}
              ftn={16}
              mov={() => {
                clor(false, saveclr?.rgba);
                onClose();
              }}
            />
          )}
        </View>
      </BlurView>
    </Modal>
  );
};

export default ColorModalShow;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    height: isWeb ? ("100%" as any) : hp(100),
    width: isWeb ? ("100%" as any) : wp(100),
    bottom: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOpacity: 0.15,
    paddingTop: isWeb ? 0 : isTablet ? hp(30) : hp(20),
    justifyContent: isWeb ? "center" : "flex-start",
    alignItems: "center",
  },
  container: {
    width: isWeb ? ("100%" as any) : wp(90),
    maxWidth: isWeb ? 460 : undefined,
    borderRadius: isWeb ? 16 : wp(3),
    paddingHorizontal: isWeb ? 16 : wp(3),
    paddingVertical: isWeb ? 16 : hp(1.5),
    backgroundColor: Colors.content_back,
  },
  close: {
    backgroundColor: Colors.filtertext,
    width: isWeb ? 32 : wp(9),
    height: isWeb ? 32 : wp(9),
    borderRadius: isWeb ? 16 : wp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: isWeb ? 36 : wp(10),
    height: isWeb ? 36 : wp(10),
    borderRadius: isWeb ? 8 : wp(2),
    marginRight: isWeb ? 10 : wp(2),
    marginBottom: isWeb ? 10 : hp(2),
  },
  webApply: {
    width: "100%",
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  webApplyText: {
    color: Colors.black,
    fontSize: 15,
    fontFamily: "semibold",
  },
});
