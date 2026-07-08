import {HabitLinkComponent} from "@/core/models/section-b/habit";
import {
  fs,
  heightPercentageToDP as hp,
  isTablet,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, {useState} from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getLinkCost,
  getLinkItems,
  getLinkScore,
  getScoreTier,
} from "../utils";

const isWeb = Platform.OS === "web";

const ItemImage: React.FC<{
  uri: string;
  imageStyle: any;
  fallbackStyle: any;
}> = ({uri, imageStyle, fallbackStyle}) => {
  const [error, setError] = useState(false);
  if (!uri || error) {
    return (
      <View style={[imageStyle, fallbackStyle]}>
        <Text style={{fontSize: fs(14)}}>📦</Text>
      </View>
    );
  }
  return (
    <Image
      source={{uri}}
      style={imageStyle}
      resizeMode="cover"
      onError={() => setError(true)}
    />
  );
};

export interface HabitLinkDetailSheetProps {
  costSymbol?: string;
  link: HabitLinkComponent | null;
  onClose: () => void;
  ScreenOrigin?: string; // for analytics, e.g. "HabitLinkItemRow" or "HabitLinkCard"
}

const HabitLinkDetailSheet: React.FC<HabitLinkDetailSheetProps> = ({
  costSymbol = "",
  link,
  onClose,
  ScreenOrigin = "Unknown",
}) => {
  if (!link) return null;
  let scorePct = getLinkScore(link);

  if (ScreenOrigin === "HabitStacksAIScreen" || ScreenOrigin === "HabitsAIScreen" || ScreenOrigin === "HabitLinksAIScreen" || ScreenOrigin === "HabitLinkItemsAIScreen") {
    scorePct = Math.round(scorePct);
  } else {
    scorePct = scorePct > 1 ? scorePct / 100 : Math.round(scorePct);
  }

  const totalCost = getLinkCost(link);
  const items = getLinkItems(link);
  const tier = getScoreTier(scorePct);
  const scoreColor = tier.hex;
  const [descExpanded, setDescExpanded] = useState(false);

  const tags = [link.company, link.location].filter(
    (t): t is string => !!t && t.trim() !== "",
  );

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.modalContainer, isWeb && styles.modalContainerWeb]}>
        {/* Backdrop — tap outside sheet to close */}
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

        <View style={[styles.sheet, isWeb && styles.sheetWeb]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Banner */}
          {link.bannerImage ? (
            <Image
              source={{ uri: link.bannerImage }}
              style={[styles.banner, isWeb && styles.bannerWeb]}
              resizeMode="cover"
            />
          ) : null}

          {isWeb ? (
            /* ---------- WEB: 3-column layout, no full-sheet scroll ---------- */
            <View style={styles.columnsRow}>
              {/* Column 1 — Overview */}
              <View style={[styles.col, styles.colPanel]}>
                <Text style={styles.colHeading}>OVERVIEW</Text>

                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={3}>
                    {link.name ?? "—"}
                  </Text>
                </View>

                <View
                  style={[
                    styles.tierBadge,
                    styles.tierBadgeWeb,
                    {
                      backgroundColor: `${scoreColor}22`,
                      borderColor: `${scoreColor}44`,
                    },
                  ]}
                >
                  <View style={[styles.tierDot, { backgroundColor: scoreColor }]} />
                  <Text style={[styles.tierText, { color: scoreColor }]}>
                    {tier.label.toUpperCase()}
                  </Text>
                </View>

                {tags.length > 0 && (
                  <View style={styles.tagsRow}>
                    {tags.map((t) => (
                      <View key={t} style={styles.tag}>
                        <Text style={styles.tagText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.scoreBarRow}>
                  <View style={styles.scoreBarTrack}>
                    <View
                      style={[
                        styles.scoreBarFill,
                        {
                          width: `${scorePct}%` as any,
                          backgroundColor: scoreColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.scorePercent, { color: scoreColor }]}>
                    {scorePct}%
                  </Text>
                </View>

                <View style={styles.costCard}>
                  <Text style={styles.costAmount}>
                    {costSymbol}{totalCost.toFixed(2)}
                  </Text>
                  <Text style={styles.costLabel}>total cost</Text>
                </View>
              </View>

              {/* Column 2 — Description */}
              <View style={[styles.col, styles.colPanel]}>
                <Text style={styles.colHeading}>DESCRIPTION</Text>
                <ScrollView
                  style={styles.colScroll}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                >
                  {link.description ? (
                    <View
                      style={[styles.descCard, { borderLeftColor: scoreColor }]}
                    >
                      <Text style={styles.description}>{link.description}</Text>
                    </View>
                  ) : (
                    <Text style={styles.emptyText}>No description provided.</Text>
                  )}
                </ScrollView>
              </View>

              {/* Column 3 — Items */}
              <View style={[styles.col, styles.colPanel]}>
                <Text style={styles.colHeading}>ITEMS ({items.length})</Text>
                <ScrollView
                  style={styles.colScroll}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                >
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <View key={item.id ?? idx} style={styles.itemRow}>
                        <ItemImage
                          uri={item.imageUrl ?? ""}
                          imageStyle={styles.itemImage}
                          fallbackStyle={styles.itemImageFallback}
                        />
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.name ?? "—"}
                        </Text>
                        <Text style={styles.itemCost}>
                          {costSymbol}{(item.cost ?? 0).toFixed(2)}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyText}>No items in this link.</Text>
                  )}
                </ScrollView>
              </View>
            </View>
          ) : (
            /* ---------- NATIVE: original single-column layout ---------- */
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.body}
              >
                {/* Name + tier */}
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={2}>
                    {link.name ?? "—"}
                  </Text>
                  <View
                    style={[
                      styles.tierBadge,
                      {
                        backgroundColor: `${scoreColor}22`,
                        borderColor: `${scoreColor}44`,
                      },
                    ]}
                  >
                    <View
                      style={[styles.tierDot, { backgroundColor: scoreColor }]}
                    />
                    <Text style={[styles.tierText, { color: scoreColor }]}>
                      {tier.label.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Tags: company, location */}
                <View style={styles.tagsRow}>
                  {tags.map((t) => (
                    <View key={t} style={styles.tag}>
                      <Text style={styles.tagText}>{t}</Text>
                    </View>
                  ))}
                </View>

                {/* Score bar */}
                <View style={styles.scoreBarRow}>
                  <View style={styles.scoreBarTrack}>
                    <View
                      style={[
                        styles.scoreBarFill,
                        {
                          width: `${scorePct}%` as any,
                          backgroundColor: scoreColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.scorePercent, { color: scoreColor }]}>
                    {scorePct}%
                  </Text>
                </View>

                {/* Cost */}
                <View style={styles.costRow}>
                  <Text style={styles.costAmount}>{costSymbol}{totalCost.toFixed(2)}</Text>
                  <Text style={styles.costLabel}>total cost</Text>
                </View>

                {/* Description */}
                {!!link.description && (
                  <View style={styles.descSection}>
                    <TouchableOpacity
                      style={styles.descHeaderRow}
                      onPress={() => setDescExpanded((v) => !v)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.descHeaderLeft}>
                        <View style={[styles.descAccent, {backgroundColor: scoreColor}]} />
                        <Text style={styles.descSectionLabel}>Description</Text>
                      </View>
                      <View style={styles.descToggle}>
                        <MaterialIcons
                          name={descExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                          size={fs(18)}
                          color="#111"
                        />
                      </View>
                    </TouchableOpacity>
                    {descExpanded && (
                      <View style={[styles.descCard, {borderLeftColor: scoreColor}]}>
                        <Text style={styles.description}>{link.description}</Text>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>

              {/* Items — dedicated vertical scroll */}
              {items.length > 0 && (
                <View style={styles.itemsSection}>
                  <Text style={styles.itemsLabel}>ITEMS ({items.length})</Text>
                  <ScrollView
                    style={styles.itemsScroll}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                  >
                    {items.map((item, idx) => (
                      <View key={item.id ?? idx} style={styles.itemRow}>
                        <ItemImage
                          uri={item.imageUrl ?? ""}
                          imageStyle={styles.itemImage}
                          fallbackStyle={styles.itemImageFallback}
                        />
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.name ?? "—"}
                        </Text>
                        <Text style={styles.itemCost}>
                          {costSymbol}{(item.cost ?? 0).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}

          {/* Close button */}
          <TouchableOpacity
            style={[styles.closeBtn, isWeb && styles.closeBtnWeb]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.78)",
  },
  modalContainerWeb: {
    alignItems: "center",
  },
  sheet: {
    backgroundColor: "#1a1a2e",
    borderTopLeftRadius: wp(7),
    borderTopRightRadius: wp(7),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    //maxHeight: isTablet ? "90%" : "80%",
    height: isTablet ? hp(150) : hp(85),
    paddingBottom: Platform.OS === "ios" ? hp(5.5) : hp(3),
  },
  sheetWeb: {
    width: "100%",
    maxWidth: 1000,
    height: "65%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 18,
  },
  handle: {
    width: wp(10),
    height: hp(0.5),
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: wp(0.5),
    alignSelf: "center",
    marginTop: hp(1.5),
    marginBottom: hp(1),
  },
  banner: {
    width: "100%",
    height: isTablet ? hp(45) : hp(15),
  },
  bannerWeb: {
    height: 120,
    borderRadius: 14,
    marginHorizontal: 20,
    width: "auto",
    marginBottom: 4,
  },
  // --- Web 3-column layout ---
  columnsRow: {
    flex: 1,
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  col: {
    flex: 1,
  },
  colPanel: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
  },
  colHeading: {
    color: "#6b7280",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 14,
  },
  colScroll: {
    flex: 1,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 13,
    fontStyle: "italic",
  },
  tierBadgeWeb: {
    alignSelf: "flex-start",
    marginBottom: hp(1.5),
  },
  costCard: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "baseline",
    gap: wp(1.5),
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  body: {
    padding: wp(5),
    paddingBottom: hp(1),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: wp(2.5),
    marginBottom: hp(1),
  },
  name: {
    flex: 1,
    color: "#f1f5f9",
    fontSize: fs(20),
    fontWeight: "800",
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.2),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2.5),
    borderRadius: wp(5),
    borderWidth: 1,
    flexShrink: 0,
  },
  tierDot: { width: wp(1.8), height: wp(1.8), borderRadius: wp(1) },
  tierText: { fontSize: fs(10), fontWeight: "700", letterSpacing: 0.5 },
  description: {
    color: "#9ca3af",
    fontSize: fs(13),
    lineHeight: fs(20),
  },
  descSection: {
    marginBottom: hp(1.5),
  },
  descHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(0.8),
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: wp(3),
    paddingVertical: hp(1.2),
    paddingLeft: wp(3),
    paddingRight: wp(2),
  },
  descHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2.5),
    flex: 1,
  },
  descAccent: {
    width: wp(0.8),
    height: hp(2.5),
    borderRadius: wp(0.4),
  },
  descSectionLabel: {
    color: "#e2e8f0",
    fontSize: fs(12),
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  descToggle: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  descCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderLeftWidth: wp(1),
    borderRadius: wp(1.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(1.5),
    marginBottom: hp(1.8),
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingVertical: hp(0.4),
    paddingHorizontal: wp(2.5),
    borderRadius: wp(5),
  },
  tagText: { color: "#9ca3af", fontSize: fs(11), fontWeight: "600" },
  scoreBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
    marginBottom: hp(1.5),
  },
  scoreBarTrack: {
    flex: 1,
    height: hp(0.6),
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: wp(1),
    overflow: "hidden",
  },
  scoreBarFill: { height: "100%", borderRadius: wp(1) },
  scorePercent: {
    fontSize: fs(12),
    fontWeight: "700",
    minWidth: wp(8.5),
    textAlign: "right",
  },
  costRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: wp(1.5),
    marginBottom: hp(2.2),
  },
  costAmount: { color: "#f1f5f9", fontSize: fs(26), fontWeight: "800" },
  costLabel: { color: "#6b7280", fontSize: fs(13) },
  itemsSection: {
    gap: hp(1),
    paddingHorizontal: wp(5),
    marginBottom: hp(1),
    height: isTablet ? hp(50) : hp(30),//--item
  },
  itemsScroll: {
    //maxHeight: hp(27),
    //height: isTablet ? hp(70) : hp(30),//--item
  },
  itemsLabel: {
    color: "#6b7280",
    fontSize: fs(9),
    letterSpacing: 2,
    marginBottom: hp(0.5),
    marginTop: hp(1),
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2.5),
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: wp(2.5),
    padding: wp(2),
    marginBottom: isTablet ? hp(1) : hp(0.5),//--item
  },
  itemImage: { width: wp(9), height: wp(9), borderRadius: wp(2), flexShrink: 0 },
  itemImageFallback: {
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  itemName: { flex: 1, color: "#d1d5db", fontSize: fs(13), fontWeight: "600" },
  itemCost: {
    color: "#f1f5f9",
    fontSize: fs(13),
    fontWeight: "800",
    flexShrink: 0,
  },
  closeBtn: {
    marginHorizontal: wp(5),
    marginTop: hp(1.5),
    paddingVertical: hp(1.8),
    borderRadius: wp(3.5),
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  closeBtnWeb: {
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeBtnText: { color: "#9ca3af", fontSize: fs(15), fontWeight: "700" },
});

export default HabitLinkDetailSheet;
