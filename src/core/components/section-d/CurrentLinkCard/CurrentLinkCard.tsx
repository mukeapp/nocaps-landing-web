import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { HabitLinkComponent } from '@/core/models/section-b/habit';
import { getDefaultImageUrl } from '@/core/utils/utilities/images';
import { getLinkScore, getLinkCost, getLinkScoreCode, getLinkItems, getScoreTier } from '../utils';
import ScoreRing from '../ScoreRing';
import ItemPills from '../ItemPills';

export interface CurrentLinkCardProps {
  link: HabitLinkComponent;
  swappedLink?: HabitLinkComponent | null;
  divideBy?: number; // optional prop to adjust score display (e.g. if score is out of 100 instead of 1)
  costSymbol?: string;
}

const CurrentLinkCard: React.FC<CurrentLinkCardProps> = ({ link, swappedLink, divideBy = 1, costSymbol = "" }) => {
  const display = swappedLink ?? link;
  const scorePct = getLinkScore(display) / divideBy;
  const totalCost = getLinkCost(display);
  const scoreCode = getLinkScoreCode(display);
  const items = getLinkItems(display);
  const tier = getScoreTier(scorePct);
  const scoreColor = tier.hex;
  const [imageError, setImageError] = useState(false);
  const isValidUrl = (s?: string | null) => !!s && /^https?:\/\//i.test(s);
  const bannerUri = (!imageError && isValidUrl(display.bannerImage))
    ? display.bannerImage!
    : getDefaultImageUrl();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>CURRENT HABITLINK</Text>

      <Image
        source={{ uri: bannerUri }}
        style={styles.banner}
        resizeMode="cover"
        onError={() => setImageError(true)}
      />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.colorDot, { backgroundColor: display.iconColor }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>{display.name}</Text>
            <Text style={styles.meta} numberOfLines={1}>
              {display.location} · {items.length} items
            </Text>
          </View>
          <ScoreRing
            scorePct={scorePct}
            size={52}
            label={`${costSymbol}${totalCost.toFixed(0)}`}
            sublabel="total"
          />
        </View>

        <View style={[styles.scoreBarRow, { marginTop: 10 }]}>
          <View style={styles.scoreBarTrack}>
            <View style={[styles.scoreBarFill, { width: `${scorePct}%` as any, backgroundColor: scoreColor }]} />
          </View>
          <Text style={[styles.scorePercent, { color: scoreColor }]}>{scorePct}%</Text>
        </View>

        <View style={styles.tagsRow}>
          {[scoreCode, display.location, `${items.length} items`]
            .filter((t): t is string => !!t)
            .map(t => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
        </View>

        {items.length > 0 && <ItemPills items={items} costSymbol={costSymbol} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(45,156,219,0.25)',
    backgroundColor: 'rgba(45,156,219,0.06)',
  },
  label: {
    color: '#6b7280',
    fontSize: 10,
    letterSpacing: 2,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
  },
  banner: { width: '100%', height: 86 },
  body: { padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  colorDot: { width: 14, height: 14, borderRadius: 7, flexShrink: 0 },
  name: { color: '#f1f5f9', fontSize: 17, fontWeight: '800', marginBottom: 2 },
  meta: { color: '#6b7280', fontSize: 11 },
  scoreBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreBarTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: { height: '100%', borderRadius: 4 },
  scorePercent: { fontSize: 11, fontWeight: '700', minWidth: 30, textAlign: 'right' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10, marginBottom: 4 },
  tag: {
    backgroundColor: 'rgba(45,156,219,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(45,156,219,0.2)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  tagText: { color: 'rgba(45,156,219,0.9)', fontSize: 10, fontWeight: '600' },
});

export default CurrentLinkCard;
