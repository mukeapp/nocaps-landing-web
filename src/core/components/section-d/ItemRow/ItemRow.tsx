import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";
import {HabitLinkItemComponent} from "@/core/models/section-b";
import {getDefaultImageUrl} from "@/core/utils/utilities/images";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import React, {useRef, useState} from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    Pressable,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import SaveLoseTag from "../SaveLoseTag";
import {getScoreTier, toPercent} from "../utils";

export interface ItemRowProps {
  actionVerb?: string;
  actionSymbol?: string;
  item: HabitLinkItemComponent;
  currentCost: number;
  selected: boolean;
  onSwap: () => void;
  onInfo: (item: HabitLinkItemComponent) => void;
  showSaveDiff?: boolean;
  hideSwap?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  costSymbol?: string;
}

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({
  item,
  currentCost,
  selected,
  onSwap,
  onInfo,
  actionVerb = "Swap",
  actionSymbol = "⇌",
  showSaveDiff = true,
  hideSwap = false,
  isLoading = false,
  disabled = false,
  costSymbol = "",
}) => {
  const scorePct = toPercent(item.score);
  const tier = getScoreTier(scorePct);
  const isRecommended = ["GOOD", "EXCELLENT"].includes(tier.code);
  const scoreColor = tier.hex;
  const refRBSheet = useRef<RBSheetRef>(null);
  const [imageError, setImageError] = useState(false);

  const handleShare = async () => {
    await Share.share({
      title: item.name ?? "",
      message: item.name ?? "",
      url: item.itemUrl ?? "",
    });
  };
  const handleLocation = () => {
    const q = encodeURIComponent(
      [item.companyName, item.location].filter(Boolean).join(" "),
    );
    Linking.openURL(`https://maps.google.com/?q=${q}`);
  };
  const handleItemUrl = () => {
    if (item.itemUrl) Linking.openURL(item.itemUrl);
  };

  const handleInfoPress = () => {
    onInfo(item);
    refRBSheet.current?.open();
  };

  return (
    <View style={[styles.row, selected && styles.rowSelected]}>
      {/* Thumbnail */}
      {item.imageUrl && !imageError ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.thumb}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <Image
          source={{ uri: getDefaultImageUrl() }}
          style={styles.thumb}
          resizeMode="cover"
        />
      )}

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name ?? "—"}
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
          {[item.companyName, item.location].filter(Boolean).join(" · ")}
        </Text>

        <View style={styles.scoreBarRow}>
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

        <SaveLoseTag
          item={item}
          currentCost={currentCost}
          showSaveDiff={showSaveDiff}
          costSymbol={costSymbol}
        />
      </View>

      {/* Swap Button */}
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

      {/* Info Button */}
      <TouchableOpacity
        onPress={handleInfoPress}
        style={[MainStyles.sheeticon, { backgroundColor: Colors.filtertext }]}
      >
        <AntDesign name="info-circle" size={17} color={Colors.white} />
      </TouchableOpacity>

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
            backgroundColor: "rgba(0,0,0,0.67)",
          },
          draggableIcon: {
            backgroundColor: Colors.filtertext,
            width: wp(30),
          },
        }}
        customModalProps={{
          animationType: "fade",
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
            <Text
              style={[MainStyles.text16white, { flex: 1, textAlign: "center" }]}
            >
              Item Details
            </Text>
            <View style={{ width: wp(8) }} />
          </View>

          {/* Image */}
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

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
              <SimpleLineIcons name="share" size={20} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleLocation}>
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                size={20}
                color={Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtnLast}
              onPress={handleItemUrl}
            >
              <Fontisto name="world-o" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Score badge */}
          <View
            style={[
              styles.sheetScoreBadge,
              {
                backgroundColor: `${scoreColor}22`,
                borderColor: `${scoreColor}44`,
              },
            ]}
          >
            <View
              style={[styles.sheetScoreDot, { backgroundColor: scoreColor }]}
            />
            <Text style={[styles.sheetScoreText, { color: scoreColor }]}>
              {tier.label.toUpperCase()} — {scorePct}%
            </Text>
          </View>

          {/* Name & Cost */}
          <View style={styles.sheetRow}>
            <Text style={MainStyles.text16white} numberOfLines={1}>
              {item.name ?? "—"}
            </Text>
            <Text style={MainStyles.text16white}>
              {costSymbol}{(item.cost ?? 0).toFixed(2)}
            </Text>
          </View>

          <View style={styles.sheetDivider} />

          {/* Details */}
          <Text style={MainStyles.text12semibold}>
            Company:{" "}
            <Text style={{ color: Colors.white }}>
              {item.companyName ?? "—"}
            </Text>
          </Text>
          <Text style={MainStyles.text12semibold}>
            Location:{" "}
            <Text style={{ color: Colors.white }}>{item.location ?? "—"}</Text>
          </Text>
          <Text style={MainStyles.text12semibold}>
            Price per unit:{" "}
            <Text style={{ color: Colors.white }}>{costSymbol}{item.price ?? 0}</Text>
          </Text>
          <Text style={MainStyles.text12semibold}>
            Quantity:{" "}
            <Text style={{ color: Colors.white }}>{item.quantity ?? 0}</Text>
          </Text>

          {item.description ? (
            <>
              <View style={styles.sheetDivider} />
              <Text
                style={[MainStyles.text12semibold, { marginBottom: hp(0.5) }]}
              >
                Description
              </Text>
              <Text
                style={[
                  MainStyles.text12semibold,
                  { color: Colors.text_color },
                ]}
              >
                {item.description}
              </Text>
            </>
          ) : null}
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    gap: 10,
    marginBottom: 10,
  },
  rowSelected: {
    backgroundColor: "rgba(230,57,70,0.12)",
    borderColor: "rgba(230,57,70,0.4)",
  },
  thumb: { width: 44, height: 44, borderRadius: 10, flexShrink: 0 },
  thumbFallback: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: { flex: 1, minWidth: 0 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
    flexWrap: "wrap",
  },
  name: { color: "#f1f5f9", fontSize: 14, fontWeight: "700", flexShrink: 1 },
  meta: { color: "#6b7280", fontSize: 11, marginBottom: 4 },
  tierBadge: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 20 },
  tierBadgeText: { fontSize: 9, fontWeight: "700", letterSpacing: 0.5 },
  scoreBarRow: { flexDirection: "row", alignItems: "center", gap: 6 },
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
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  swapIcon: { color: "#fff", fontSize: 16, fontWeight: "800" },

  // Bottom Sheet
  sheetContent: { flex: 1, paddingHorizontal: wp(5), paddingTop: hp(1) },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  sheetClose: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: Colors.borderline,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetImage: {
    width: "100%",
    height: hp(18),
    borderRadius: wp(3),
    marginBottom: hp(1.5),
  },
  sheetImageFallback: {
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetScoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: hp(1),
  },
  sheetScoreDot: { width: 8, height: 8, borderRadius: 4 },
  sheetScoreText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  sheetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(1),
  },
  sheetDivider: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderline,
    marginVertical: hp(1),
  },
  actionRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderline,
    marginBottom: hp(1.5),
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1.5),
    borderRightWidth: 1,
    borderRightColor: Colors.borderline,
  },
  actionBtnLast: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1.5),
  },
});

export default ItemRow;
