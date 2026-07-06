import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";
import {
  HabitStackComponent,
  HabitStackMarketComponent,
} from "@/core/models/section-b";
import {selectScorerCostPerItem} from "@/core/redux/habit-intelligence-cost";
import {
  RevenueCatAction,
  selectRevenueCat,
} from "@/core/redux/user-revenue-cat";
import {decreaseRemainingCreditsByUserId} from "@/core/services/section-b";
import {
  countItemsForHabitStack,
  isHabitStackAIScored,
  showToastSuccess,
  truncateString,
} from "@/core/utils";
import {ensureMinTotalCost, formatCostDecimal} from "@/core/utils/utilities/totalCost";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useNavigation} from "@react-navigation/native";
import React, {useMemo, useState} from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import {useDispatch, useSelector} from "react-redux";
import {HabitStackPreview} from "../../..";
import AIModelSelector from "@/core/components/section-b/ai-model-selector/AIModelSelector";
import {
  selectAICompanies,
  selectDefaultSelection,
} from "@/core/redux/ai-models-cost-multiplier";

type Props = {
  name?: string;
  personsCount: number;
  expanded: boolean;
  canEdit?: boolean;
  setExpanded: (v: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClickOpenIcon2: () => void;
  sendToMarketInProgress?: (
    habitStackId: string,
  ) => Promise<HabitStackMarketComponent>;
  hideCalendar?: boolean;
  isHabitStack?: boolean;
  stack?: HabitStackComponent;
  onScoreComplete?: () => void;
  canAIScore?: boolean;
  hideChevron?: boolean;
  hideHabitStackCalendarOption?: boolean; // If true, the calendar option will be hidden for non-friends
};

const HeaderRight: React.FC<Props> = ({
  name,
  personsCount,
  expanded,
  setExpanded,
  onEdit,
  onDelete,
  canEdit = false,
  onClickOpenIcon2,
  hideCalendar = false,
  isHabitStack = false,
  stack,
  onScoreComplete,
  sendToMarketInProgress = async (
    habitStackId: string,
  ): Promise<HabitStackMarketComponent> => {
    console.log("Send to market in progress");
    return {} as HabitStackMarketComponent;
  },
  canAIScore = false,
  hideChevron = false,
  hideHabitStackCalendarOption = false,
}) => {
  // useState: For UI state controlled by user interactions
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // Add this
  const [showScoreConfirm, setShowScoreConfirm] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [localMarketOverride, setLocalMarketOverride] = useState<
    boolean | null
  >(null);

  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const revenueCat = useSelector((s: any) => selectRevenueCat(s));
  const userId: string =
    useSelector((s: any) => s?.user?.userdata?.collectdata?.userId)?.trim() ??
    "";
  const SCORER_COST_PER_ITEM = useSelector((s: any) =>
    selectScorerCostPerItem(s),
  );

  const companies = useSelector(selectAICompanies);
  const { companyName: defaultCompanyName, modelId: defaultModelId } = useSelector(selectDefaultSelection);

  const [scoreSelectedCompany, setScoreSelectedCompany] = useState(defaultCompanyName);
  const [scoreSelectedModelId, setScoreSelectedModelId] = useState(defaultModelId);
  const scoreModel = companies.flatMap(c => c.models).find(m => m.id === scoreSelectedModelId);
  const scoreAdjustedPerItem = SCORER_COST_PER_ITEM * (scoreModel?.noCapCostMultiplier ?? 1.0);
  const handleScoreCompanyChange = (companyName: string) => {
    setScoreSelectedCompany(companyName);
    const models = (companies.find(c => c.name === companyName)?.models ?? [])
      .filter(m => m.isVisible !== false);
    const defaultModel = models.find(m => m.isDefault) ?? models[0];
    setScoreSelectedModelId(defaultModel?.id);
  };

  // useMemo: For computed/derived values from props (and local state)
  const isStackInMarket = useMemo(() => {
    if (localMarketOverride !== null) {
      return localMarketOverride;
    }
    return (
      stack?.marketInProgress ||
      stack?.marketPending ||
      stack?.marketPublished ||
      stack?.isMarketOwned ||
      false
    );
  }, [
    stack?.marketInProgress,
    stack?.marketPending,
    stack?.marketPublished,
    stack?.isMarketOwned,
    localMarketOverride,
  ]);

  // Add this function
  const handleInfoClick = () => {
    setMenuOpen(false);
    setTimeout(() => {
      setShowPreview(true);
    }, 400);
  };

  // Add this function
  const handlePreviewClose = (obj: string) => {
    setShowPreview(false);
  };

  const runAiScorer = async (stackId: string, modelId: string) => {
    const aiOn =
      (
        process.env.EXPO_PUBLIC_FEATURE_FLAG_AI_SCORER_HABITSTACK_ON ?? "FALSE"
      ).toUpperCase() === "TRUE";
    if (aiOn) {
      const url = `${process.env.EXPO_PUBLIC_API_NOCAP_AI}/ai/scorer/habit-stack/${stackId}?model=${modelId}`;
      await fetch(url, { method: "PUT", headers: { accept: "*/*" } });
    } else {
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  };

  const deductCredits = async (totalCost: number): Promise<boolean> => {
    const { data: record, status } = await decreaseRemainingCreditsByUserId(
      userId,
      totalCost,
    );
    if (status >= 200 && status < 300 && record) {
      dispatch(RevenueCatAction.subtractCredits(totalCost));
      return true;
    }
    return false;
  };

  const handleScoreConfirm = async () => {
    const itemCount = countItemsForHabitStack(stack);
    const totalCost = ensureMinTotalCost(itemCount * scoreAdjustedPerItem);
    if ((revenueCat?.remainingCredits ?? 0) < totalCost) return;
    setIsScoring(true);
    try {
      const stackId = stack?.documentId ?? stack?.id ?? "";
      await runAiScorer(stackId, scoreSelectedModelId);
      const deducted = await deductCredits(totalCost);
      if (deducted) onScoreComplete?.();
    } finally {
      setIsScoring(false);
      setShowScoreConfirm(false);
    }
  };

  const handleEditClick = () => {
    setMenuOpen(false);
    setTimeout(() => {
      onEdit();
    }, 400);
  };

  const handleDeleteClick = () => {
    setMenuOpen(false);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    setTimeout(() => {
      onDelete();
    }, 400);
  };

  const handleSendToMarket = async () => {
    setMenuOpen(false);
    if (stack?.id) {
      setLocalMarketOverride(true);
      try {
        const response: HabitStackMarketComponent =
          await sendToMarketInProgress(stack.id);
        if (response.marketInProgress === true) {
          showToastSuccess("Habit Stack sent to Market In Progress");
          console.log("Habit Stack marked as Market In Progress");
          stack.marketInProgress = true;
          setLocalMarketOverride(null);
        } else {
          setLocalMarketOverride(null);
        }
      } catch (error) {
        setLocalMarketOverride(null);
        console.error("Failed to send to market:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <View style={s.titleRow}>
      {/* Title + people */}
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1, minWidth: 0 }}>
        <Text
          style={[MainStyles.text16Simple, { flex: 1 }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {truncateString(name || "", 20)}
        </Text>
        <View style={[s.personPill, { marginLeft: 6, flexShrink: 0 }]}>
          <MaterialIcons name="person-outline" size={16} color={Colors.white} />
          <View style={s.personCount}>
            <Text style={MainStyles.text8}>{personsCount}</Text>
          </View>
        </View>
      </View>

      {/* Menu + expand */}
      <View style={{ flexDirection: "row", alignItems: "center", flexShrink: 0, marginLeft: 6 }}>
        <Pressable onPress={() => setMenuOpen(true)}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color={Colors.white}
          />
        </Pressable>

        {canEdit && (
          <View style={s.ctrl}>
            <TouchableOpacity onPress={() => setShowScoreConfirm(true)}>
              <MaterialCommunityIcons
                name="creation"
                size={15}
                color={isHabitStackAIScored(stack) ? "#f59e0b" : Colors.white}
              />
            </TouchableOpacity>
          </View>
        )}

        {!hideChevron && (
          <Pressable style={s.ctrl} onPress={() => setExpanded(!expanded)}>
            <MaterialIcons
              name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up"}
              size={24}
              color={Colors.white}
            />
          </Pressable>
        )}
      </View>

      {/* HabitStackPreview */}
      <HabitStackPreview
        rnsheet={showPreview}
        canEdit={canEdit}
        dataitem={stack}
        closefun={handlePreviewClose}
      />

      {/* Score Confirm Modal */}
      <Modal
        visible={showScoreConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isScoring) setShowScoreConfirm(false);
        }}
      >
        <TouchableOpacity
          style={s.scoreOverlay}
          activeOpacity={1}
          onPress={() => {
            if (!isScoring) setShowScoreConfirm(false);
          }}
        >
          <TouchableOpacity
            style={s.scoreModal}
            activeOpacity={1}
            onPress={() => {}}
          >
            {/* Header */}
            <View style={s.scoreModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.scoreModalName}>{stack?.name}</Text>
              </View>
              <TouchableOpacity
                style={s.scoreModalClose}
                onPress={() => setShowScoreConfirm(false)}
                disabled={isScoring}
              >
                <Entypo name="cross" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Current score */}
            <View
              style={[
                s.scoreCurrentRow,
                {
                  borderColor:
                    stack?.scoreComponent?.scoreInfo?.color?.toLowerCase?.() ??
                    Colors.borderline,
                },
              ]}
            >
              <Text style={s.scoreCurrentLabel}>Current score</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={[
                    s.scoreDot,
                    {
                      backgroundColor:
                        stack?.scoreComponent?.scoreInfo?.color?.toLowerCase?.() ??
                        "#6B7280",
                    },
                  ]}
                />
                <Text
                  style={[
                    s.scoreCurrentValue,
                    {
                      color:
                        stack?.scoreComponent?.scoreInfo?.color?.toLowerCase?.() ??
                        "#6B7280",
                    },
                  ]}
                >
                  {stack?.scoreComponent?.scoreInfo?.label ?? "Unknown"}
                </Text>
              </View>
            </View>

            {/* Your credits row */}
            <View style={s.scoreCurrentRow}>
              <Text style={s.scoreCurrentLabel}>Your credits</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <MaterialIcons name="bolt" size={16} color="#f59e0b" />
                <Text style={[s.scoreCurrentValue, { color: "#f59e0b" }]}>
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

            {/* NocapAI prompt + cost breakdown */}
            <View style={s.scoreAiSection}>
              <View style={s.scoreAiIconWrap}>
                <MaterialCommunityIcons
                  name="creation"
                  size={24}
                  color="#fff"
                />
              </View>
              <Text style={s.scoreAiTitle}>Score with NocapAI</Text>
              <Text style={s.scoreAiDesc}>
                {"Would you like "}
                <Text style={{ fontWeight: "700", color: "#A78BFA" }}>
                  NocapAI
                </Text>
                {" to analyze and score all items in "}
                <Text style={{ fontWeight: "700", color: "#E0E0E0" }}>
                  "{stack?.name}"
                </Text>
                {" for you?"}
              </Text>

              <View style={[s.swapCostRow, { marginTop: 12 }]}>
                <Text style={s.scoreAiDesc}>Items</Text>
                <Text style={[s.scoreAiDesc, { color: "#E0E0E0" }]}>
                  {countItemsForHabitStack(stack)}
                </Text>
              </View>
              <View style={s.swapCostRow}>
                <Text style={s.scoreAiDesc}>Cost per item</Text>
                <Text style={[s.scoreAiDesc, { color: "#E0E0E0" }]}>
                  {formatCostDecimal(scoreAdjustedPerItem)} credits
                </Text>
              </View>
              <View style={s.swapCostTotalRow}>
                <Text
                  style={[
                    s.scoreAiDesc,
                    { fontWeight: "700", color: "#E8E5FF" },
                  ]}
                >
                  Total
                </Text>
                <Text
                  style={[
                    s.scoreAiDesc,
                    { fontWeight: "700", color: "#A78BFA" },
                  ]}
                >
                  {formatCostDecimal(ensureMinTotalCost(countItemsForHabitStack(stack) * scoreAdjustedPerItem))}{" "}
                  credits
                </Text>
              </View>

              {(revenueCat?.remainingCredits ?? 0) <
                countItemsForHabitStack(stack) * scoreAdjustedPerItem &&
                !isScoring && (
                  <Text style={s.swapInsufficientText}>
                    Insufficient credits. Please top up to continue.
                  </Text>
                )}
            </View>

            {/* Buttons — sufficient credits */}
            {((revenueCat?.remainingCredits ?? 0) >=
              countItemsForHabitStack(stack) * scoreAdjustedPerItem ||
              isScoring) && (
              <View style={s.scoreButtons}>
                <TouchableOpacity
                  style={[s.scoreCancelBtn, isScoring && { opacity: 0.4 }]}
                  onPress={() => setShowScoreConfirm(false)}
                  disabled={isScoring}
                >
                  <Text style={s.scoreCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    s.scoreConfirmBtn,
                    isScoring && s.scoreConfirmBtnLoading,
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
                  <Text style={s.scoreConfirmText}>
                    {isScoring ? "Scoring..." : "Score with NocapAI"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Buttons — insufficient credits */}
            {(revenueCat?.remainingCredits ?? 0) <
              countItemsForHabitStack(stack) * scoreAdjustedPerItem &&
              !isScoring && (
                <View style={s.scoreButtons}>
                  <TouchableOpacity
                    style={s.scoreCancelBtn}
                    onPress={() => setShowScoreConfirm(false)}
                  >
                    <Text style={s.scoreCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={s.swapAddCreditsBtn}
                    onPress={() => {
                      setShowScoreConfirm(false);
                      navigation.navigate("account");
                    }}
                  >
                    <MaterialIcons name="bolt" size={16} color="#f59e0b" />
                    <Text style={s.swapAddCreditsBtnText}>Add Credits</Text>
                  </TouchableOpacity>
                </View>
              )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Menu Modal */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={s.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={s.menuModal}>
            {
              <TouchableOpacity style={s.menuItem} onPress={handleInfoClick}>
                <MaterialIcons name="info" size={20} color={Colors.white} />
                <Text style={s.menuItemText}>Info</Text>
              </TouchableOpacity>
            }

            {<View style={s.menuDivider} />}

            {!hideCalendar && !hideHabitStackCalendarOption && (
              <TouchableOpacity
                style={s.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  onClickOpenIcon2();
                }}
              >
                <FontAwesome5
                  name="calendar-alt"
                  size={20}
                  color={Colors.white}
                />
                <Text style={s.menuItemText}>Habit Stack Calendar</Text>
              </TouchableOpacity>
            )}

            {!hideCalendar && <View style={s.menuDivider} />}

            {canEdit && (
              <TouchableOpacity style={s.menuItem} onPress={handleEditClick}>
                <MaterialIcons name="edit" size={20} color={Colors.white} />
                <Text style={s.menuItemText}>Edit</Text>
              </TouchableOpacity>
            )}

            {canEdit && <View style={s.menuDivider} />}

            {canEdit && (
              <TouchableOpacity
                style={[s.menuItem, isStackInMarket && s.menuItemDisabled]}
                onPress={isStackInMarket ? undefined : handleDeleteClick}
                disabled={isStackInMarket}
              >
                <MaterialIcons
                  name="delete"
                  size={20}
                  color={isStackInMarket ? Colors.gray : Colors.red}
                />
                <Text
                  style={[
                    s.menuItemText,
                    { color: isStackInMarket ? Colors.gray : Colors.red },
                  ]}
                >
                  {isStackInMarket
                    ? "To Delete, Please remove from Market"
                    : "Delete"}
                </Text>
              </TouchableOpacity>
            )}

            {canEdit && <View style={s.menuDivider} />}

            {canEdit && isHabitStack && !isStackInMarket && (
              <TouchableOpacity style={s.menuItem} onPress={handleSendToMarket}>
                <MaterialIcons name="mail" size={20} color={Colors.blue} />
                <Text style={[s.menuItemText, { color: Colors.blue }]}>
                  Send To Market
                </Text>
              </TouchableOpacity>
            )}

            {canEdit && isHabitStack && isStackInMarket && (
              <TouchableOpacity style={s.menuItem}>
                <MaterialIcons name="check" size={20} color={Colors.green} />
                <Text style={[s.menuItemText, { color: Colors.green }]}>
                  Already in Market
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={s.deleteModalOverlay}>
          <View style={s.deleteModal}>
            <View style={s.deleteIconContainer}>
              <AntDesign
                name="exclamation-circle"
                size={50}
                color={Colors.red}
              />
            </View>

            <Text style={s.deleteTitle}>Delete Habit Stack</Text>
            <Text style={s.deleteMessage}>
              Are you sure you want to delete{" "}
              <Text style={s.deleteItemName}>{name}</Text>?
            </Text>
            <Text style={s.deleteWarning}>This action cannot be undone.</Text>

            <View style={s.deleteButtons}>
              <TouchableOpacity
                style={[s.deleteButton, s.cancelButton]}
                onPress={handleCancelDelete}
              >
                <Text style={s.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.deleteButton, s.confirmButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={s.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const s = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  personPill: {
    backgroundColor: Colors.text_background,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 999,
  },
  personCount: {
    position: "absolute",
    right: -6,
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.colorred,
    alignItems: "center",
    justifyContent: "center",
  },
  ctrl: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuModal: {
    backgroundColor: Colors.content_back,
    borderRadius: 12,
    width: wp(50),
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuItemText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "regular",
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.borderline,
    marginHorizontal: 8,
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
  scoreConfirmText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
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
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModal: {
    backgroundColor: Colors.content_back,
    borderRadius: 16,
    width: wp(85),
    padding: wp(6),
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.red,
  },
  deleteIconContainer: {
    marginBottom: hp(2),
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: hp(1),
    textAlign: "center",
  },
  deleteMessage: {
    fontSize: 16,
    color: Colors.text_color,
    textAlign: "center",
    marginBottom: hp(0.5),
  },
  deleteItemName: {
    color: Colors.white,
    fontWeight: "600",
  },
  deleteWarning: {
    fontSize: 14,
    color: Colors.red,
    textAlign: "center",
    marginBottom: hp(3),
  },
  deleteButtons: {
    flexDirection: "row",
    gap: wp(3),
    width: "100%",
  },
  deleteButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.content_back,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  cancelButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: Colors.red,
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HeaderRight;
