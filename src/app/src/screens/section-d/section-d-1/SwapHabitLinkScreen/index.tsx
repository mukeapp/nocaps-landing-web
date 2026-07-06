import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import Toast from 'react-native-root-toast';
import { HabitLinkComponent } from '@/core/models/section-b/habit';
import {
  CurrentLinkCard,
  LinkRow,
  LinkConfirmSheet,
  LinkConfirmState,
  SCORE_TIERS,
  getLinkScore,
  getLinkCost,
  getScoreTier,
} from '@/core/components/section-d';
import useSwapHabitLinkForm from '@/core/hooks/useSwapHabitLinkForm';
import {MOCK_CURRENT_LINK, MOCK_SWAP_LINKS} from './mockData';
import CountdownLoader from '@/core/components/section-b/loader/CountdownLoader';
import {Timeout, toSeconds} from "@/core/utils/utilities/timeout";

// ─── Props ────────────────────────────────────────────────────────────────────

interface SwapHabitLinkScreenProps {
  currentLink?: HabitLinkComponent; // LOCAL ONLY - REPLACE WITH API DATA
  swapLinks?: HabitLinkComponent[]; // LOCAL ONLY - REPLACE WITH API DATA
  navigation: any;
  route: any;
  onSettings?: () => void;
  onConfirmSwap?: (link: HabitLinkComponent) => void;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

const SwapHabitLinkScreen: React.FC<SwapHabitLinkScreenProps> = ({
  currentLink = MOCK_CURRENT_LINK, // LOCAL ONLY - REPLACE WITH API DATA
  swapLinks   = MOCK_SWAP_LINKS,  // LOCAL ONLY - REPLACE WITH API DATA
  navigation,
  route,
  onSettings,
  onConfirmSwap,
}) => {

  const form = useSwapHabitLinkForm({ navigation, route });
  const { currentItem, swapItems } = form;
  const costSymbol = form.costSymbol;

  //console.log('SwapHabitLinkScreen render', { swapItems });

  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [swappedLink, setSwappedLink] = useState<HabitLinkComponent | null>(null);
  const [showConfirm, setShowConfirm] = useState<LinkConfirmState | null>(null);

  const handleSwap = useCallback((link: HabitLinkComponent) => {
    const tier = getScoreTier(getLinkScore(link));
    const isRecommended = ['GOOD', 'EXCELLENT'].includes(tier.code);
    setShowConfirm({ link, tier, type: isRecommended ? 'confirm' : 'warn' });
  }, []);

  const confirmSwap = useCallback(async () => {
    if (!showConfirm || !form.currentItem) return;
    setShowConfirm(null);
    const success = await form.processSwap(form.currentItem, showConfirm.link);
    if (success) {
      setSwappedLink(showConfirm.link);
      setSelectedId(showConfirm.link.id ?? null);
      onConfirmSwap?.(showConfirm.link);
      Toast.show('Swap successful!', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#22c55e',
      });
    }
  }, [showConfirm, form, onConfirmSwap]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f18" />
      <CountdownLoader visible={form.loading} totalSeconds={toSeconds(Timeout.swapHabitLink)} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.headerIconText}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerSub}>Swap Provider</Text>
          <Text style={styles.headerTitle}>HabitLink Swap</Text>
        </View>
        <TouchableOpacity style={styles.headerIconBtn} onPress={onSettings} activeOpacity={0.7}>
          <Text style={styles.headerIconText}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current HabitLink */}
        <View style={styles.sectionPad}>

          {/* Swap options Live */}
          {currentItem && !form.swapDone && <CurrentLinkCard link={currentItem} swappedLink={swappedLink} divideBy={100} costSymbol={costSymbol} />}

          {/* Swap options LOCAL */}
          {/* <CurrentLinkCard link={currentLink} swappedLink={swappedLink} /> */}
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>ALTERNATIVE PROVIDERS</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Score Legend */}
        <View style={styles.legend}>
          {SCORE_TIERS.filter(t => t.code !== 'UNKNOWN').map(tier => (
            <View key={tier.code} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: tier.hex }]} />
              <Text style={styles.legendText}>{tier.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Swap options Live */}
        <View style={styles.linkList}>
          {swapItems.map(link => (
            <LinkRow
              key={link.id}
              link={link}
              currentCost={currentItem ? getLinkCost(currentItem) : 0}
              selected={selectedId === link.id}
              onSwap={() => handleSwap(link)}
              hideSwap={form.swapDone}
              costSymbol={costSymbol}
            />
          ))}
        </View>

        {/* Swap options LOCAL */}
        {/* <View style={styles.linkList}>
          {swapLinks.map(link => (
            <LinkRow
              key={link.id}
              link={link}
              currentCost={getLinkCost(currentLink)}
              selected={selectedId === link.id}
              onSwap={() => handleSwap(link)}
            />
          ))}
        </View> */}

        <View style={{ height: 40 }} />
      </ScrollView>

      <LinkConfirmSheet
        confirm={showConfirm}
        onCancel={() => setShowConfirm(null)}
        onConfirm={confirmSwap}
        costSymbol={costSymbol}
      />
    </SafeAreaView>
  );
};

export default SwapHabitLinkScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f0f18' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: { color: '#f1f5f9', fontSize: 18 },
  headerSub: { color: '#6b7280', fontSize: 10, letterSpacing: 2, marginBottom: 2 },
  headerTitle: { color: '#f1f5f9', fontSize: 17, fontWeight: '800' },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  sectionPad: { paddingHorizontal: 16, paddingBottom: 16 },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 8,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  dividerLabel: { color: '#6b7280', fontSize: 9, letterSpacing: 2 },

  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: '#6b7280', fontSize: 9, letterSpacing: 0.5 },

  linkList: { paddingHorizontal: 16 },
});
