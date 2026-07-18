import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@/core/utils/responsive';

interface Props {
  errors: string[];
  onDismiss: () => void;
}

const ValidationErrorModal: React.FC<Props> = ({ errors, onDismiss }) => (
  <Modal
    visible={errors.length > 0}
    transparent
    animationType="fade"
    onRequestClose={onDismiss}
  >
    <View style={s.overlay}>
      <View style={s.box}>
        <View style={s.iconRow}>
          <MaterialCommunityIcons name="alert-circle-outline" size={wp(8)} color="#e63946" />
        </View>
        <Text style={s.title}>Almost there!</Text>
        <Text style={s.subtitle}>
          • HabitStack alone → ready to GO{'\n'}
          • Sector alone → ready to GO{'\n'}
          • User/Friend → requires a Sector
        </Text>
        <View style={s.list}>
          {errors.map((msg, i) => (
            <View key={i} style={s.errorRow}>
              <MaterialCommunityIcons name="close-circle" size={wp(4)} color="#e63946" />
              <Text style={s.errorText}>{msg}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={s.dismissBtn} onPress={onDismiss}>
          <Text style={s.dismissText}>Got it</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default ValidationErrorModal;

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(6),
  },
  box: {
    width: '100%',
    backgroundColor: '#1a1a2e',
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: 'rgba(230,57,70,0.25)',
    paddingHorizontal: wp(6),
    paddingVertical: hp(3.5),
    alignItems: 'center',
  },
  iconRow: {
    marginBottom: hp(1.5),
  },
  title: {
    color: '#f1f5f9',
    fontSize: wp(5),
    fontFamily: 'poppins_semibold',
    marginBottom: hp(0.5),
  },
  subtitle: {
    color: '#6b7280',
    fontSize: wp(3.3),
    fontFamily: 'poppins_regular',
    marginBottom: hp(2),
  },
  list: {
    width: '100%',
    gap: hp(1.2),
    marginBottom: hp(3),
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2.5),
    backgroundColor: 'rgba(230,57,70,0.08)',
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
  },
  errorText: {
    color: '#f1f5f9',
    fontSize: wp(3.5),
    fontFamily: 'poppins_regular',
    flex: 1,
  },
  dismissBtn: {
    backgroundColor: '#e63946',
    borderRadius: wp(10),
    paddingHorizontal: wp(10),
    paddingVertical: hp(1.4),
  },
  dismissText: {
    color: '#fff',
    fontSize: wp(3.8),
    fontFamily: 'poppins_semibold',
  },
});
