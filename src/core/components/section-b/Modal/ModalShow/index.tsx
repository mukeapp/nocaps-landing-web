import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  View,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { MainStyles } from "@/core/constants/styles";
import { DefaultLoader, ButtonSignIn } from "@/core/components/section-a";
import { Colors } from "@/core/constants/Colors";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

type Modalfun = {
  name: string;
  popup: boolean;
  items: string[];
  onSelect: (check: boolean, item: string | object) => void;
  onClose: () => void;
};
const Modalshow = ({ name, popup, items, onSelect, onClose }: Modalfun) => {
  const [selected, setselected] = useState({});
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
            <Text style={MainStyles.text20}>Select Item</Text>
            <TouchableOpacity style={styles.close} onPress={() => onClose()}>
              <SimpleLineIcons name="close" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View
            style={[
              MainStyles.viewone,
              { flexWrap: "wrap", marginTop: hp(2), maxHeight: hp(30) },
            ]}
          >
            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {items?.map((obj, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.box,
                      {
                        borderColor:
                          selected?.label == obj?.label
                            ? Colors.white
                            : "rgba(59, 59, 59, 1)",
                      },
                    ]}
                    onPress={() => setselected(obj)}
                  >
                    <Text style={[MainStyles.text10, { fontSize: 12 }]}>
                      {obj?.value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <View style={{ alignSelf: "center" }}>
            <ButtonSignIn
              text="Apply"
              wid="84"
              bg={Colors.white}
              bd={Colors.white}
              txcl={Colors.black}
              ftn={16}
              mov={() =>
                name == "habitstack"
                  ? onSelect(name, "false", selected)
                  : onSelect(name, "false", selected?.value)
              }
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default Modalshow;

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
    paddingTop: hp(30),
    alignItems: "center",
  },
  container: {
    width: wp(95),
    borderRadius: wp(3),
    paddingHorizontal: wp(1.5),
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
    borderRadius: wp(10),
    marginRight: wp(2),
    marginBottom: hp(1),
    paddingHorizontal: wp(2.4),
    paddingVertical: wp(1.8),
    borderWidth: 1,
    borderColor: "rgba(59, 59, 59, 1)",
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(1),
  },
});
