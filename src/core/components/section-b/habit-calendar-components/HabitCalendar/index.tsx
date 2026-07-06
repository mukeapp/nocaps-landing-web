import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-root-toast";
import {
  HabitLinkItemComponent,
  IHabitCalendar,
  IHabitCalendarCalendarType,
  ScoreCounts,
} from "@/core/models/section-b/habit";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getWeeksInMonth,
} from "@/core/utils";
import {
  getHabitLinkItemDataByHabitIdAndDate,
  getHabitLinkItemDataByHabitLinkIdAndDate,
  getHabitLinkItemDataByHabitStackIdAndDate,
  getHabitLinkItemDataByOriginIdAndDateNoCap,
} from "@/core/services/section-b/section-b-0/habit-link-item-data";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet,
} from "@/core/utils/responsive";
import DayNotesSheet from "@/core/components/section-b/habit-calendar-components/DayNotesSheet";

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1; // Months are 0-indexed, so add 1

const sampleData: IHabitCalendar[] = [
  {
    year: year,
    month: month,
    day: 1,
    habitStackId: "habit123",
    userId: "user456",
    scoreInfo: { color: "red", scoreCode: "BAD" },
  },
  {
    year: year,
    month: month,
    day: 2,
    habitStackId: "habit123",
    userId: "user456",
    scoreInfo: { color: "purple", scoreCode: "POOR" },
  },
  {
    year: year,
    month: month,
    day: 4,
    habitStackId: "habit123",
    userId: "user456",
    scoreInfo: { color: "green", scoreCode: "GOOD" },
  },
  {
    year: year,
    month: month,
    day: 5,
    habitStackId: "habit123",
    userId: "user456",
    scoreInfo: { color: "green", scoreCode: "GOOD" },
  },
  {
    year: year,
    month: month,
    day: 9,
    habitStackId: "habit123",
    userId: "user456",
    scoreInfo: { color: "orange", scoreCode: "AVERAGE" },
  },
  {
    year: year,
    month: month,
    day: 11,
    habitStackId: "habit123",
    userId: "user456",
    scoreInfo: { color: "gold", scoreCode: "EXCELLENT" },
  },
  {
    year: year,
    month: month,
    day: 12,
    habitStackId: "habit123",
    userId: "user456",
    scoreInfo: { color: "gray", scoreCode: "UNKNOWN" },
  },
];

const colorMap: Record<string, string> = {
  gray: "#4b5563",   // UNKNOWN
  red: "#f87171",    // BAD
  purple: "#a855f7", // POOR
  orange: "#fb923c", // AVERAGE
  green: "#22c55e",  // GOOD
  gold: "#fbbf24",   // EXCELLENT
};

type Props = {
  calendarType: IHabitCalendarCalendarType;
  setCalendarType: (type: IHabitCalendarCalendarType) => void;
  showTypeDropdown: boolean;
  setShowTypeDropdown: (show: boolean) => void;
  showCalendarPicker: boolean;
  setShowCalendarPicker: (show: boolean) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedWeek: number[] | null;
  setSelectedWeek: (week: number[] | null) => void;
  habitCalendarData: IHabitCalendar[];
  setHabitCalendarData: (data: IHabitCalendar[]) => void;
};

const HabitCalendar: React.FC<Props> = ({
  calendarType,
  setCalendarType,
  showTypeDropdown,
  setShowTypeDropdown,
  showCalendarPicker,
  setShowCalendarPicker,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedWeek,
  setSelectedWeek,
  habitCalendarData = sampleData,
  setHabitCalendarData,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [gridWidth, setGridWidth] = useState(0);
  const cellSize = gridWidth > 0 ? Math.floor(gridWidth / 7) : wp(11);

  const [numUnknown, setNumUnknown] = useState(0);
  const [numBad, setNumBad] = useState(0);
  const [numPoor, setNumPoor] = useState(0);
  const [numAverage, setNumAverage] = useState(0);
  const [numGood, setNumGood] = useState(0);
  const [numExcellent, setNumExcellent] = useState(0);

  // Toggle: when false -> gray stays gray; when true -> gray shows as red
  const [showGrayAsRed, setShowGrayAsRed] = useState(false);

  // Day notes sheet
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetItems, setSheetItems] = useState<any[]>([]);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [sheetDay, setSheetDay] = useState<{year: number; month: number; day: number} | null>(null);

  const calculateScoreCounts = (data: IHabitCalendar[]): ScoreCounts => {
    const counts: ScoreCounts = {
      numUnknown: 0,
      numBad: 0,
      numPoor: 0,
      numAverage: 0,
      numGood: 0,
      numExcellent: 0,
    };

    data.forEach((item) => {
      const scoreCode = item.scoreInfo?.scoreCode?.toUpperCase();

      switch (scoreCode) {
        case "UNKNOWN":
        case "UNKNOW":
          counts.numUnknown++;
          break;
        case "BAD":
          counts.numBad++;
          break;
        case "POOR":
          counts.numPoor++;
          break;
        case "AVERAGE":
          counts.numAverage++;
          break;
        case "GOOD":
          counts.numGood++;
          break;
        case "EXCELLENT":
          counts.numExcellent++;
          break;
        default:
          counts.numUnknown++;
          break;
      }
    });

    return counts;
  };

  const updateScoreCounts = (data: IHabitCalendar[]) => {
    const counts = calculateScoreCounts(data);
    setNumUnknown(counts.numUnknown);
    setNumBad(counts.numBad);
    setNumPoor(counts.numPoor);
    setNumAverage(counts.numAverage);
    setNumGood(counts.numGood);
    setNumExcellent(counts.numExcellent);
  };

  useEffect(() => {
    updateScoreCounts(habitCalendarData);
  }, [habitCalendarData]);

  const handleDayPress = async (d: number) => {
    const dayData = getDataForDay(selectedYear, selectedMonth, d);

    const isflowHabitStackCalendar = !!dayData?.habitStackId;
    const isflowHabitCalendar = !!dayData?.habitId;
    const isflowHabitLinkCalendar = !!dayData?.habitLinkId;
    const isflowHabitLinkItemCalendar = !!dayData?.habitLinkItemId;

    if (
      (!isflowHabitStackCalendar && !isflowHabitCalendar && !isflowHabitLinkCalendar && !isflowHabitLinkItemCalendar) ||
      (dayData?.habitLinkItemDataCount ?? 0) === 0
    ) {
      Toast.show("No notes for this day");
      return;
    }

    setSheetDay({year: selectedYear, month: selectedMonth + 1, day: d});
    setSheetVisible(true);
    setSheetLoading(true);
    try {
      let items: HabitLinkItemComponent[] = [];
      if (isflowHabitStackCalendar) {
        items = await getHabitLinkItemDataByHabitStackIdAndDate(
          dayData!.habitStackId!,
          selectedYear,
          selectedMonth + 1,
          d,
        );
      } else if (isflowHabitCalendar) {
        items = await getHabitLinkItemDataByHabitIdAndDate(
          dayData!.habitId!,
          selectedYear,
          selectedMonth + 1,
          d,
        );
      } else if (isflowHabitLinkCalendar) {
        items = await getHabitLinkItemDataByHabitLinkIdAndDate(
          dayData!.habitLinkId!,
          selectedYear,
          selectedMonth + 1,
          d,
        );
      } else if (isflowHabitLinkItemCalendar) {
        items = await getHabitLinkItemDataByOriginIdAndDateNoCap(
          dayData!.userId,
          dayData!.habitLinkItemId!,
          selectedYear,
          selectedMonth + 1,
          d,
          1,
        );
      }
      setSheetItems(items);
    } finally {
      setSheetLoading(false);
    }
  };

  const getDataForDay = (
    year: number,
    month: number,
    day: number
  ): IHabitCalendar | undefined => {
    return habitCalendarData.find(
      (d) => d.year === year && d.month === month + 1 && d.day === day
    );
  };

  // Color logic with toggle:
  // - default: gray => gray
  // - when showGrayAsRed = true: gray => red
  // - other colors unchanged
  const getDayColor = (dayData?: IHabitCalendar): string => {
    const rawColorKey =
      dayData?.scoreInfo?.color?.toLowerCase?.() ?? "gray";

    if (rawColorKey === "gray") {
      return showGrayAsRed ? colorMap.red : colorMap.gray;
    }

    return colorMap[rawColorKey] ?? colorMap.gray;
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
    const days: JSX.Element[] = [];
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
    const cellStyle = { width: cellSize, height: cellSize };
    const circleSize = cellSize - wp(2);
    const circleStyle = { width: circleSize, height: circleSize, borderRadius: circleSize / 2 };

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={[styles.dayCell, cellStyle]} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayData = getDataForDay(selectedYear, selectedMonth, d);
      const color = getDayColor(dayData);

      days.push(
        <TouchableOpacity key={d} style={[styles.dayCell, cellStyle]} onPress={() => handleDayPress(d)} activeOpacity={0.7}>
          <View style={[styles.dayCircle, circleStyle, { backgroundColor: color }]}>
            <Text style={styles.dayText}>{d}</Text>
            {(dayData?.habitLinkItemDataCount ?? 0) > 0 && <View style={styles.dayDot} />}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarView}>
        <View style={styles.weekDaysRow}>
          {weekDays.map((wd, i) => (
            <View key={`wd-${i}`} style={[styles.weekDayCell, { width: cellSize }]}>
              <Text style={styles.weekDayText}>{wd}</Text>
            </View>
          ))}
        </View>
        <View
          style={styles.daysGrid}
          onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}
        >
          {days}
        </View>
      </View>
    );
  };

  const renderWeekView = () => {
    if (!selectedWeek) return null;

    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
    const startDay = new Date(selectedYear, selectedMonth, selectedWeek[0]).getDay();
    const cellStyle = { width: cellSize, height: cellSize };
    const circleSize = cellSize - wp(2);
    const circleStyle = { width: circleSize, height: circleSize, borderRadius: circleSize / 2 };
    const emptyDays: JSX.Element[] = [];

    for (let i = 0; i < startDay; i++) {
      emptyDays.push(<View key={`empty-${i}`} style={[styles.dayCell, cellStyle]} />);
    }

    return (
      <View style={styles.calendarView}>
        <View style={styles.weekDaysRow}>
          {weekDays.map((wd, i) => (
            <View key={`wd-${i}`} style={[styles.weekDayCell, { width: cellSize }]}>
              <Text style={styles.weekDayText}>{wd}</Text>
            </View>
          ))}
        </View>
        <View
          style={styles.daysGrid}
          onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}
        >
          {emptyDays}
          {selectedWeek.map((d) => {
            const dayData = getDataForDay(selectedYear, selectedMonth, d);
            const color = getDayColor(dayData);

            return (
              <TouchableOpacity key={d} style={[styles.dayCell, cellStyle]} onPress={() => handleDayPress(d)} activeOpacity={0.7}>
                <View style={[styles.dayCircle, circleStyle, { backgroundColor: color }]}>
                  <Text style={styles.dayText}>{d}</Text>
                  {(dayData?.habitLinkItemDataCount ?? 0) > 0 && <View style={styles.dayDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Calendar Type Dropdown */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowTypeDropdown(true)}
        >
          <Text style={styles.buttonText}>{calendarType}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Calendar Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowCalendarPicker(true)}
        >
          <View style={styles.buttonContent}>
            <Feather name="calendar" size={20} color="#9ca3af" />
            <Text style={styles.buttonText}>
              {calendarType === "Monthly"
                ? `${months[selectedMonth]}, ${selectedYear}`
                : selectedWeek
                ? `Week ${
                    getWeeksInMonth(selectedYear, selectedMonth).indexOf(
                      selectedWeek
                    ) + 1
                  } - ${months[selectedMonth]}, ${selectedYear}`
                : `Select Week - ${months[selectedMonth]}, ${selectedYear}`}
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Calendar View Component */}
      <View style={styles.calendarContainer}>
        {calendarType === "Monthly" ? renderMonthView() : renderWeekView()}
      </View>

      {/* Legend + Toggle */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendCircle, { backgroundColor: colorMap.gray }]}
          />
          <Text style={styles.legendText}>UNK ({numUnknown})</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendCircle, { backgroundColor: colorMap.red }]}
          />
          <Text style={styles.legendText}>BAD ({numBad})</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendCircle, { backgroundColor: colorMap.purple }]}
          />
          <Text style={styles.legendText}>POOR ({numPoor})</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendCircle, { backgroundColor: colorMap.orange }]}
          />
          <Text style={styles.legendText}>AVG ({numAverage})</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendCircle, { backgroundColor: colorMap.green }]}
          />
          <Text style={styles.legendText}>GOOD ({numGood})</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendCircle, { backgroundColor: colorMap.gold }]}
          />
          <Text style={styles.legendText}>EXC ({numExcellent})</Text>
        </View>

        {/* Toggle Button: gray -> gray / gray -> red */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>
            {showGrayAsRed
              ? "Toggle UNKNOWN as BAD"
              : "Toggle UNKNOWN as BAD"}
          </Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              showGrayAsRed && styles.toggleButtonActive,
            ]}
            onPress={() => setShowGrayAsRed((prev) => !prev)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.toggleThumb,
                showGrayAsRed && styles.toggleThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Type Dropdown Modal */}
      <Modal
        visible={showTypeDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTypeDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTypeDropdown(false)}
        >
          <View style={styles.modalContent}>
            {["Monthly", "Weekly"].map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.modalItem}
                onPress={() => {
                  setCalendarType(type as IHabitCalendarCalendarType);
                  setShowTypeDropdown(false);
                  setSelectedWeek(null);
                }}
              >
                <Text style={styles.modalItemText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Calendar Picker Modal */}
      <Modal
        visible={showCalendarPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalendarPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCalendarPicker(false)}
        >
          <View style={styles.pickerModalContent}>
            <ScrollView>
              <View style={styles.yearSelector}>
                <TouchableOpacity
                  style={styles.yearButton}
                  onPress={() => setSelectedYear(selectedYear - 1)}
                >
                  <Text style={styles.yearButtonText}>&lt;</Text>
                </TouchableOpacity>
                <Text style={styles.yearText}>{selectedYear}</Text>
                <TouchableOpacity
                  style={styles.yearButton}
                  onPress={() => setSelectedYear(selectedYear + 1)}
                >
                  <Text style={styles.yearButtonText}>&gt;</Text>
                </TouchableOpacity>
              </View>

              {calendarType === "Monthly" ? (
                <View style={styles.monthsGrid}>
                  {months.map((m, idx) => (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.monthButton,
                        selectedMonth === idx && styles.monthButtonSelected,
                      ]}
                      onPress={() => {
                        setSelectedMonth(idx);
                        setShowCalendarPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.monthButtonText,
                          selectedMonth === idx &&
                            styles.monthButtonTextSelected,
                        ]}
                      >
                        {m.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.weekSelector}>
                  {getWeeksInMonth(selectedYear, selectedMonth).map(
                    (week, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.weekButton}
                        onPress={() => {
                          setSelectedWeek(week);
                          setShowCalendarPicker(false);
                        }}
                      >
                        <Text style={styles.weekButtonText}>
                          Week {idx + 1}: {months[selectedMonth]} {week[0]} -{" "}
                          {week[week.length - 1]}, {selectedYear}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <DayNotesSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        items={sheetItems}
        loading={sheetLoading}
        day={sheetDay?.day ?? 0}
        month={sheetDay?.month ?? 0}
        year={sheetDay?.year ?? 0}
      />
    </View>
  );
};

export default HabitCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    padding: wp(4),
  },
  section: {
    marginBottom: hp(2),
  },
  button: {
    backgroundColor: "#1f2937",
    borderRadius: wp(2),
    padding: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  buttonText: {
    color: "#d1d5db",
    fontSize: wp(4.2),
  },
  calendarContainer: {
    backgroundColor: "#1f2937",
    borderRadius: wp(2),
    padding: wp(4),
    marginBottom: hp(2),
  },
  calendarView: {
    marginTop: hp(1),
  },
  weekDaysRow: {
    flexDirection: "row",
    marginBottom: hp(2),
  },
  weekDayCell: {
    alignItems: "center",
  },
  weekDayText: {
    color: "#9ca3af",
    fontSize: wp(3.2),
    fontWeight: "600",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1),
  },
  dayCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    color: "#ffffff",
    fontSize: wp(3.7),
    fontWeight: "600",
  },
  dayDot: {
    width: wp(1.2),
    height: wp(1.2),
    borderRadius: wp(0.6),
    backgroundColor: "#ffffff",
    marginTop: hp(0.3),
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: wp(4),
    marginBottom: hp(2),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  legendCircle: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
  },
  legendText: {
    color: "#9ca3af",
    fontSize: wp(3.2),
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1.5),
    gap: wp(3),
  },
  toggleLabel: {
    color: "#9ca3af",
    fontSize: wp(3.2),
    flexShrink: 1,
  },
  toggleButton: {
    width: isTablet ? wp(8) : wp(11),
    height: hp(3),
    borderRadius: wp(3),
    backgroundColor: "#374151",
    padding: wp(0.5),
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#ef4444",
  },
  toggleThumb: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: "#f9fafb",
    transform: [{ translateX: 0 }],
  },
  toggleThumbActive: {
    transform: [{ translateX: wp(5) }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1f2937",
    borderRadius: wp(2),
    width: "80%",
    overflow: "hidden",
  },
  modalItem: {
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  modalItemText: {
    color: "#d1d5db",
    fontSize: wp(4.2),
  },
  pickerModalContent: {
    backgroundColor: "#1f2937",
    borderRadius: wp(2),
    width: "90%",
    maxHeight: "70%",
    padding: wp(4),
  },
  yearSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  yearButton: {
    backgroundColor: "#374151",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(1),
  },
  yearButtonText: {
    color: "#ffffff",
    fontSize: wp(4.7),
    fontWeight: "bold",
  },
  yearText: {
    color: "#ffffff",
    fontSize: wp(4.7),
    fontWeight: "600",
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2),
  },
  monthButton: {
    backgroundColor: "#374151",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderRadius: wp(1),
    width: "30%",
    alignItems: "center",
  },
  monthButtonSelected: {
    backgroundColor: "#2563eb",
  },
  monthButtonText: {
    color: "#d1d5db",
    fontSize: wp(3.7),
  },
  monthButtonTextSelected: {
    color: "#ffffff",
    fontWeight: "600",
  },
  weekSelector: {
    gap: wp(2),
  },
  weekButton: {
    backgroundColor: "#374151",
    padding: wp(3),
    borderRadius: wp(1),
  },
  weekButtonText: {
    color: "#d1d5db",
    fontSize: wp(3.7),
  },
});
