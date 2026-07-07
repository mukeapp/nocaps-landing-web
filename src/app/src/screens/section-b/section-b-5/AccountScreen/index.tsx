import {GetAllSubscriptions} from "@/core/api/section-b";
import {
    AddCreditsSheet,
    Avatar,
    Card,
    ConfirmModal,
    DangerItem,
    DowngradeSheet,
    InfoRow,
    ModalConfig,
    PlanCard,
    PlanInfoModal,
    SectionLabel,
    formatPrice,
    getInitials,
    toUIPlan,
} from "@/core/components/section-b-5";
import {DefaultLoader as Loader} from "@/core/components/section-a";
import {Header2} from "@/core/components/section-b";
import {Colors} from "@/core/constants/Colors";
import {
    BillingType,
    PlanId,
    SubscriptionPlan,
    SubscriptionPlanAction,
    planIdToEntitlement,
    planIdToOfferingId,
    selectSubscriptionPlans,
    selectVisibleBillingTypes,
} from "@/core/redux/subscription-plan";
import {CreditPreset} from "@/core/redux/credit-presets";
import {UserDataAction} from "@/core/redux/user-data";
import {
    RevenueCatAction,
    selectMonthlyCredits,
    selectRevenueCat,
} from "@/core/redux/user-revenue-cat";
import {
    createUserRevenueCat,
    destroyAccountByUserId,
    getUserRevenueCatByNocapUserId,
    increaseRemainingCreditsByUserId,
    purgeHabitStacksByUserId,
    purgeNoCapPostsByUserId,
    updateRevenueCatUserId,
    updateUserRevenueCatSubscriptionPlan,
} from "@/core/services/section-b";
import * as Clipboard from "expo-clipboard";
import {formatCredits, uuidUtils} from "@/core/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Constants from "expo-constants";
import React, {useCallback, useEffect, useState} from "react";
import {
    ActivityIndicator,
    Linking,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Purchases, {
    PURCHASE_TYPE,
    PurchasesOfferings,
    PurchasesPackage,
} from "react-native-purchases";
import {
    heightPercentageToDP as _hp,
    widthPercentageToDP as _wp,
} from "@/core/utils/responsive";
import Toast from "react-native-root-toast";
import {useDispatch, useSelector} from "react-redux";

const isWeb = Platform.OS === "web";

// Web: use fixed px scaling so fonts/icons don't inflate with browser width.
// Native: keep original responsive-screen percentages.
const wp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _wp(p));
const hp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _hp(p));

// ─── helpers ──────────────────────────────────────────────────────────────────

const getRcPricing = (
  planId: string,
  offerings: PurchasesOfferings | null,
): { price: number; currency: string } | null => {
  if (!offerings) return null;
  const offeringId = planIdToOfferingId[planId];
  if (!offeringId) return null;
  const pkg =
    offerings.all[offeringId]?.monthly ??
    offerings.all[offeringId]?.availablePackages[0] ??
    null;
  if (!pkg) return null;
  return { price: pkg.product.price, currency: pkg.product.currencyCode };
};

const getPackageForPlan = (
  planId: string,
  offerings: PurchasesOfferings | null,
): PurchasesPackage | null => {
  if (!offerings) return null;
  const offeringId = planIdToOfferingId[planId];
  if (!offeringId) return null;
  return (
    offerings.all[offeringId]?.monthly ??
    offerings.all[offeringId]?.availablePackages[0] ??
    null
  );
};

// ─── main screen ──────────────────────────────────────────────────────────────

const AccountScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((s: any) => s?.user?.userdata?.collectdata);
  const revenueCat = useSelector((s: any) => selectRevenueCat(s));
  const monthlyCredits = useSelector(selectMonthlyCredits);
  const subscriptionPlans = useSelector(selectSubscriptionPlans);
  const visibleBillingTypes = useSelector(selectVisibleBillingTypes);

  const PERSONAL_PLANS = subscriptionPlans
    .filter((p) => p.billingType === "personal" && p.isVisible)
    .map(toUIPlan);
  const BUSINESS_PLANS = subscriptionPlans
    .filter((p) => p.billingType === "business" && p.isVisible)
    .map(toUIPlan);
  const PLAN_LABELS: Record<string, string> = Object.fromEntries(
    subscriptionPlans.map((p) => [p.id, `${p.name} · ${formatPrice(p.price)}`]),
  );
  const getFeaturesForPlan = (planId: string): string[] =>
    subscriptionPlans.find((p) => p.id === planId)?.features ?? [];

  const getDescriptionForPlan = (planId: string): string | undefined =>
    subscriptionPlans.find((p) => p.id === planId)?.description;

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalConfig | null>(null);
  const [billingType, setBillingType] = useState<BillingType>("personal");
  const [selectedPlan, setSelectedPlan] = useState<string>(revenueCat.planId ?? "free");
  const [showSub, setShowSub] = useState(false);
  const [infoPlanId, setInfoPlanId] = useState<string | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [addCreditsLoading, setAddCreditsLoading] = useState(false);
  const [showDowngradeSheet, setShowDowngradeSheet] = useState(false);
  const [purgingStacks, setPurgingStacks] = useState(false);
  const [deletingPosts, setDeletingPosts] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const firstName: string = user?.firstName ?? "";
  const lastName: string = user?.lastName ?? "";
  const username: string = user?.username ?? "";
  const email: string = user?.email ?? "";
  const photo: string = user?.photo ?? "";
  const userId: string = user?.userId ?? user?.id ?? "";

  const fetchOrCreateRevenueCat = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, status } = await getUserRevenueCatByNocapUserId(userId);
      let record = data;
      if (status === 404 || !record) {
        const created = await createUserRevenueCat({
          id: uuidUtils.generateUUID(),
          nocapUserId: userId,
          revenueCatUserId: `rc_${userId}`,
          planId: "free",
          billingType: "personal",
          monthlyCredits: 0,
          remainingCredits: 0,
          isActive: true,
          purchasedAt: null,
        });
        record = created.data;
      }
      if (record) {
        dispatch(
          RevenueCatAction.setPurchasedPlan({
            documentId: record.documentId ?? null,
            id: record.id ?? null,
            revenueCatUserId: record.revenueCatUserId ?? `rc_${userId}`,
            nocapUserId: record.nocapUserId ?? userId,
            planId: record.planId ?? "free",
            billingType: record.billingType ?? "personal",
            monthlyCredits: record.monthlyCredits ?? 0,
            remainingCredits: record.remainingCredits ?? 0,
            purchasedAt: record.purchasedAt ?? null,
            createdAt: record.createdAt ?? null,
            updatedAt: record.updatedAt ?? null,
          }),
        );
      }
    } catch (err) {
      console.log("fetchOrCreateRevenueCat:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch]);

  const fetchSubscriptions = useCallback(async () => {
    const [apiResult, rcResult] = await Promise.allSettled([
      GetAllSubscriptions(),
      Purchases.getOfferings(),
    ]);

    let rcOfferings: PurchasesOfferings | null = null;
    if (rcResult.status === "fulfilled") {
      rcOfferings = rcResult.value;
      setOfferings(rcOfferings);
    } else {
      console.error("[RevenueCat] getOfferings failed:", rcResult.reason);
    }

    if (apiResult.status === "fulfilled") {
      const { data, status } = apiResult.value;
      if (status >= 200 && status < 300 && Array.isArray(data)) {
        const mapped: SubscriptionPlan[] = data.map((item: any) => {
          const rc = getRcPricing(item.id, rcOfferings);
          return {
            id: item.id as PlanId,
            name: item.name,
            price: rc?.price ?? item.price,
            currency: rc?.currency ?? "USD",
            tagline: item.tagline,
            ...(item.description != null
              ? { description: item.description }
              : {}),
            credits: item.credits,
            isPopular: item.isPopular ?? false,
            isVisible: item.isVisible ?? false,
            billingType: item.billingType as BillingType,
            features: item.features ?? [],
            ...(item.footerNote != null ? { footerNote: item.footerNote } : {}),
          };
        });
        dispatch(SubscriptionPlanAction.setPlans(mapped));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const onFocus = () => {
      fetchOrCreateRevenueCat();
      fetchSubscriptions();
    };
    const unsub = navigation.addListener("focus", onFocus);
    return unsub;
  }, [fetchOrCreateRevenueCat, fetchSubscriptions, navigation]);

  useEffect(() => {
    if (!visibleBillingTypes.includes(billingType)) {
      setBillingType("personal");
    }
  }, [visibleBillingTypes, billingType]);

  useEffect(() => {
    if (!showSub) {
      setSelectedPlan(revenueCat.planId ?? "free");
    }
  }, [revenueCat.planId, showSub]);

  const planUnchanged = selectedPlan === revenueCat.planId;

  // ─── add credits ─────────────────────────────────────────────────────────────

  const handleAddCredits = async (credits: number, usd: number) => {
    try {
      const { data: record, status } = await increaseRemainingCreditsByUserId(
        userId,
        credits,
      );
      if (status >= 200 && status < 300 && record) {
        dispatch(RevenueCatAction.addCredits(credits));
        Toast.show(
          `${credits.toLocaleString()} credits added for $${usd} USD!`,
          {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
          },
        );
      } else {
        Toast.show("Failed to add credits. Please try again.", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch {
      Toast.show("Failed to add credits. Please try again.", {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
    }
  };

  const handleRevenueCatAddCredit = async (
    preset: CreditPreset,
    credits: number,
    usd: number,
  ) => {
    setShowAddCredits(false);
    setAddCreditsLoading(true);
    try {
      const products = await Purchases.getProducts([preset.id], PURCHASE_TYPE.INAPP);
      if (products.length === 0) throw new Error("Product not found");

      const { customerInfo } = await Purchases.purchaseStoreProduct(products[0]);
      const rcUserId = customerInfo.originalAppUserId;
      await updateRevenueCatUserId(userId, rcUserId);
      await handleAddCredits(credits, usd);
    } catch (e: any) {
      if (e?.userCancelled !== true) {
        Toast.show("Purchase failed. Please try again.", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      }
    } finally {
      setAddCreditsLoading(false);
    }
  };

  // ─── subscription purchase ──────────────────────────────────────────────────

  const handleSubscribe = useCallback(
    async (pkg: PurchasesPackage, plan: SubscriptionPlan) => {
      try {
        const { customerInfo } = await Purchases.purchasePackage(pkg);
        const entitlementKey = planIdToEntitlement[plan.id];
        if (
          entitlementKey &&
          typeof customerInfo.entitlements.active[entitlementKey] !==
            "undefined"
        ) {
          console.log("customerInfo:", JSON.stringify(customerInfo, null, 2));
          const rcUserId = customerInfo.originalAppUserId;
          await updateRevenueCatUserId(userId, rcUserId);
          const { data: record, status } =
            await updateUserRevenueCatSubscriptionPlan(userId, {
              planId: plan.id,
              billingType: plan.billingType,
              monthlyCredits: plan.credits,
              remainingCredits: plan.credits,
              purchasedAt: new Date().toISOString(),
            });
          if (status >= 200 && status < 300 && record) {
            dispatch(
              RevenueCatAction.setPurchasedPlan({
                documentId: record.documentId ?? null,
                id: record.id ?? null,
                revenueCatUserId: rcUserId ?? record.revenueCatUserId ?? null,
                nocapUserId: record.nocapUserId ?? userId,
                planId: record.planId ?? plan.id,
                billingType: record.billingType ?? plan.billingType,
                monthlyCredits: record.monthlyCredits ?? plan.credits,
                purchasedAt: record.purchasedAt ?? null,
                createdAt: record.createdAt ?? null,
                updatedAt: record.updatedAt ?? null,
              }),
            );
            setShowSub(false);
            Toast.show(
              `Welcome to ${plan.name}! ${plan.credits.toLocaleString()} AI credits added.`,
              {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
              },
            );
          } else {
            Toast.show("Failed to update subscription. Please try again.", {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            });
          }
        }
      } catch (e: any) {
        console.log("📢 error", e);
        if (e?.userCancelled !== true) {
          Toast.show("Purchase failed. Please try again.", {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
          });
        }
      }
    },
    [userId, dispatch],
  );

  const openManageSubscriptions = () => {
    const url =
      Platform.OS === "ios"
        ? "https://apps.apple.com/account/subscriptions"
        : "https://play.google.com/store/account/subscriptions";
    Linking.openURL(url).catch(() => {});
  };

  const doFreeDowngrade = useCallback(async () => {
    const plan = subscriptionPlans.find((p) => p.id === selectedPlan);
    if (!plan) return;
    setPurchaseLoading(true);
    try {
      const { data: record, status } =
        await updateUserRevenueCatSubscriptionPlan(userId, {
          planId: plan.id,
          billingType: plan.billingType,
          monthlyCredits: 0,
          remainingCredits: 0,
          purchasedAt: null,
        });
      if (status >= 200 && status < 300 && record) {
        dispatch(
          RevenueCatAction.setPurchasedPlan({
            documentId: record.documentId ?? null,
            id: record.id ?? null,
            revenueCatUserId: record.revenueCatUserId ?? null,
            nocapUserId: record.nocapUserId ?? userId,
            planId: record.planId ?? plan.id,
            billingType: record.billingType ?? plan.billingType,
            monthlyCredits: record.monthlyCredits ?? 0,
            purchasedAt: record.purchasedAt ?? null,
            createdAt: record.createdAt ?? null,
            updatedAt: record.updatedAt ?? null,
          }),
        );
        setShowSub(false);
        Toast.show("You are on the Free plan.", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      } else {
        Toast.show("Failed to update subscription. Please try again.", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      }
    } finally {
      setPurchaseLoading(false);
    }
  }, [selectedPlan, subscriptionPlans, userId, dispatch]);

  const handleContinue = async () => {
    if (selectedPlan === revenueCat.planId) {
      Toast.show("You are already on this plan.", {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
      return;
    }

    const plan = subscriptionPlans.find((p) => p.id === selectedPlan);
    if (!plan) return;

    if (plan.price === 0) {
      setShowDowngradeSheet(true);
      return;
    }

    setPurchaseLoading(true);
    try {
      const pkg = getPackageForPlan(plan.id, offerings);
      if (!pkg) {
        Toast.show("This plan is not available for purchase right now.", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
        return;
      }
      await handleSubscribe(pkg, plan);
    } finally {
      setPurchaseLoading(false);
    }
  };

  // ─── danger actions ────────────────────────────────────────────────────────

  const confirmPurgeStacks = () =>
    setModal({
      title: "Purge All HabitStacks?",
      message:
        "This will permanently delete all your HabitStacks and associated data. This cannot be undone.",
      confirmLabel: "Yes, Purge All",
      onConfirm: async () => {
        setModal(null);
        setPurgingStacks(true);
        try {
          await purgeHabitStacksByUserId(userId);
          Toast.show("All HabitStacks purged successfully.", {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
          });
        } catch {
          Toast.show("Failed to purge HabitStacks. Please try again.", {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
          });
        } finally {
          setPurgingStacks(false);
        }
      },
    });

  const confirmDeletePosts = () =>
    setModal({
      title: "Delete All Posts?",
      message:
        "All your community posts will be permanently removed. Your account stays active.",
      confirmLabel: "Yes, Delete All Posts",
      onConfirm: async () => {
        setModal(null);
        setDeletingPosts(true);
        try {
          await purgeNoCapPostsByUserId(userId);
          Toast.show("All posts deleted successfully.", {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
          });
        } catch {
          Toast.show("Failed to delete posts. Please try again.", {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
          });
        } finally {
          setDeletingPosts(false);
        }
      },
    });

  const confirmDeleteAccount = () =>
    setModal({
      title: "Delete Account?",
      message:
        "Your account, HabitStacks, posts, and all data will be permanently erased. This cannot be reversed.",
      confirmLabel: "Permanently Delete Account",
      onConfirm: async () => {
        setModal(null);
        setDeletingAccount(true);
        try {
          await destroyAccountByUserId(userId);
        } catch {
          // Proceed with local logout even if the API call fails
        } finally {
          setDeletingAccount(false);
          dispatch(RevenueCatAction.resetRevenueCat());
          dispatch(UserDataAction.setTempData({}));
          dispatch(UserDataAction.setUserData({}));
          dispatch(UserDataAction.setUserAuth(""));
        }
      },
    });

  // ─── render ────────────────────────────────────────────────────────────────

  return (
    <View style={s.root}>
      <Header2
        title="Account"
        titleTextFormat={1}
        titleVisibilityIcon={false}
        showSettingsIcon={true}
        navigation={navigation}
        cameFromDrawerTab={false}
      />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={isWeb ? s.webContainer : undefined}>
        {/* ── Profile card ── */}
        <View style={s.profileCard}>
          <Avatar initials={getInitials(firstName, lastName)} photo={photo} />
          <View style={s.profileInfo}>
            <Text style={s.fullName}>
              {`${firstName} ${lastName}`.trim() || "—"}
            </Text>
            <Text style={s.usernameText}>
              {username ? `@${username}` : "—"}
            </Text>
            <TouchableOpacity
              style={s.editProfileBtn}
              onPress={() => navigation.navigate("profile-edit")}
              activeOpacity={0.7}
            >
              <Text style={s.editProfileBtnText}>Edit Profile →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Profile Info ── */}
        <SectionLabel>Profile Info</SectionLabel>
        <Card>
          <InfoRow label="First Name" value={firstName || "—"} />
          <View style={s.rowDivider} />
          <InfoRow label="Last Name" value={lastName || "—"} />
          <View style={s.rowDivider} />
          <InfoRow label="Username" value={username ? `@${username}` : "—"} />
          <View style={s.rowDivider} />
          <InfoRow label="Email" value={email || "—"} />
          <View style={s.rowDivider} />
          <View style={s.userIdRow}>
            <Text style={s.userIdLabel}>NoCap UserId</Text>
            <TouchableOpacity
              style={s.userIdValueRow}
              onPress={() => {
                Clipboard.setStringAsync(userId);
                Toast.show("User ID copied.", {
                  duration: Toast.durations.SHORT,
                  position: Toast.positions.BOTTOM,
                });
              }}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="content-copy" size={wp(3.5)} color="#6b7280" />
              <Text style={s.userIdValue} numberOfLines={1}>{userId || "—"}</Text>
            </TouchableOpacity>
          </View>
          <View style={s.rowDivider} />
          <View style={s.goToProfileRow}>
            <TouchableOpacity
              style={s.goToProfileBtn}
              onPress={() => navigation.navigate("profile")}
              activeOpacity={0.7}
            >
              <Text style={s.goToProfileBtnText}>Go to Profile Page →</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* ── NoCap Credits ── */}
        <SectionLabel>NoCap Credits</SectionLabel>
        <Card>
          <View style={s.creditsRow}>
            <View style={s.creditsColumns}>
              <View style={s.creditsCol}>
                <Text style={s.creditsLabel}>REMAINING</Text>
                <View style={s.creditsValueRow}>
                  <MaterialIcons name="bolt" size={wp(4.5)} color="#f59e0b" />
                  <Text style={s.creditsValue}>
                    {formatCredits(revenueCat?.remainingCredits ?? 0)}
                  </Text>
                </View>
              </View>
              <View style={s.creditsDivider} />
              <View style={s.creditsCol}>
                <Text style={s.creditsLabel}>MONTHLY</Text>
                <Text style={s.creditsMonthlyValue}>
                  {formatCredits(monthlyCredits)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={s.addCreditsBtn}
              onPress={() => setShowAddCredits(true)}
              disabled={addCreditsLoading}
              activeOpacity={0.8}
            >
              {addCreditsLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="add" size={wp(3.5)} color="#fff" />
                  <Text style={s.addCreditsBtnText}>Add Credits</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Card>

        {/* ── Subscription ── */}
        <SectionLabel>Subscription</SectionLabel>
        <Card>
          {/* summary row */}
          <View style={[s.subSummaryRow, showSub && s.subSummaryRowBorder]}>
            <View>
              <Text style={s.subCurrentLabel}>CURRENT PLAN</Text>
              <View style={s.subCurrentValueRow}>
                <Text style={s.subCurrentValue}>
                  {PLAN_LABELS[revenueCat.planId]}
                </Text>
                <TouchableOpacity
                  style={s.infoBtn}
                  onPress={() => setInfoPlanId(revenueCat.planId)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <MaterialIcons
                    name="info-outline"
                    size={wp(3.2)}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={s.subToggleBtn}
              onPress={() => setShowSub((v) => !v)}
              activeOpacity={0.7}
            >
              <Text style={s.subToggleBtnText}>
                {showSub ? "Hide ▲" : "Change ▼"}
              </Text>
            </TouchableOpacity>
          </View>

          {showSub && (
            <View style={s.subPicker}>
              {/* billing type toggle */}
              <View style={s.pageToggleRow}>
                {visibleBillingTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      s.pageToggleBtn,
                      billingType === type && s.pageToggleBtnActive,
                    ]}
                    onPress={() => {
                      setBillingType(type);
                      setSelectedPlan(
                        type === "personal" ? "free" : "business",
                      );
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        s.pageToggleBtnText,
                        billingType === type && { color: "#fff" },
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* plan cards */}
              <View style={s.planCardsRow}>
                {(billingType === "personal"
                  ? PERSONAL_PLANS
                  : BUSINESS_PLANS
                ).map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    selected={selectedPlan === plan.id}
                    onPress={() => setSelectedPlan(plan.id)}
                    onInfo={() => setInfoPlanId(plan.id)}
                  />
                ))}
              </View>

              {/* description */}
              {/* {getDescriptionForPlan(selectedPlan) && (
                <Text style={s.planDescription}>
                  {getDescriptionForPlan(selectedPlan)}
                </Text>
              )} */}

              {/* features */}
              {/* {getFeaturesForPlan(selectedPlan).map((f, i) => (
                <View key={i} style={s.featureRow}>
                  <Text style={s.featureCheck}>✓</Text>
                  <Text style={s.featureText}>{f}</Text>
                </View>
              ))} */}

              {/* continue */}
              <TouchableOpacity
                style={[
                  s.continueBtn,
                  (purchaseLoading || planUnchanged) && s.continueBtnDisabled,
                ]}
                onPress={handleContinue}
                disabled={purchaseLoading || planUnchanged}
                activeOpacity={0.85}
              >
                {purchaseLoading ? (
                  <ActivityIndicator size="small" color="#090909" />
                ) : (
                  <Text style={s.continueBtnText}>Continue</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={s.manageSubLink}
                onPress={openManageSubscriptions}
                activeOpacity={0.7}
              >
                <Text style={s.manageSubLinkText}>Manage Subscriptions →</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* ── Danger Zone ── */}
        <SectionLabel>Danger Zone</SectionLabel>
        <Card>
          <DangerItem
            icon="🔥"
            label="Purge All HabitStacks"
            sublabel="Permanently removes all habit stack data"
            onPress={confirmPurgeStacks}
            loading={purgingStacks}
          />
          <DangerItem
            icon="🗑️"
            label="Delete All Posts"
            sublabel="Remove all your posts from the community feed"
            onPress={confirmDeletePosts}
            loading={deletingPosts}
          />
          <DangerItem
            icon="⚠️"
            label="Delete Account"
            sublabel="Permanently erase your account & all data"
            onPress={confirmDeleteAccount}
            loading={deletingAccount}
            hideBorder
          />
        </Card>

        <Text style={s.footer}>
          NoCaps v{Constants.expoConfig?.version ?? "1.0.0"}
        </Text>
        </View>{/* end webContainer */}
      </ScrollView>

      <PlanInfoModal planId={infoPlanId} onClose={() => setInfoPlanId(null)} />
      <ConfirmModal
        visible={!!modal}
        config={modal}
        onCancel={() => setModal(null)}
      />
      <AddCreditsSheet
        visible={showAddCredits}
        onClose={() => setShowAddCredits(false)}
        onConfirm={handleRevenueCatAddCredit}
      />
      <DowngradeSheet
        visible={showDowngradeSheet}
        onClose={() => setShowDowngradeSheet(false)}
        onConfirm={() => {
          setShowDowngradeSheet(false);
          doFreeDowngrade();
        }}
      />

      <Loader status={loading} />
    </View>
  );
};

export default AccountScreen;

// ─── styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0f0f1a" },

  scroll: { paddingBottom: hp(5) },
  webContainer: isWeb ? {
    maxWidth: 1200,
    width: '100%',
    marginLeft: 'auto' as any,
    marginRight: 'auto' as any,
    paddingHorizontal: wp(3),
  } : {},

  // profile card
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(4),
    marginBottom: hp(1),
    backgroundColor: "rgba(230,57,70,0.07)",
    borderWidth: 1,
    borderColor: "rgba(230,57,70,0.2)",
    borderRadius: wp(5),
    padding: wp(5),
    gap: wp(5),
  },
  profileInfo: { flex: 1, gap: hp(0.5) },
  fullName: { fontSize: wp(5), fontFamily: "bold", color: "#f1f5f9" },
  usernameText: {
    fontSize: wp(3.3),
    fontFamily: "regular",
    color: "#6b7280",
    marginBottom: hp(0.5),
  },
  editProfileBtn: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(230,57,70,0.12)",
    borderWidth: 1,
    borderColor: "rgba(230,57,70,0.3)",
    borderRadius: wp(2),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.7),
  },
  editProfileBtnText: {
    fontSize: wp(3),
    fontFamily: "medium",
    color: Colors.colorred,
  },

  // user id row
  userIdRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.6),
  },
  userIdLabel: {
    fontSize: wp(3.3),
    fontFamily: "regular",
    color: "#6b7280",
  },
  userIdValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    maxWidth: "60%",
  },
  userIdValue: {
    fontSize: wp(3.3),
    fontFamily: "regular",
    color: "#9ca3af",
  },

  // info rows
  rowDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: wp(5),
  },
  goToProfileRow: { padding: wp(5), alignItems: "flex-end" },
  goToProfileBtn: {
    backgroundColor: "rgba(46,196,182,0.1)",
    borderWidth: 1,
    borderColor: "rgba(46,196,182,0.25)",
    borderRadius: wp(2),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
  },
  goToProfileBtnText: {
    fontSize: wp(3),
    fontFamily: "medium",
    color: "#2ec4b6",
  },

  // subscription
  subSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.8),
  },
  subSummaryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  subCurrentLabel: {
    fontSize: wp(2.5),
    fontFamily: "medium",
    color: "#6b7280",
    letterSpacing: 1,
    marginBottom: hp(0.4),
  },
  subCurrentValue: { fontSize: wp(3.8), fontFamily: "bold", color: "#f1f5f9" },
  subCurrentValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
    marginTop: hp(0.3),
  },
  infoBtn: {
    width: wp(5.5),
    height: wp(5.5),
    borderRadius: wp(2.75),
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  subToggleBtn: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: wp(2.5),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
  },
  subToggleBtnText: { fontSize: wp(3), fontFamily: "medium", color: "#f1f5f9" },
  subPicker: { padding: wp(3.5) },

  pageToggleRow: { flexDirection: "row", gap: wp(2), marginBottom: hp(1.5) },
  pageToggleBtn: {
    flex: 1,
    paddingVertical: hp(1),
    borderRadius: wp(2.5),
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
  },
  pageToggleBtnActive: { backgroundColor: Colors.colorred },
  pageToggleBtnText: {
    fontSize: wp(3),
    fontFamily: "medium",
    color: "#9ca3af",
  },

  // plan cards row wrapper
  planCardsRow: { flexDirection: "row", gap: wp(2.5), marginBottom: hp(2) },

  planDescription: {
    fontSize: wp(3.3),
    fontFamily: "regular",
    color: "#9ca3af",
    lineHeight: wp(5),
    marginBottom: hp(1.5),
  },

  featureRow: {
    flexDirection: "row",
    gap: wp(2.5),
    marginBottom: hp(1.1),
    alignItems: "flex-start",
  },
  featureCheck: { color: Colors.colorred, fontSize: wp(3.5) },
  featureText: {
    flex: 1,
    fontSize: wp(3),
    fontFamily: "regular",
    color: "#d1d5db",
    lineHeight: wp(4.5),
  },
  continueBtn: {
    backgroundColor: "#f1f5f9",
    borderRadius: wp(3.5),
    paddingVertical: hp(1.8),
    alignItems: "center",
    marginTop: hp(1.5),
  },
  continueBtnText: { fontSize: wp(4), fontFamily: "bold", color: "#111" },
  continueBtnDisabled: { opacity: 0.6 },
  manageSubLink: {
    alignSelf: "center",
    paddingVertical: hp(1.2),
    marginTop: hp(0.5),
  },
  manageSubLinkText: {
    fontSize: wp(3.3),
    fontFamily: "regular",
    color: "#6b7280",
  },

  // nocap credits
  creditsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  creditsColumns: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
  },
  creditsCol: { alignItems: "flex-start" },
  creditsLabel: {
    fontSize: wp(2.5),
    fontFamily: "medium",
    color: "#6b7280",
    letterSpacing: 1,
    marginBottom: hp(0.5),
  },
  creditsValueRow: { flexDirection: "row", alignItems: "center", gap: wp(1) },
  creditsValue: { fontSize: wp(6), fontFamily: "bold", color: "#f1f5f9" },
  creditsDivider: { width: 1, height: hp(4), backgroundColor: "#374151" },
  creditsMonthlyValue: {
    fontSize: wp(5),
    fontFamily: "bold",
    color: "#94a3b8",
    marginTop: hp(0.5),
  },
  addCreditsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    backgroundColor: Colors.colorred,
    borderRadius: wp(2.5),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1),
  },
  addCreditsBtnText: { fontSize: wp(3), fontFamily: "medium", color: "#fff" },

  footer: {
    textAlign: "center",
    fontSize: wp(2.8),
    fontFamily: "regular",
    color: "#374151",
    paddingTop: hp(2),
  },
});
