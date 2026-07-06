import { setUserLogout, selectUser } from "@/core/redux/user-data";
import { useDispatch } from "react-redux";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { useFocusEffect } from "@react-navigation/native";

import { MainStyles } from "@/core/constants/styles";
import { Images } from "@/core/constants/Images";
import { Colors } from "@/core/constants/Colors";
import { HabitStackCard, Header2 } from "@/core/components/section-b";
import {
  DefaultLoader as Loader,
  ButtonSignIn as Button,
} from "@/core/components/section-a";
import {
  getHabitStackComponentsByUserId,
  DeleteHabitStack,
} from "@/core/api/section-b";
import Toast from "react-native-root-toast";
import { HabitStackComponent } from "@/core/models/section-b";
import { useMyFriendsAndHabitsForm } from "@/core/hooks";
import { FriendsLinks, HabitCategories, HabitLinkItemsRow, HabitLinksRow, HabitsRow, HabitStacksRow, FriendsFilterRow } from "@/core/components/section-b-1";
import {showToastSuccess} from "@/core/utils";

const MyFriendsAndHabitsScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useMyFriendsAndHabitsForm({ navigation, route });
  const [key, setKey] = useState(0);

  // Force reload FlatList when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Reset the stacks and reload
      form.load?.();
      // Force FlatList to remount by changing key
      setKey((prev) => prev + 1);
    }, [form.load])
  );

  const onOpenLinkItem = (habitLink: any) =>
    navigation.navigate("habitlinks", {
      originScreen: "my-friends-and-habits",
      habitLink: habitLink,
    });

  const renderHabitStacksRow = useCallback(
    (sectorDocId?: string) => {
      const sid = sectorDocId ?? "";
      return (
        <HabitStacksRow
          showCopyButton={true}
          showCopyButtonText="Copy HabitStack"
          onCopyPress={form.copyItem}
          mustReloadUser={true}
          userdata={undefined}
          habitCategoryId={1}
          sectorId={sid}
          stacks={sid ? form.filteredStacksBySector[sid] : []}
          onNeedFetch={form.fetchStacks}
          onOpenLinkItem={onOpenLinkItem}
        />
      );
    },
    [form.filteredStacksBySector, form.fetchStacks]
  );



  const renderHabitsRow = useCallback(
    (sectorDocId?: string) => {
      const sid = sectorDocId ?? "";
      return (
        <HabitsRow
          showCopyButton={form.showCopyButton}
          showCopyButtonText="Copy Habit"
          onCopyPress={form.copyItem}
          userdata={null}
          habitCategoryId={form.selectedCategoryId}
          sectorId={sid}
          stacks={sid ? form.filteredStacksBySector[sid] : []}
          onNeedFetch={form.fetchStacks}
          onOpenLinkItem={onOpenLinkItem}
          showHabitBanner={true}
          mustReloadUser={true}
        />
      );
    },
    [form.filteredStacksBySector, form.fetchStacks]
  );

  const renderHabitLinksRow = useCallback(
    (sectorDocId?: string) => {
      const sid = sectorDocId ?? "";
      return (
        <HabitLinksRow
          showCopyButton={form.showCopyButton}
          showCopyButtonText="Copy HabitLink"
          onCopyPress={form.copyItem}
          showHabitLinkBanner={true}
          userdata={null}
          habitCategoryId={form.selectedCategoryId}
          sectorId={sid}
          stacks={sid ? form.filteredStacksBySector[sid] : []}
          onNeedFetch={form.fetchStacks}
          onOpenLinkItem={onOpenLinkItem}
          showHabitLinkNav={false}
          showExpandedButton={true}
        />
      );
    },
    [form.filteredStacksBySector, form.fetchStacks]
  );

  const renderHabitLinkItemsRow = useCallback(
    (sectorDocId?: string) => {
      const sid = sectorDocId ?? "";
      return (
        <HabitLinkItemsRow
          showCopyButton={false}
          showCopyButtonText="None"
          showCopyButtonForItem={form.showCopyButton}
          showCopyButtonTextForItem="Copy"
          onCopyPress={form.copyItem}
          showHabitLinkBanner={true}
          userdata={null}
          habitCategoryId={form.selectedCategoryId}
          sectorId={sid}
          stacks={sid ? form.filteredStacksBySector[sid] : []}
          onNeedFetch={form.fetchStacks}
          onOpenLinkItem={onOpenLinkItem}
          showHabitLinkItems={true}
          showHabitLinkNav={false}
          showExpandedButton={true}
        />
      );
    },
    [form.filteredStacksBySector, form.fetchStacks]
  );

  return (
    <View style={MainStyles.root2}>

      <Header2
        title={form.destinationScreenTitle}
        titleTextFormat={1}
        titleVisibilityIcon={false}
        showSettingsIcon={true}
        navigation={navigation}
        cameFromDrawerTab={form.cameFromDrawerTab}
      />

      { form.cameFromDrawerTab && <FriendsLinks form={form} /> }

      {/* Habit categories Filter row */}
      <HabitCategories form={form} />

      {/* Friends List Filter row */}
      <FriendsFilterRow
        friends={form.friends}
        selectedFriendUserId={form.selectedFriendUserId}
        onSelectFriend={form.setSelectedFriendUserId}
      />

      <FlatList
        data={form.sectors}
        keyExtractor={(item) => `${item?.documentId ?? item?.id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(6) }}
        renderItem={({ item }) => (
          <View style={styles.sectorBlock}>
            <View style={styles.sectorLabelRow}>
              <View style={styles.sectorAccent} />
              <Text style={styles.sectorLabel}>{item?.label ?? "—"}</Text>
            </View>
            {form.selectedCategoryId == 1 &&
              renderHabitStacksRow(item?.documentId)}
            {form.selectedCategoryId == 2 && renderHabitsRow(item?.documentId)}
            {form.selectedCategoryId == 3 &&
              renderHabitLinksRow(item?.documentId)}
            {form.selectedCategoryId == 4 &&
              renderHabitLinkItemsRow(item?.documentId)}
          </View>
        )}
        ListEmptyComponent={
          !form.loading ? (
            <View style={styles.notfound}>
              <Text style={styles.notfoundText}>No sectors found.</Text>
            </View>
          ) : null
        }
      />

      <Loader status={form.loading} />
    </View>
  );
};

export default MyFriendsAndHabitsScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("1%"),
  },
  logoBox: {
    width: wp("12%"),
    height: wp("12%"),
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp("3%"),
    marginRight: wp("3%"),
  },
  logo: {
    width: wp("7%"),
    height: wp("7%"),
  },
  listWrap: {
    flex: 1,
    marginTop: hp("2%"),
  },
  notfound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: hp("55%"),
  },
  nottxt: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "semibold",
  },
  box: {
    width: wp(12),
    height: wp(12),
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp(3),
    marginRight: wp(3),
  },

  searchContainer: {
    flexDirection: "row",
    height: hp(6),
    alignItems: "center",
    marginHorizontal: wp(6),
    marginVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: wp(3),
    backgroundColor: "#F5F5F8",
  },
  searchIcon: {
    height: hp(2.5),
    width: wp(5),
    tintColor: "#000",
  },
  searchInput: {
    flex: 1,
    marginLeft: wp(3),
    fontFamily: "poppins_regular",
    fontSize: wp(4),
    lineHeight: hp(3),
    color: Colors.black || "#000",
  },
  filterButton: {
    padding: wp(2),
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    height: hp(2.5),
    width: wp(5),
    tintColor: "#000",
  },

  listContent: {
    paddingVertical: hp(1.5),
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    height: hp(6.5),
    paddingHorizontal: wp(2.4),
    borderRadius: wp(3),
  },
  chipText: {
    alignSelf: "center",
    fontSize: wp(3.6),
    fontFamily: "poppins_semibold",
  },

  sectorBlock: {
    marginHorizontal: wp(4),
    marginBottom: hp(1.2),
  },
  sectorLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.8),
  },
  sectorAccent: {
    width: wp(1),
    height: hp(2.2),
    backgroundColor: Colors.primary,
    borderRadius: wp(1),
    marginRight: wp(2),
  },
  sectorLabel: {
    color: Colors.white,
    fontSize: wp(4),
    fontFamily: "poppins_semibold",
  },

  stacksContent: {
    paddingVertical: hp(1),
    paddingLeft: wp(0.5),
    paddingRight: wp(0.5),
  },
  stackCard: {
    width: wp(90),
    minHeight: hp(10),
    marginRight: wp(3),
    borderRadius: wp(3),
    backgroundColor: Colors.text_background,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
  },
  stackTitle: {
    color: Colors.white,
    fontSize: wp(3.8),
    fontFamily: "poppins_semibold",
  },
  stackMeta: {
    marginTop: hp(0.6),
    color: Colors.gray || "#A9A9A9",
    fontSize: wp(3.2),
    fontFamily: "poppins_regular",
  },

  emptyRow: {
    paddingVertical: hp(1.5),
  },
  emptyRowText: {
    color: Colors.gray || "#A9A9A9",
    fontSize: wp(3.4),
    fontFamily: "poppins_regular",
  },

  notfoundText: {
    color: Colors.white,
    fontSize: wp(4),
    fontFamily: "poppins_semibold",
  },
});