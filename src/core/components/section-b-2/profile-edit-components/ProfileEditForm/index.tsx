import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet,
  fs,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";

type Props = {
  firstName?: string;
  setFirstName: (v: string) => void;
  lastName?: string;
  setLastName: (v: string) => void;
  userName?: string;
  setUserName: (v: string) => void;
  description?: string;
  setDescription: (v: string) => void;
};

const ProfileEditForm: React.FC<Props> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  userName,
  setUserName,
  description,
  setDescription,
}) => {
  return (
    <View style={styles.container}>
      {/* Personal Info section */}
      <Text style={styles.sectionLabel}>Personal Info</Text>

      <Text style={styles.fieldLabel}>First Name</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor={Colors.text_color}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>

      <Text style={styles.fieldLabel}>Last Name</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor={Colors.text_color}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>

      <Text style={styles.fieldLabel}>Username</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={userName}
          onChangeText={setUserName}
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={Colors.text_color}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
      </View>

      {/* About Me section */}
      <Text style={[styles.sectionLabel, { marginTop: hp(3) }]}>About Me</Text>

      <View style={[styles.inputRow, styles.textArea]}>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textAreaInput]}
          placeholder="Write something about yourself..."
          placeholderTextColor={Colors.text_color}
          multiline
          textAlignVertical="top"
          returnKeyType="default"
        />
      </View>
    </View>
  );
};

export default ProfileEditForm;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: isTablet ? wp(5) : wp(4),
    paddingTop: hp(2),
  },
  sectionLabel: {
    fontSize: fs(11),
    fontFamily: "semibold",
    color: Colors.text_color,
    letterSpacing: 1.2,
    marginBottom: hp(1.5),
    textTransform: "uppercase",
  },
  fieldLabel: {
    fontSize: fs(12),
    fontFamily: "semibold",
    color: Colors.white,
    marginTop: hp(1.5),
    marginBottom: hp(0.7),
  },
  inputRow: {
    width: "100%",
    height: isTablet ? hp(6.5) : hp(5.5),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.inuptborder,
    backgroundColor: Colors.content_back,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },
  input: {
    flex: 1,
    marginHorizontal: wp(1),
    fontSize: fs(13),
    fontFamily: "regular",
    color: Colors.white,
  },
  textArea: {
    height: isTablet ? hp(18) : hp(15),
    alignItems: "flex-start",
    paddingVertical: hp(1.5),
  },
  textAreaInput: {
    textAlignVertical: "top",
  },
});
