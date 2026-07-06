import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { SimpleLineIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { ButtonSignIn } from "@/core/components/section-a";

type Props = {
  visible: boolean;
  title: string;
  value: string;
  placeholder: string;
  onApply: (val: string) => void;
  onClose: () => void;
};

const TextInputModal: React.FC<Props> = ({
  visible,
  title,
  value,
  placeholder,
  onApply,
  onClose,
}) => {
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    if (visible) setTempValue(value);
  }, [visible, value]);

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={35}
        tint="light"
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={MainStyles.viewtwo}>
            <Text style={MainStyles.text20}>{title}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <SimpleLineIcons name="close" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={tempValue}
            onChangeText={setTempValue}
            autoFocus
          />
          <View style={{ alignSelf: "center", marginTop: hp(2) }}>
            <ButtonSignIn
              text="Apply"
              wid="84"
              bg={Colors.white}
              bd={Colors.white}
              txcl={Colors.black}
              ftn={16}
              mov={() => {
                onApply(tempValue);
                onClose();
              }}
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default TextInputModal;

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
  closeBtn: {
    backgroundColor: Colors.filtertext,
    width: wp(9),
    height: wp(9),
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    color: "#fff",
    fontSize: wp(4),
    borderWidth: 1,
    borderColor: "rgba(59,59,59,1)",
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    marginTop: hp(2),
  },
});
