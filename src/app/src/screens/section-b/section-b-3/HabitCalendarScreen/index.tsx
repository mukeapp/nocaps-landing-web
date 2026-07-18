import { setUserLogout, selectUser } from "@/core/redux/user-data";
import { useDispatch } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
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
import {
  CalendarLoadProgress,
  CalendarRows,
  HabitCalendar,
  HabitCard,
  HabitEditDateTimeRows,
  HabitLinkCard,
  HabitLinkItemCard,
  HabitStackCard,
  Header2,
} from "@/core/components/section-b";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
import {
  useFriendRequestForm,
  useHabitCalendarForm,
  useNewFriendsForm,
  useTimePickers,
  useYourFriendsForm,
} from "@/core/hooks";
import { FriendsVerticalList } from "@/core/components/section-b-1";

const HabitCalendarScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const pickers = useTimePickers();
  const form = useHabitCalendarForm({ navigation, route });
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

  return (
    <View style={MainStyles.root2}>
      <Header2
        title={form.destinationScreenTitle}
        titleTextFormat={1}
        titleVisibilityIcon={false}
        showSettingsIcon={true}
        navigation={navigation}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HabitCalendar
          calendarType={form.calendarType}
          setCalendarType={form.setCalendarType}
          showTypeDropdown={form.showTypeDropdown}
          setShowTypeDropdown={form.setShowTypeDropdown}
          showCalendarPicker={form.showCalendarPicker}
          setShowCalendarPicker={form.setShowCalendarPicker}
          selectedYear={form.selectedYear}
          setSelectedYear={form.setSelectedYear}
          selectedMonth={form.selectedMonth}
          setSelectedMonth={form.setSelectedMonth}
          selectedWeek={form.selectedWeek}
          setSelectedWeek={form.setSelectedWeek}
          habitCalendarData={form.habitCalendarData}
          setHabitCalendarData={form.setHabitCalendarData}
        />

        {/* Progress Modal */}
      <CalendarLoadProgress
        visible={form.isLoadingProgress}
        logs={form.progressLogs}
      />

        {form.habitStack && (
          <HabitStackCard
            showCopyButton={false}
            showCopyButtonText={"None"}
            onCopyPress={() => {
              console.log("Copy pressed");
            }}
            key={
              form.habitStack?.documentId ??
              form.habitStack?.id ??
              Math.random()
            }
            stack={form.habitStack}
            canEdit={false}
            username={undefined}
            onOpenLinkItem={form.onOpenLinkItem}
            mustReloadUser={true}
            hideCalendar={true}
            showHabitLinkNav={false}
            showBottomUpSheetItemList={true}
          />
        )}

        {form.habit && (
          <HabitCard
            showCopyButton={false}
            showCopyButtonText={"None"}
            onCopyPress={() => {
              console.log("Copy pressed");
            }}
            username={undefined}
            mustReloadUser={true}
            showHabitBanner={true}
            key={form.habit?.documentId ?? form.habit?.id ?? Math.random()}
            habit={form.habit}
            onOpenItem={form.onOpenLinkItem}
            hideCalendar={true}
            showHabitLinkNav={false}
            showBottomUpSheetItemList={true}
          />
        )}

        {form.habitLink && (
          <HabitLinkCard
            showCopyButton={false}
            showCopyButtonText={'None'}
            onCopyPress={() => { console.log("Copy pressed"); }}
            showHabitLinkBanner={true}
            key={form.habitLink?.documentId ?? form.habitLink?.id ?? Math.random()}
            link={form.habitLink}
            onOpenItem={form.onOpenLinkItem}
            costSymbol={""}
            hideCalendar={true}
            canAIScore={false}
            showHabitLinkNav={false}
            showBottomUpSheetItemList={true}
          />
        )}

        {form.habitLinkItem && (
          <HabitLinkItemCard
            item={form.habitLinkItem}
            costSymbol={form.costSymbol}
            onOpenItem= {() => console.log("Open Item")}
            onInfo= {() => console.log("Info")}
            color= {Colors.primary}
          />
        )}
      </ScrollView>
      <Loader status={form.loading} />
    </View>
  );
};

export default HabitCalendarScreen;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp("0%"),
    paddingBottom: hp("2%"),
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
});
