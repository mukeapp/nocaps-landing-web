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
import Toast from "react-native-root-toast";

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
import useHabitLinkItemsAIForm from "@/core/hooks/useHabitLinkItemsAIForm";
import {HabitLinkItemComponent} from "@/core/models/section-b";

// ─── Props ────────────────────────────────────────────────────────────────────

interface HabitLinkItemsAIScreenProps {
  navigation: any;
  route: any;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

const HabitLinkItemsAIScreen: React.FC<HabitLinkItemsAIScreenProps> = ({
  navigation,
  route,
}) => {
  const form = useHabitLinkItemsAIForm({ navigation, route });
  const costSymbol = form.costSymbol ?? "";

  const [showConfirm, setShowConfirm] = useState<ConfirmState | null>(null);

  const handleAdd = useCallback((item: HabitLinkItemComponent) => {
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

  const confirmAdd = useCallback(async () => {
    if (!showConfirm) return;
    const habitLinkDocumentId =
      form.habitLink?.documentId ?? form.habitLink?.id ?? "";
    setShowConfirm(null);
    const success = await form.processGen(
      habitLinkDocumentId,
      showConfirm.item,
    );
    if (success) {
      Toast.show(`✓ ${showConfirm.item.name ?? "Item"} added successfully!`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        backgroundColor: "rgba(34,197,94,0.9)",
        textColor: "#fff",
        shadow: false,
        animation: true,
        hideOnPress: true,
      });
    }
  }, [showConfirm, form]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f18" />

      <CountdownLoader
        visible={form.loading || form.saving}
        text={
          form.saving ? "Saving item..." : "AI is searching for new items..."
        }
        totalSeconds={form.saving ? 30 : toSeconds(Timeout.generateHabitLinkItem)}
      />

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
          <Text style={styles.headerSub}>Add Item</Text>
          <Text style={styles.headerTitle}>HabitLinkItem AI</Text>
        </View>
        <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {!form.loading && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Current Item Card (optional context) */}
          {form.currentItem && (
            <View style={styles.cardPadding}>
              <CurrentItemCard item={form.currentItem} swappedItem={null} />
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

          {/* Generated Items */}
          <View style={styles.itemList}>
            {form.generatedItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                currentCost={form.currentItem?.cost ?? 0}
                selected={form.addedItem?.id === item.id}
                onSwap={() => handleAdd(item)}
                onInfo={(_item) => {}}
                actionSymbol="＋"
                showSaveDiff={false}
                isLoading={form.processingItemId === item.id}
                disabled={
                  !!form.processingItemId && form.processingItemId !== item.id
                }
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
        onConfirm={confirmAdd}
        actionVerb="Add"
        isSwap={false}
        costSymbol={costSymbol}
      />
    </SafeAreaView>
  );
};

export default HabitLinkItemsAIScreen;

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
