import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextBox } from "@/core/components/section-b";
import { MainStyles } from "@/core/constants/styles";
import { heightPercentageToDP as hp } from "@/core/utils/responsive";

type Props = {
  sectorVal: string; onPickSector: () => void;
  focusVal: string;  onPickFocus: () => void;
  unitVal: string;   onPickUnit: () => void;
  priorityVal: string; onPickPriority: () => void;
};

const SelectorsSection: React.FC<Props> = ({
  sectorVal, onPickSector, focusVal, onPickFocus, unitVal, onPickUnit, priorityVal, onPickPriority,
}) => (
  <>
    <View style={[MainStyles.viewtwo, { marginTop: hp(2) }]}>
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Habit Stack Sector</Text>
        <TouchableOpacity onPress={onPickSector}>
          <TextBox icn wid={50} plac="Select Item" top={1} edt={false} val={sectorVal} />
        </TouchableOpacity>
      </View>
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Habit Stack Focus</Text>
        <TouchableOpacity onPress={onPickFocus}>
          <TextBox icn wid={35} plac="Select Item" top={1} edt={false} val={focusVal} />
        </TouchableOpacity>
      </View>
    </View>

    <View style={[MainStyles.viewtwo, { marginTop: hp(2) }]}>
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Habit Stack Unit</Text>
        <TouchableOpacity onPress={onPickUnit}>
          <TextBox icn wid={35} plac="Select Item" top={1} edt={false} val={unitVal} />
        </TouchableOpacity>
      </View>
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Habit Stack Priority</Text>
        <TouchableOpacity onPress={onPickPriority}>
          <TextBox icn wid={50} plac="Select Item" top={1} edt={false} val={priorityVal} />
        </TouchableOpacity>
      </View>
    </View>
  </>
);

export default SelectorsSection;
