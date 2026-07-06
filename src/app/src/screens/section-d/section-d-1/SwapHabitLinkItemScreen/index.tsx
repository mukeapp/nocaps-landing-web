import {Colors} from "@/core/constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import React, {useCallback, useState} from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {
  ConfirmSheet,
  CurrentItemCard,
  getScoreTier,
  ItemRow,
  SCORE_TIERS,
  toPercent,
} from "../../../../../../core/components/section-d";

import type {ConfirmState} from "../../../../../../core/components/section-d";


import CountdownLoader from "@/core/components/section-b/loader/CountdownLoader";
import {Timeout, toSeconds} from "@/core/utils/utilities/timeout";
import useSwapHabitLinkItemForm from "@/core/hooks/useSwapHabitLinkItemForm";
import Toast from "react-native-root-toast";

// ─── Screen ───────────────────────────────────────────────────────────────────

const SwapHabitLinkItemScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useSwapHabitLinkItemForm({ navigation, route });
  const costSymbol = form.costSymbol;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<ConfirmState | null>(null);

  const handleSwap = useCallback((item: (typeof form.swapItems)[0]) => {
    const scorePct = toPercent(item.score);
    const tier = getScoreTier(scorePct);
    const isRecommended = ["GOOD", "EXCELLENT"].includes(tier.code);
    setShowConfirm({
      item,
      tier,
      scorePct,
      type: isRecommended ? "confirm" : "warn",
    });
  }, []);

  const confirmSwap = useCallback(async () => {
    if (!showConfirm || !form.currentItem) return;
    setShowConfirm(null);
    const success = await form.processSwap(form.currentItem, showConfirm.item);
    if (success) {
      setSelectedId(showConfirm.item.id);
      Toast.show("Swap successful!", {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        backgroundColor: "#22c55e",
      });
    }
  }, [showConfirm, form]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f18" />

      <CountdownLoader visible={form.loading} totalSeconds={toSeconds(Timeout.swapHabitLinkItem)} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={form.goBack}
          activeOpacity={0.7}
        >
          <Text style={styles.headerIconText}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerSub}>Swap Item</Text>
          <Text style={styles.headerTitle}>HabitLinkItem Swap</Text>
        </View>
        <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {!form.loading && form.currentItem && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Current Item Card */}
          {!form.swapDone && (
            <View style={styles.cardPadding}>
              <CurrentItemCard item={form.currentItem} swappedItem={null} costSymbol={costSymbol} />
            </View>
          )}

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>AVAILABLE AT</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Score Legend */}
          <View style={styles.legend}>
            {SCORE_TIERS.filter((t) => t.code !== "UNKNOWN").map((tier) => (
              <View key={tier.code} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: tier.hex }]}
                />
                <Text style={styles.legendText}>
                  {tier.label.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>

          {/* Swap Items */}
          <View style={styles.itemList}>
            {form.swapItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                currentCost={form.currentItem?.cost ?? 0}
                selected={selectedId === item.id}
                onSwap={() => handleSwap(item)}
                onInfo={(_item) => {}}
                hideSwap={form.swapDone}
                costSymbol={costSymbol}
              />
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      <ConfirmSheet
        confirm={showConfirm}
        onCancel={() => setShowConfirm(null)}
        onConfirm={confirmSwap}
        costSymbol={costSymbol}
      />
    </SafeAreaView>
  );
};

export default SwapHabitLinkItemScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0f0f18" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(26, 203, 85, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconText: { color: "#f1f5f9", fontSize: 18 },
  headerSub: {
    color: "#6b7280",
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 2,
  },
  headerTitle: { color: "#f1f5f9", fontSize: 17, fontWeight: "800" },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  cardPadding: { paddingHorizontal: 16, paddingBottom: 16 },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  dividerLabel: { color: "#6b7280", fontSize: 10, letterSpacing: 2 },

  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: "#6b7280", fontSize: 9, letterSpacing: 0.5 },

  itemList: { paddingHorizontal: 16 },
});
