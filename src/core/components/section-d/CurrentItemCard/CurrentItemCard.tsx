import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '@/core/utils/responsive';
import AntDesign from '@expo/vector-icons/AntDesign';
import { MainStyles } from '@/core/constants/styles';
import { Colors } from '@/core/constants/Colors';
import { HabitLinkItemComponent } from '../types';
import { toPercent, getScoreTier } from '../utils';
import ScoreRing from '../ScoreRing';

export interface CurrentItemCardProps {
  item: HabitLinkItemComponent;
  swappedItem?: HabitLinkItemComponent | null;
  costSymbol?: string;
}

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

const CurrentItemCard: React.FC<CurrentItemCardProps> = ({ item, swappedItem, costSymbol = "" }) => {
  const display = swappedItem ?? item;
  const scorePct = toPercent(display.score);
  const scoreColor = getScoreTier(scorePct).hex;
  const cost = display.cost ?? 0;
  const tier = getScoreTier(scorePct);
  const refRBSheet = useRef<RBSheetRef>(null);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>CURRENT ITEM</Text>

      <View style={styles.cardRow}>
        {display.imageUrl ? (
          <Image source={{ uri: display.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imageFallback]}>
            <Text style={{ fontSize: 28 }}>🛍️</Text>
          </View>
        )}

        <View style={{ flex: 1, marginRight: 12 }}>
          {/* Name row with info button */}
          <View style={styles.nameRow}>
            <Text style={[styles.itemName, { flex: 1 }]} numberOfLines={1}>
              {display.name ?? '—'}
            </Text>
            <TouchableOpacity
              onPress={() => refRBSheet.current?.open()}
              style={[MainStyles.sheeticon, { backgroundColor: Colors.filtertext }]}
            >
              <AntDesign name="info-circle" size={17} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemSub} numberOfLines={1}>
            {[display.companyName, display.location].filter(Boolean).join(' · ')}
          </Text>
          <View style={[styles.scoreBarRow, { marginTop: 6 }]}>
            <View style={styles.scoreBarTrack}>
              <View style={[styles.scoreBarFill, { width: `${scorePct}%` as any, backgroundColor: scoreColor }]} />
            </View>
            <Text style={[styles.scorePercent, { color: scoreColor }]}>{scorePct}%</Text>
          </View>
        </View>

        <ScoreRing scorePct={scorePct} size={54} label={`${costSymbol}${cost}`} sublabel="cost" />
      </View>

      <View style={styles.tagsRow}>
        {[display.scoreCode, display.companyName, display.quantity != null ? `Qty: ${display.quantity}` : null]
          .filter((t): t is string => !!t)
          .map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
      </View>

      {/* Info Bottom Sheet */}
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        height={hp(70)}
        customStyles={{
          container: {
            backgroundColor: Colors.content_back,
            borderRadius: wp(5),
          },
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.67)',
          },
          draggableIcon: {
            backgroundColor: Colors.filtertext,
            width: wp(30),
          },
        }}
        customModalProps={{
          animationType: 'fade',
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{ enabled: false }}
      >
        <View style={styles.sheetContent}>
          {/* Sheet Header */}
          <View style={styles.sheetHeader}>
            <TouchableOpacity
              style={styles.sheetClose}
              onPress={() => refRBSheet.current?.close()}
            >
              <AntDesign name="close" size={16} color={Colors.white} />
            </TouchableOpacity>
            <Text style={[MainStyles.text16white, { flex: 1, textAlign: 'center' }]}>
              Item Details
            </Text>
            <View style={{ width: wp(8) }} />
          </View>

          {/* Image */}
          {display.imageUrl ? (
            <Image
              source={{ uri: display.imageUrl }}
              style={styles.sheetImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.sheetImage, styles.sheetImageFallback]}>
              <Text style={{ fontSize: 40 }}>🛍️</Text>
            </View>
          )}

          {/* Score badge */}
          <View style={[styles.sheetScoreBadge, { backgroundColor: `${scoreColor}22`, borderColor: `${scoreColor}44` }]}>
            <View style={[styles.sheetScoreDot, { backgroundColor: scoreColor }]} />
            <Text style={[styles.sheetScoreText, { color: scoreColor }]}>
              {tier.label.toUpperCase()} — {scorePct}%
            </Text>
          </View>

          {/* Name & Cost */}
          <View style={styles.sheetRow}>
            <Text style={MainStyles.text16white} numberOfLines={1}>{display.name ?? '—'}</Text>
            <Text style={MainStyles.text16white}>{costSymbol}{cost.toFixed(2)}</Text>
          </View>

          <View style={styles.sheetDivider} />

          <Text style={MainStyles.text12semibold}>
            Company:{' '}
            <Text style={{ color: Colors.white }}>{display.companyName ?? '—'}</Text>
          </Text>
          <Text style={MainStyles.text12semibold}>
            Location:{' '}
            <Text style={{ color: Colors.white }}>{display.location ?? '—'}</Text>
          </Text>
          <Text style={MainStyles.text12semibold}>
            Price per unit:{' '}
            <Text style={{ color: Colors.white }}>{costSymbol}{display.price ?? 0}</Text>
          </Text>
          <Text style={MainStyles.text12semibold}>
            Quantity:{' '}
            <Text style={{ color: Colors.white }}>{display.quantity ?? 0}</Text>
          </Text>

          {display.description ? (
            <>
              <View style={styles.sheetDivider} />
              <Text style={[MainStyles.text12semibold, { marginBottom: hp(0.5) }]}>Description</Text>
              <Text style={[MainStyles.text12semibold, { color: Colors.text_color }]}>
                {display.description}
              </Text>
            </>
          ) : null}
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: 'rgba(45,156,219,0.08)',
    borderWidth: 1, borderColor: 'rgba(45,156,219,0.25)',
    padding: 16,
  },
  label: { color: '#6b7280', fontSize: 10, letterSpacing: 2, marginBottom: 10 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 56, height: 56, borderRadius: 14, marginRight: 14 },
  imageFallback: {
    backgroundColor: 'rgba(45,156,219,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  itemName: { color: '#f1f5f9', fontSize: 18, fontWeight: '800' },
  itemSub: { color: '#6b7280', fontSize: 11, marginBottom: 2 },
  scoreBarRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scoreBarTrack: {
    flex: 1, height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4, overflow: 'hidden',
  },
  scoreBarFill: { height: '100%', borderRadius: 4 },
  scorePercent: { fontSize: 11, fontWeight: '700', minWidth: 30, textAlign: 'right' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: {
    backgroundColor: 'rgba(45,156,219,0.12)',
    borderWidth: 1, borderColor: 'rgba(45,156,219,0.2)',
    paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20,
  },
  tagText: { color: 'rgba(45,156,219,0.9)', fontSize: 10, fontWeight: '600' },

  // Bottom Sheet
  sheetContent: { flex: 1, paddingHorizontal: wp(5), paddingTop: hp(1) },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  sheetClose: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: Colors.borderline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetImage: {
    width: '100%',
    height: hp(18),
    borderRadius: wp(3),
    marginBottom: hp(1.5),
  },
  sheetImageFallback: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: hp(1),
  },
  sheetScoreDot: { width: 8, height: 8, borderRadius: 4 },
  sheetScoreText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  sheetDivider: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderline,
    marginVertical: hp(1),
  },
});

export default CurrentItemCard;
