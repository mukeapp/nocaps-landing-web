import React from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { SimpleLineIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { TouchableOpacity } from "react-native";

import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { ButtonSignIn } from "@/core/components/section-a";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

const AlertModal: React.FC<Props> = ({ visible, title, message, onClose }) => {
  return (
    <Modal animationType="slide" visible={visible} transparent>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={35}
        tint="light"
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={MainStyles.text20}>{title}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <SimpleLineIcons name="close" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.messageText}>{message}</Text>
          </View>

          <View style={{ alignSelf: "center", marginTop: hp(2) }}>
            <ButtonSignIn
              text="OK"
              wid="84"
              bg={Colors.white}
              bd={Colors.white}
              txcl={Colors.black}
              ftn={16}
              mov={onClose}
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    height: hp(100),
    width: wp(100),
    bottom: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOpacity: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: wp(85),
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2.5),
    backgroundColor: Colors.content_back,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    backgroundColor: Colors.filtertext,
    width: wp(9),
    height: wp(9),
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    marginTop: hp(2),
    paddingHorizontal: wp(1),
  },
  messageText: {
    color: Colors.white,
    fontSize: wp(3.8),
    lineHeight: wp(5.5),
    fontFamily: "poppins_regular",
  },
});
