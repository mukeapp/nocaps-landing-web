import React, {useState} from "react";
import AIModelSelector from "@/core/components/section-b/ai-model-selector/AIModelSelector";
import {
  selectAICompanies,
  selectDefaultSelection,
} from "@/core/redux/ai-models-cost-multiplier";
import {
  ActivityIndicator,
  Image,
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
  fs,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";

import {
  Banner,
  HabitLinkPreview,
  LinearProgress,
} from "@/core/components/section-b";
import {HabitLinkDetailSheet} from "@/core/components/section-d";
import {Colors} from "@/core/constants/Colors";
import {Images} from "@/core/constants/Images";
import {MainStyles} from "@/core/constants/styles";
import {IUser} from "@/core/models/section-a";
import {HabitLinkComponent, RouterData} from "@/core/models/section-b";
import {
  selectScorerCostPerItem,
  selectSwapCostPerItem,
} from "@/core/redux/habit-intelligence-cost";
import {
  RevenueCatAction,
  selectRevenueCat,
} from "@/core/redux/user-revenue-cat";
import {fetchUserByUserId} from "@/core/services/section-a/user";
import {decreaseRemainingCreditsByUserId} from "@/core/services/section-b";
import {isHabitLinkAIScored} from "@/core/utils/utilities/habitUtils";
import {ensureMinTotalCost, formatCostDecimal} from "@/core/utils/utilities/totalCost";
import {
  formatCost,
  formatCostAsNumber,
} from "@/core/utils/utilities/numberUtils";
import {truncateString} from "@/core/utils/utilities/string";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";

type Props = {
  showCopyButton?: boolean;
  showCopyButtonText?: string;
  onCopyPress?: (id: string, parentId: string, dataType: string) => void;
  showHabitLinkBanner?: boolean;
  habitLink: HabitLinkComponent;
  name: string;
  cost?: number;
  progress?: number;
  progressColor?: string;
  iconSource: any;
  onOpen?: () => void;
  costSymbol?: string;
  hideCalendar?: boolean;
  goToHabitLinkCalendar?: () => void;
  showHabitLinkNav?: boolean;
  expanded?: boolean;
  setExpanded?: (expanded: boolean) => void;
  showExpandedButton?: boolean;
  isHabitCalendar?: boolean;
  btnCalendarText?: string;
  canEdit?: boolean;
  selectedMarketActionId?: number;
  marketOwnerId?: string;
  //goToSwapScreen?: (item: HabitLinkComponent) => void;
  canGoToSwapScreen?: boolean;
  showBottomUpSheetItemList?: boolean;
  onScoreComplete?: () => void;
  canAIScore?: boolean;
  ScreenOrigin?: string; // for analytics, e.g. "HabitLinkItemRow" or "HabitLinkCard"
};

const HabitLinkItemRow: React.FC<Props> = ({
  showCopyButton = false,
  showCopyButtonText = "Copy",
  onCopyPress = (id: string, parentId: string, dataType: string) =>
    console.log("Copy pressed"),
  showHabitLinkBanner = false,
  habitLink,
  name,
  cost = 0,
  progress = 0,
  progressColor,
  iconSource,
  onOpen,
  costSymbol = "",
  hideCalendar = false,
  goToHabitLinkCalendar = () => {
    console;
  },
  showHabitLinkNav = true,
  expanded = false,
  setExpanded,
  showExpandedButton = false,
  isHabitCalendar = false,
  btnCalendarText = "+ Calendar Data",
  canEdit = false,
  selectedMarketActionId = 0,
  marketOwnerId = "",
  // goToSwapScreen = async (item: HabitLinkComponent) => {
  //   console.log("Go to swap screen not implemented");
  // },
  canGoToSwapScreen = false,
  showBottomUpSheetItemList = false,
  onScoreComplete,
  canAIScore = false,
  ScreenOrigin = "UNKNOWN",
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

  const [liveUsername, setLiveUsername] = useState("");

  const [liveUser, setLiveUser] = useState<IUser>({});

  const [menuOpen, setMenuOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showLinkDetail, setShowLinkDetail] = useState(false);
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

  canEdit = canEdit || userdata?.collectdata?.userId === habitLink?.userId;

  const navigateToSwapHabitLink = (
    habitLinkItemComponent: HabitLinkComponent,
    modelId: string,
  ) => {
    const routerData: RouterData = {
      habitLink: habitLink,
      modelId,
      costSymbol,
    };

    navigation.navigate("swap-habit-link", {
      originScreen: "HabitLinkItemRow-Component",
      destinationScreenTitle: "",
      routeData: routerData,
    });
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

  const runAiScorer = async (linkId: string, modelId: string) => {
    const aiOn =
      (
        process.env.EXPO_PUBLIC_FEATURE_FLAG_AI_SCORER_HABITLINK_ON ?? "FALSE"
      ).toUpperCase() === "TRUE";
    if (aiOn) {
      const url = `${process.env.EXPO_PUBLIC_API_NOCAP_AI}/ai/scorer/habit-link/${linkId}?model=${modelId}`;
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
    const itemCount = habitLink?.habitLinkItemComponentsData?.length ?? 0;
    const totalCost = ensureMinTotalCost(itemCount * scoreAdjustedPerItem);
    if ((revenueCat?.remainingCredits ?? 0) < totalCost) return;
    setIsScoring(true);
    try {
      const linkId = habitLink.documentId ?? habitLink.id ?? "";
      await runAiScorer(linkId, scoreSelectedModelId);
      const deducted = await deductCredits(totalCost);
      if (deducted) onScoreComplete?.();
    } finally {
      setIsScoring(false);
      setShowScoreConfirm(false);
    }
  };

  const handleGoToSwapScreen = async (_item: HabitLinkComponent) => {
    setShowSwapConfirm(true);
  };

  const handleSwapConfirm = async () => {
    const itemCount = habitLink?.habitLinkItemComponentsData?.length ?? 0;
    const totalCost = ensureMinTotalCost(itemCount * swapAdjustedPerItem);
    setShowSwapConfirm(false);
    const { data: record, status } = await decreaseRemainingCreditsByUserId(
      userId,
      totalCost,
    );
    if (status >= 200 && status < 300 && record) {
      dispatch(RevenueCatAction.subtractCredits(totalCost));
      navigateToSwapHabitLink(habitLink, swapSelectedModelId);
    }
  };

  React.useEffect(() => {
    const loadUser = async () => {
      const userId =
        selectedMarketActionId === 4
          ? marketOwnerId || habitLink?.userId
          : habitLink?.userId;
      // console.log("Reloading user for stack:", stack);
      const user = await fetchUserByUserId(userId ?? "");
      // console.log("Fetched user:", user);
      setLiveUser(user);
      if (user?.username) {
        setLiveUsername(user.username);
      } else [setLiveUsername("Unknown User")];
    };

    loadUser();
  }, [habitLink?.userId]);

  return (
    <View>
      {showHabitLinkBanner && (
        // <ImageBackground
        //   source={
        //     habitLink?.bannerImage
        //       ? { uri: habitLink?.bannerImage }
        //       : Images.default_banner_000
        //   }
        //   resizeMode="cover"
        //   style={styles.hero}
        //   imageStyle={{ borderRadius: wp(3) }}
        // >
        //   <View style={{ flexDirection: "row", alignItems: "center" }}>
        //     <Image
        //       source={Images.profile}
        //       resizeMode="contain"
        //       style={styles.avatar}
        //     />
        //     <Text style={MainStyles.text16white}>{liveUsername}</Text>
        //   </View>
        // </ImageBackground>
        <Banner
          dataType="habit-link"
          bannerImage={habitLink?.bannerImage}
          showCopyButton={showCopyButton}
          showCopyButtonText={showCopyButtonText}
          onCopyPress={onCopyPress}
          username={liveUsername}
          data={habitLink}
          userProfileImage={liveUser ? liveUser?.photo || "" : ""}
          user={liveUser}
        />
      )}
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.iconWrap}>
            <Image
              source={iconSource}
              resizeMode="contain"
              style={styles.icon}
            />
            <TouchableOpacity style={styles.fileBadge} onPress={onOpen}>
              <Image
                source={Images.file}
                resizeMode="contain"
                style={styles.fileIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.meta}>
            <Text style={MainStyles.text10semibold}>
              {truncateString(name ?? "", 18)}
            </Text>
            <View style={{ marginTop: hp("0.4%") }}>
              <LinearProgress
                progress={
                  progress < 1
                    ? formatCostAsNumber(progress * 100, false)
                    : formatCostAsNumber(progress, false)
                }
                backgroundColor="#ddd"
                progressColor={progressColor ?? Colors.inputback}
              />
            </View>
            <View style={styles.badge}>
              <Text style={MainStyles.text12semibold}>
                {costSymbol}
                {cost ? formatCost(cost, true) : formatCost(cost, true)}
              </Text>
            </View>
          </View>
        </View>

        {/* habitLink small banner image */}
        {/* <View style={styles.banner}>
        <Image source={Images.banner} resizeMode="contain" style={styles.bannerImage} />
      </View> */}

        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            gap: isWeb ? 8 : wp("2%"),
          }}
        >
          {
            <View style={styles.openBtn2}>
              <TouchableOpacity onPress={() => setMenuOpen(true)}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </View>
          }
          {canEdit && canGoToSwapScreen && (
            <TouchableOpacity
              style={[
                MainStyles.sheeticon,
                isWeb && { width: 36, height: 36, borderRadius: 18 },
                {
                  backgroundColor:
                    habitLink?.scoreComponent?.scoreInfo?.color?.toLowerCase?.() ||
                    Colors.inputback,
                },
              ]}
              onPress={() => handleGoToSwapScreen(habitLink)}
            >
              <Fontisto name="arrow-swap" size={17} color={Colors.white} />
            </TouchableOpacity>
          )}

          {canEdit && canAIScore && (
            <View style={styles.openBtn2}>
              <TouchableOpacity onPress={() => setShowScoreConfirm(true)}>
                <MaterialCommunityIcons
                  name="creation"
                  size={24}
                  color={
                    isHabitLinkAIScored(habitLink) ? "#f59e0b" : Colors.white
                  }
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Button to open habit link details */}
          {showHabitLinkNav && !isHabitCalendar && (
            <Pressable style={styles.openBtn} onPress={onOpen}>
              <Image
                source={Images.file}
                resizeMode="contain"
                style={styles.openIcon}
              />
            </Pressable>
          )}

          {/* Button to open habit link Calendar details */}
          {showHabitLinkNav && isHabitCalendar && (
            <Pressable style={styles.openBtn3} onPress={onOpen}>
              <Text style={styles.openBtnText2}>{btnCalendarText}</Text>
            </Pressable>
          )}

          {showExpandedButton && setExpanded && (
            <Pressable
              style={styles.openBtn}
              onPress={() => setExpanded(!expanded)}
            >
              <FontAwesome5
                name={expanded ? "chevron-up" : "chevron-down"}
                size={15}
                color={Colors.white}
              />
            </Pressable>
          )}

          {/* Button to open bottom up sheet item list */}
          {showBottomUpSheetItemList && (
            <TouchableOpacity
              style={styles.openBtn2}
              onPress={() => setShowLinkDetail(true)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="dashboard" size={18} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bottom up sheet — link detail (same as HabitLinkPill info) */}
      <HabitLinkDetailSheet
        costSymbol={costSymbol}
        link={showLinkDetail ? habitLink : null}
        onClose={() => setShowLinkDetail(false)}
        ScreenOrigin={ScreenOrigin}
      />

      {/* Add HabitLinkPreview */}
      <HabitLinkPreview
        rnsheet={showPreview}
        canEdit={canEdit}
        dataitem={habitLink}
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
          style={styles.scoreOverlay}
          activeOpacity={1}
          onPress={() => {
            if (!isScoring) setShowScoreConfirm(false);
          }}
        >
          <TouchableOpacity
            style={styles.scoreModal}
            activeOpacity={1}
            onPress={() => {}}
          >
            {/* Header */}
            <View style={styles.scoreModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scoreModalName}>{habitLink?.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.scoreModalClose}
                onPress={() => setShowScoreConfirm(false)}
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
                    habitLink?.scoreComponent?.scoreInfo?.color?.toLowerCase?.() ??
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
                        habitLink?.scoreComponent?.scoreInfo?.color?.toLowerCase?.() ??
                        "#6B7280",
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.scoreCurrentValue,
                    {
                      color:
                        habitLink?.scoreComponent?.scoreInfo?.color?.toLowerCase?.() ??
                        "#6B7280",
                    },
                  ]}
                >
                  {habitLink?.scoreComponent?.scoreInfo?.label ?? "Unknown"}
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
                {" to analyze and score all items in "}
                <Text style={{ fontWeight: "700", color: "#E0E0E0" }}>
                  "{habitLink?.name}"
                </Text>
                {" for you?"}
              </Text>

              <View style={[styles.swapCostRow, { marginTop: 12 }]}>
                <Text style={styles.scoreAiDesc}>Items</Text>
                <Text style={[styles.scoreAiDesc, { color: "#E0E0E0" }]}>
                  {habitLink?.habitLinkItemComponentsData?.length ?? 0}
                </Text>
              </View>
              <View style={styles.swapCostRow}>
                <Text style={styles.scoreAiDesc}>Cost per item</Text>
                <Text style={[styles.scoreAiDesc, { color: "#E0E0E0" }]}>
                  {formatCostDecimal(scoreAdjustedPerItem)} credits
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
                  {formatCostDecimal(ensureMinTotalCost((habitLink?.habitLinkItemComponentsData?.length ?? 0) *
                    scoreAdjustedPerItem))}{" "}
                  credits
                </Text>
              </View>

              {(revenueCat?.remainingCredits ?? 0) <
                (habitLink?.habitLinkItemComponentsData?.length ?? 0) *
                  scoreAdjustedPerItem &&
                !isScoring && (
                  <Text style={styles.swapInsufficientText}>
                    Insufficient credits. Please top up to continue.
                  </Text>
                )}
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

            {/* Buttons — sufficient credits */}
            {((revenueCat?.remainingCredits ?? 0) >=
              (habitLink?.habitLinkItemComponentsData?.length ?? 0) *
                SCORER_COST_PER_ITEM ||
              isScoring) && (
              <View style={styles.scoreButtons}>
                <TouchableOpacity
                  style={[styles.scoreCancelBtn, isScoring && { opacity: 0.4 }]}
                  onPress={() => setShowScoreConfirm(false)}
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
            {(revenueCat?.remainingCredits ?? 0) <
              (habitLink?.habitLinkItemComponentsData?.length ?? 0) *
                SCORER_COST_PER_ITEM &&
              !isScoring && (
                <View style={styles.scoreButtons}>
                  <TouchableOpacity
                    style={styles.scoreCancelBtn}
                    onPress={() => setShowScoreConfirm(false)}
                  >
                    <Text style={styles.scoreCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.swapAddCreditsBtn}
                    onPress={() => {
                      setShowScoreConfirm(false);
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
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Swap Confirm Modal */}
      <Modal
        visible={showSwapConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSwapConfirm(false)}
      >
        <TouchableOpacity
          style={styles.scoreOverlay}
          activeOpacity={1}
          onPress={() => setShowSwapConfirm(false)}
        >
          <TouchableOpacity
            style={styles.scoreModal}
            activeOpacity={1}
            onPress={() => {}}
          >
            {/* Header */}
            <View style={styles.scoreModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scoreModalName}>Confirm Swap</Text>
                <Text style={styles.scoreCurrentLabel}>{habitLink?.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.scoreModalClose}
                onPress={() => setShowSwapConfirm(false)}
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
                  {habitLink?.habitLinkItemComponentsData?.length ?? 0}
                </Text>
              </View>
              <View style={styles.swapCostRow}>
                <Text style={styles.scoreAiDesc}>Cost per item</Text>
                <Text style={[styles.scoreAiDesc, { color: "#E0E0E0" }]}>
                  {formatCostDecimal(swapAdjustedPerItem)} credits
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
                  {formatCostDecimal(ensureMinTotalCost((habitLink?.habitLinkItemComponentsData?.length ?? 0) *
                    swapAdjustedPerItem))}{" "}
                  credits
                </Text>
              </View>

              {(revenueCat?.remainingCredits ?? 0) <
                (habitLink?.habitLinkItemComponentsData?.length ?? 0) *
                  swapAdjustedPerItem && (
                <Text style={styles.swapInsufficientText}>
                  Insufficient credits. Please top up to continue.
                </Text>
              )}
            </View>

            {/* Sufficient credits — Swap button */}
            {(revenueCat?.remainingCredits ?? 0) >=
              (habitLink?.habitLinkItemComponentsData?.length ?? 0) *
                SWAP_COST_PER_ITEM && (
              <TouchableOpacity
                style={[styles.scoreConfirmBtn, styles.swapConfirmBtnFull]}
                onPress={handleSwapConfirm}
              >
                <MaterialIcons name="swap-horiz" size={16} color="#fff" />
                <Text style={styles.scoreConfirmText}>
                  Swap —{" "}
                  {formatCostDecimal(ensureMinTotalCost((habitLink?.habitLinkItemComponentsData?.length ?? 0) *
                    swapAdjustedPerItem))}{" "}
                  credits
                </Text>
              </TouchableOpacity>
            )}

            {/* Insufficient — Cancel + Add Credits */}
            {(revenueCat?.remainingCredits ?? 0) <
              (habitLink?.habitLinkItemComponentsData?.length ?? 0) *
                SWAP_COST_PER_ITEM && (
              <View style={styles.scoreButtons}>
                <TouchableOpacity
                  style={styles.scoreCancelBtn}
                  onPress={() => setShowSwapConfirm(false)}
                >
                  <Text style={styles.scoreCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.swapAddCreditsBtn}
                  onPress={() => {
                    setShowSwapConfirm(false);
                    navigation.navigate("account");
                  }}
                >
                  <MaterialIcons name="bolt" size={16} color="#f59e0b" />
                  <Text style={styles.swapAddCreditsBtnText}>Add Credits</Text>
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
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.menuModal}>
            {
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleInfoClick}
              >
                <MaterialIcons name="info" size={20} color={Colors.white} />
                <Text style={styles.menuItemText}>Info</Text>
              </TouchableOpacity>
            }

            {<View style={styles.menuDivider} />}

            {!hideCalendar && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  goToHabitLinkCalendar();
                }}
              >
                <FontAwesome5
                  name="calendar-alt"
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.menuItemText}>HabitLink Calendar</Text>
              </TouchableOpacity>
            )}

            {!hideCalendar && <View style={styles.menuDivider} />}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default HabitLinkItemRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: isWeb ? 8 : hp("1%"),
    marginTop: isWeb ? 10 : hp("1.5%"),
    backgroundColor: "rgba(31, 35, 158, 0.5)",
    borderRadius: isWeb ? 10 : wp(3),
  },
  openBtn2: {
    width: isWeb ? 36 : wp("9%"),
    height: isWeb ? 36 : wp("9%"),
    borderRadius: isWeb ? 18 : wp("5%"),
    backgroundColor: Colors.background_color,
    alignItems: "center",
    justifyContent: "center",
  },
  left: { flexDirection: "row", alignItems: "center" },
  iconWrap: {
    width: isWeb ? 44 : wp("12%"),
    height: isWeb ? 44 : wp("12%"),
    borderRadius: isWeb ? 10 : wp("3%"),
    backgroundColor: Colors.icon_back,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { width: isWeb ? 26 : wp("7%"), height: isWeb ? 26 : wp("7%") },
  fileBadge: {
    position: "absolute",
    right: isWeb ? -4 : hp("-0.7%"),
    top: isWeb ? -4 : hp("-0.7%"),
    width: isWeb ? 18 : wp("5%"),
    height: isWeb ? 18 : wp("5%"),
    borderRadius: isWeb ? 9 : wp("3%"),
    backgroundColor: Colors.blueback,
    alignItems: "center",
    justifyContent: "center",
  },
  fileIcon: { width: isWeb ? 14 : wp("4%"), height: isWeb ? 14 : wp("4%"), tintColor: Colors.white },
  meta: { marginLeft: isWeb ? 16 : wp("4%") },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.text_background,
    paddingHorizontal: isWeb ? 8 : wp("2%"),
    paddingVertical: isWeb ? 3 : hp("0.3%"),
    borderRadius: 999,
    marginTop: isWeb ? 3 : hp("0.3%"),
  },
  openBtn: {
    width: isWeb ? 36 : wp("9%"),
    height: isWeb ? 36 : wp("9%"),
    borderRadius: isWeb ? 18 : wp("5%"),
    backgroundColor: Colors.blueback,
    alignItems: "center",
    justifyContent: "center",
  },
  openIcon: { width: isWeb ? 22 : wp("6%"), height: isWeb ? 22 : wp("6%"), tintColor: Colors.white },
  hero: {
    width: wp(84),
    height: hp(17.4),
    padding: wp(2),
    justifyContent: "flex-end",
  },
  avatar: {
    width: wp(8.5),
    height: wp(8.5),
    borderRadius: wp(5),
    marginRight: wp(2),
  },
  openBtn3: {
    backgroundColor: Colors.primary, // or your preferred color
    paddingHorizontal: isWeb ? 16 : wp(4),
    paddingVertical: isWeb ? 8 : hp(1.5),
    borderRadius: isWeb ? 8 : wp(2),
    alignItems: "center",
    justifyContent: "center",
    // Add any other existing styles from your openBtn
  },
  openBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "poppins_semibold",
  },
  openBtnText2: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "poppins_semibold",
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
    padding: isWeb ? 16 : wp(4),
  },
  scoreModal: {
    width: "100%",
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: isWeb ? 24 : wp(6),
    borderWidth: 1,
    borderColor: "#333333",
  },
  scoreModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isWeb ? 12 : hp(2.5),
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
    marginLeft: isWeb ? 12 : wp(3),
  },
  scoreCurrentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isWeb ? 12 : wp(3),
    borderRadius: 12,
    marginBottom: isWeb ? 16 : hp(3),
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
    padding: isWeb ? 20 : wp(5),
    backgroundColor: "#1e1b4b",
    borderRadius: 14,
    marginBottom: isWeb ? 16 : hp(3),
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
    marginBottom: isWeb ? 8 : hp(2),
  },
  scoreAiTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E8E5FF",
    marginBottom: isWeb ? 4 : hp(1),
  },
  scoreAiDesc: {
    fontSize: 13,
    color: "#9B95C9",
    lineHeight: 20,
    textAlign: "center",
  },
  scoreButtons: {
    flexDirection: "row",
    gap: isWeb ? 10 : wp(2.5),
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
    gap: isWeb ? 8 : wp(2),
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
    marginBottom: isWeb ? 6 : hp(1.2),
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
    gap: isWeb ? 8 : wp(2),
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
