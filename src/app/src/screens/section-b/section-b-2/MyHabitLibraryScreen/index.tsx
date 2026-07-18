import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { useSelector } from "react-redux";
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
import useMyHabitLibraryForm from "@/core/hooks/useMyHabitLibraryForm";
import { getHabitDataByCategory } from "@/core/services/section-b";

// Web-adapted rewrite (July 2026 direction: web UX over pixel-mobile parity),
// fourth screen on the pattern. State/data stay in useMyHabitLibraryForm; card
// props mirror this screen's previous Row usage (HabitStacksRow / HabitsRow /
// HabitLinksRow — copy buttons off: it's the user's own library).

const EMPTY_LABEL: Record<number, string> = {
  1: "No habit stacks yet.",
  2: "No habits yet.",
  3: "No habit links yet.",
};

type SectorSectionProps = {
  sector: any;
  stacks: any[] | undefined;
  onNeedFetch: (sectorId: string) => void;
  selectedCategoryId: number;
  categoryLabel: string;
  renderCard: (item: any, idx: number) => React.ReactNode;
};

const SectorSection: React.FC<SectorSectionProps> = ({
  sector,
  stacks,
  onNeedFetch,
  selectedCategoryId,
  categoryLabel,
  renderCard,
}) => {
  const sectorId = sector?.documentId ?? "";

  // Per-sector lazy fetch, verbatim from HabitStacksRow's effect.
  useEffect(() => {
    if (!stacks && sectorId) {
      onNeedFetch(sectorId);
    }
  }, [stacks, sectorId, onNeedFetch]);

  const items =
    (getHabitDataByCategory(stacks ?? [], selectedCategoryId) as any[]) ?? [];

  return (
    <section className="mt-8 first:mt-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-4 w-1 rounded bg-[#2D9CDB]" />
        <h2 className="flex-1 text-lg font-semibold text-foreground">
          {sector?.label ?? "—"}
        </h2>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          {categoryLabel}
        </span>
      </div>

      {!stacks ? (
        <div className="animate-pulse rounded-2xl bg-white/5 h-24" />
      ) : items.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
          {items.map((item, idx) => (
            <div
              key={`${item?.documentId ?? item?.id ?? idx}`}
              className="min-w-0"
            >
              {renderCard(item, idx)}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {EMPTY_LABEL[selectedCategoryId] ?? "Nothing here yet."}
        </p>
      )}
    </section>
  );
};

const MyHabitLibraryScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const onOpenLinkItem = (habitLink: any) =>
    navigation.navigate("habitlinks", {
      originScreen: "my-habit-library",
      multiple: true,
      habitLink: habitLink,
    });
  const userdata = useSelector((s: any) => s?.user?.userdata);
  const form = useMyHabitLibraryForm({ navigation, route });
  const username = userdata?.collectdata?.username;

  const [selectedSectorDocId, setSelectedSectorDocId] = useState<
    string | null
  >(null);

  const categoryLabel =
    form.selectedCategoryId === 1
      ? "HabitStacks"
      : form.selectedCategoryId === 2
        ? "Habits"
        : "HabitLinks";

  const visibleSectors =
    selectedSectorDocId === null
      ? form.sectors
      : form.sectors.filter(
          (s: any) => s?.documentId === selectedSectorDocId
        );

  const renderCard = (item: any, idx: number) => {
    const key = `${item?.documentId ?? item?.id ?? idx}`;
    switch (form.selectedCategoryId) {
      case 2:
        return (
          <HabitCard
            key={key}
            showCopyButton={false}
            username={username}
            mustReloadUser={false}
            showHabitBanner={true}
            habit={item}
            onOpenItem={onOpenLinkItem}
            hideCalendar={false}
            selectedMarketActionId={0}
            marketOwnerId={item?.marketOwnerId}
            showExpandedButton={true}
            showHabitLinkNav={false}
          />
        );
      case 3:
        return (
          <HabitLinkCard
            key={key}
            showCopyButton={false}
            showHabitLinkBanner={true}
            link={item}
            onOpenItem={onOpenLinkItem}
            costSymbol=""
            hideCalendar={false}
            showHabitLinkNav={false}
            showExpandedButton={true}
            selectedMarketActionId={0}
            marketOwnerId={item?.marketOwnerId}
            mustReloadUser={false}
          />
        );
      case 1:
      default:
        return (
          <HabitStackCard
            key={key}
            showCopyButton={false}
            stack={item}
            canEdit={false}
            username={username}
            onOpenLinkItem={onOpenLinkItem}
            mustReloadUser={false}
            hideCalendar={false}
            selectedMarketActionId={0}
            showExpandedButton={true}
            showHabitLinkNav={false}
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
        title="My Habit Library"
        onOpenDrawer={() => navigation.openDrawer()}
      />

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto w-full">
        {/* Page header */}
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          My Habit Library
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {form.sectors.length} sector{form.sectors.length !== 1 ? "s" : ""} —
          everything you&apos;ve saved, organized by area.
        </p>

        {/* Category tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {form.habitCategories.map((category: any) => {
            const active = category.id === form.selectedCategoryId;
            return (
              <button
                key={category.id}
                onClick={() => form.setSelectedCategoryId(category.id)}
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

        {/* Sector filter pills (functional: All or a single sector) */}
        {form.sectors.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedSectorDocId(null)}
              className={
                selectedSectorDocId === null
                  ? "rounded-full bg-[#2D9CDB] text-white px-3 py-1 text-xs font-semibold transition-colors"
                  : "rounded-full border border-white/10 text-muted-foreground px-3 py-1 text-xs font-medium hover:bg-white/5 hover:text-foreground transition-colors"
              }
            >
              All
            </button>
            {form.sectors.map((sector: any) => {
              const active = selectedSectorDocId === sector?.documentId;
              return (
                <button
                  key={`pill-${sector?.documentId}`}
                  onClick={() =>
                    setSelectedSectorDocId(sector?.documentId ?? null)
                  }
                  className={
                    active
                      ? "rounded-full bg-[#2D9CDB] text-white px-3 py-1 text-xs font-semibold transition-colors"
                      : "rounded-full border border-white/10 text-muted-foreground px-3 py-1 text-xs font-medium hover:bg-white/5 hover:text-foreground transition-colors"
                  }
                >
                  {sector?.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Sector sections */}
        {form.sectors.length === 0 ? (
          !form.loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <MaterialCommunityIcons
                name="book-open-outline"
                size={48}
                color={Colors.text_color}
              />
              <p className="mt-4 text-lg font-semibold text-foreground">
                Library is empty
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your habit sectors will appear here once loaded.
              </p>
            </div>
          ) : null
        ) : (
          visibleSectors.map((sector: any) => {
            const sectorId = sector?.documentId ?? "";
            return (
              <SectorSection
                key={`${sector?.documentId ?? sector?.id}`}
                sector={sector}
                stacks={sectorId ? form.stacksBySector[sectorId] : []}
                onNeedFetch={form.fetchStacks}
                selectedCategoryId={form.selectedCategoryId}
                categoryLabel={categoryLabel}
                renderCard={renderCard}
              />
            );
          })
        )}
      </div>

      <Loader status={form.loading} />
    </View>
  );
};

export default MyHabitLibraryScreen;
