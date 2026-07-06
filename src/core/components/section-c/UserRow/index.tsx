import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@/core/utils/responsive';
import Avatar, { AvatarUser } from '@/core/components/section-c/Avatar';

interface Props {
  user: AvatarUser;
  selected?: boolean;
  onSelect?: () => void;
  hideSelect?: boolean;
  hideOptions?: boolean;
}

const UserRow: React.FC<Props> = ({ user, selected, onSelect, hideSelect = false, hideOptions = false }) => (
  <View style={[
    s.row,
    !hideSelect && s.rowWithHPadding,
    !hideSelect && s.rowWithVPadding,
    ]}>
    <Avatar user={user} />
    <View style={s.info}>
      <Text style={s.name}>{user.displayName}</Text>
      <Text style={s.handle}>{user.username}</Text>
    </View>
    {!hideSelect && (
      <TouchableOpacity
        style={[s.selectBtn, selected && s.selectBtnActive]}
        onPress={onSelect}
        activeOpacity={0.75}
      >
        <Text style={[s.selectText, selected && s.selectTextActive]}>
          {selected ? 'Selected' : 'Select'}
        </Text>
      </TouchableOpacity>
    )}
    {!hideOptions && (
      <TouchableOpacity style={s.moreBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Feather name="more-vertical" size={18} color="#6b7280" />
      </TouchableOpacity>
    )}
  </View>
);

export default UserRow;

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    //paddingHorizontal: wp(3.5),
    //paddingVertical: hp(1.5),
    gap: wp(3),
  },
  rowWithHPadding:{
    paddingHorizontal: wp(3.5),
  },
  rowWithVPadding:{
    paddingVertical: hp(1.5),
  },
  info: { flex: 1 },
  name: {
    color: '#f1f5f9',
    fontSize: wp(3.5),
    fontFamily: 'poppins_semibold',
  },
  handle: {
    color: '#6b7280',
    fontSize: wp(3),
    fontFamily: 'poppins_regular',
    marginTop: hp(0.3),
  },
  selectBtn: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  selectBtnActive: {
    backgroundColor: 'rgba(230,57,70,0.15)',
    borderColor: 'rgba(230,57,70,0.4)',
  },
  selectText: {
    color: '#9ca3af',
    fontSize: wp(3),
    fontFamily: 'poppins_semibold',
  },
  selectTextActive: { color: '#e63946' },
  moreBtn: { padding: wp(1) },
});
