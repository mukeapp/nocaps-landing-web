import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/core/constants/Colors";
import { useNavigation } from "@react-navigation/native";

import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import MetaRow from "./MetaRow";
import {HabitStackComponent} from "@/core/models/section-b/habit";
import {HabitStackMarketComponent, RouterData} from "@/core/models/section-b";
import {updateMarkHabitStackAsMarketInProgress} from "@/core/services/section-b/section-b-3";
import {Stack} from "expo-router";

type Props = {
  // Header bits
  icon?: string;
  color: string;
  iconColor?: string; // star tint + dots color
  reviewColor?: string;          // review dot color
  name?: string;
  personsCount: number;
  expanded: boolean;
  canEdit?: boolean;
  setExpanded: (v: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;

  // Meta bits
  costSymbol?: string;
  cost: number;
  focus?: string;
  priority?: string;
  statusIcon?: string;

  stack?: HabitStackComponent;
  hideCalendar?: boolean;
  onScoreComplete?: () => void;
  canAIScore?: boolean;
  hideChevron?: boolean;
  hideHabitStackCost?: boolean; // If true, the cost of the habit stack will be hidden
  hideHabitStackCalendarOption?: boolean; // If true, the calendar option will be hidden for non-friends
};

const HabitStackHeader: React.FC<Props> = ({
  icon,
  color,
  reviewColor = 'rgba(128, 128, 128, 1)',
  iconColor =  'rgba(128, 128, 128, 1)',
  name,
  personsCount,
  expanded,
  canEdit = false,
  setExpanded,
  onEdit,
  onDelete,
  costSymbol,
  cost,
  focus,
  priority,
  statusIcon = "play",
  stack,
  hideCalendar = false,
  onScoreComplete,
  canAIScore = false,
  hideChevron = false,
  hideHabitStackCost = false,
  hideHabitStackCalendarOption = false,
}) => {
  const navigation = useNavigation<any>();
  const goToHabitStackCalendar = () => {
    const routerData: RouterData = {
      destinationScreenTitle: "HabitStack Calendar",
      habitStack: stack,
    }
    navigation.navigate("habit-calendar", {
      OriginScreen: "habit-stack-header",
      routerData,
    });
  }

  const sendToMarketInProgress = async (habitStackId: string) : Promise<HabitStackMarketComponent> => {

    const response = await updateMarkHabitStackAsMarketInProgress({ id: habitStackId, valid: true });

    return response;

  }



  return (
    <View style={s.headerRow}>
      <HeaderLeft icon={icon} color={reviewColor} iconColor={iconColor} habitStack={stack}  />
      <View style={{ flex: 1, marginLeft: 8 }}>
        <HeaderRight
          name={name}
          personsCount={personsCount}
          expanded={expanded}
          canEdit={canEdit}
          setExpanded={setExpanded}
          onEdit={onEdit}
          onDelete={onDelete}
          onClickOpenIcon2={goToHabitStackCalendar}
          hideCalendar={hideCalendar}
          isHabitStack={true}
          stack={stack}
          sendToMarketInProgress={sendToMarketInProgress}
          onScoreComplete={onScoreComplete}
          canAIScore={canAIScore}
          hideChevron={hideChevron}
          hideHabitStackCalendarOption={hideHabitStackCalendarOption}
        />
        <MetaRow
          cost={cost}
          focus={focus}
          priority={priority}
          statusIcon={statusIcon}
          costSymbol={costSymbol}
          hideHabitStackCost={hideHabitStackCost}
        />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
});

export default HabitStackHeader;
