import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";

import { TextBox } from "@/core/components/section-b";
import { MainStyles } from "@/core/constants/styles";
import { Images } from "@/core/constants/Images";
import { Colors } from "@/core/constants/Colors";
import {ScrollView} from "react-native-gesture-handler";

type Props = {
  firstName?: string;
  setFirstName: (v: string) => void;
  lastName?: string;
  setLastName: (v: string) => void;
  userName?: string;
  setUserName: (v: string) => void;
};

const ProfileEditInputText: React.FC<Props> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  userName,
  setUserName,
}) => {
  return (
      <View style={styles.container}>
        <View style={styles.newview}>
          <Text style={MainStyles.text14}>First Name</Text>
          <TextBox
            icn={false}
            wid={80}
            plac="First Name"
            top={1}
            val={firstName}
            onchan={setFirstName}
          />
        </View>
        <View style={styles.newview}>
          <Text style={MainStyles.text14}>Last Name</Text>
          <TextBox
            icn={false}
            wid={80}
            plac="Last Name"
            top={1}
            val={lastName}
            onchan={setLastName}
          />
        </View>
        <View style={styles.newview}>
          <Text style={MainStyles.text14}>User Name</Text>
          <TextBox
            icn={false}
            wid={80}
            plac="User Name"
            top={1}
            val={userName}
            onchan={setUserName}
          />
        </View>
      </View>
  );
};

export default ProfileEditInputText;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    backgroundColor: Colors.background_color,
  },
  newview: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: hp(2),
  },
});
