import React, {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet,
} from "@/core/utils/responsive";
import {BlurView} from "expo-blur";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import {Colors} from "@/core/constants/Colors";
import {HabitLinkItemComponent} from "@/core/models/section-b/habit";
import {SemiCircleProgress} from "@/core/components/section-b";
import {formatCost} from "@/core/utils/utilities/numberUtils";
import {getScoreColor} from "@/core/utils/utilities/score";
import {openUrlIfValid} from "@/core/utils/utilities/urls";

const isUrl = (str?: string): boolean => {
  if (!str) return false;
  return /^https?:\/\//i.test(str) || str.startsWith("www.");
};

/** Truncate label to 20 characters with ellipsis */
const truncateLabel = (label?: string): string => {
  if (!label) return "";
  return label.length > 20 ? label.slice(0, 20) + "..." : label;
};

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

// ── Per-item card with expand/collapse ─────────────────────────────────────

type CardProps = {item: HabitLinkItemComponent};

const DayNoteItemCard: React.FC<CardProps> = ({item}) => {
  const [expanded, setExpanded] = useState(false);

  const scoreColor = getScoreColor(item?.scoreCode ?? "UNKNOWN");
  const scoreLabel = item?.scoreCode
    ? item.scoreCode.charAt(0).toUpperCase() + item.scoreCode.slice(1).toLowerCase()
    : "Unknown";

  return (
    <View style={styles.card}>

      {/* Collapsed header — always visible */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item?.name ?? "Untitled"}
          </Text>
          <View style={styles.cardBadgeRow}>
            {item?.cost != null && (
              <View style={styles.costBadge}>
                <Text style={styles.costText}>${item.cost.toFixed(2)}</Text>
              </View>
            )}
            {!!item?.noteText && (
              <View style={styles.noteBadge}>
                <MaterialIcons name="sticky-note-2" size={12} color="#facc15" />
                <Text style={styles.noteBadgeText} numberOfLines={1}>
                  {truncateLabel(item.noteText)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Score Wheel */}
        <View style={styles.scoreWheelWrap}>
          <SemiCircleProgress
            progress={formatCost(item?.score * 100 ?? 0, false)}
            size={45}
            strokeWidth={4}
            backgroundColor={Colors.white}
            progressColor={scoreColor}
            statustxt={scoreLabel}
          />
        </View>

        <MaterialIcons
          name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={22}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {/* Expanded content */}
      {expanded && (
        <View style={styles.cardBody}>
          {/* Image banner */}
          {!!item?.imageUrl && (
            <Image
              source={{uri: item.imageUrl}}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          )}

          {/* Description + Score status */}
          <View style={styles.descriptionRow}>
            {!!item?.description ? (
              <Text style={[styles.bodyText, {flex: 1, marginBottom: 0}]}>{item.description}</Text>
            ) : (
              <View style={{flex: 1}} />
            )}
            <View style={styles.scoreStatusRow}>
              <View style={[styles.scoreDot, {backgroundColor: scoreColor}]} />
              <Text style={[styles.scoreStatusLabel, {color: scoreColor}]}>
                {scoreLabel}
              </Text>
            </View>
          </View>

          {/* Meta fields */}
          {!!item?.companyName && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Company</Text>
              {isUrl(item.companyName) ? (
                <TouchableOpacity
                  style={styles.urlBtn}
                  onPress={() => openUrlIfValid(item.companyName)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="open-in-browser" size={14} color={Colors.primary} />
                  <Text style={styles.urlBtnText}>Open link</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.metaValue}>{truncateLabel(item.companyName)}</Text>
              )}
            </View>
          )}
          {!!item?.location && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Location</Text>
              <Text style={styles.metaValue}>{item.location}</Text>
            </View>
          )}
          {item?.price != null && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Price</Text>
              <Text style={styles.metaValue}>${item.price.toFixed(2)}</Text>
            </View>
          )}
          {item?.quantity != null && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Qty</Text>
              <Text style={styles.metaValue}>{item.quantity}</Text>
            </View>
          )}
          {!!item?.aiScored && !!item?.aiScoredDescription && (
            <View style={styles.aiSection}>
              <Text style={styles.aiLabel}>AI Analysis</Text>
              <Text style={styles.aiDesc}>{item.aiScoredDescription}</Text>
            </View>
          )}

          {/* Note divider */}
          {(!!item?.noteText || !!item?.noteImageUrl) && (
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.notesLabelBadge}>
                <Text style={styles.notesLabelText}>Notes</Text>
              </View>
              <View style={styles.dividerLine} />
            </View>
          )}

          {/* Note text — at bottom */}
          {!!item?.noteText && (
            <Text style={styles.noteText}>{item.noteText}</Text>
          )}

          {/* Note image — below noteText */}
          {!!item?.noteImageUrl && (
            <Image
              source={{uri: item.noteImageUrl}}
              style={styles.noteImage}
              resizeMode="cover"
            />
          )}
        </View>
      )}
    </View>
  );
};

// ── Sheet ──────────────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  onClose: () => void;
  items: HabitLinkItemComponent[];
  loading: boolean;
  day: number;
  month: number; // 1-indexed
  year: number;
};

const DayNotesSheet: React.FC<Props> = ({
  visible,
  onClose,
  items,
  loading,
  day,
  month,
  year,
}) => {
  const monthName = MONTHS[(month - 1) % 12] ?? "";

  return (
    <Modal animationType="slide" visible={visible} transparent onRequestClose={onClose}>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={35}
        tint="dark"
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Notes · {day} {monthName} {year}
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Entypo name="cross" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {loading ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color={Colors.white} />
            </View>
          ) : items.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No notes for this day.</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {items.map((it, idx) => (
                <DayNoteItemCard key={it.documentId ?? it.id ?? idx} item={it} />
              ))}
            </ScrollView>
          )}
        </View>
      </BlurView>
    </Modal>
  );
};

export default DayNotesSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "#111827",
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
    maxHeight: isTablet ? hp(160) : hp(90),
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
  },
  handle: {
    alignSelf: "center",
    width: wp(10),
    height: 4,
    borderRadius: 2,
    backgroundColor: "#374151",
    marginTop: hp(1.2),
    marginBottom: hp(1),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(2),
  },
  headerTitle: {
    color: Colors.white,
    fontSize: wp(4.2),
    fontWeight: "700",
  },
  closeBtn: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderWrap: {
    paddingVertical: hp(6),
    alignItems: "center",
  },
  emptyWrap: {
    paddingVertical: hp(6),
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: wp(3.6),
  },
  scrollArea: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingBottom: hp(2),
  },

  // Card
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#2D2D2F",
    marginBottom: hp(1.5),
    overflow: "hidden",
  },
  descriptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: wp(2),
    marginBottom: hp(1),
  },
  scoreStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  scoreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scoreStatusLabel: {
    fontSize: wp(2.8),
    fontWeight: "600",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.4),
  },
  scoreWheelWrap: {
    marginLeft: wp(2),
    marginRight: wp(1),
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: wp(2),
  },
  cardName: {
    color: Colors.white,
    fontSize: wp(3.8),
    fontWeight: "600",
    marginBottom: 4,
  },
  cardBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  noteBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#374151",
    borderRadius: 6,
    paddingHorizontal: wp(2),
    paddingVertical: 2,
  },
  noteBadgeText: {
    color: "#fff",
    fontSize: wp(3),
    fontWeight: "700",
    flexShrink: 1,
  },
  costBadge: {
    backgroundColor: "#374151",
    borderRadius: 6,
    paddingHorizontal: wp(2),
    paddingVertical: 2,
  },
  costText: {
    color: "#facc15",
    fontSize: wp(3),
    fontWeight: "700",
  },
  scoreBadge: {
    borderRadius: 6,
    paddingHorizontal: wp(2),
    paddingVertical: 2,
  },
  scoreBadgeText: {
    color: "#fff",
    fontSize: wp(2.8),
    fontWeight: "600",
  },

  // Card body
  cardBody: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(1.5),
  },
  bannerImage: {
    width: "100%",
    height: hp(18),
    borderRadius: wp(2),
    marginBottom: hp(1),
  },
  bodyText: {
    color: "#D1D5DB",
    fontSize: wp(3.4),
    lineHeight: 20,
    marginBottom: hp(1),
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  metaLabel: {
    color: "#6B7280",
    fontSize: wp(3.2),
  },
  metaValue: {
    color: "#E5E7EB",
    fontSize: wp(3.2),
    fontWeight: "500",
  },
  urlBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(45,156,219,0.12)",
    borderRadius: 6,
    paddingHorizontal: wp(2),
    paddingVertical: 3,
  },
  urlBtnText: {
    color: Colors.primary,
    fontSize: wp(3.2),
    fontWeight: "600",
  },
  aiSection: {
    backgroundColor: "#1e1b4b",
    borderRadius: wp(2),
    padding: wp(3),
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  aiLabel: {
    color: "#A78BFA",
    fontSize: wp(3),
    fontWeight: "600",
    marginBottom: 4,
  },
  aiDesc: {
    color: "#9B95C9",
    fontSize: wp(3.2),
    lineHeight: 20,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(1.2),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#2D2D2F",
  },
  notesLabelBadge: {
    backgroundColor: "#374151",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginHorizontal: 8,
  },
  notesLabelText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  noteText: {
    color: "#E0E0E0",
    fontSize: wp(3.4),
    lineHeight: 22,
    marginBottom: hp(1),
  },
  noteImage: {
    width: "100%",
    height: hp(20),
    borderRadius: wp(2),
    marginTop: hp(0.5),
  },
});
