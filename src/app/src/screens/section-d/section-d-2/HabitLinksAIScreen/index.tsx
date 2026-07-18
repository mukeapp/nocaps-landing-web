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
  LinkConfirmSheet,
  LinkRow,
  SCORE_TIERS,
  getLinkScore,
  getScoreTier,
} from "@/core/components/section-d";

import type {LinkConfirmState} from "@/core/components/section-d";

import CountdownLoader from "@/core/components/section-b/loader/CountdownLoader";
import {Timeout, toSeconds} from "@/core/utils/utilities/timeout";
import useHabitLinksAIForm from "@/core/hooks/useHabitLinksAIForm";
import {HabitLinkComponent} from "@/core/models/section-b";

// ─── Props ────────────────────────────────────────────────────────────────────

interface HabitLinksAIScreenProps {
  navigation: any;
  route: any;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

const HabitLinksAIScreen: React.FC<HabitLinksAIScreenProps> = ({
  navigation,
  route,
}) => {
  const form = useHabitLinksAIForm({ navigation, route });
  const costSymbol = form.costSymbol;

  const [showConfirm, setShowConfirm] = useState<LinkConfirmState | null>(null);

  const handleAdd = useCallback((link: HabitLinkComponent) => {
    const tier = getScoreTier(getLinkScore(link));
    const isRecommended = ["GOOD", "EXCELLENT"].includes(tier.code);
    setShowConfirm({ link, tier, type: isRecommended ? "confirm" : "warn" });
  }, []);

  const confirmAdd = useCallback(async () => {
    if (!showConfirm) return;
    const habitId = route?.params?.habitId ?? "";
    setShowConfirm(null);
    const success = await form.processGen(habitId, showConfirm.link);
    if (success) {
      Toast.show(
        `✓ ${showConfirm.link.name ?? "HabitLink"} added successfully!`,
        {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          backgroundColor: "rgba(34,197,94,0.9)",
          textColor: "#fff",
          shadow: false,
          animation: true,
          hideOnPress: true,
        },
      );
    }
  }, [showConfirm, form, route]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f18" />

      <CountdownLoader
        visible={form.loading}
        text="AI is generating HabitLinks..."
        totalSeconds={toSeconds(Timeout.generateHabitLink)}
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
          <Text style={styles.headerSub}>Add HabitLink</Text>
          <Text style={styles.headerTitle}>HabitLink AI</Text>
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
          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>AI GENERATED</Text>
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

          {/* Generated HabitLink cards */}
          <View style={styles.linkList}>
            {form.generatedLinks.map((link) => (
              <View key={link.id} style={styles.linkCardWrapper}>
                <LinkRow
                  link={link}
                  currentCost={0}
                  selected={form.addedLink?.id === link.id}
                  onSwap={() => handleAdd(link)}
                  showSaveDiff={false}
                  actionSymbol="＋"
                  isLoading={form.processingLinkId === link.id}
                  disabled={
                    !!form.processingLinkId && form.processingLinkId !== link.id
                  }
                  costSymbol={costSymbol}
                />
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      <LinkConfirmSheet
        confirm={showConfirm}
        onCancel={() => setShowConfirm(null)}
        onConfirm={confirmAdd}
        actionVerb="Add"
        costSymbol={costSymbol}
      />
    </SafeAreaView>
  );
};

export default HabitLinksAIScreen;

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

  linkList: { paddingHorizontal: 16 },
  linkCardWrapper: {
    borderWidth: 1.5,
    borderColor: "rgba(59,130,246,0.3)",
    borderRadius: 20,
    marginBottom: 12,
  },
});
