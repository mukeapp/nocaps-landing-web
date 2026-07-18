import React, { useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";

import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import { DefaultLoader as Loader } from "@/core/components/section-a";
import { useHabitStackSearchShowForm } from "@/core/hooks";
import { HabitStackPill, UserRow } from "@/core/components/section-c";
import { HabitStackCard } from "@/core/components/section-b";
import { HabitStackComponent } from "@/core/models/section-b";
import Ionicons from "@expo/vector-icons/Ionicons";

const HabitStackSearchShowScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useHabitStackSearchShowForm({ navigation, route });

  const handleEndReached = useCallback(() => {
    if (!form.habitStackComponentFetcher.loading && form.habitStackComponentFetcher.hasMore) {
      form.habitStackComponentFetcher.loadNext();
    }
  }, [form.habitStackComponentFetcher]);

  const keyExtractor = useCallback(
    (item: HabitStackComponent, idx: number) =>
      `${item?.documentId ?? item?.id ?? idx}`,
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: HabitStackComponent }) => (
      <View style={styles.cardWrapper}>
        <View style={styles.cardInner}>
          <HabitStackCard
            stack={item}
            canEdit={false}
            hideCalendar={true}
            mustReloadUser={true}
            showExpandedButton={true}
            showHabitLinkNav={false}
          />
        </View>
      </View>
    ),
    []
  );

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={styles.backCircle}>
            <Ionicons name="arrow-back" size={18} color={Colors.white} />
          </View>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{form.destinationScreenTitle}</Text>
          {form.sector?.label ? (
            <View style={styles.sectorPill}>
              <Text style={styles.sectorPillText}>{form.sector.label}</Text>
            </View>
          ) : null}
          {form.habitStackSearchName ? (
            <View style={styles.sectorPill}>
              <Text style={styles.sectorPillText}>
                Search Name: {form.habitStackSearchName}
              </Text>
            </View>
          ) : null}
          {form.users.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {form.users.map((user, idx) => (
                <React.Fragment key={user.id}>
                  <UserRow user={user} hideOptions={true} hideSelect={true} />
                  {idx < form.users.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              ))}
            </ScrollView>
          )}
          {form.habitStacks.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {form.habitStacks.map((habitStack, idx) => (
                <React.Fragment key={habitStack.id}>
                  <HabitStackPill habitStack={habitStack} />
                  {idx < form.habitStacks.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    );
  }, [navigation, form.destinationScreenTitle, form.sector, form.users, form.habitStacks, form.habitStackSearchName]);

  const renderEmpty = useCallback(() => {
    if (!form.habitStackComponentFetcher.loading) {
      return (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No HabitStacks found.</Text>
        </View>
      );
    }
    return null;
  }, [form.habitStackComponentFetcher.loading]);

  const renderFooter = useCallback(() => {
    if (form.habitStackComponentFetcher.loading) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color={Colors.white} />
        </View>
      );
    }
    return null;
  }, [form.habitStackComponentFetcher.loading]);

  return (
    <View style={MainStyles.root2}>
      <FlatList
        data={form.habitStackComponentFetcher.data ?? []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />

      <Loader status={form.loading} />
    </View>
  );
};

export default HabitStackSearchShowScreen;

const styles = StyleSheet.create({
  cardWrapper: {
    alignItems: "center",
    backgroundColor: "#000",
  },
  cardInner: {
    width: "100%",
    maxWidth: 600,
    marginBottom: hp(5),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: { flexShrink: 0 },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerTitleContainer: {
    flexShrink: 1,
    flexDirection: "column",
    gap: 6,
  },
  headerTitle: {
    color: "#f1f5f9",
    fontSize: 18,
    fontFamily: "poppins_semibold",
  },
  sectorPill: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  sectorPillText: {
    color: "#000000",
    fontSize: 12,
    fontFamily: "poppins_medium",
  },
  empty: {
    height: hp(30),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: Colors.gray || "#A9A9A9",
    fontSize: 14,
    fontFamily: "poppins_regular",
  },
  footer: {
    paddingVertical: hp(2),
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 14,
  },
});
