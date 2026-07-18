import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@/core/utils/responsive';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  onClear: () => void;
}

const SearchTextInput: React.FC<Props> = ({ value, onChangeText, placeholder, onClear }) => (
  <View style={s.wrapper}>
    <Feather name="search" size={16} color="#6b7280" style={{ marginRight: 8 }} />
    <TextInput
      style={s.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#4b5563"
      returnKeyType="search"
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Feather name="x" size={16} color="#6b7280" />
      </TouchableOpacity>
    )}
  </View>
);

export default SearchTextInput;

const s = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.5),
  },
  input: {
    flex: 1,
    color: '#f1f5f9',
    fontSize: wp(3.5),
    fontFamily: 'poppins_regular',
    padding: 0,
  },
});
