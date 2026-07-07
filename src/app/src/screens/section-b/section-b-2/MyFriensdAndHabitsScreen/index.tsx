import React, { useEffect } from "react";
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
import { useMyFriendsAndHabitsForm } from "@/core/hooks";
import { getHabitDataByCategory } from "@/core/services/section-b";

// Web-adapted rewrite (July 2026 direction: web UX over pixel-mobile parity),
// third screen on the pattern after MyHabitStacksScreen and
// HabitMarketSeelAllScreen. State/data stay in useMyFriendsAndHabitsForm; card
// props mirror the mobile Row components prop-for-prop (HabitStacksRow,
// HabitsRow, HabitLinksRow, HabitLinkItemsRow) so behavior is unchanged.

const EMPTY_LABEL: Record<number, string> = {
  1: "No habit stacks yet.",
  2: "No habits yet.",
  3: "No habit links yet.",
  4: "No habit link items yet.",
};

type SectorSectionProps = {
  sector: any;
  stacks: any[] | undefined;
  onNeedFetch: (sectorId: string) => void;
  selectedCategoryId: number;
  renderCard: (item: any, idx: number) => React.ReactNode;
};

const SectorSection: React.FC<SectorSectionProps> = ({
  sector,
  stacks,
  onNeedFetch,
  selectedCategoryId,
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
        <h2 className="text-lg font-semibold text-foreground">
          {sector?.label ?? "—"}
        </h2>
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

const MyFriendsAndHabitsScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useMyFriendsAndHabitsForm({ navigation, route });
  const username = form.userdata?.collectdata?.username;

  const onOpenLinkItem = (habitLink: any) =>
    navigation.navigate("habitlinks", {
      originScreen: "my-friends-and-habits",
      habitLink: habitLink,
    });

  const renderCard = (item: any, idx: number) => {
    const key = `${item?.documentId ?? item?.id ?? idx}`;
    switch (form.selectedCategoryId) {
      case 2:
        return (
          <HabitCard
            key={key}
            showCopyButton={form.showCopyButton}
            showCopyButtonText="Copy Habit"
            onCopyPress={form.copyItem}
            username={username}
            mustReloadUser={true}
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
            showCopyButton={form.showCopyButton}
            showCopyButtonText="Copy HabitLink"
            onCopyPress={form.copyItem}
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
      case 4:
        return (
          <HabitLinkCard
            key={key}
            showCopyButton={false}
            showCopyButtonText="None"
            showCopyButtonForItem={form.showCopyButton}
            showCopyButtonTextForItem="Copy"
            onCopyPress={form.copyItem}
            showHabitLinkBanner={true}
            link={item}
            onOpenItem={onOpenLinkItem}
            costSymbol=""
            showHabitLinkNav={false}
            showExpandedButton={true}
            hideCalendar={false}
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
            showCopyButton={true}
            showCopyButtonText="Copy HabitStack"
            onCopyPress={form.copyItem}
            stack={item}
            canEdit={false}
            username={username}
            onOpenLinkItem={onOpenLinkItem}
            mustReloadUser={true}
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
          See what your friends are building — copy their habits into your
          library.
        </p>

        {/* Friend navigation links (drawer entry only, as on mobile) */}
        {form.cameFromDrawerTab && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {form.friendLinks.map((link: any) => (
              <button
                key={link.id}
                onClick={() => {
                  form.setSelectedFriendLinkId(link.id);
                  link.OnPress();
                }}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 pl-4 pr-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
              >
                {link.name}
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={16}
                  color={Colors.gray}
                />
              </button>
            ))}
          </div>
        )}

        {/* Category tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
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

        {/* Friend filter row */}
        {form.friends.length > 0 && (
          <div className="mt-5 flex gap-4 overflow-x-auto pb-2 border-b border-white/10">
            <button
              onClick={() => form.setSelectedFriendUserId(null)}
              className="flex flex-col items-center shrink-0"
            >
              <span
                className={
                  form.selectedFriendUserId === null
                    ? "grid place-items-center h-14 w-14 rounded-full bg-[#2D9CDB]/20 ring-2 ring-[#2D9CDB]"
                    : "grid place-items-center h-14 w-14 rounded-full bg-card ring-1 ring-white/10 hover:ring-white/25 transition-shadow"
                }
              >
                <MaterialCommunityIcons
                  name="account-group-outline"
                  size={26}
                  color={
                    form.selectedFriendUserId === null
                      ? Colors.primary
                      : Colors.text_color
                  }
                />
              </span>
              <span
                className={
                  form.selectedFriendUserId === null
                    ? "mt-1.5 w-16 truncate text-center text-xs font-semibold text-foreground"
                    : "mt-1.5 w-16 truncate text-center text-xs text-muted-foreground"
                }
              >
                All
              </span>
            </button>

            {form.friends.map((friend: any) => {
              const active = form.selectedFriendUserId === friend.userId;
              const initial = (friend.username?.[0] ?? "?").toUpperCase();
              return (
                <button
                  key={friend.userId}
                  onClick={() => form.setSelectedFriendUserId(friend.userId)}
                  className="flex flex-col items-center shrink-0"
                >
                  <span
                    className={
                      active
                        ? "grid place-items-center h-14 w-14 rounded-full overflow-hidden bg-card ring-2 ring-[#2D9CDB]"
                        : "grid place-items-center h-14 w-14 rounded-full overflow-hidden bg-card ring-1 ring-white/10 hover:ring-white/25 transition-shadow"
                    }
                  >
                    {friend.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={friend.photo}
                        alt={friend.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-[#2D9CDB]">
                        {initial}
                      </span>
                    )}
                  </span>
                  <span
                    className={
                      active
                        ? "mt-1.5 w-16 truncate text-center text-xs font-semibold text-foreground"
                        : "mt-1.5 w-16 truncate text-center text-xs text-muted-foreground"
                    }
                  >
                    {friend.username}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Sector sections */}
        {form.sectors.length ? (
          form.sectors.map((sector: any) => {
            const sectorId = sector?.documentId ?? "";
            return (
              <SectorSection
                key={`${sector?.documentId ?? sector?.id}`}
                sector={sector}
                stacks={
                  sectorId ? form.filteredStacksBySector[sectorId] : []
                }
                onNeedFetch={form.fetchStacks}
                selectedCategoryId={form.selectedCategoryId}
                renderCard={renderCard}
              />
            );
          })
        ) : !form.loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <MaterialCommunityIcons
              name="account-group-outline"
              size={48}
              color={Colors.text_color}
            />
            <p className="mt-4 text-lg font-semibold text-foreground">
              No sectors found.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add friends to see their habits here.
            </p>
          </div>
        ) : null}
      </div>

      <Loader status={form.loading} />
    </View>
  );
};

export default MyFriendsAndHabitsScreen;
