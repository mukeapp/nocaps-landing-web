import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ComparisonHabitLink } from '@/core/models/section-b/habit';

export interface ComparisonLinkDiffProps {
  cmp: ComparisonHabitLink;
  costSymbol?: string;
}

const ComparisonLinkDiff: React.FC<ComparisonLinkDiffProps> = ({ cmp, costSymbol = "" }) => {
  const { save, currentItem, swapItem } = cmp;
  const swapCost = swapItem?.scoreComponent?.cost ?? 0;
  const isFree = swapCost === 0;

  let label: string;
  let bgColor: string;
  let borderColor: string;
  let textColor: string;

  if (isFree) {
    label = 'FREE';
    bgColor = 'rgba(34,197,94,0.12)';
    borderColor = 'rgba(34,197,94,0.3)';
    textColor = '#22c55e';
  } else if (save > 0) {
    label = `SAVE ${costSymbol}${save.toFixed(2)}`;
    bgColor = 'rgba(34,197,94,0.12)';
    borderColor = 'rgba(34,197,94,0.25)';
    textColor = '#22c55e';
  } else if (save < 0) {
    label = `+${costSymbol}${Math.abs(save).toFixed(2)}`;
    bgColor = 'rgba(239,68,68,0.12)';
    borderColor = 'rgba(239,68,68,0.25)';
    textColor = '#ef4444';
  } else {
    label = 'SAME';
    bgColor = 'rgba(107,114,128,0.12)';
    borderColor = 'rgba(107,114,128,0.2)';
    textColor = '#6b7280';
  }

  return (
    <View style={styles.row}>
      <Text style={styles.currentName} numberOfLines={1}>{currentItem?.name ?? '—'}</Text>
      <Text style={styles.arrow}>→</Text>
      <Text style={styles.swapName} numberOfLines={1}>{swapItem?.name ?? '—'}</Text>
      <View style={[styles.badge, { backgroundColor: bgColor, borderColor }]}>
        <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  currentName: { color: '#6b7280', fontSize: 10, flex: 1, flexShrink: 1 },
  arrow: { color: '#4b5563', fontSize: 10 },
  swapName: { color: '#d1d5db', fontSize: 10, flex: 1, flexShrink: 1 },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
    borderWidth: 1,
    flexShrink: 0,
  },
  badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.3 },
});

export default ComparisonLinkDiff;
