import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as _wp,
  heightPercentageToDP as _hp,
  fs,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _wp(p);
const hp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _hp(p);
const _fs = (size: number): number =>
  isWeb ? size : fs(size);
import { useNavigation } from "@react-navigation/native";
import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  HabitLinkComponent,
  HabitLinkItemComponent,
} from "@/core/models/section-b/habit";
import { formatCost, truncateString } from "@/core/utils";
import { RouterData } from "@/core/models/section-b";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {getHabitLinkItemDataByOriginIdAndDate} from "@/core/services/section-b/section-b-0/habit-link-item-data";

type Item = {
  documentId: string;
  name: string;
  cost?: number;
  scoreObject?: { scoreInfo?: { color?: string } };
};

type Props = {
  startDate: Date | null;
  costSymbol?: string;
  items: HabitLinkItemComponent[];
  color?: string;
  canEdit?: boolean;
  dataType?: string;
  canShowCheckbox?: boolean;
  onEdit: (item: HabitLinkItemComponent) => void;
  onInfo: (item: HabitLinkItemComponent) => void;
  onDelete: (item: HabitLinkItemComponent) => void;
  onToggleCheck?: (item: HabitLinkItemComponent, isChecked: boolean) => void;
  showCopyButton?: boolean;
  showCopyButtonText?: string;
  onCopyPress?: (id: string, parentId?: string, dataType?: string) => Promise<void>;
  insertCalendarData?: (item: HabitLinkItemComponent, year: number, month: number, day: number, isChecked?: boolean) => Promise<void>;
  goToSwapScreen?: (item: HabitLinkItemComponent) => void;
  canGoToSwapScreen?: boolean;
};

const HabitLinkItemsList: React.FC<Props> = ({
  startDate,
  costSymbol = "",
  items,
  color,
  dataType = "habit-link-item",
  onEdit,
  onInfo,
  onDelete,
  onToggleCheck,
  canEdit = false,
  canGoToSwapScreen = false,
  canShowCheckbox = false,
  showCopyButton = false,
  showCopyButtonText = "Copy Item",
  onCopyPress = async (id: string, parentId?: string, dataType?: string) =>
    console.log("Copy pressed"),
  insertCalendarData = async (item: HabitLinkItemComponent, year: number, month: number, day: number, isChecked?: boolean) => {
    console.log("Insert calendar data not implemented");
  },
  goToSwapScreen = async (item: HabitLinkItemComponent) => {
    console.log("Go to swap screen not implemented");
  },
}) => {
  const navigation = useNavigation<any>();

  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [itemsCalendarOnLoad, setItemsCalendarOnLoad] = useState<HabitLinkItemComponent[]>([]);
  const [itemsCalendar, setItemsCalendar] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    const loadItemsCalendar = async () => {
      if (!startDate) return;
      if (!canShowCheckbox) return;

      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1;
      const day = startDate.getDate();

      const calendarItems: HabitLinkItemComponent[] = [];
      const calendarItemsSet: Set<string> = new Set();

      for (const item of items) {
        const found: HabitLinkItemComponent | null = await getHabitLinkItemDataByOriginIdAndDate(
          item.id,
          item.habitLinkId,
          year,
          month,
          day
        );

        if (found) {
          calendarItems.push(item);
          calendarItemsSet.add(item.id);
        }
      }

      setItemsCalendarOnLoad(calendarItems);
      setItemsCalendar(calendarItemsSet);
      setCheckedItems(calendarItemsSet);
    };

    loadItemsCalendar();
  }, [startDate, items]);

  const goToHabitLinkItemCalendar = (habitLinkItem: HabitLinkItemComponent) => {
    const routerData: RouterData = {
      destinationScreenTitle: "HabitLinkItem Calendar",
      habitLinkItem,
      costSymbol,
    };
    navigation.navigate("habit-calendar", {
      OriginScreen: "habit-links",
      routerData,
    });
  };

  const handleInsertCalendarData = async (item: HabitLinkItemComponent, isChecked?: boolean) => {
    if (!startDate || !insertCalendarData) return;

    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1;
    const day = startDate.getDate();

    await insertCalendarData(item, year, month, day, isChecked);
  };

  const handleGoToSwapScreen = async (item: HabitLinkItemComponent) => {
    if (!goToSwapScreen) return;
    await goToSwapScreen(item);
  };

  const handleCopyPress = async (data: HabitLinkItemComponent) => {
    const itemId = data.documentId;

    if (processingItems.has(itemId) || copiedItems.has(itemId) || !onCopyPress) return;

    setProcessingItems(prev => new Set(prev).add(itemId));

    try {
      if (dataType == "habit-link-item") {
        await onCopyPress(data?.documentId, undefined, dataType);
      }

      setCopiedItems(prev => new Set(prev).add(itemId));

      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleCheckboxToggle = (item: HabitLinkItemComponent) => {
    const newCheckedItems = new Set(checkedItems);
    const isCurrentlyChecked = checkedItems.has(item.documentId);
    handleInsertCalendarData(item, !isCurrentlyChecked);

    if (isCurrentlyChecked) {
      newCheckedItems.delete(item.documentId);
    } else {
      newCheckedItems.add(item.documentId);
    }

    setCheckedItems(newCheckedItems);

    if (onToggleCheck) {
      onToggleCheck(item, !isCurrentlyChecked);
    }
  };

  const render = ({ item }: { item: HabitLinkItemComponent }) => {
    const isChecked = checkedItems.has(item.documentId);
    const isProcessing = processingItems.has(item.documentId);
    const isCopied = copiedItems.has(item.documentId);

    const itemAccentColor =
      item?.scoreObject?.scoreInfo?.color?.toLowerCase?.() || color || "#6b7280";

    const metaParts = [
      item?.companyName,
      `${costSymbol}${formatCost(item?.cost)}`,
    ].filter(Boolean);

    return (
      <View style={styles.card}>
        {/* Left score accent bar */}
        <View style={[styles.cardAccent, {backgroundColor: itemAccentColor}]} />

        {/* Main content */}
        <View style={styles.cardContent}>
          {/* Name + score pill */}
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {truncateString(item?.name ?? "", 20)}
            </Text>
            {!!item?.scoreObject?.scoreInfo?.label && (
              <View
                style={[
                  styles.scorePill,
                  {backgroundColor: itemAccentColor + "33"},
                ]}
              >
                <Text style={[styles.scorePillText, {color: itemAccentColor}]}>
                  {item.scoreObject.scoreInfo.label}
                </Text>
              </View>
            )}
          </View>

          {/* Company · cost */}
          {metaParts.length > 0 && (
            <Text style={styles.metaText} numberOfLines={1}>
              {metaParts.join(" · ")}
            </Text>
          )}
        </View>

        {/* Action icons */}
        <View style={styles.iconsContainer}>
          {/* Copy button */}
          {showCopyButton && (
            <TouchableOpacity
              style={[
                styles.copyButton,
                isProcessing && styles.copyButtonDisabled,
                isCopied && styles.copyButtonSuccess,
              ]}
              onPress={() => handleCopyPress(item)}
              disabled={isProcessing || isCopied}
              activeOpacity={isProcessing || isCopied ? 1 : 0.7}
            >
              <MaterialCommunityIcons
                name={isCopied ? "check" : "content-copy"}
                size={fs(15)}
                color={Colors.white}
              />
              <Text
                style={[
                  styles.copyButtonText,
                  isProcessing && styles.copyButtonTextDisabled,
                ]}
              >
                {isProcessing ? "Processing..." : isCopied ? "Copied" : showCopyButtonText}
              </Text>
            </TouchableOpacity>
          )}

          {canEdit && canGoToSwapScreen && (
            <TouchableOpacity
              style={[MainStyles.sheeticon, {backgroundColor: itemAccentColor}]}
              onPress={() => handleGoToSwapScreen(item)}
            >
              <Fontisto name="arrow-swap" size={fs(15)} color={Colors.white} />
            </TouchableOpacity>
          )}

          {canEdit && (
            <TouchableOpacity
              style={[MainStyles.sheeticon, {backgroundColor: "rgba(255,255,255,0.07)"}]}
              onPress={() => goToHabitLinkItemCalendar(item)}
            >
              <FontAwesome5 name="calendar-alt" size={fs(15)} color={Colors.white} />
            </TouchableOpacity>
          )}

          {canEdit && (
            <TouchableOpacity
              style={[MainStyles.sheeticon, {backgroundColor: "rgba(255,255,255,0.07)"}]}
              onPress={() => onEdit(item)}
            >
              <Feather name="edit-3" size={fs(15)} color={Colors.white} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[MainStyles.sheeticon, {backgroundColor: "rgba(255,255,255,0.07)"}]}
            onPress={() => onInfo(item)}
          >
            <AntDesign name="info-circle" size={fs(15)} color={Colors.white} />
          </TouchableOpacity>

          {canShowCheckbox && (
            <TouchableOpacity
              style={[
                MainStyles.sheeticon,
                {backgroundColor: isChecked ? Colors.green : "rgba(255,255,255,0.07)"},
              ]}
              onPress={() => handleCheckboxToggle(item)}
            >
              <MaterialIcons
                name={isChecked ? "check-box" : "check-box-outline-blank"}
                size={fs(16)}
                color={Colors.white}
              />
            </TouchableOpacity>
          )}

          {canEdit && (
            <TouchableOpacity
              style={[MainStyles.sheeticon, {backgroundColor: "rgba(255,23,23,0.15)"}]}
              onPress={() => onDelete(item)}
            >
              <Entypo name="cross" size={fs(16)} color={Colors.red} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={!showCopyButton ? styles.listWrap : styles.listWrapShort}>
      {items.map((item) => (
        <React.Fragment key={item.documentId ?? item.id ?? Math.random()}>
          {render({ item })}
        </React.Fragment>
      ))}
    </View>
  );
};

export default HabitLinkItemsList;

export const styles = StyleSheet.create({
  listWrap: {
    marginBottom: hp(1),
  },
  listWrapShort: {
    marginBottom: hp(1),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: wp(3),
    marginTop: hp(1.2),
    overflow: "hidden",
    paddingRight: wp(3),
    paddingVertical: hp(1.2),
  },
  cardAccent: {
    width: wp(1),
    alignSelf: "stretch",
    borderRadius: wp(0.5),
    marginRight: wp(3),
  },
  cardContent: {
    flex: 1,
    gap: hp(0.4),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
    flexWrap: "wrap",
  },
  nameText: {
    color: Colors.white,
    fontSize: fs(13),
    fontWeight: "600",
    flexShrink: 1,
  },
  metaText: {
    color: "#6b7280",
    fontSize: fs(11),
  },
  scorePill: {
    borderRadius: wp(3),
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
  },
  scorePillText: {
    fontSize: fs(9),
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
  },
  badge: {
    position: "absolute",
    top: hp(-0.7),
    right: hp(-0.7),
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    backgroundColor: Colors.colorred,
    alignItems: "center",
    justifyContent: "center",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: hp(0.9),
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
  },
  copyButtonDisabled: {
    backgroundColor: "rgba(0,0,0,0.3)",
    opacity: 0.6,
  },
  copyButtonSuccess: {
    backgroundColor: "rgba(34,197,94,0.8)",
  },
  copyButtonText: {
    color: Colors.white,
    fontSize: fs(12),
    fontFamily: "poppins_semibold",
    marginLeft: wp(1.5),
  },
  copyButtonTextDisabled: {
    color: Colors.gray,
  },
});
