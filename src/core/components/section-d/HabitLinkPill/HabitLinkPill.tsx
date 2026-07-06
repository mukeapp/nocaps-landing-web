import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { HabitLinkComponent } from '@/core/models/section-b/habit';
import { getScoreTier } from '../utils';

export interface HabitLinkPillProps {
  link: HabitLinkComponent;
  selected: boolean;
  onPress: () => void;
  onInfo?: () => void;
  save?: number;
  costSymbol?: string;
}

const HabitLinkPill: React.FC<HabitLinkPillProps> = ({ link, selected, onPress, onInfo, save, costSymbol = "" }) => {
  const [imageError, setImageError] = useState(false);
  const cost = link.scoreComponent?.cost ?? 0;
  const scorePct = link.scoreComponent?.score ?? 0;
  const tier = getScoreTier(scorePct);

  const hasSave = save !== undefined;
  const saveColor  = !hasSave ? undefined : save > 0 ? '#22c55e' : save < 0 ? '#ef4444' : '#6b7280';
  const saveLabel  = !hasSave ? undefined
    : save === 0 ? 'SAME'
    : save > 0   ? `▼${costSymbol}${save.toFixed(0)}`
    : `▲${costSymbol}${Math.abs(save).toFixed(0)}`;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={[styles.pill, selected && styles.pillSelected]}
      >
        {link.bannerImage && !imageError ? (
          <Image
            source={{ uri: link.bannerImage }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.image, styles.imageFallback]}>
            <Text style={{ fontSize: 22 }}>📦</Text>
          </View>
        )}
        <Text style={styles.name} numberOfLines={1}>{link.name ?? '—'}</Text>
        <Text style={styles.cost}>{costSymbol}{cost.toFixed(2)}</Text>
        {hasSave && (
          <Text style={[styles.save, { color: saveColor }]}>{saveLabel}</Text>
        )}
        <View style={[styles.tierDot, { backgroundColor: tier.hex }]} />
      </TouchableOpacity>

      {onInfo && (
        <TouchableOpacity style={styles.infoBtn} onPress={onInfo} activeOpacity={0.7} hitSlop={6}>
          <AntDesign name="info-circle" size={13} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  pill: {
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minWidth: 76,
  },
  pillSelected: {
    backgroundColor: 'rgba(45,156,219,0.14)',
    borderColor: 'rgba(45,156,219,0.45)',
  },
  image: { width: 48, height: 48, borderRadius: 10 },
  imageFallback: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: '#d1d5db',
    fontSize: 9,
    fontWeight: '600',
    maxWidth: 68,
    textAlign: 'center',
  },
  cost: { color: '#f1f5f9', fontSize: 11, fontWeight: '800' },
  save: { fontSize: 9, fontWeight: '800', letterSpacing: 0.3 },
  tierDot: { width: 6, height: 6, borderRadius: 3 },
  infoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HabitLinkPill;
