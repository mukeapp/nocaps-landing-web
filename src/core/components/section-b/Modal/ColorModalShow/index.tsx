import { StyleSheet, Modal, TouchableOpacity, Text, View } from "react-native";
import React, { useState } from "react";
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
            <Text style={MainStyles.text20}>Select Color</Text>
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
          <View
            style={[
              MainStyles.viewtwo,
              { flexWrap: "wrap", marginVertical: hp(2) },
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
          </View>
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
        </View>
      </BlurView>
    </Modal>
  );
};

export default ColorModalShow;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    height: hp(100),
    width: wp(100),
    bottom: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOpacity: 0.15,
    paddingTop: isTablet ? hp(30) : hp(20),
    alignItems: "center",
  },
  container: {
    width: wp(90),
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    backgroundColor: Colors.content_back,
  },
  close: {
    backgroundColor: Colors.filtertext,
    width: wp(9),
    height: wp(9),
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(2),
    marginRight: wp(2),
    marginBottom: hp(2),
  },
});
