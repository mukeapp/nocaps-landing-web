import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import {Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {widthPercentageToDP as _wp} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _wp(p);


type Props = {
  title: string;
  canAdd: boolean;
  canEdit: boolean;
  onBack: () => void;
  onAdd: () => void;
  gotoUpload?: () => void;
  handleAddHabitLinkItemPress?: () => void;
  onScorePress?: () => void;
};

const TopBar: React.FC<Props> = ({
  title,
  canAdd,
  canEdit,
  onBack,
  onAdd,
  gotoUpload,
  handleAddHabitLinkItemPress,
  onScorePress,
}) => {
  return (
    <View style={[MainStyles.viewtwo, styles.row]}>
      <View style={styles.left}>
        <TouchableOpacity
          style={[MainStyles.sheeticon, styles.mr]}
          onPress={onBack}
        >
          <FontAwesome6 name="arrow-left-long" size={14} color={Colors.black} />
        </TouchableOpacity>
        <Text style={MainStyles.text20semibold}>{title}</Text>
      </View>

      <View style={styles.right}>
        {/* {canEdit && (
          <TouchableOpacity
            style={[MainStyles.sheeticon, styles.mr]}
            onPress={onScorePress}
          >
            <AntDesign name="star" size={22} color={Colors.black} />
          </TouchableOpacity>
        )} */}

        {canEdit && (
          <TouchableOpacity
            style={[MainStyles.sheeticon, styles.mr]}
            onPress={gotoUpload}
          >
            <AntDesign name="cloud-upload" size={25} color={Colors.black} />
          </TouchableOpacity>
        )}

        {canEdit && (
          <TouchableOpacity
            style={MainStyles.sheeticon}
            onPress={handleAddHabitLinkItemPress}
            disabled={!canAdd}
          >
            <AntDesign name="copy" size={25} color={Colors.black} />
          </TouchableOpacity>
        )}

        {canEdit && (
          <TouchableOpacity
            style={MainStyles.sheeticon}
            onPress={onAdd}
            disabled={!canAdd}
          >
            <AntDesign name="plus" size={25} color={Colors.black} />
            {/* <AntDesign name="addfile" size={18} color={Colors.black} /> */}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  row: {
    marginTop: wp(3),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    gap: wp(1), // Added gap between buttons
  },
  middle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    gap: wp(1), // Added gap between buttons
  },
  mr: {
    marginRight: wp(2),
  },
});
