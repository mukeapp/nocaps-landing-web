import {Colors} from "@/core/constants/Colors";
import {RouterData} from "@/core/models/section-b";
import {HabitLinkItemComponent} from "@/core/models/section-b/habit";
import {
  selectScorerCostPerItem,
  selectSwapCostPerItem,
} from "@/core/redux/habit-intelligence-cost";
import {
  RevenueCatAction,
  selectRevenueCat,
} from "@/core/redux/user-revenue-cat";
import {decreaseRemainingCreditsByUserId} from "@/core/services/section-b";
import {getHabitLinkItemDataByOriginIdAndDate} from "@/core/services/section-b/section-b-0/habit-link-item-data";
import {formatCost, truncateString} from "@/core/utils";
import {ensureMinTotalCost, formatCostDecimal} from "@/core/utils/utilities/totalCost";
import {
  selectAICompanies,
  selectDefaultSelection,
} from "@/core/redux/ai-models-cost-multiplier";
import AIModelSelector from "@/core/components/section-b/ai-model-selector/AIModelSelector";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useNavigation} from "@react-navigation/native";
import React, {useState} from "react";
import BannerSectionV2 from "@/core/components/section-b/banner/BannerSectionV2";
import {useMediaUploadV2} from "@/core/hooks";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  heightPercentageToDP as _hp,
  widthPercentageToDP as _wp,
} from "@/core/utils/responsive";
import {useDispatch, useSelector} from "react-redux";

const isWeb = Platform.OS === "web";
const wp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _wp(p);
const hp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _hp(p);

type Props = {
  startDate: Date | null;
  costSymbol?: string;
  items: HabitLinkItemComponent[];
  color?: string;
  canEdit?: boolean;
  dataType?: string;
  canShowCheckbox?: boolean;
  showCheckboxButton?: boolean;
  onEdit: (item: HabitLinkItemComponent) => void;
  onInfo: (item: HabitLinkItemComponent) => void;
  onDelete: (item: HabitLinkItemComponent) => void;
  onToggleCheck?: (item: HabitLinkItemComponent, isChecked: boolean) => void;
  showCopyButton?: boolean;
  showCopyButtonText?: string;
  onCopyPress?: (
    id: string,
    parentId?: string,
    dataType?: string,
  ) => Promise<void>;
  insertCalendarData?: (
    item: HabitLinkItemComponent,
    year: number,
    month: number,
    day: number,
    isChecked?: boolean,
    noteText?: string,
    noteImageUrl?: string,
  ) => Promise<void>;
  goToSwapScreen?: (item: HabitLinkItemComponent, modelId?: string) => void;
  canGoToSwapScreen?: boolean;
  onStarPress?: (item: HabitLinkItemComponent) => void;
  starredItems?: Set<string>;
  onScoreComplete?: () => void;
  canShowButtonItemData?: boolean;
};

const HabitLinkItemsListV2: React.FC<Props> = ({
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
  showCheckboxButton = true,
  showCopyButton = false,
  showCopyButtonText = "Copy Item",
  onCopyPress = async () => console.log("Copy pressed"),
  insertCalendarData = async () =>
    console.log("Insert calendar data not implemented"),
  goToSwapScreen = async () => console.log("Go to swap screen not implemented"),
  onStarPress = () => console.log("Star press not implemented"),
  starredItems,
  onScoreComplete,
  canShowButtonItemData = false,
}) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const userId: string =
    useSelector((s: any) => s?.user?.userdata?.collectdata?.userId)?.trim() ??
    "";
  const revenueCat = useSelector((s: any) => selectRevenueCat(s));
  const noteMedia = useMediaUploadV2();

  const [processingItems, setProcessingItems] = useState<Set<string>>(
    new Set(),
  );
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [scoreModalItem, setScoreModalItem] =
    useState<HabitLinkItemComponent | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [swapConfirmItem, setSwapConfirmItem] =
    useState<HabitLinkItemComponent | null>(null);
  const [noteModalItem, setNoteModalItem] =
    useState<HabitLinkItemComponent | null>(null);
  const [noteText, setNoteText] = useState<string>("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteViewItem, setNoteViewItem] = useState<HabitLinkItemComponent | null>(null);
  const [isFetchingNote, setIsFetchingNote] = useState(false);

  React.useEffect(() => {
    const loadItemsCalendar = async () => {
      if (!startDate || !canShowCheckbox) return;

      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1;
      const day = startDate.getDate();
      const calendarItemsSet = new Set<string>();

      for (const item of items) {
        const found = await getHabitLinkItemDataByOriginIdAndDate(
          item.id,
          item.habitLinkId,
          year,
          month,
          day,
        );
        if (found) {
          calendarItemsSet.add(item.id);
        }
      }

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

  const handleInsertCalendarData = async (
    item: HabitLinkItemComponent,
    isChecked?: boolean,
    noteText?: string,
    noteImageUrl?: string,
  ) => {
    if (!startDate || !insertCalendarData) return;
    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1;
    const day = startDate.getDate();
    await insertCalendarData(item, year, month, day, isChecked, noteText, noteImageUrl);
  };

  const companies = useSelector(selectAICompanies);
  const { companyName: defaultCompanyName, modelId: defaultModelId } = useSelector(selectDefaultSelection);
  const SWAP_COST_PER_ITEM = useSelector((s: any) => selectSwapCostPerItem(s));
  const SCORER_COST_PER_ITEM = useSelector((s: any) =>
    selectScorerCostPerItem(s),
  );

  const [scoreSelectedCompany, setScoreSelectedCompany] = useState(defaultCompanyName);
  const [scoreSelectedModelId, setScoreSelectedModelId] = useState(defaultModelId);
  const scoreModel = companies.flatMap(c => c.models).find(m => m.id === scoreSelectedModelId);
  const adjustedScoreCost = SCORER_COST_PER_ITEM * (scoreModel?.noCapCostMultiplier ?? 1.0);
  const totalScoreCost = ensureMinTotalCost(adjustedScoreCost);
  const handleScoreCompanyChange = (companyName: string) => {
    setScoreSelectedCompany(companyName);
    const models = (companies.find(c => c.name === companyName)?.models ?? [])
      .filter(m => m.isVisible !== false);
    const defaultModel = models.find(m => m.isDefault) ?? models[0];
    setScoreSelectedModelId(defaultModel?.id);
  };

  const [swapSelectedCompany, setSwapSelectedCompany] = useState(defaultCompanyName);
  const [swapSelectedModelId, setSwapSelectedModelId] = useState(defaultModelId);
  const swapModel = companies.flatMap(c => c.models).find(m => m.id === swapSelectedModelId);
  const adjustedSwapCost = SWAP_COST_PER_ITEM * (swapModel?.noCapCostMultiplier ?? 1.0);
  const totalSwapCost = ensureMinTotalCost(adjustedSwapCost);
  const handleSwapCompanyChange = (companyName: string) => {
    setSwapSelectedCompany(companyName);
    const models = (companies.find(c => c.name === companyName)?.models ?? [])
      .filter(m => m.isVisible !== false);
    const defaultModel = models.find(m => m.isDefault) ?? models[0];
    setSwapSelectedModelId(defaultModel?.id);
  };

  const handleGoToSwapScreen = (item: HabitLinkItemComponent) => {
    setSwapConfirmItem(item);
  };

  const handleSwapConfirm = async () => {
    if (!swapConfirmItem) return;
    const item = swapConfirmItem;
    setSwapConfirmItem(null);
    const { data: record, status } = await decreaseRemainingCreditsByUserId(
      userId,
      totalSwapCost,
    );
    if (status >= 200 && status < 300 && record) {
      dispatch(RevenueCatAction.subtractCredits(totalSwapCost));
      if (goToSwapScreen) await goToSwapScreen(item, swapSelectedModelId);
    }
  };

  const handleCopyPress = async (data: HabitLinkItemComponent) => {
    const itemId = data.documentId ?? data.id ?? "";
    if (processingItems.has(itemId) || copiedItems.has(itemId) || !onCopyPress)
      return;

    setProcessingItems((prev) => new Set(prev).add(itemId));
    try {
      await onCopyPress(itemId, undefined, dataType);
      setCopiedItems((prev) => new Set(prev).add(itemId));
      setTimeout(() => {
        setCopiedItems((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }, 2000);
    } finally {
      setProcessingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleCheckboxToggle = (item: HabitLinkItemComponent) => {
    const id = item.documentId ?? item.id ?? "";
    const isCurrentlyChecked = checkedItems.has(id);
    handleInsertCalendarData(item, !isCurrentlyChecked);
    setCheckedItems((prev) => {
      const next = new Set(prev);
      isCurrentlyChecked ? next.delete(id) : next.add(id);
      return next;
    });
    if (onToggleCheck) onToggleCheck(item, !isCurrentlyChecked);
  };

  const handleOpenNoteModal = (item: HabitLinkItemComponent) => {
    setNoteText(item.noteText ?? "");
    setNoteModalItem(item);
  };

  const handleSaveNote = async () => {
    if (!noteModalItem) return;
    setIsSavingNote(true);
    try {
      await handleInsertCalendarData(
        noteModalItem,
        true,
        noteText,
        noteMedia.preview ?? undefined,
      );
      setCheckedItems((prev) => new Set(prev).add(safeId(noteModalItem)));
      if (onToggleCheck) onToggleCheck(noteModalItem, true);
      setNoteModalItem(null);
      setNoteText("");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleCancelNote = () => {
    setNoteModalItem(null);
    setNoteText("");
  };

  const handleOpenNoteView = async (item: HabitLinkItemComponent) => {
    if (!startDate) return;
    setIsFetchingNote(true);
    try {
      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1;
      const day = startDate.getDate();
      const fresh = await getHabitLinkItemDataByOriginIdAndDate(
        item.id,
        item.habitLinkId,
        year,
        month,
        day,
      );
      setNoteViewItem(fresh ?? item);
    } finally {
      setIsFetchingNote(false);
    }
  };

  const runAiScorer = async (itemId: string, modelId: string) => {
    const aiOn =
      (
        process.env.EXPO_PUBLIC_FEATURE_FLAG_AI_SCORER_HABITLINKITEM_ON ??
        "FALSE"
      ).toUpperCase() === "TRUE";
    if (aiOn) {
      const url = `${process.env.EXPO_PUBLIC_API_NOCAP_AI}/ai/scorer/habit-link-item/${itemId}?model=${modelId}`;
      await fetch(url, { method: "PUT", headers: { accept: "*/*" } });
    } else {
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  };

  const handleScoreConfirm = async () => {
    if (!scoreModalItem) return;
    if ((revenueCat?.remainingCredits ?? 0) < totalScoreCost) return;
    setIsScoring(true);
    try {
      const itemId = scoreModalItem.documentId ?? scoreModalItem.id ?? "";
      await runAiScorer(itemId, scoreSelectedModelId);
      const { data: record, status } = await decreaseRemainingCreditsByUserId(
        userId,
        totalScoreCost,
      );
      if (status >= 200 && status < 300 && record) {
        dispatch(RevenueCatAction.subtractCredits(totalScoreCost));
        await onStarPress(scoreModalItem);
        onScoreComplete?.();
      }
    } finally {
      setIsScoring(false);
      setScoreModalItem(null);
    }
  };

  const safeId = (item: HabitLinkItemComponent) =>
    item.documentId ?? item.id ?? "";

  const render = ({ item }: { item: HabitLinkItemComponent }) => {
    const id = safeId(item);
    const isChecked = checkedItems.has(id);
    const isProcessing = processingItems.has(id);
    const isCopied = copiedItems.has(id);
    const borderColor =
      item?.scoreObject?.scoreInfo?.color?.toLowerCase?.() ||
      color ||
      Colors.borderline;

    return (
      <View style={styles.row}>
        {/* Card */}
        <TouchableOpacity
          style={[styles.card, { borderColor }]}
          onPress={() => onInfo(item)}
          activeOpacity={0.75}
        >
          {/* Info button — top right of card */}
          <TouchableOpacity
            style={styles.infoBadge}
            onPress={() => onInfo(item)}
            hitSlop={6}
          >
            <AntDesign name="info-circle" size={12} color="#9ca3af" />
          </TouchableOpacity>

          {/* Name + cost */}
          <Text style={styles.cardName} numberOfLines={1}>
            {truncateString(item?.name ?? "", 14)}
          </Text>
          <Text style={styles.cardCost}>
            {costSymbol} {formatCost(item?.cost)}
          </Text>
          {!!item?.price && (
            <Text style={styles.cardMeta}>
              {costSymbol} {formatCost(item?.price)} / unit
            </Text>
          )}
          {/* {!!item?.quantity && (
            <Text style={styles.cardMeta}>x{item?.quantity}</Text>
          )}
          {!!item?.location && (
            <View style={styles.cardMetaRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={10} color="#9ca3af" />
              <Text style={[styles.cardMeta, { marginLeft: 2 }]} numberOfLines={1}>
                {item?.location}
              </Text>
            </View>
          )} */}
        </TouchableOpacity>

        {/* Action buttons */}
        <View style={styles.actions}>
          {showCopyButton && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                isCopied && styles.actionBtnSuccess,
                isProcessing && styles.actionBtnDisabled,
              ]}
              onPress={() => handleCopyPress(item)}
              disabled={isProcessing || isCopied}
            >
              <MaterialCommunityIcons
                name={isCopied ? "check" : "content-copy"}
                size={16}
                color={Colors.white}
              />
            </TouchableOpacity>
          )}

          {canEdit && canGoToSwapScreen && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor:
                    item?.scoreObject?.scoreInfo?.color?.toLowerCase?.() ||
                    color ||
                    Colors.inputback,
                },
              ]}
              onPress={() => handleGoToSwapScreen(item)}
            >
              <Fontisto name="arrow-swap" size={16} color={Colors.white} />
            </TouchableOpacity>
          )}

          {canEdit && canGoToSwapScreen && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                starredItems?.has(id) && styles.actionBtnStarred,
              ]}
              onPress={() => setScoreModalItem(item)}
            >
              <MaterialCommunityIcons
                name="creation"
                size={24}
                color={item?.aiScored ? "#f59e0b" : Colors.white}
              />
            </TouchableOpacity>
          )}

          {canEdit && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => goToHabitLinkItemCalendar(item)}
            >
              <FontAwesome5
                name="calendar-alt"
                size={16}
                color={Colors.white}
              />
            </TouchableOpacity>
          )}

          {canEdit && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onEdit(item)}
            >
              <Feather name="edit-3" size={16} color={Colors.white} />
            </TouchableOpacity>
          )}

          {canShowCheckbox && isChecked && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleOpenNoteView(item)}
              disabled={isFetchingNote}
            >
              {isFetchingNote ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <AntDesign name="info-circle" size={16} color={Colors.white} />
              )}
            </TouchableOpacity>
          )}

          {canShowCheckbox && showCheckboxButton && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isChecked ? Colors.green : Colors.filtertext,
                },
              ]}
              onPress={() => handleCheckboxToggle(item)}
            >
              <MaterialIcons
                name={isChecked ? "check-box" : "check-box-outline-blank"}
                size={17}
                color={Colors.white}
              />
            </TouchableOpacity>
          )}

          {canShowButtonItemData && !isChecked && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleOpenNoteModal(item)}
            >
              <AntDesign name="plus" size={18} color={Colors.white} />
            </TouchableOpacity>
          )}

          {canShowButtonItemData && isChecked && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnDelete]}
              onPress={() => handleCheckboxToggle(item)}
            >
              <Entypo name="cross" size={18} color={Colors.white} />
            </TouchableOpacity>
          )}

          {canEdit && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnDelete]}
              onPress={() => onDelete(item)}
            >
              <Entypo name="cross" size={18} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.listWrap}>
      <FlatList
        data={items}
        renderItem={render}
        keyExtractor={(item) =>
          item.documentId ?? item.id ?? Math.random().toString()
        }
        showsVerticalScrollIndicator={false}
      />
      {/* ── AI Scorer Modal ── */}
      <Modal
        visible={scoreModalItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isScoring) setScoreModalItem(null);
        }}
      >
        <View style={styles.scoreOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              if (!isScoring) setScoreModalItem(null);
            }}
          />
          <View style={styles.scoreModal}>
            {/* Header */}
            <View style={styles.scoreModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scoreModalName}>
                  {scoreModalItem?.name}
                </Text>
                <Text style={styles.scoreModalCost}>
                  {costSymbol} {formatCost(scoreModalItem?.cost)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.scoreModalClose}
                onPress={() => setScoreModalItem(null)}
                disabled={isScoring}
              >
                <Entypo name="cross" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Current score */}
            <View
              style={[
                styles.scoreCurrentRow,
                {
                  borderColor:
                    scoreModalItem?.scoreObject?.scoreInfo?.color?.toLowerCase?.() ??
                    Colors.borderline,
                },
              ]}
            >
              <Text style={styles.scoreCurrentLabel}>Current score</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={[
                    styles.scoreDot,
                    {
                      backgroundColor:
                        scoreModalItem?.scoreObject?.scoreInfo?.color?.toLowerCase?.() ??
                        "#6B7280",
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.scoreCurrentValue,
                    {
                      color:
                        scoreModalItem?.scoreObject?.scoreInfo?.color?.toLowerCase?.() ??
                        "#6B7280",
                    },
                  ]}
                >
                  {scoreModalItem?.scoreObject?.scoreInfo?.label ?? "Unknown"}
                </Text>
              </View>
            </View>

            {/* Your credits row */}
            <View style={styles.scoreCurrentRow}>
              <Text style={styles.scoreCurrentLabel}>Your credits</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <MaterialIcons name="bolt" size={16} color="#f59e0b" />
                <Text style={[styles.scoreCurrentValue, { color: "#f59e0b" }]}>
                  {(revenueCat?.remainingCredits ?? 0).toLocaleString()}
                </Text>
              </View>
            </View>

            <AIModelSelector
              selectedCompany={scoreSelectedCompany}
              selectedModelId={scoreSelectedModelId}
              onCompanyChange={handleScoreCompanyChange}
              onModelChange={setScoreSelectedModelId}
            />

            {/* AI Analysis section — only when already scored */}
            {scoreModalItem?.aiScored &&
              scoreModalItem?.aiScoredDescription && (
                <View style={styles.scoreAiSection}>
                  {/* <View style={styles.scoreAiIconWrap}>
                    <MaterialCommunityIcons
                      name="creation"
                      size={24}
                      color="#fff"
                    />
                  </View> */}
                  <Text style={styles.scoreAiTitle}>AI Nocap Analysis</Text>
                  <ScrollView
                    style={styles.scoreAiDescScroll}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                    indicatorStyle="white"
                  >
                    <Text style={styles.scoreAiDesc}>
                      {scoreModalItem?.aiScoredDescription}
                    </Text>
                  </ScrollView>
                </View>
              )}

            {/* Score with NocapAI — prompt + cost breakdown */}
            <View style={styles.scoreAiSection}>
              <View style={styles.scoreAiIconWrap}>
                <MaterialCommunityIcons
                  name="creation"
                  size={24}
                  color="#fff"
                />
              </View>
              <Text style={styles.scoreAiTitle}>Score with NocapAI</Text>
              <Text style={styles.scoreAiDesc}>
                {"Would you like "}
                <Text style={{ fontWeight: "700", color: "#A78BFA" }}>
                  NocapAI
                </Text>
                {" to analyze and score "}
                <Text style={{ fontWeight: "700", color: "#E0E0E0" }}>
                  "{scoreModalItem?.name}"
                </Text>
                {" for you?"}
              </Text>

              <View style={[styles.swapCostRow, { marginTop: 12 }]}>
                <Text style={styles.scoreAiDesc}>Cost per item</Text>
                <Text style={[styles.scoreAiDesc, { color: "#E0E0E0" }]}>
                  {formatCostDecimal(totalScoreCost)} credits
                </Text>
              </View>
              <View style={styles.swapCostTotalRow}>
                <Text
                  style={[
                    styles.scoreAiDesc,
                    { fontWeight: "700", color: "#E8E5FF" },
                  ]}
                >
                  Total
                </Text>
                <Text
                  style={[
                    styles.scoreAiDesc,
                    { fontWeight: "700", color: "#A78BFA" },
                  ]}
                >
                  {formatCostDecimal(totalScoreCost)} credits
                </Text>
              </View>

              {(revenueCat?.remainingCredits ?? 0) < totalScoreCost &&
                !isScoring && (
                  <Text style={styles.swapInsufficientText}>
                    Insufficient credits. Please top up to continue.
                  </Text>
                )}
            </View>

            {/* Buttons — sufficient credits */}
            {((revenueCat?.remainingCredits ?? 0) >= totalScoreCost ||
              isScoring) && (
              <View style={styles.scoreButtons}>
                <TouchableOpacity
                  style={[styles.scoreCancelBtn, isScoring && { opacity: 0.4 }]}
                  onPress={() => setScoreModalItem(null)}
                  disabled={isScoring}
                >
                  <Text style={styles.scoreCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.scoreConfirmBtn,
                    isScoring && styles.scoreConfirmBtnLoading,
                  ]}
                  onPress={handleScoreConfirm}
                  disabled={isScoring}
                >
                  {isScoring ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <MaterialCommunityIcons
                      name="creation"
                      size={16}
                      color="#fff"
                    />
                  )}
                  <Text style={styles.scoreConfirmText}>
                    {isScoring ? "Scoring..." : "Score with NocapAI"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Buttons — insufficient credits */}
            {(revenueCat?.remainingCredits ?? 0) < totalScoreCost &&
              !isScoring && (
                <View style={styles.scoreButtons}>
                  <TouchableOpacity
                    style={styles.scoreCancelBtn}
                    onPress={() => setScoreModalItem(null)}
                  >
                    <Text style={styles.scoreCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.swapAddCreditsBtn}
                    onPress={() => {
                      setScoreModalItem(null);
                      navigation.navigate("account");
                    }}
                  >
                    <MaterialIcons name="bolt" size={16} color="#f59e0b" />
                    <Text style={styles.swapAddCreditsBtnText}>
                      Add Credits
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </View>
      </Modal>

      {/* ── Swap Confirm Modal ── */}
      <Modal
        visible={swapConfirmItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSwapConfirmItem(null)}
      >
        <View style={styles.scoreOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setSwapConfirmItem(null)}
          />
          <View style={styles.scoreModal}>
            {/* Header */}
            <View style={styles.scoreModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scoreModalName}>Confirm Swap</Text>
                <Text style={styles.scoreModalCost}>
                  {swapConfirmItem?.name}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.scoreModalClose}
                onPress={() => setSwapConfirmItem(null)}
              >
                <Entypo name="cross" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Your credits row */}
            <View style={styles.scoreCurrentRow}>
              <Text style={styles.scoreCurrentLabel}>Your credits</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <MaterialIcons name="bolt" size={16} color="#f59e0b" />
                <Text style={[styles.scoreCurrentValue, { color: "#f59e0b" }]}>
                  {(revenueCat?.remainingCredits ?? 0).toLocaleString()}
                </Text>
              </View>
            </View>

            <AIModelSelector
              selectedCompany={swapSelectedCompany}
              selectedModelId={swapSelectedModelId}
              onCompanyChange={handleSwapCompanyChange}
              onModelChange={setSwapSelectedModelId}
            />

            {/* Cost breakdown */}
            <View style={styles.scoreAiSection}>
              <View style={styles.scoreAiIconWrap}>
                <MaterialIcons name="swap-horiz" size={24} color="#fff" />
              </View>
              <Text style={styles.scoreAiTitle}>Swap Cost</Text>

              <View style={styles.swapCostRow}>
                <Text style={styles.scoreAiDesc}>Items</Text>
                <Text style={[styles.scoreAiDesc, { color: "#E0E0E0" }]}>
                  1
                </Text>
              </View>
              <View style={styles.swapCostRow}>
                <Text style={styles.scoreAiDesc}>Cost per item</Text>
                <Text style={[styles.scoreAiDesc, { color: "#E0E0E0" }]}>
                  {formatCostDecimal(totalSwapCost)} credits
                </Text>
              </View>
              <View style={styles.swapCostTotalRow}>
                <Text
                  style={[
                    styles.scoreAiDesc,
                    { fontWeight: "700", color: "#E8E5FF" },
                  ]}
                >
                  Total
                </Text>
                <Text
                  style={[
                    styles.scoreAiDesc,
                    { fontWeight: "700", color: "#A78BFA" },
                  ]}
                >
                  {formatCostDecimal(totalSwapCost)} credits
                </Text>
              </View>

              {(revenueCat?.remainingCredits ?? 0) < totalSwapCost && (
                <Text style={styles.swapInsufficientText}>
                  Insufficient credits. Please top up to continue.
                </Text>
              )}
            </View>

            {/* Buttons */}
            {(revenueCat?.remainingCredits ?? 0) >= totalSwapCost && (
              <TouchableOpacity
                style={[styles.scoreConfirmBtn, styles.swapConfirmBtnFull]}
                onPress={handleSwapConfirm}
              >
                <MaterialIcons name="swap-horiz" size={16} color="#fff" />
                <Text style={styles.scoreConfirmText}>
                  Swap — {formatCostDecimal(totalSwapCost)} credits
                </Text>
              </TouchableOpacity>
            )}

            {(revenueCat?.remainingCredits ?? 0) < totalSwapCost && (
              <View style={styles.scoreButtons}>
                <TouchableOpacity
                  style={styles.scoreCancelBtn}
                  onPress={() => setSwapConfirmItem(null)}
                >
                  <Text style={styles.scoreCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.swapAddCreditsBtn}
                  onPress={() => {
                    setSwapConfirmItem(null);
                    navigation.navigate("account");
                  }}
                >
                  <MaterialIcons name="bolt" size={16} color="#f59e0b" />
                  <Text style={styles.swapAddCreditsBtnText}>Add Credits</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Note View Modal (read-only) ── */}
      <Modal
        visible={noteViewItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setNoteViewItem(null)}
      >
        <View style={styles.scoreOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setNoteViewItem(null)}
          />
          <View style={[styles.scoreModal, styles.noteModal]}>
            <View style={styles.scoreModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scoreModalName}>Note</Text>
                <Text style={styles.scoreModalCost} numberOfLines={1}>
                  {noteViewItem?.name}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.scoreModalClose}
                onPress={() => setNoteViewItem(null)}
              >
                <Entypo name="cross" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {!!noteViewItem?.noteImageUrl && (
              <View style={styles.noteBannerWrap}>
                <Image
                  source={{ uri: noteViewItem.noteImageUrl }}
                  style={styles.noteViewImage}
                  resizeMode="cover"
                />
              </View>
            )}

            {!!noteViewItem?.noteText ? (
              <Text style={styles.noteViewText}>{noteViewItem.noteText}</Text>
            ) : (
              <Text style={styles.noteViewEmpty}>No note added.</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Note Modal ── */}
      <Modal
        visible={noteModalItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isSavingNote) handleCancelNote();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.scoreOverlay}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              if (!isSavingNote) handleCancelNote();
            }}
          />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={[styles.scoreModal, styles.noteModal]}>
            {/* Header */}
            <View style={styles.scoreModalHeader}>
              <View style={{flex: 1}}>
                <Text style={styles.scoreModalName}>Add Note</Text>
                <Text style={styles.scoreModalCost} numberOfLines={1}>
                  {noteModalItem?.name}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.scoreModalClose}
                onPress={handleCancelNote}
                disabled={isSavingNote}
              >
                <Entypo name="cross" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Banner / image picker */}
            <View style={styles.noteBannerWrap}>
              <BannerSectionV2
                image={noteMedia.local}
                remoteImage={noteModalItem?.noteImageUrl ?? null}
                preview={noteMedia.preview}
                onPick={noteMedia.pickImg}
              />
            </View>

            {/* Text area */}
            <TextInput
              style={styles.noteTextInput}
              placeholder="Add a note..."
              placeholderTextColor="#6B7280"
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSavingNote}
            />

            {/* Buttons */}
            <View style={[styles.scoreButtons, {marginTop: hp(2)}]}>
              <TouchableOpacity
                style={[styles.scoreCancelBtn, isSavingNote && {opacity: 0.4}]}
                onPress={handleCancelNote}
                disabled={isSavingNote}
              >
                <Text style={styles.scoreCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.scoreConfirmBtn,
                  styles.noteSaveBtn,
                  isSavingNote && styles.scoreConfirmBtnLoading,
                ]}
                onPress={handleSaveNote}
                disabled={isSavingNote || noteMedia.loading}
              >
                {isSavingNote ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <AntDesign name="check" size={16} color="#fff" />
                )}
                <Text style={styles.scoreConfirmText}>
                  {isSavingNote ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default HabitLinkItemsListV2;

const styles = StyleSheet.create({
  listWrap: {
    flex: 1,
    marginBottom: hp(1),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(1.5),
  },
  card: {
    position: "relative",
    width: wp(30),
    minHeight: hp(7),
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1.5,
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingTop: hp(1.5),
    paddingBottom: hp(1.5),
    justifyContent: "center",
  },
  cardName: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  cardCost: {
    color: "#facc15",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },
  infoBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: wp(2),
  },
  actionBtn: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(5),
    backgroundColor: Colors.filtertext,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnSuccess: {
    backgroundColor: "rgba(34, 197, 94, 0.8)",
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnDelete: {
    backgroundColor: "#ef4444",
  },
  actionBtnStarred: {
    backgroundColor: "#f59e0b",
  },
  scoreOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: wp(4),
  },
  scoreModal: {
    width: "100%",
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: wp(6),
    borderWidth: 1,
    borderColor: "#333333",
  },
  scoreModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2.5),
  },
  scoreModalName: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.white,
  },
  scoreModalCost: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 2,
  },
  scoreModalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(3),
  },
  scoreCurrentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp(3),
    borderRadius: 12,
    marginBottom: hp(3),
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  scoreCurrentLabel: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  scoreDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  scoreCurrentValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  scoreAiSection: {
    alignItems: "center",
    padding: wp(5),
    backgroundColor: "#1e1b4b",
    borderRadius: 14,
    marginBottom: hp(3),
    borderWidth: 1,
    borderColor: "#312e81",
  },
  scoreAiIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(2),
  },
  scoreAiTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E8E5FF",
    marginBottom: hp(1),
  },
  scoreAiDesc: {
    fontSize: 13,
    color: "#9B95C9",
    lineHeight: 20,
    textAlign: "center",
  },
  scoreAiDescScroll: {
    maxHeight: hp(15),
    width: "100%",
  },
  scoreButtons: {
    flexDirection: "row",
    gap: wp(2.5),
  },
  scoreCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreCancelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  scoreConfirmBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#7C3AED",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
  },
  scoreConfirmBtnLoading: {
    backgroundColor: "#5B21B6",
  },
  swapConfirmBtnFull: {
    flex: 0,
    width: "100%",
    marginBottom: hp(1.2),
  },
  swapAddCreditsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.4)",
    backgroundColor: "rgba(245,158,11,0.12)",
  },
  swapAddCreditsBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
  },
  scoreConfirmText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
  cardMeta: {
    color: "#9ca3af",
    fontSize: 10,
    marginTop: 2,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  swapCostRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 4,
  },
  swapCostTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#312e81",
  },
  swapInsufficientText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  noteModal: {
    maxHeight: "90%",
  },
  noteBannerWrap: {
    marginBottom: hp(2),
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333333",
  },
  noteTextInput: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    padding: wp(3),
    color: "#FFFFFF",
    fontSize: 14,
    minHeight: hp(12),
    lineHeight: 20,
  },
  noteSaveBtn: {
    backgroundColor: "#16a34a",
  },
  noteViewImage: {
    width: "100%",
    height: hp(20),
    borderRadius: 8,
  },
  noteViewText: {
    color: "#E0E0E0",
    fontSize: 14,
    lineHeight: 22,
    paddingTop: hp(1),
  },
  noteViewEmpty: {
    color: "#6B7280",
    fontSize: 14,
    fontStyle: "italic",
    paddingTop: hp(1),
  },

});
