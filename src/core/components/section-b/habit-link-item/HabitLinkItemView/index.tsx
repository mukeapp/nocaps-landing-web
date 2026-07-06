import * as Clipboard from "expo-clipboard";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getDefaultImageUrl2 } from "@/core/utils/utilities/images";
import { openUrlIfValid } from "@/core/utils/utilities/urls";
import { fetchCostSymbolByHabitLinkId } from "@/core/services/section-b/section-b-0/units";
import { fetchHabitLinkItemComponentByDocumentId } from "@/core/services/section-b/section-b-0/habit-link-item";
import { formatCost } from "@/core/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  fs,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
} from "@/core/utils/responsive";
import { HabitLinkItemComponent } from "@/core/models/section-b/habit";

interface Props {
  habitLinkItemId: string;
  costSymbol?: string;
}

const HabitLinkItemView: React.FC<Props> = ({ habitLinkItemId, costSymbol = "" }) => {
  const [item, setItem] = useState<HabitLinkItemComponent | null>(null);
  const [loading, setLoading] = useState(true);
  const [descExpanded, setDescExpanded] = useState(false);
  const [aiDescExpanded, setAiDescExpanded] = useState(false);
  const [resolvedCostSymbol, setResolvedCostSymbol] = useState(costSymbol);

  useEffect(() => {
    if (!habitLinkItemId) { setLoading(false); return; }
    setLoading(true);
    fetchHabitLinkItemComponentByDocumentId(habitLinkItemId)
      .then((data: HabitLinkItemComponent | null) => {
        setItem(data);
        if (costSymbol) {
          setResolvedCostSymbol(costSymbol);
        } else if (data?.habitLinkId) {
          fetchCostSymbolByHabitLinkId(data.habitLinkId).then((s) => {
            if (s) setResolvedCostSymbol(s);
          });
        }
      })
      .finally(() => setLoading(false));
  }, [habitLinkItemId, costSymbol]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.white} />
      </View>
    );
  }
  if (!item) return null;

  const accentColor =
    item?.scoreObject?.scoreInfo?.color?.toLowerCase?.() || "#6b7280";

  const formatTimestamp = (ts?: Date | string) => {
    if (!ts) return "N/A";
    const date = ts instanceof Date ? ts : new Date(ts as string);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: item?.name ?? "",
        url: item?.itemUrl ?? "",
      });
    } catch (_) {}
  };

  const handleOpenLocation = () => {
    const encoded = encodeURIComponent(item?.location ?? "");
    openUrlIfValid(`https://maps.google.com/?q=${encoded}`);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Image banner */}
      <Image
        source={
          item?.imageUrl
            ? { uri: item.imageUrl }
            : { uri: getDefaultImageUrl2() }
        }
        style={styles.imo}
        resizeMode="cover"
      />

      {/* Action icons below image */}
      <View style={styles.iconRow}>
        {!!item?.name && (
          <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
            <SimpleLineIcons name="share" size={fs(20)} color={Colors.white} />
          </TouchableOpacity>
        )}
        {!!item?.location && (
          <TouchableOpacity style={styles.iconBtn} onPress={handleOpenLocation}>
            <MaterialCommunityIcons
              name="map-marker-radius-outline"
              size={fs(20)}
              color={Colors.white}
            />
          </TouchableOpacity>
        )}
        {!!item?.itemUrl && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => openUrlIfValid(item?.itemUrl)}
          >
            <Fontisto name="world-o" size={fs(20)} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>

      {/* Company + Score badge */}
      <View style={[MainStyles.viewtwo, { marginTop: hp(2) }]}>
        {!!item?.companyName && (
          <Text style={styles.companyText}>{item.companyName}</Text>
        )}
        {!!item?.scoreObject?.scoreInfo?.label && (
          <View
            style={[
              styles.scoreBadge,
              {
                backgroundColor:
                  item?.scoreObject?.scoreInfo?.color?.toLowerCase() ||
                  Colors.inputback,
              },
            ]}
          >
            <Text style={styles.scoreBadgeText}>
              {item.scoreObject.scoreInfo.label}
            </Text>
          </View>
        )}
      </View>

      {/* Title */}
      {!!item?.name && (
        <Text style={styles.titleText}>{item.name}</Text>
      )}

      {/* Chip tags */}
      {(!!item?.companyName || !!item?.location) && (
        <View style={styles.chipRow}>
          {!!item?.companyName && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{item.companyName}</Text>
            </View>
          )}
          {!!item?.location && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{item.location}</Text>
            </View>
          )}
        </View>
      )}

      {/* Score progress bar */}
      {!!item?.scoreObject?.score && (
        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(item.scoreObject.score, 100)}%` as any,
                  backgroundColor:
                    item?.scoreObject?.scoreInfo?.color?.toLowerCase() ||
                    Colors.green,
                },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {parseFloat(Number(item.scoreObject.score).toFixed(2))}%
          </Text>
        </View>
      )}

      {/* Cost callout */}
      {!!item?.cost && (
        <Text style={styles.costCallout}>
          {resolvedCostSymbol}
          {formatCost(item.cost)}{" "}
          <Text style={styles.costLabel}>total cost</Text>
        </Text>
      )}

      <View style={styles.bord} />

      {/* Details grid */}
      <View style={styles.detailsGrid}>
        {!!item?.price && (
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <View style={styles.detailCardIconWrap}>
                <MaterialIcons name="sell" size={fs(14)} color={accentColor} />
              </View>
              <Text style={styles.detailLabel}>UNIT / PRICE</Text>
            </View>
            <Text style={styles.detailValue}>
              {resolvedCostSymbol} {formatCost(item.price)}
            </Text>
          </View>
        )}

        {!!item?.quantity && (
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <View style={styles.detailCardIconWrap}>
                <MaterialIcons name="inventory-2" size={fs(14)} color={accentColor} />
              </View>
              <Text style={styles.detailLabel}>QUANTITY</Text>
            </View>
            <Text style={styles.detailValue}>{item.quantity}</Text>
          </View>
        )}

        <View style={styles.detailCardFull}>
          <View style={styles.detailCardHeader}>
            <View style={styles.detailCardIconWrap}>
              <MaterialIcons name="auto-awesome" size={fs(14)} color={accentColor} />
            </View>
            <Text style={styles.detailLabel}>NOCAP AI SCORED</Text>
          </View>
          <View
            style={[
              styles.aiScoredBadge,
              { backgroundColor: item?.aiScored ? "rgba(75,181,67,0.15)" : "rgba(255,23,23,0.12)" },
            ]}
          >
            <View
              style={[
                styles.aiScoredDot,
                { backgroundColor: item?.aiScored ? Colors.success : Colors.red },
              ]}
            />
            <Text
              style={[
                styles.aiScoredText,
                { color: item?.aiScored ? Colors.success : Colors.red },
              ]}
            >
              {item?.aiScored ? "Yes" : "No"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bord} />

      {/* Description — expandable */}
      <View style={styles.descSection}>
        <TouchableOpacity
          style={styles.descHeaderRow}
          onPress={() => setDescExpanded((v) => !v)}
          activeOpacity={0.7}
        >
          <View style={styles.descHeaderLeft}>
            <View style={[styles.descAccent, { backgroundColor: accentColor }]} />
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
          <View style={[styles.descCard, { borderLeftColor: accentColor }]}>
            <Text style={styles.description}>
              {item?.description || "No description available."}
            </Text>
          </View>
        )}
      </View>

      {/* NoCap AI Description — expandable */}
      {!!item?.aiScoredDescription && (
        <View style={styles.descSection}>
          <TouchableOpacity
            style={styles.descHeaderRow}
            onPress={() => setAiDescExpanded((v) => !v)}
            activeOpacity={0.7}
          >
            <View style={styles.descHeaderLeft}>
              <View style={[styles.descAccent, { backgroundColor: accentColor }]} />
              <MaterialIcons name="auto-awesome" size={fs(14)} color={accentColor} />
              <Text style={styles.descSectionLabel}>NoCap AI Description</Text>
            </View>
            <View style={styles.descToggle}>
              <MaterialIcons
                name={aiDescExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={fs(18)}
                color="#111"
              />
            </View>
          </TouchableOpacity>
          {aiDescExpanded && (
            <View style={[styles.descCard, { borderLeftColor: accentColor }]}>
              <Text style={styles.description}>{item.aiScoredDescription}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.bord} />

      {/* IDs */}
      <View style={styles.idsRow}>
        <TouchableOpacity
          style={styles.idBtn}
          onPress={() => Clipboard.setStringAsync(item?.habitLinkId ?? "")}
          activeOpacity={0.7}
        >
          <View style={styles.idBtnInner}>
            <Text style={styles.idLabel}>HABITLINK ID</Text>
            <Text style={styles.idValue} numberOfLines={1}>
              {item?.habitLinkId || "N/A"}
            </Text>
          </View>
          <MaterialIcons name="content-copy" size={fs(16)} color={Colors.text_color} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.idBtn}
          onPress={() => Clipboard.setStringAsync(item?.documentId ?? item?.id ?? "")}
          activeOpacity={0.7}
        >
          <View style={styles.idBtnInner}>
            <Text style={styles.idLabel}>ITEM ID</Text>
            <Text style={styles.idValue} numberOfLines={1}>
              {item?.documentId ?? item?.id ?? "N/A"}
            </Text>
          </View>
          <MaterialIcons name="content-copy" size={fs(16)} color={Colors.text_color} />
        </TouchableOpacity>
      </View>

      <View style={styles.bord} />

      {/* Timestamps */}
      <View style={styles.infoRow}>
        <Text style={MainStyles.text16}>
          Created:{" "}
          <Text style={[MainStyles.text12semibold, { color: Colors.text_color }]}>
            {formatTimestamp(item?.createdAt)}
          </Text>
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={MainStyles.text16}>
          Updated:{" "}
          <Text style={[MainStyles.text12semibold, { color: Colors.text_color }]}>
            {formatTimestamp(item?.updatedAt)}
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default HabitLinkItemView;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(4),
  },
  scrollContent: {
    paddingBottom: hp(3),
  },
  bord: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderline,
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  imo: {
    width: isTablet ? "100%" : wp(90),
    height: isTablet ? hp(40) : hp(20),
    marginTop: hp(2),
    borderRadius: wp(2),
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
    paddingVertical: hp(1.5),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderline,
    marginTop: hp(1),
  },
  iconBtn: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: Colors.borderline,
    alignItems: "center",
    justifyContent: "center",
  },
  companyText: {
    color: "#9ca3af",
    fontSize: fs(12),
    fontWeight: "600",
  },
  scoreBadge: {
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.3),
  },
  scoreBadgeText: {
    color: "#fff",
    fontSize: fs(11),
    fontWeight: "700",
  },
  titleText: {
    color: Colors.white,
    fontSize: fs(18),
    fontWeight: "800",
    marginTop: hp(0.5),
    marginBottom: hp(1),
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2),
    marginBottom: hp(1.5),
  },
  chip: {
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: Colors.borderline,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  chipText: {
    color: Colors.white,
    fontSize: fs(12),
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
    marginBottom: hp(1.5),
  },
  progressBar: {
    flex: 1,
    height: hp(0.7),
    borderRadius: wp(0.8),
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: wp(0.8),
  },
  progressLabel: {
    color: "#9ca3af",
    fontSize: fs(12),
    fontWeight: "600",
    minWidth: wp(8),
    textAlign: "right",
  },
  costCallout: {
    color: Colors.white,
    fontSize: fs(22),
    fontWeight: "800",
    marginBottom: hp(1),
  },
  costLabel: {
    color: "#9ca3af",
    fontSize: fs(13),
    fontWeight: "400",
  },
  infoRow: {
    marginTop: hp(1),
  },
  descSection: {
    marginTop: hp(1),
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
  description: {
    color: "#9ca3af",
    fontSize: fs(13),
    lineHeight: fs(20),
  },
  idsRow: {
    gap: hp(1),
    marginTop: hp(0.5),
  },
  idBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.borderline,
    borderRadius: wp(2.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
  },
  idBtnInner: {
    flex: 1,
    marginRight: wp(2),
  },
  idLabel: {
    color: Colors.text_color,
    fontSize: fs(9),
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: hp(0.3),
  },
  idValue: {
    color: Colors.white,
    fontSize: fs(12),
    fontWeight: "600",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2.5),
    marginTop: hp(0.5),
    marginBottom: hp(0.5),
  },
  detailCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.borderline,
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    gap: hp(0.8),
  },
  detailCardFull: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.borderline,
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
  },
  detailCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  detailCardIconWrap: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  detailLabel: {
    color: "#6b7280",
    fontSize: fs(9),
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  detailValue: {
    color: Colors.white,
    fontSize: fs(15),
    fontWeight: "600",
    marginTop: hp(0.5),
  },
  aiScoredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: wp(4),
  },
  aiScoredDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
  },
  aiScoredText: {
    fontSize: fs(13),
    fontWeight: "700",
  },
});
