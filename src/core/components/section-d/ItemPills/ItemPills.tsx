import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { HabitLinkItemComponent } from '@/core/models/section-b/habit';
import ItemPill from '../ItemPill';

export interface ItemPillsProps {
  items: HabitLinkItemComponent[];
  saves?: (number | undefined)[];
  costSymbol?: string;
}

const ItemPills: React.FC<ItemPillsProps> = ({ items, saves, costSymbol = "" }) => {
  const visible = items.slice(0, 6);
  const extra = items.length - 6;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {visible.map((item, idx) => (
        <ItemPill key={item.id} item={item} save={saves?.[idx]} costSymbol={costSymbol} />
      ))}
      {extra > 0 && (
        <View style={styles.more}>
          <Text style={styles.moreText}>+{extra}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { gap: 6, paddingBottom: 2 },
  more: {
    width: 48,
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  moreText: { color: '#9ca3af', fontSize: 12, fontWeight: '700' },
});

export default ItemPills;
