import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@/core/utils/responsive';

interface Props {
  title: string;
}

const SectionLabel: React.FC<Props> = ({ title }) => (
  <View style={s.row}>
    <Text style={s.title}>{title}</Text>
    <TouchableOpacity style={s.infoBtn}>
      <Feather name="info" size={13} color="#6b7280" />
    </TouchableOpacity>
  </View>
);

export default SectionLabel;

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    marginBottom: hp(1.2),
    marginTop: hp(0.5),
    gap: wp(1.5),
  },
  title: {
    color: '#f1f5f9',
    fontSize: wp(4),
    fontFamily: 'poppins_semibold',
  },
  infoBtn: {
    width: wp(4.5),
    height: wp(4.5),
    borderRadius: wp(2.25),
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
