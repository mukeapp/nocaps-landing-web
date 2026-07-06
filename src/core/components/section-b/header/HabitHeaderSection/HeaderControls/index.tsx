import React, {useState} from "react";
import AIModelSelector from "@/core/components/section-b/ai-model-selector/AIModelSelector";
import {
  selectAICompanies,
  selectDefaultSelection,
} from "@/core/redux/ai-models-cost-multiplier";
import {
  ActivityIndicator,
  Modal,
  Platform,
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

const isWeb = Platform.OS === "web";

import {Colors} from "@/core/constants/Colors";
import {HabitComponent, RouterData} from "@/core/models/section-b";
import {
  selectScorerCostPerItem,
  selectSwapCostPerItem,
} from "@/core/redux/habit-intelligence-cost";
import {
  RevenueCatAction,
  selectRevenueCat,
} from "@/core/redux/user-revenue-cat";
import {decreaseRemainingCreditsByUserId} from "@/core/services/section-b";
import {
  countItemsForHabit,
  isHabitAIScored,
} from "@/core/utils/utilities/habitUtils";
import {ensureMinTotalCost, formatCostDecimal} from "@/core/utils/utilities/totalCost";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {HabitPreview} from "../../..";

type Props = {
  expanded: boolean;
  onToggleExpand: () => void;
  // dynamic color for the "sync" button background (e.g. score color)
  accentColor: string;
  isOptionalsVisible?: boolean; // if true, the whole control set is optional (not shown in minimal mode)
  onClickOpenIcon3: () => void;
  hideCalendar?: boolean;
  habit?: HabitComponent;
  canEdit?: boolean;
  canGoToSwapScreen?: boolean;
  onScoreComplete?: () => void;
  costSymbol?: string;
};

const HeaderControls: React.FC<Props> = ({
  expanded,
  onToggleExpand,
  accentColor,
  isOptionalsVisible = false,
  onClickOpenIcon3,
  hideCalendar = false,
  habit = {} as HabitComponent,
  canEdit = false,
  canGoToSwapScreen = false,
  onScoreComplete,
  costSymbol = "",
}) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const userdata = useSelector((s: any) => s?.user?.userdata);
  const userId: string =
    useSelector((s: any) => s?.user?.userdata?.collectdata?.userId)?.trim() ??
    "";
  const revenueCat = useSelector((s: any) => selectRevenueCat(s));
  const SWAP_COST_PER_ITEM = useSelector((s: any) => selectSwapCostPerItem(s));
  const SCORER_COST_PER_ITEM = useSelector((s: any) =>
    selectScorerCostPerItem(s),
  );

  canEdit = canEdit || userdata?.collectdata?.userId === habit?.userId;

  const [menuOpen, setMenuOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showScoreConfirm, setShowScoreConfirm] = useState(false);
  const [showSwapConfirm, setShowSwapConfirm] = useState(false);
  const [isScoring, setIsScoring] = useState(false);

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

  const [swapSelectedCompany, setSwapSelectedCompany] = useState(defaultCompanyName);
  const [swapSelectedModelId, setSwapSelectedModelId] = useState(defaultModelId);
  const swapModel = companies.flatMap(c => c.models).find(m => m.id === swapSelectedModelId);
  const swapAdjustedPerItem = SWAP_COST_PER_ITEM * (swapModel?.noCapCostMultiplier ?? 1.0);
  const handleSwapCompanyChange = (companyName: string) => {
    setSwapSelectedCompany(companyName);
    const models = (companies.find(c => c.name === companyName)?.models ?? [])
      .filter(m => m.isVisible !== false);
    const defaultModel = models.find(m => m.isDefault) ?? models[0];
    setSwapSelectedModelId(defaultModel?.id);
  };

  const navigateToSwapHabit = (habit: HabitComponent, modelId: string) => {
    const routerData: RouterData = {
      habit: habit,
      modelId,
      costSymbol,
    };

    navigation.navigate("swap-habit", {
      originScreen: "Habit-Component",
      destinationScreenTitle: "",
      routeData: routerData,
    });
  };

  const handleGoToSwapScreen = async (_item: HabitComponent) => {
    setShowSwapConfirm(true);
  };

  const handleSwapConfirm = async () => {
    const itemCount = countItemsForHabit(habit);
    const totalCost = ensureMinTotalCost(itemCount * swapAdjustedPerItem);
    setShowSwapConfirm(false);
    const { data: record, status } = await decreaseRemainingCreditsByUserId(
      userId,
      totalCost,
    );
    if (status >= 200 && status < 300 && record) {
      dispatch(RevenueCatAction.subtractCredits(totalCost));
      navigateToSwapHabit(habit, swapSelectedModelId);
    }
  };

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

  const runAiScorer = async (habitId: string, modelId: string) => {
    const aiOn =
      (
        process.env.EXPO_PUBLIC_FEATURE_FLAG_AI_SCORER_HABIT_ON ?? "FALSE"
      ).toUpperCase() === "TRUE";
    if (aiOn) {
      const url = `${process.env.EXPO_PUBLIC_API_NOCAP_AI}/ai/scorer/habit/${habitId}?model=${modelId}`;
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
    const itemCount = countItemsForHabit(habit);
    const totalCost = ensureMinTotalCost(itemCount * scoreAdjustedPerItem);
    if ((revenueCat?.remainingCredits ?? 0) < totalCost) return;
    setIsScoring(true);
    try {
      const habitId = habit.documentId ?? habit.id ?? "";
      await runAiScorer(habitId, scoreSelectedModelId);
      const deducted = await deductCredits(totalCost);
      if (deducted) onScoreComplete?.();
    } finally {
      setIsScoring(false);
      setShowScoreConfirm(false);
    }
  };

  return (
    <View style={s.controls}>
      {/* Explore (compass) */}
      {/* <View style={s.ctrlWhite}>
        <SimpleLineIcons name="compass" size={14} color="black" />
      </View> */}

      {/* Sync (arrow-swap) with dynamic background */}

      {canEdit && canGoToSwapScreen && (
        <View>
          <TouchableOpacity
            style={[s.ctrlWhite, { backgroundColor: accentColor }]}
            onPress={() => handleGoToSwapScreen(habit)}
          >
            <Fontisto name="arrow-swap" size={17} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}

      {canEdit && canGoToSwapScreen && (
        <View style={s.ctrl}>
          <TouchableOpacity onPress={() => setShowScoreConfirm(true)}>
            <MaterialCommunityIcons
              name="creation"
              size={15}
              color={isHabitAIScored(habit) ? "#f59e0b" : Colors.white}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Expand (3 dots) */}
      {
        <View style={s.ctrl}>
          <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      }

      {isOptionalsVisible && (
        <View>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Chevron toggle */}
      <Pressable style={s.ctrl} onPress={onToggleExpand}>
        <MaterialIcons
          name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up"}
          size={24}
          color={Colors.white}
        />
      </Pressable>

      {/* Add HabitStackPreview */}
      <HabitPreview
        rnsheet={showPreview}
        canEdit={canEdit}
        dataitem={habit}
        closefun={handlePreviewClose}
      />

      {/* Swap Confirm Modal */}
      <Modal
        visible={showSwapConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSwapConfirm(false)}
      >
        <TouchableOpacity
          style={s.scoreOverlay}
          activeOpacity={1}
          onPress={() => setShowSwapConfirm(false)}
        >
          <TouchableOpacity
            style={s.scoreModal}
            activeOpacity={1}
            onPress={() => {}}
          >
            {/* Header */}
            <View style={s.scoreModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.scoreModalName}>Confirm Swap</Text>
                <Text style={s.scoreCurrentLabel}>{habit?.name}</Text>
              </View>
              <TouchableOpacity
                style={s.scoreModalClose}
                onPress={() => setShowSwapConfirm(false)}
              >
                <Entypo name="cross" size={16} color="#6B7280" />
              </TouchableOpacity>
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
              selectedCompany={swapSelectedCompany}
              selectedModelId={swapSelectedModelId}
              onCompanyChange={handleSwapCompanyChange}
              onModelChange={setSwapSelectedModelId}
            />

            {/* Cost breakdown */}
            <View style={s.scoreAiSection}>
              <View style={s.scoreAiIconWrap}>
                <MaterialIcons name="swap-horiz" size={24} color="#fff" />
              </View>
              <Text style={s.scoreAiTitle}>Swap Cost</Text>

              <View style={s.swapCostRow}>
                <Text style={s.scoreAiDesc}>Items</Text>
                <Text style={[s.scoreAiDesc, { color: "#E0E0E0" }]}>
                  {countItemsForHabit(habit)}
                </Text>
              </View>
              <View style={s.swapCostRow}>
                <Text style={s.scoreAiDesc}>Cost per item</Text>
                <Text style={[s.scoreAiDesc, { color: "#E0E0E0" }]}>
                  {formatCostDecimal(swapAdjustedPerItem)} credits
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
                  {formatCostDecimal(ensureMinTotalCost(countItemsForHabit(habit) * swapAdjustedPerItem))} credits
                </Text>
              </View>

              {(revenueCat?.remainingCredits ?? 0) <
                countItemsForHabit(habit) * swapAdjustedPerItem && (
                <Text style={s.swapInsufficientText}>
                  Insufficient credits. Please top up to continue.
                </Text>
              )}
            </View>

            {/* Sufficient credits — Swap button */}
            {(revenueCat?.remainingCredits ?? 0) >=
              countItemsForHabit(habit) * swapAdjustedPerItem && (
              <TouchableOpacity
                style={[s.scoreConfirmBtn, s.swapConfirmBtnFull]}
                onPress={handleSwapConfirm}
              >
                <MaterialIcons name="swap-horiz" size={16} color="#fff" />
                <Text style={s.scoreConfirmText}>
                  Swap — {formatCostDecimal(ensureMinTotalCost(countItemsForHabit(habit) * swapAdjustedPerItem))}{" "}
                  credits
                </Text>
              </TouchableOpacity>
            )}

            {/* Insufficient — Cancel + Add Credits */}
            {(revenueCat?.remainingCredits ?? 0) <
              countItemsForHabit(habit) * swapAdjustedPerItem && (
              <View style={s.scoreButtons}>
                <TouchableOpacity
                  style={s.scoreCancelBtn}
                  onPress={() => setShowSwapConfirm(false)}
                >
                  <Text style={s.scoreCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.swapAddCreditsBtn}
                  onPress={() => {
                    setShowSwapConfirm(false);
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
                <Text style={s.scoreModalName}>{habit?.name}</Text>
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
                    habit?.scoreComponent?.scoreInfo?.color?.toLowerCase?.() ??
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
                        habit?.scoreComponent?.scoreInfo?.color?.toLowerCase?.() ??
                        "#6B7280",
                    },
                  ]}
                />
                <Text
                  style={[
                    s.scoreCurrentValue,
                    {
                      color:
                        habit?.scoreComponent?.scoreInfo?.color?.toLowerCase?.() ??
                        "#6B7280",
                    },
                  ]}
                >
                  {habit?.scoreComponent?.scoreInfo?.label ?? "Unknown"}
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
                  "{habit?.name}"
                </Text>
                {" for you?"}
              </Text>

              <View style={[s.swapCostRow, { marginTop: 12 }]}>
                <Text style={s.scoreAiDesc}>Items</Text>
                <Text style={[s.scoreAiDesc, { color: "#E0E0E0" }]}>
                  {countItemsForHabit(habit)}
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
                  {formatCostDecimal(ensureMinTotalCost(countItemsForHabit(habit) * scoreAdjustedPerItem))} credits
                </Text>
              </View>

              {(revenueCat?.remainingCredits ?? 0) <
                countItemsForHabit(habit) * scoreAdjustedPerItem &&
                !isScoring && (
                  <Text style={s.swapInsufficientText}>
                    Insufficient credits. Please top up to continue.
                  </Text>
                )}
            </View>

            {/* Buttons — sufficient credits */}
            {((revenueCat?.remainingCredits ?? 0) >=
              countItemsForHabit(habit) * scoreAdjustedPerItem ||
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
              countItemsForHabit(habit) * scoreAdjustedPerItem &&
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

            {!hideCalendar && (
              <TouchableOpacity
                style={s.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  onClickOpenIcon3();
                }}
              >
                <FontAwesome5
                  name="calendar-alt"
                  size={20}
                  color={Colors.white}
                />
                <Text style={s.menuItemText}>Habit Calendar</Text>
              </TouchableOpacity>
            )}

            {!hideCalendar && <View style={s.menuDivider} />}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const s = StyleSheet.create({
  controls: { flexDirection: "row", alignItems: "center" },
  ctrl: {
    width: isWeb ? 30 : wp("6.5%"),
    height: isWeb ? 30 : wp("6.5%"),
    borderRadius: isWeb ? 15 : wp("7%"),
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: isWeb ? 6 : wp("1%"),
  },
  ctrlWhite: {
    width: isWeb ? 30 : wp("6.5%"),
    height: isWeb ? 30 : wp("6.5%"),
    borderRadius: isWeb ? 15 : wp("7%"),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: isWeb ? 6 : wp("1%"),
    backgroundColor: Colors.white, // will be overridden for the sync button
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
    width: isWeb ? 240 : wp(50),
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
  swapConfirmBtnFull: {
    flex: 0,
    width: "100%",
    marginBottom: hp(1.2),
  },
  swapCostRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    width: "100%",
    marginTop: 4,
  },
  swapCostTotalRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
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
    textAlign: "center" as const,
  },
  swapAddCreditsBtn: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: wp(2),
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.4)",
    backgroundColor: "rgba(245,158,11,0.12)",
  },
  swapAddCreditsBtnText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#f59e0b",
  },
});

export default HeaderControls;
