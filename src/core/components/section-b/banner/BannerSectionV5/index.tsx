import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { MainStyles } from "@/core/constants/styles";
import { HabitStyles } from "@/core/styles/HabitStyles";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import Entypo from "@expo/vector-icons/Entypo";
import { getDefaultImageUrl } from "@/core/utils/utilities/images";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CalendarRows } from "@/core/components/section-b";

type Props = {
  remoteImage: string | null; // existing banner if editing
  onPick: () => void;
  overlayText?: string; // Text to display on the image
  datePickers?: any;
  showEndDate?: boolean;
  showDatePickers?: boolean;
};

export default function BannerSectionV5({
  remoteImage,
  onPick,
  overlayText = "Banner",
  datePickers,
  showEndDate = false,
  showDatePickers = false,
}: Props) {
  const imageUrl = remoteImage ? remoteImage : getDefaultImageUrl();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={HabitStyles.imgbannerFull}
        resizeMode="cover"
      />

      {/* Text overlay at bottom right */}
      <View style={styles.textOverlayContainer}>
        <View style={styles.textBackground}>
          <Text style={styles.overlayText}>{overlayText}</Text>
        </View>
      </View>

      {showDatePickers && (
        <CalendarRows
          startDate={datePickers.startDate}
          endDate={datePickers.endDate}
          onPickStartDate={() => datePickers.showPicker("startDate", "date")}
          onPickEndDate={() => datePickers.showPicker("endDate", "date")}
          isEditingExisting={false}
          showEndDate={showEndDate}
        />
      )}

      <DateTimePickerModal
        isVisible={datePickers.show}
        mode={datePickers.mode}
        onConfirm={datePickers.handleConfirm}
        onCancel={datePickers.hide}
        display={Platform.OS === "ios" ? "inline" : "default"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  textOverlayContainer: {
    flexDirection: "row",
    //position: 'absolute',
    bottom: 40,
    left: 10,
    gap: 10,
  },
  textBackground: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  overlayText: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
  },
});
