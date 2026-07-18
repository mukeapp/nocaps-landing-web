import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { HabitLinkComponent, ComparisonHabitLinkItem } from '@/core/models/section-b/habit';
import HabitLinkPill from '../HabitLinkPill';
import ItemPills from '../ItemPills';
import ComparisonItemDiff from '../ComparisonItemDiff';
import HabitLinkDetailSheet from '../HabitLinkDetailSheet/HabitLinkDetailSheet';

export interface HabitLinkPillsProps {
  links: HabitLinkComponent[];
  savesById?: Record<string, number>;
  itemSavesByLinkId?: Record<string, (number | undefined)[]>;
  itemCmpByLinkId?: Record<string, ComparisonHabitLinkItem[]>;
  costSymbol?: string;
}

const HabitLinkPills: React.FC<HabitLinkPillsProps> = ({
  links,
  savesById,
  itemSavesByLinkId,
  itemCmpByLinkId,
  costSymbol = "",
}) => {
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);
  const [infoLink, setInfoLink] = useState<HabitLinkComponent | null>(null);

  const handlePress = (linkId: string) => {
    setActiveLinkId(prev => (prev === linkId ? null : linkId));
  };

  const activeLink = links.find(l => l.id === activeLinkId);
  const activeItems = activeLink?.habitLinkItemComponentsData ?? [];
  const activeItemSaves = activeLinkId ? itemSavesByLinkId?.[activeLinkId] : undefined;
  const activeItemCmps  = activeLinkId ? (itemCmpByLinkId?.[activeLinkId] ?? []) : [];

  if (links.length === 0) return null;

  return (
    <View>
      <Text style={styles.label}>LINKS ({links.length})</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {links.map(link => (
          <HabitLinkPill
            key={link.id}
            link={link}
            selected={activeLinkId === link.id}
            onPress={() => handlePress(link.id!)}
            onInfo={() => setInfoLink(link)}
            save={savesById?.[link.id ?? '']}
            costSymbol={costSymbol}
          />
        ))}
      </ScrollView>

      {activeItems.length > 0 && (
        <View style={styles.itemsSection}>
          <Text style={styles.itemsLabel}>
            {activeLink?.name?.toUpperCase()} · ITEMS ({activeItems.length})
          </Text>
          <ItemPills items={activeItems} saves={activeItemSaves} costSymbol={costSymbol} />

          {activeItemCmps.length > 0 && (
            <View style={styles.cmpSection}>
              <Text style={styles.cmpLabel}>ITEM COMPARISON</Text>
              {activeItemCmps.map((cmp, idx) => (
                <ComparisonItemDiff key={idx} cmp={cmp} costSymbol={costSymbol} />
              ))}
            </View>
          )}
        </View>
      )}
      <HabitLinkDetailSheet link={infoLink} onClose={() => setInfoLink(null)} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: { color: '#6b7280', fontSize: 9, letterSpacing: 2, marginBottom: 6 },
  pillsRow: { gap: 6, paddingBottom: 2 },
  itemsSection: { marginTop: 10 },
  itemsLabel: { color: '#6b7280', fontSize: 9, letterSpacing: 2, marginBottom: 4 },
  cmpSection: { marginTop: 10 },
  cmpLabel: { color: '#6b7280', fontSize: 9, letterSpacing: 2, marginBottom: 4 },
});

export default HabitLinkPills;
