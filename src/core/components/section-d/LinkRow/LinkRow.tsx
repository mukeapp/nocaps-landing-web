import {HabitLinkComponent} from "@/core/models/section-b/habit";
import {getDefaultImageUrl} from "@/core/utils/utilities/images";
import React, {useState} from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import ComparisonItemDiff from "../ComparisonItemDiff";
import ItemPills from "../ItemPills";
import {
    getLinkCost,
    getLinkItems,
    getLinkScore,
    getScoreTier,
} from "../utils";

export interface LinkRowProps {
  link: HabitLinkComponent;
  currentCost: number;
  selected: boolean;
  onSwap: () => void;
  showSaveDiff?: boolean;
  actionSymbol?: string;
  hideSwap?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  costSymbol?: string;
}

const LinkRow: React.FC<LinkRowProps> = ({
  link,
  currentCost,
  selected,
  onSwap,
  showSaveDiff = true,
  actionSymbol = "⇌",
  hideSwap = false,
  isLoading = false,
  disabled = false,
  costSymbol = "",
}) => {
  const [showComparison, setShowComparison] = useState(false);
  const [imageUri, setImageUri] = useState<string>(
    link.bannerImage ?? getDefaultImageUrl(),
  );

  const scorePct = getLinkScore(link);
  const totalCost = getLinkCost(link);
  const items = getLinkItems(link);
  const tier = getScoreTier(scorePct);
  const isRecommended = ["GOOD", "EXCELLENT"].includes(tier.code);
  const scoreColor = tier.hex;
  const itemSaves = link.comparisonHabitLink?.comparisonHabitLinkItems?.map(
    (c) => c.save,
  );
  const hasCmp =
    (link.comparisonHabitLink?.comparisonHabitLinkItems ?? []).length > 0;

  const diff = currentCost - totalCost;
  const saveBg =
    diff > 0
      ? "rgba(34,197,94,0.12)"
      : diff < 0
        ? "rgba(239,68,68,0.12)"
        : "rgba(107,114,128,0.15)";
  const saveBorder =
    diff > 0
      ? "rgba(34,197,94,0.25)"
      : diff < 0
        ? "rgba(239,68,68,0.25)"
        : "rgba(107,114,128,0.2)";
  const saveColor = diff > 0 ? "#22c55e" : diff < 0 ? "#ef4444" : "#6b7280";
  const saveLabel =
    diff === 0
      ? "SAME"
      : diff > 0
        ? `SAVE ${costSymbol}${diff.toFixed(2)}`
        : `+${costSymbol}${Math.abs(diff).toFixed(2)}`;

  return (
    <View style={[styles.row, selected && styles.rowSelected]}>
      {/* Top row */}
      <View style={styles.topRow}>
        <Image
          source={{ uri: imageUri }}
          style={styles.thumb}
          resizeMode="cover"
          onError={() => setImageUri(getDefaultImageUrl())}
        />

        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {link.name}
            </Text>
            <View
              style={[styles.tierBadge, { backgroundColor: `${scoreColor}22` }]}
            >
              <Text style={[styles.tierBadgeText, { color: scoreColor }]}>
                {tier.label.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.meta} numberOfLines={1}>
            {link.location} · {items.length} items
          </Text>
        </View>

        {!hideSwap &&
          (isLoading ? (
            <View
              style={[
                styles.swapBtn,
                { backgroundColor: isRecommended ? scoreColor : "#ef4444" },
              ]}
            >
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <Pressable
              onPress={onSwap}
              disabled={disabled}
              style={({ pressed }) => [
                styles.swapBtn,
                {
                  backgroundColor: isRecommended ? scoreColor : "#ef4444",
                  opacity: disabled ? 0.35 : pressed ? 0.75 : 1,
                },
              ]}
            >
              <Text style={styles.swapIcon}>{actionSymbol}</Text>
            </Pressable>
          ))}

        {items.length > 0 && (
          <Pressable
            onPress={() => setShowComparison((v) => !v)}
            style={({ pressed }) => [
              styles.toggleBtn,
              showComparison && styles.toggleBtnActive,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={styles.toggleIcon}>{showComparison ? "▲" : "▼"}</Text>
          </Pressable>
        )}
      </View>

      {/* Score bar */}
      <View style={[styles.scoreBarRow, { marginTop: 10 }]}>
        <View style={styles.scoreBarTrack}>
          <View
            style={[
              styles.scoreBarFill,
              { width: `${scorePct}%` as any, backgroundColor: scoreColor },
            ]}
          />
        </View>
        <Text style={[styles.scorePercent, { color: scoreColor }]}>
          {scorePct}%
        </Text>
      </View>

      {/* Cost + Save/Lose */}
      <View style={styles.costRow}>
        <Text style={styles.costText}>{costSymbol}{totalCost.toFixed(2)}</Text>
        <Text style={styles.costLabel}>total</Text>
        {showSaveDiff && (
          <View
            style={[
              styles.saveBadge,
              { backgroundColor: saveBg, borderColor: saveBorder },
            ]}
          >
            <Text style={[styles.saveBadgeText, { color: saveColor }]}>
              {saveLabel}
            </Text>
          </View>
        )}
      </View>

      {/* ITEMS · ITEM COMPARISON — toggled */}
      {showComparison && items.length > 0 && (
        <View style={styles.itemsSection}>
          <Text style={styles.itemsSectionLabel}>ITEMS ({items.length})</Text>
          <ItemPills items={items} saves={itemSaves} costSymbol={costSymbol} />

          {hasCmp && (
            <View style={styles.cmpSection}>
              <Text style={styles.itemsSectionLabel}>ITEM COMPARISON</Text>
              {link.comparisonHabitLink!.comparisonHabitLinkItems!.map(
                (cmp, idx) => (
                  <ComparisonItemDiff key={idx} cmp={cmp} costSymbol={costSymbol} />
                ),
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    marginBottom: 12,
  },
  rowSelected: {
    backgroundColor: "rgba(230,57,70,0.10)",
    borderColor: "rgba(230,57,70,0.4)",
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  thumb: { width: 44, height: 44, borderRadius: 10, flexShrink: 0 },
  nameBlock: { flex: 1, minWidth: 0 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  name: { color: "#f1f5f9", fontSize: 15, fontWeight: "700", flexShrink: 1 },
  meta: { color: "#6b7280", fontSize: 11, marginTop: 2 },
  tierBadge: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 20 },
  tierBadgeText: { fontSize: 9, fontWeight: "700", letterSpacing: 0.5 },
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  swapIcon: { color: "#fff", fontSize: 16, fontWeight: "800" },
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  toggleBtnActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.2)",
  },
  toggleIcon: { color: "#9ca3af", fontSize: 14 },
  scoreBarRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  scoreBarTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 4,
    overflow: "hidden",
  },
  scoreBarFill: { height: "100%", borderRadius: 4 },
  scorePercent: {
    fontSize: 11,
    fontWeight: "700",
    minWidth: 30,
    textAlign: "right",
  },
  costRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  costText: { color: "#f1f5f9", fontSize: 13, fontWeight: "800" },
  costLabel: { color: "#6b7280", fontSize: 10 },
  saveBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  saveBadgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  itemsSection: { marginTop: 10 },
  itemsSectionLabel: {
    color: "#6b7280",
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 4,
  },
  cmpSection: { marginTop: 10 },
});

export default LinkRow;
