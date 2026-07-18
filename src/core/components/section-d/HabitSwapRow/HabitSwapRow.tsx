import {
    ComparisonHabitLinkItem,
    HabitComponent,
    HabitLinkComponent,
} from "@/core/models/section-b/habit";
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
import ComparisonLinkDiff from "../ComparisonLinkDiff";
import HabitLinkPills from "../HabitLinkPills";
import {
    getHabitCost,
    getHabitLinks,
    getHabitScore,
    getScoreTier,
} from "../utils";

export interface HabitSwapRowProps {
  habit: HabitComponent;
  currentCost: number;
  currentLinks?: HabitLinkComponent[];
  selected: boolean;
  onSwap: () => void;
  actionSymbol?: string;
  showSaveDiff?: boolean;
  hideSwap?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  costSymbol?: string;
}

const HabitSwapRow: React.FC<HabitSwapRowProps> = ({
  habit,
  currentCost,
  currentLinks,
  selected,
  onSwap,
  actionSymbol = "",
  showSaveDiff = true,
  hideSwap = false,
  isLoading = false,
  disabled = false,
  costSymbol = "",
}) => {
  const [showComparison, setShowComparison] = useState(false);

  const scorePct = getHabitScore(habit);
  const totalCost = getHabitCost(habit);
  const links = getHabitLinks(habit);
  const tier = getScoreTier(scorePct);
  const isRecommended = ["GOOD", "EXCELLENT"].includes(tier.code);
  const scoreColor = tier.hex;
  const hasCmp = (habit.comparisonHabit?.comparisonHabitLinks ?? []).length > 0;

  // Index-based comparison: currentLinks[i] ↔ links[i], items[j] ↔ items[j]
  const savesById: Record<string, number> = {};
  const itemSavesByLinkId: Record<string, (number | undefined)[]> = {};
  const itemCmpByLinkId: Record<string, ComparisonHabitLinkItem[]> = {};

  links.forEach((swapLink, i) => {
    if (!swapLink.id) return;
    const curLink = currentLinks?.[i];

    // Link-level save
    if (curLink) {
      savesById[swapLink.id] =
        (curLink.scoreComponent?.cost ?? 0) -
        (swapLink.scoreComponent?.cost ?? 0);
    } else {
      const cmp = habit.comparisonHabit?.comparisonHabitLinks?.find(
        (c) => c.swapItem?.id === swapLink.id,
      );
      if (cmp) savesById[swapLink.id] = cmp.save;
    }

    // Item-level saves + comparison rows
    if (curLink) {
      const curItems = curLink.habitLinkItemComponentsData ?? [];
      const swapItems = swapLink.habitLinkItemComponentsData ?? [];
      const count = Math.max(curItems.length, swapItems.length);
      const saves: (number | undefined)[] = [];
      const cmps: ComparisonHabitLinkItem[] = [];
      for (let j = 0; j < count; j++) {
        const curItem = curItems[j];
        const swapItem = swapItems[j];
        const save = (curItem?.cost ?? 0) - (swapItem?.cost ?? 0);
        saves.push(save);
        cmps.push({ currentItem: curItem, swapItem, score: 0, save });
      }
      itemSavesByLinkId[swapLink.id] = saves;
      itemCmpByLinkId[swapLink.id] = cmps;
    }
  });

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
          source={{ uri: habit.bannerImage ?? getDefaultImageUrl() }}
          style={styles.thumb}
          resizeMode="cover"
        />

        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {habit.name}
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
            {habit.interest} · {links.length} links
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
              <Text style={styles.swapIcon}>{actionSymbol || "⇌"}</Text>
            </Pressable>
          ))}

        {links.length > 0 && (
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

      {/* LINKS · ITEMS · ITEM COMPARISON · LINK COMPARISON — toggled */}
      {showComparison && links.length > 0 && (
        <View style={styles.linksSection}>
          <HabitLinkPills
            links={links}
            savesById={savesById}
            itemSavesByLinkId={itemSavesByLinkId}
            itemCmpByLinkId={itemCmpByLinkId}
            costSymbol={costSymbol}
          />

          {hasCmp && (
            <View style={styles.cmpSection}>
              <Text style={styles.cmpLabel}>LINK COMPARISON</Text>
              {habit.comparisonHabit!.comparisonHabitLinks!.map((cmp, idx) => (
                <ComparisonLinkDiff key={idx} cmp={cmp} costSymbol={costSymbol} />
              ))}
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
  linksSection: { marginTop: 10 },
  cmpSection: { marginTop: 10 },
  cmpLabel: {
    color: "#6b7280",
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 4,
  },
});

export default HabitSwapRow;
