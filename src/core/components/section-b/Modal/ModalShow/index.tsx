import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  View,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";

const isWeb = Platform.OS === "web";
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
            <Text style={[MainStyles.text20, isWeb && { fontSize: 18 }]}>Select Item</Text>
            <TouchableOpacity style={styles.close} onPress={() => onClose()}>
              <SimpleLineIcons name="close" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View
            style={[
              MainStyles.viewone,
              { flexWrap: "wrap", marginTop: hp(2), maxHeight: hp(30) },
              isWeb && { maxHeight: "60vh" as any, marginBottom: 16 },
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
          {isWeb ? (
            <TouchableOpacity
              style={styles.webApply}
              onPress={() =>
                name == "habitstack"
                  ? onSelect(name, "false", selected)
                  : onSelect(name, "false", selected?.value)
              }
            >
              <Text style={styles.webApplyText}>Apply</Text>
            </TouchableOpacity>
          ) : (
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
          )}
        </View>
      </BlurView>
    </Modal>
  );
};

export default Modalshow;

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
    paddingTop: isWeb ? 0 : hp(30),
    justifyContent: isWeb ? "center" : "flex-start",
    alignItems: "center",
  },
  container: {
    width: isWeb ? ("100%" as any) : wp(95),
    maxWidth: isWeb ? 460 : undefined,
    borderRadius: isWeb ? 16 : wp(3),
    paddingHorizontal: isWeb ? 16 : wp(1.5),
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
    borderRadius: isWeb ? 999 : wp(10),
    marginRight: isWeb ? 8 : wp(2),
    marginBottom: isWeb ? 8 : hp(1),
    paddingHorizontal: isWeb ? 14 : wp(2.4),
    paddingVertical: isWeb ? 8 : wp(1.8),
    borderWidth: 1,
    borderColor: "rgba(59, 59, 59, 1)",
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: isWeb ? 20 : wp(5),
    height: isWeb ? 20 : wp(5),
    marginRight: isWeb ? 6 : wp(1),
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
