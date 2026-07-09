import React, { useEffect, useRef } from "react";
import { Platform, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import { DefaultLoader as Loader } from "@/core/components/section-a";
import {
  HabitCard,
  HabitLinkCard,
  HabitStackCard,
} from "@/core/components/section-b";
import WebDashboardHeader from "@/core/components/section-b/header/WebDashboardHeader";
import { useHabitMarketSeelAllForm } from "@/core/hooks";
import { getHabitDataByCategory } from "@/core/services/section-b";

// Web-adapted rewrite (July 2026 direction: web UX over pixel-mobile parity).
// State/data stay in useHabitMarketSeelAllForm; this file is presentation only.
// Card props mirror the mobile InfiniteLoaders prop-for-prop so behavior matches
// the /dashboard/habit-market rows (see HabitStacksRowInfiniteLoader et al).

const EMPTY_LABEL: Record<number, string> = {
  1: "No habit stacks yet.",
  2: "No habits yet.",
  3: "No habit links yet.",
  4: "No habit link items yet.",
};

const HabitMarketSeelAllScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useHabitMarketSeelAllForm({ navigation, route });
  const { stacksFetcher } = form;

  const items =
    (getHabitDataByCategory(
      stacksFetcher.data ?? [],
      form.selectedCategoryId
    ) as any[]) ?? [];

  const initialLoading =
    (form.loading || stacksFetcher.loading) && items.length === 0;

  // showCopyButton rule carried over from the previous MarketSection wiring.
  const showCopyButton =
    form.selectedCategoryId === 1 ? true : form.showCopyButton;
  const username = form.user?.collectdata?.username;

  // Infinite scroll: IntersectionObserver sentinel. stacksFetcher changes
  // identity every render, so the observer reads it through a ref instead of
  // re-subscribing (and never auto-fetches while a page is already loading —
  // loadNext also self-guards via its loadingRef).
  const fetcherRef = useRef(stacksFetcher);
  fetcherRef.current = stacksFetcher;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const f = fetcherRef.current;
        if (entries.some((e) => e.isIntersecting) && f.hasMore && !f.loading) {
          f.loadNext();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const renderCard = (item: any, idx: number) => {
    const key = `${item?.documentId ?? item?.id ?? idx}`;
    switch (form.selectedCategoryId) {
      case 2:
        return (
          <HabitCard
            key={key}
            showCopyButton={showCopyButton}
            showCopyButtonText="Copy Habit"
            onCopyPress={form.copyItem}
            username={username}
            mustReloadUser={true}
            showHabitBanner={true}
            habit={item}
            onOpenItem={form.onOpenLinkItem}
            hideCalendar={true}
            selectedMarketActionId={4}
            marketOwnerId={item?.marketOwnerId}
          />
        );
      case 3:
        return (
          <HabitLinkCard
            key={key}
            showCopyButton={showCopyButton}
            showCopyButtonText="Copy HabitLink"
            onCopyPress={form.copyItem}
            showHabitLinkBanner={true}
            link={item}
            onOpenItem={form.onOpenLinkItem}
            costSymbol=""
            hideCalendar={true}
            showHabitLinkNav={true}
            selectedMarketActionId={4}
            marketOwnerId={item?.marketOwnerId}
            mustReloadUser={true}
          />
        );
      case 4:
        return (
          <HabitLinkCard
            key={key}
            showCopyButton={false}
            showCopyButtonText="None"
            showCopyButtonForItem={showCopyButton}
            showCopyButtonTextForItem="Copy"
            onCopyPress={form.copyItem}
            showHabitLinkBanner={true}
            link={item}
            onOpenItem={form.onOpenLinkItem}
            costSymbol=""
            showHabitLinkNav={false}
            showExpandedButton={true}
            hideCalendar={true}
            selectedMarketActionId={4}
            marketOwnerId={item?.marketOwnerId}
            mustReloadUser={true}
          />
        );
      case 1:
      default:
        return (
          <HabitStackCard
            key={key}
            showCopyButton={showCopyButton}
            showCopyButtonText="Copy HabitStack"
            onCopyPress={form.copyItem}
            stack={item}
            canEdit={false}
            username={username}
            onOpenLinkItem={form.onOpenLinkItem}
            mustReloadUser={true}
            hideCalendar={true}
            selectedMarketActionId={4}
          />
        );
    }
  };

  return (
    <View
      style={[
        MainStyles.root2,
        Platform.OS === "web" && { paddingHorizontal: 0, paddingTop: 0 },
      ]}
    >
      {/* Sticky top bar — shared web dashboard header */}
      <WebDashboardHeader
        title={form.destinationScreenTitle}
        onBack={
          form.cameFromDrawerTab ? undefined : () => navigation.goBack()
        }
        onOpenDrawer={
          form.cameFromDrawerTab ? () => navigation.openDrawer() : undefined
        }
      />

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto w-full">
        {/* Page header */}
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          {form.destinationScreenTitle}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse ready-made habits from the NoCaps market.
        </p>

        {/* Category tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {form.habitCategories.map((category) => {
            const active = category.id === form.selectedCategoryId;
            return (
              <button
                key={category.id}
                onClick={() => {
                  form.setSelectedCategoryId(category.id);
                  form.setHabitCategory(category.name);
                }}
                className={
                  active
                    ? "rounded-full bg-white text-neutral-900 px-4 py-1.5 text-sm font-semibold transition-colors"
                    : "rounded-full bg-white/5 border border-white/10 text-muted-foreground px-4 py-1.5 text-sm font-medium hover:bg-white/10 hover:text-foreground transition-colors"
                }
              >
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Sector chips — a single active chip labels the sector you arrived
            filtered to (the title itself is generic); direct visits show all. */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {form.sectors.map((sector) => {
            const active = sector.id === form.activeSector;
            return (
              <button
                key={sector.documentId}
                onClick={() => form.setActiveSector(sector.id)}
                className={
                  active
                    ? "rounded-full bg-white/15 text-foreground px-3 py-1 text-xs font-semibold transition-colors"
                    : "rounded-full border border-white/10 text-muted-foreground px-3 py-1 text-xs font-medium hover:bg-white/5 hover:text-foreground transition-colors"
                }
              >
                {sector.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {initialLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white/5 h-64"
              />
            ))}
          </div>
        ) : items.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6 items-start">
              {items.map((item, idx) => (
                <div
                  key={`${item?.documentId ?? item?.id ?? idx}`}
                  className="min-w-0"
                >
                  {renderCard(item, idx)}
                </div>
              ))}
            </div>

            {/* Pagination footer: sentinel + accessible fallback */}
            <div ref={sentinelRef} className="h-2" />
            <div className="flex justify-center py-6">
              {stacksFetcher.loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Loading more…
                </div>
              ) : stacksFetcher.hasMore ? (
                <button
                  onClick={() => stacksFetcher.loadNext()}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                >
                  Load more
                </button>
              ) : (
                <span className="text-xs text-muted-foreground">
                  You&apos;ve reached the end.
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <MaterialCommunityIcons
              name="storefront-outline"
              size={48}
              color={Colors.text_color}
            />
            <p className="mt-4 text-lg font-semibold text-foreground">
              {EMPTY_LABEL[form.selectedCategoryId] ?? "Nothing here yet."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back soon — new market items are added regularly.
            </p>
          </div>
        )}
      </div>

      <Loader status={form.loading} />
    </View>
  );
};

export default HabitMarketSeelAllScreen;
