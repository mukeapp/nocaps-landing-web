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
import { ConfirmState } from '../types';

export interface ConfirmSheetProps {
  isSwap?: boolean;
  confirm: ConfirmState | null;
  onCancel: () => void;
  onConfirm: () => void;
  actionVerb?: string;
  costSymbol?: string;
}

const ConfirmSheet: React.FC<ConfirmSheetProps> = ({ confirm, onCancel, onConfirm, actionVerb = 'Swap', isSwap = true, costSymbol = "" }) => {
  if (!confirm) return null;
  const { item, tier, scorePct, type } = confirm;
  const isWarn = type === 'warn';
  const replaceText =
  isSwap ? `Replace current item with ${item.name} from ${item.companyName} at ${costSymbol}${(item.cost ?? 0).toFixed(2)} total.`
  : `Add ${item.name} from ${item.companyName} at ${costSymbol}${(item.cost ?? 0).toFixed(2)} total.`;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>

          <Text style={styles.emoji}>{isWarn ? '⚠️' : '⇌'}</Text>
          <Text style={styles.title}>
            {isWarn ? `${tier.label} Score Item` : `${actionVerb} to ${item.name}?`}
          </Text>

          <View style={[styles.tierBadge, { backgroundColor: `${tier.hex}22`, borderColor: `${tier.hex}44` }]}>
            <View style={[styles.tierDot, { backgroundColor: tier.hex }]} />
            <Text style={[styles.tierText, { color: tier.hex }]}>
              {tier.label.toUpperCase()} — {scorePct}%
            </Text>
          </View>

          <Text style={styles.desc}>
            {isWarn
              ? `${item.companyName ?? item.name} scored ${scorePct}% (${tier.label}). This may not align with your goal.`
              : replaceText}
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
    flex: 1, backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  sheet: {
    backgroundColor: '#1a1a2e', borderRadius: 28,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 24,
  },
  emoji: { fontSize: 36, textAlign: 'center', marginBottom: 10 },
  title: { color: '#f1f5f9', fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  tierBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'center',
    gap: 6, paddingVertical: 4, paddingHorizontal: 12,
    borderRadius: 20, borderWidth: 1, marginBottom: 10,
  },
  tierDot: { width: 8, height: 8, borderRadius: 4 },
  tierText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  desc: { color: '#9ca3af', fontSize: 13, lineHeight: 20, textAlign: 'center', marginBottom: 20 },
  buttons: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center',
  },
  cancelBtnText: { color: '#9ca3af', fontSize: 15, fontWeight: '700' },
  confirmBtn: { flex: 2, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

export default ConfirmSheet;
