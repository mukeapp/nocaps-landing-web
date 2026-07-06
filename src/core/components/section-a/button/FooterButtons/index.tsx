import React from "react";
import { View } from "react-native";
import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import { ButtonSignIn } from "@/core/components/section-a";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "@/core/utils/responsive";
type Props = {
  onCancel: () => void;
  onSave: () => void;
  cancelWidth?: string;
  saveWidth?: string;
  saveText?: string;
  cancelBg?: string;
};

const FooterButtons: React.FC<Props> = ({
  onCancel,
  onSave,
  cancelWidth = "48",
  saveWidth = "40",
  saveText = "Save",
  cancelBg = Colors.background_color,
}) => {
  return (
    <View style={[MainStyles.viewtwo, styles.wrap]}>
      <ButtonSignIn text="Cancel" wid={cancelWidth} bg={cancelBg} bd={Colors.white} ftn={14} mov={onCancel} />
      <ButtonSignIn text={saveText} wid={saveWidth} bg={Colors.white} bd={Colors.white} txcl={Colors.background_color} ftn={14} mov={onSave} />
    </View>
  );
};

export default FooterButtons;

export const styles = StyleSheet.create({
  wrap: { marginTop: hp(2), marginBottom: hp(5) },
});
