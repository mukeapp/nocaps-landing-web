import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { useFocusEffect } from "@react-navigation/native";

import { MainStyles } from "@/core/constants/styles";
import { Images } from "@/core/constants/Images";
import { Colors } from "@/core/constants/Colors";
import { DefaultLoader as Loader } from "@/core/components/section-a";
import useMyHabitLibraryForm from "@/core/hooks/useMyHabitLibraryForm";
import { useSelector } from "react-redux";
import {HabitCategories, HabitLinksRow, HabitsRow, HabitStacksRow} from "@/core/components/section-b-1";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";


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

  const [selectedSectorDocId, setSelectedSectorDocId] = useState<string | null>(null);

  // "All" (null) is the default — no auto-selection needed

  // Force reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      form.refetch();
      return () => {};
    }, [form.refetch])
  );

  const renderHabitStacksRow = useCallback(
    (sectorDocId?: string) => {
      const sid = sectorDocId ?? "";
      return (
        <HabitStacksRow
          mustReloadUser={false}
          userdata={userdata}
          habitCategoryId={form.selectedCategoryId}
          sectorId={sid}
          stacks={sid ? form.stacksBySector[sid] : []}
          onNeedFetch={form.fetchStacks}
          onOpenLinkItem={onOpenLinkItem}
        />
      );
    },
    [form.stacksBySector, form.fetchStacks]
  );

  const renderHabitsRow = useCallback(
    (sectorDocId?: string) => {
      const sid = sectorDocId ?? "";
      return (
        <HabitsRow
          showHabitBanner={true}
          userdata={userdata}
          habitCategoryId={form.selectedCategoryId}
          sectorId={sid}
          stacks={sid ? form.stacksBySector[sid] : []}
          onNeedFetch={form.fetchStacks}
          onOpenLinkItem={onOpenLinkItem}
        />
      );
    },
    [form.stacksBySector, form.fetchStacks]
  );

  const renderHabitLinksRow = useCallback(
    (sectorDocId?: string) => {
      const sid = sectorDocId ?? "";
      return (
        <HabitLinksRow
          showHabitLinkBanner={true}
          userdata={userdata}
          habitCategoryId={form.selectedCategoryId}
          sectorId={sid}
          stacks={sid ? form.stacksBySector[sid] : []}
          onNeedFetch={form.fetchStacks}
          onOpenLinkItem={onOpenLinkItem}
          showHabitLinkNav={false}
          showExpandedButton={true}
        />
      );
    },
    [form.stacksBySector, form.fetchStacks]
  );

  const categoryLabel =
    form.selectedCategoryId === 1 ? "HabitStacks"
    : form.selectedCategoryId === 2 ? "Habits"
    : "HabitLinks";

  const selectedSector = form.sectors.find(
    (s: any) => s?.documentId === selectedSectorDocId
  );

  return (
    <View style={styles.root}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.75}
        >
          <View style={styles.logoBox}>
            <Image source={Images.logo} resizeMode="contain" style={styles.logo} />
          </View>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Habit Library</Text>
          <Text style={styles.headerSub}>
            {form.sectors.length} sector{form.sectors.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      {/* ── Category chips ── */}
      <View>

      <HabitCategories form={form} />
      </View>

      {/* ── Sector pill buttons ── */}
      {(() => {
        const pillData = [{ documentId: "__all__", label: "All" }, ...form.sectors];
        return (
          <FlatList
            data={pillData}
            keyExtractor={(item) => `pill-${item?.documentId}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pillFlatList}
            contentContainerStyle={styles.pillRow}
            renderItem={({ item, index }) => {
              const isAll = item.documentId === "__all__";
              const isActive = isAll
                ? selectedSectorDocId === null
                : selectedSectorDocId === item?.documentId;
              const isFirst = index === 0;
              const isLast = index === pillData.length - 1;
              return (
                <TouchableOpacity
                  style={[
                    styles.pill,
                    isActive && styles.pillActive,
                    { marginLeft: isFirst ? wp(4) : wp(2), marginRight: isLast ? wp(4) : 0 },
                  ]}
                  onPress={() => setSelectedSectorDocId(isAll ? null : item?.documentId ?? null)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, isActive && styles.pillTextActive]} numberOfLines={1}>
                    {item?.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        );
      })()}

      {/* ── Sector content ── */}
      {form.sectors.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <MaterialCommunityIcons name="book-open-outline" size={wp(12)} color={Colors.text_color} />
          </View>
          <Text style={styles.emptyTitle}>Library is empty</Text>
          <Text style={styles.emptySubtitle}>Your habit sectors will appear here once loaded.</Text>
        </View>
      ) : selectedSectorDocId === null ? (
        /* "All" selected — show every sector */
        <ScrollView style={styles.sectorBlock} showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectorBlockContent}>
          {form.sectors.map((sector: any) => (
            <View key={sector?.documentId} style={styles.allSectorItem}>
              <View style={styles.sectorHeader}>
                <View style={styles.sectorAccent} />
                <Text style={styles.sectorLabel}>{sector?.label ?? "—"}</Text>
                <View style={styles.sectorBadge}>
                  <Text style={styles.sectorBadgeText}>{categoryLabel}</Text>
                </View>
              </View>
              {form.selectedCategoryId === 1 && renderHabitStacksRow(sector?.documentId)}
              {form.selectedCategoryId === 2 && renderHabitsRow(sector?.documentId)}
              {form.selectedCategoryId === 3 && renderHabitLinksRow(sector?.documentId)}
            </View>
          ))}
        </ScrollView>
      ) : (
        /* Single sector selected */
        <ScrollView style={styles.sectorBlock} showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectorBlockContent}>
          <View style={styles.sectorHeader}>
            <View style={styles.sectorAccent} />
            <Text style={styles.sectorLabel}>{selectedSector?.label ?? "—"}</Text>
            <View style={styles.sectorBadge}>
              <Text style={styles.sectorBadgeText}>{categoryLabel}</Text>
            </View>
          </View>
          {form.selectedCategoryId === 1 && renderHabitStacksRow(selectedSectorDocId ?? undefined)}
          {form.selectedCategoryId === 2 && renderHabitsRow(selectedSectorDocId ?? undefined)}
          {form.selectedCategoryId === 3 && renderHabitLinksRow(selectedSectorDocId ?? undefined)}
        </ScrollView>
      )}

      <Loader status={form.loading} />
    </View>
  );
};

export default MyHabitLibraryScreen;

const styles = StyleSheet.create({

  root: {
    flex: 1,
    paddingHorizontal: wp(1),
    paddingTop: hp(6),
    backgroundColor: Colors.background_color,
  },
  // ── header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingBottom: hp(1.5),
  },
  menuBtn: {
    marginRight: wp(3),
  },
  logoBox: {
    width: wp(11),
    height: wp(11),
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp(3),
  },
  logo: {
    width: wp(6.5),
    height: wp(6.5),
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: wp(5),
    fontFamily: "bold",
    color: Colors.white,
    lineHeight: wp(6.5),
  },
  headerSub: {
    fontSize: wp(3),
    fontFamily: "regular",
    color: Colors.text_color,
  },
  headerRight: {
    width: wp(11),
  },

  // ── sector pills ─────────────────────────────────────────────────────────────
  pillFlatList: {
    flexGrow: 0,
    marginBottom: hp(1.5),
  },
  pillRow: {
    alignItems: "center",
    paddingVertical: hp(0.5),
  },
  pill: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.9),
    borderRadius: wp(5),
    backgroundColor: Colors.title_background,
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontFamily: "regular",
    fontSize: wp(3.4),
    color: Colors.text_color,
  },
  pillTextActive: {
    color: Colors.white,
    fontFamily: "semibold",
  },

  // ── sector content ────────────────────────────────────────────────────────────
  sectorBlock: {
    flex: 1,
    marginHorizontal: wp(4),
    marginTop: hp(0.5),
  },
  sectorBlockContent: {
    paddingBottom: hp(6),
  },
  allSectorItem: {
    marginBottom: hp(2),
  },
  sectorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
    gap: wp(2.5),
  },
  sectorAccent: {
    width: wp(1),
    height: hp(2.2),
    borderRadius: wp(1),
    backgroundColor: Colors.primary,
  },
  sectorLabel: {
    flex: 1,
    color: Colors.white,
    fontSize: wp(3.8),
    fontFamily: "semibold",
  },
  sectorBadge: {
    backgroundColor: Colors.text_background,
    borderRadius: wp(2),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.3),
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  sectorBadgeText: {
    color: Colors.text_color,
    fontSize: wp(2.6),
    fontFamily: "regular",
  },

  // ── empty state ──────────────────────────────────────────────────────────────
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: hp(10),
    paddingHorizontal: wp(10),
  },
  emptyIconWrap: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  emptyTitle: {
    color: Colors.white,
    fontSize: wp(4.2),
    fontFamily: "semibold",
    marginBottom: hp(0.8),
    textAlign: "center",
  },
  emptySubtitle: {
    color: Colors.text_color,
    fontSize: wp(3.3),
    fontFamily: "regular",
    textAlign: "center",
    lineHeight: wp(5),
  },
});
