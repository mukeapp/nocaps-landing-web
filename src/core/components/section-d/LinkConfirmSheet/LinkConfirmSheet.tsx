import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinkConfirmState } from '../types';
import { getLinkScore, getLinkCost, getLinkItems } from '../utils';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
  fs,
} from "@/core/utils/responsive";

export interface LinkConfirmSheetProps {
  confirm: LinkConfirmState | null;
  onCancel: () => void;
  onConfirm: () => void;
  actionVerb?: string;
  costSymbol?: string;
}

const LinkConfirmSheet: React.FC<LinkConfirmSheetProps> = ({ confirm, onCancel, onConfirm, actionVerb = 'Swap', costSymbol = "" }) => {
  if (!confirm) return null;
  const { link, tier, type } = confirm;
  const isWarn = type === 'warn';
  const scorePct = getLinkScore(link);
  const totalCost = getLinkCost(link);
  const items = getLinkItems(link);
  const replaceText = actionVerb == 'Swap' ? 'Replace current' : `${actionVerb} current`;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>

          <Text style={styles.emoji}>{isWarn ? '⚠️' : '⇌'}</Text>

          <Text style={styles.title}>
            {isWarn ? `${tier.label} Score Provider` : `${actionVerb} to ${link.name}?`}
          </Text>

          <View style={[styles.tierBadge, { backgroundColor: `${tier.hex}22`, borderColor: `${tier.hex}44` }]}>
            <View style={[styles.tierDot, { backgroundColor: tier.hex }]} />
            <Text style={[styles.tierText, { color: tier.hex }]}>
              {tier.label.toUpperCase()} — {scorePct}%
            </Text>
          </View>

          <View style={styles.costRow}>
            <Text style={styles.cost}>{costSymbol}{totalCost.toFixed(2)}</Text>
            <Text style={styles.costSub}>total · {items.length} items</Text>
          </View>

          <Text style={styles.desc}>
            {isWarn
              ? `${link.name} scored ${scorePct}% (${tier.label}). This may not align with your habit goal.`
              : `${replaceText} HabitLink with ${link.name} from ${link.location}.`}
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: isWarn ? '#f97316' : '#e63946' }]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>
                {isWarn ? `${actionVerb} Anyway` : `Confirm ${actionVerb}`}
              </Text>
            </TouchableOpacity>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'flex-end',
    paddingHorizontal: wp(4),
    paddingBottom: Platform.OS === 'ios' ? hp(5.5) : hp(3),
  },
  sheet: {
    backgroundColor: '#1a1a2e',
    borderRadius: wp(7),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: wp(6),
    height: isTablet ? hp(50) : hp(40),
  },
  emoji: { fontSize: fs(38), textAlign: 'center', marginBottom: hp(1.3), color: '#f1f5f9' },
  title: {
    color: '#f1f5f9',
    fontSize: fs(18),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: hp(1.3),
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: wp(1.5),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3.5),
    borderRadius: wp(5),
    borderWidth: 1,
    marginBottom: hp(1.5),
  },
  tierDot: { width: wp(2), height: wp(2), borderRadius: wp(1) },
  tierText: { fontSize: fs(12), fontWeight: '700', letterSpacing: 0.5 },
  costRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: wp(1.5),
    justifyContent: 'center',
    marginBottom: hp(1.5),
  },
  cost: { color: '#f1f5f9', fontSize: fs(22), fontWeight: '800' },
  costSub: { color: '#6b7280', fontSize: fs(12) },
  desc: {
    color: '#9ca3af',
    fontSize: fs(13),
    lineHeight: hp(2.5),
    textAlign: 'center',
    marginBottom: hp(2.5),
  },
  buttons: { flexDirection: 'row', gap: wp(2.5) },
  cancelBtn: {
    flex: 1,
    paddingVertical: hp(1.8),
    borderRadius: wp(3.5),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  cancelBtnText: { color: '#9ca3af', fontSize: fs(15), fontWeight: '700' },
  confirmBtn: { flex: 2, paddingVertical: hp(1.8), borderRadius: wp(3.5), alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: fs(15), fontWeight: '800' },
});

export default LinkConfirmSheet;
