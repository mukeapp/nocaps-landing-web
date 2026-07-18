import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Share } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
} from '@/core/utils/responsive';
import AntDesign from '@expo/vector-icons/AntDesign';
import { MainStyles } from '@/core/constants/styles';
import { Colors } from '@/core/constants/Colors';
import { HabitLinkItemComponent } from '@/core/models/section-b/habit';

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

export interface ItemPillProps {
  item: HabitLinkItemComponent;
  save?: number;
  costSymbol?: string;
}

const ItemPill: React.FC<ItemPillProps> = ({ item, save, costSymbol = "" }) => {
  const sheetRef = useRef<RBSheetRef>(null);
  const [imageError, setImageError] = useState(false);
  let badgeLabel: string | null = null;
  let badgeBg = 'transparent';
  let badgeBorder = 'transparent';
  let badgeColor = '#fff';

  if (save !== undefined) {
    const swapCost = item.cost ?? 0;
    if (swapCost === 0) {
      badgeLabel = 'FREE';
      badgeBg = 'rgba(34,197,94,0.18)';
      badgeBorder = 'rgba(34,197,94,0.35)';
      badgeColor = '#22c55e';
    } else if (save > 0) {
      badgeLabel = `SAVE ${costSymbol}${save.toFixed(2)}`;
      badgeBg = 'rgba(34,197,94,0.18)';
      badgeBorder = 'rgba(34,197,94,0.35)';
      badgeColor = '#22c55e';
    } else if (save < 0) {
      badgeLabel = `+${costSymbol}${Math.abs(save).toFixed(2)}`;
      badgeBg = 'rgba(239,68,68,0.18)';
      badgeBorder = 'rgba(239,68,68,0.35)';
      badgeColor = '#ef4444';
    } else {
      badgeLabel = 'SAME';
      badgeBg = 'rgba(107,114,128,0.18)';
      badgeBorder = 'rgba(107,114,128,0.3)';
      badgeColor = '#6b7280';
    }
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => sheetRef.current?.open()}
        style={styles.pill}
      >
        {item.imageUrl && !imageError ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.image, styles.imageFallback]}>
            <Text style={{ fontSize: 22 }}>🛍️</Text>
          </View>
        )}
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>{costSymbol}{(item.cost ?? 0).toFixed(2)}</Text>
        {badgeLabel !== null && (
          <View style={[styles.badge, { backgroundColor: badgeBg, borderColor: badgeBorder }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeLabel}</Text>
          </View>
        )}
      </TouchableOpacity>

      <RBSheet
        ref={sheetRef}
        useNativeDriver={false}
        height={isTablet ? hp(150) : hp(80)}
        customStyles={{
          container: { backgroundColor: Colors.content_back, borderRadius: wp(5) },
          wrapper: { backgroundColor: 'rgba(0,0,0,0.67)' },
          draggableIcon: { backgroundColor: Colors.filtertext, width: wp(30) },
        }}
        customModalProps={{ animationType: 'fade', statusBarTranslucent: true }}
        customAvoidingViewProps={{ enabled: false }}
      >
        <View style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <TouchableOpacity style={styles.sheetClose} onPress={() => sheetRef.current?.close()}>
              <AntDesign name="close" size={16} color={Colors.white} />
            </TouchableOpacity>
            <Text style={[MainStyles.text16white, { flex: 1, textAlign: 'center' }]}>
              Item Details
            </Text>
            <View style={{ width: wp(8) }} />
          </View>

          {item.imageUrl && !imageError ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.sheetImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.sheetImage, styles.sheetImageFallback]}>
              <Text style={{ fontSize: 40 }}>🛍️</Text>
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Share.share({ title: item.name ?? '', message: `${item.name ?? ''} — ${costSymbol}${(item.cost ?? 0).toFixed(2)}\n${item.itemUrl ?? ''}` })}
            >
              <AntDesign name="share-alt" size={16} color={Colors.white} />
              <Text style={styles.actionLabel}>Share</Text>
            </TouchableOpacity>

            {item.location ? (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(item.location!)}`)}
              >
                <AntDesign name="environment" size={16} color={Colors.white} />
                <Text style={styles.actionLabel}>Location</Text>
              </TouchableOpacity>
            ) : null}

            {item.itemUrl ? (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => Linking.openURL(item.itemUrl!)}
              >
                <AntDesign name="link" size={16} color={Colors.white} />
                <Text style={styles.actionLabel}>Item URL</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {badgeLabel !== null && (
            <View style={[styles.sheetScoreBadge, { backgroundColor: badgeBg, borderColor: badgeBorder }]}>
              <View style={[styles.sheetScoreDot, { backgroundColor: badgeColor }]} />
              <Text style={[styles.sheetScoreText, { color: badgeColor }]}>
                {badgeLabel}
              </Text>
            </View>
          )}

          <View style={styles.sheetRow}>
            <Text style={MainStyles.text16white} numberOfLines={1}>{item.name ?? '—'}</Text>
            <Text style={MainStyles.text16white}>{costSymbol}{(item.cost ?? 0).toFixed(2)}</Text>
          </View>

          <View style={styles.sheetDivider} />

          <Text style={MainStyles.text12semibold}>
            Company: <Text style={{ color: Colors.white }}>{item.companyName ?? '—'}</Text>
          </Text>
          <Text style={MainStyles.text12semibold}>
            Location: <Text style={{ color: Colors.white }}>{item.location ?? '—'}</Text>
          </Text>
          <Text style={MainStyles.text12semibold}>
            Price per unit: <Text style={{ color: Colors.white }}>{costSymbol}{item.price ?? item.cost ?? 0}</Text>
          </Text>
          <Text style={MainStyles.text12semibold}>
            Quantity: <Text style={{ color: Colors.white }}>{item.quantity ?? 1}</Text>
          </Text>

          {item.description ? (
            <>
              <View style={styles.sheetDivider} />
              <Text style={[MainStyles.text12semibold, { marginBottom: hp(0.5) }]}>Description</Text>
              <Text style={[MainStyles.text12semibold, { color: Colors.text_color }]}>
                {item.description}
              </Text>
            </>
          ) : null}
        </View>
      </RBSheet>
    </>
  );
};

const styles = StyleSheet.create({
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
  image: { width: 48, height: 48, borderRadius: 10 },
  imageFallback: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { color: '#d1d5db', fontSize: 9, fontWeight: '600', maxWidth: 68, textAlign: 'center' },
  price: { color: '#f1f5f9', fontSize: 11, fontWeight: '800' },
  badge: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 2,
  },
  badgeText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.3 },

  // Bottom Sheet
  sheetContent: { flex: 1, paddingHorizontal: wp(5), paddingTop: hp(1) },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(1.5) },
  sheetClose: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: Colors.borderline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetImage: { width: '100%', height: hp(18), borderRadius: wp(3), marginBottom: hp(1.5) },
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
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: hp(1.5) },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionLabel: { color: '#9ca3af', fontSize: 9, fontWeight: '600', letterSpacing: 0.5 },
});

export default ItemPill;
