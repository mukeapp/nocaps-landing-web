import {HabitLinkItemComponent} from '@/core/models/section-b/habit';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SaveLoseTagProps {
  item: HabitLinkItemComponent;
  currentCost: number;
  showSaveDiff?: boolean;
  costSymbol?: string;
}

const SaveLoseTag: React.FC<SaveLoseTagProps> = ({ item, currentCost, showSaveDiff = true, costSymbol = "" }) => {
  const itemCost = item.cost ?? 0;
  // Prefer the pre-computed save from comparisonHabitLinkItem if present
  const diff = item.comparisonHabitLinkItem != null
    ? item.comparisonHabitLinkItem.save
    : currentCost - itemCost;

  if (diff === 0) {
    return (
      <View style={styles.row}>
        <Text style={styles.costText}>{costSymbol}{itemCost.toFixed(2)}</Text>
        <View style={[styles.badge, { backgroundColor: 'rgba(107,114,128,0.15)', borderColor: 'rgba(107,114,128,0.2)' }]}>
          <Text style={[styles.badgeText, { color: '#6b7280' }]}>SAME</Text>
        </View>
      </View>
    );
  }

  const saving = diff > 0;
  const color  = saving ? '#22c55e' : '#ef4444';
  const bg     = saving ? 'rgba(34,197,94,0.12)'  : 'rgba(239,68,68,0.12)';
  const border = saving ? 'rgba(34,197,94,0.25)'  : 'rgba(239,68,68,0.25)';
  const label  = saving ? `SAVE ${costSymbol}${diff.toFixed(0)}` : `-${costSymbol}${Math.abs(diff).toFixed(0)}`;

  return (
    <View style={styles.row}>
      <Text style={styles.costText}>{costSymbol}{itemCost.toFixed(2)}</Text>
      {showSaveDiff && (
        <View style={[styles.badge, { backgroundColor: bg, borderColor: border }]}>
          <Text style={[styles.badgeText, { color }]}>{label}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  costText: { color: '#f1f5f9', fontSize: 12, fontWeight: '700' },
  badge: { paddingVertical: 2, paddingHorizontal: 7, borderRadius: 6, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
});

export type { SaveLoseTagProps };
export default SaveLoseTag;
