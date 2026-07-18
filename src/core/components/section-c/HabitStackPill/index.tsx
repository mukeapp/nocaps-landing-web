import {HabitStackComponent} from '@/core/models/section-b';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@/core/utils/responsive';

// ── Status icon map ───────────────────────────────────────────────────────────
function getStatusIcon(status?: string): string {
  switch (status) {
    case 'PLAY':     return '▶';
    case 'PAUSE':    return '⏸';
    case 'STOP':     return '⏹';
    case 'PREVIOUS': return '⏮';
    case 'NEXT':     return '⏭';
    default:         return '⏸';
  }
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  habitStack: HabitStackComponent;
  onPress?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const HabitStackPill: React.FC<Props> = ({ habitStack, onPress }) => {
  const { name, iconColor, status } = habitStack;
  const bgColor = iconColor ?? 'rgba(100,100,100,1)';
  const statusIcon = getStatusIcon(status);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={s.outerPill}
    >
      {/* HabitStack Name Pill */}
      <View style={[s.namePill, { backgroundColor: bgColor }]}>
        <Text style={s.nameText} numberOfLines={1}>
          {name}
        </Text>
      </View>

      {/* Status Circle */}
      <View style={s.statusCircle}>
        <Text style={s.statusIcon}>{statusIcon}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default HabitStackPill;

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  outerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55,55,55,0.9)',   // gray outer pill
    borderRadius: wp(10),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(1),
    alignSelf: 'flex-start',
    gap: wp(1.5),
  },
  namePill: {
    borderRadius: wp(10),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.6),
    maxWidth: wp(55),
  },
  nameText: {
    color: '#ffffff',
    fontSize: wp(3.2),
    fontFamily: 'poppins_semibold',
  },
  statusCircle: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    color: '#ffffff',
    fontSize: wp(3.5),
  },
});