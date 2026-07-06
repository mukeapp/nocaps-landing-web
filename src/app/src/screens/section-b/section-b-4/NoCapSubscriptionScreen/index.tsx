// NoCapSubscriptionScreen.tsx

import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import Toast from "react-native-root-toast";
import {useDispatch, useSelector} from "react-redux";

const isWeb = Platform.OS === "web";

import {GetAllSubscriptions} from "@/core/api/section-b";
import {DefaultLoader as Loader} from "@/core/components/section-a";
import {Header2} from "@/core/components/section-b";
import {DowngradeSheet} from "@/core/components/section-b-5";
import {MainStyles} from "@/core/constants/styles";
import {useNoCapSubscriptionForm} from "@/core/hooks";
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
import {
  RevenueCatAction,
  selectCurrentPlan,
} from "@/core/redux/user-revenue-cat";
import {
  createUserRevenueCat,
  getUserRevenueCatByNocapUserId,
  updateRevenueCatUserId,
  updateUserRevenueCatSubscriptionPlan,
} from "@/core/services/section-b";
import {uuidUtils} from "@/core/utils";
import Purchases, {
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";
import SubscriptionHeader from "./subscription-components/SubscriptionHeader";
import SubscriptionPlanCard from "./subscription-components/SubscriptionPlanCardProps";

// ---------------------------------------------------------------------------

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

const NoCapSubscriptionScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const form = useNoCapSubscriptionForm({ navigation, route });
  const subscriptionPlans = useSelector(selectSubscriptionPlans);
  const visibleBillingTypes = useSelector(selectVisibleBillingTypes);
  const { planId: currentPlanId } = useSelector(selectCurrentPlan);
  const user = useSelector((s: any) => s?.user?.userdata?.collectdata);
  const userId: string = user?.userId ?? user?.id ?? "";
  const [billingType, setBillingType] = useState<BillingType>("personal");
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [showDowngradeSheet, setShowDowngradeSheet] = useState(false);
  const [pendingFreePlan, setPendingFreePlan] = useState<SubscriptionPlan | null>(null);

  // ─── fetch / create RevenueCat record on mount ────────────────────────────

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

  const doFreeDowngrade = useCallback(
    async (plan: SubscriptionPlan) => {
      setLoadingPlanId(plan.id);
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
          Toast.show("You are now on the Free plan.", {
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
        setLoadingPlanId(null);
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

  const handleUpgrade = async (planId: string) => {
    const plan = subscriptionPlans.find((p) => p.id === planId);
    if (!plan) return;

    if (plan.id === currentPlanId) {
      Toast.show("You are already on this plan.", {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
      return;
    }

    if (plan.price === 0) {
      setPendingFreePlan(plan);
      setShowDowngradeSheet(true);
      return;
    }

    setLoadingPlanId(planId);
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
      setLoadingPlanId(null);
    }
  };

  return (
    <View style={MainStyles.root2}>
      <Header2
        title="SUBSCRIPTION"
        titleTextFormat={1}
        titleVisibilityIcon={false}
        showSettingsIcon={false}
        navigation={navigation}
        cameFromDrawerTab={form.cameFromDrawerTab}
      />
      <Loader status={form.loading} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isWeb && { maxWidth: 640, alignSelf: "center", width: "100%" }]}
        showsVerticalScrollIndicator={false}
      >
        <SubscriptionHeader
          billingType={billingType}
          onChangeBillingType={setBillingType}
          visibleBillingTypes={visibleBillingTypes}
        />

        {subscriptionPlans
          .filter((plan) => plan.billingType === billingType && plan.isVisible)
          .map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={plan.id === currentPlanId}
              isLoading={loadingPlanId === plan.id}
              onUpgrade={handleUpgrade}
            />
          ))}

        <TouchableOpacity
          style={styles.manageSubLink}
          onPress={openManageSubscriptions}
          activeOpacity={0.7}
        >
          <Text style={styles.manageSubLinkText}>Manage Subscriptions →</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Iterate over offerings and display them for testing purposes */}
      {/* {offerings && (
        <View style={{padding: 20}}>
          {Object.values(offerings.all).map((offering) => (
            <View key={offering.identifier} style={{marginBottom: 20}}>
              <Header2
                title={`${offering.identifier} — ${offering.serverDescription}`}
                titleTextFormat={3}
              />
              {offering.availablePackages.map((pkg) => (
                <View key={pkg.identifier} style={{paddingLeft: 10, marginBottom: 10}}>
                  <Header2 title={`Package: ${pkg.packageType}`} titleTextFormat={4} />
                  <View style={{paddingLeft: 10}}>
                    <Header2 title={`Title: ${pkg.product.title}`} titleTextFormat={5} />
                    <Header2 title={`Description: ${pkg.product.description}`} titleTextFormat={5} />
                    <Header2 title={`Price: ${pkg.product.priceString}`} titleTextFormat={5} />
                    <Header2 title={`Per month: ${pkg.product.pricePerMonthString}`} titleTextFormat={5} />
                    <Header2 title={`Per year: ${pkg.product.pricePerYearString}`} titleTextFormat={5} />
                    <Header2 title={`Intro price: ${pkg.product.introPrice ?? "N/A"}`} titleTextFormat={5} />
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      )} */}

      {loading && (
        <View style={styles.loaderOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <DowngradeSheet
        visible={showDowngradeSheet}
        onClose={() => {
          setShowDowngradeSheet(false);
          setPendingFreePlan(null);
        }}
        onConfirm={() => {
          setShowDowngradeSheet(false);
          if (pendingFreePlan) doFreeDowngrade(pendingFreePlan);
        }}
      />
    </View>
  );
};

export default NoCapSubscriptionScreen;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: isWeb ? 24 : wp(4),
    paddingTop: isWeb ? 20 : hp(2.5),
    paddingBottom: isWeb ? 32 : hp(4),
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  manageSubLink: {
    alignSelf: "center",
    paddingVertical: isWeb ? 12 : hp(1.5),
    marginTop: isWeb ? 8 : hp(1),
  },
  manageSubLinkText: {
    fontSize: isWeb ? 14 : wp(3.3),
    fontFamily: "regular",
    color: "#6b7280",
  },
});
