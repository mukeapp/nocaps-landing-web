import * as Clipboard from "expo-clipboard";
import { DefaultLoader } from "@/core/components/section-a";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { HabitStackComponent } from "@/core/models/section-b";
import { getDefaultImageUrl2 } from "@/core/utils/utilities/images";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";

interface HabitStackPreviewProps {
  canEdit?: boolean;
  rnsheet?: boolean;
  closefun?: (obj: string) => void;
  dataitem?: HabitStackComponent;
}

const HabitStackPreview: React.FC<HabitStackPreviewProps> = ({
  canEdit = false,
  rnsheet = false,
  closefun = (obj: string) => {},
  dataitem = {} as HabitStackComponent,
}) => {
  interface RBSheetRef {
    open: () => void;
    close: () => void;
  }
  const refRBSheet = useRef<RBSheetRef>(null);

  useEffect(() => {
    if (rnsheet) {
      refRBSheet.current?.open();
    } else {
      refRBSheet.current?.close();
    }
  }, [rnsheet]);

  const [loading, setLoading] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const accentColor = dataitem?.iconColor || "#6b7280";

  const formatTimestamp = (ts?: Date | string) => {
    if (!ts) return "N/A";
    const date = ts instanceof Date ? ts : new Date(ts as string);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  };

  return (
    <View style={{ position: "absolute" }}>
      {/* Preview Bottom Sheet */}
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        height={hp(150)}
        customStyles={{
          container: {
            backgroundColor: Colors.content_back,
            borderRadius: 20,
          },
          wrapper: {
            backgroundColor: "#000000ab",
          },
          draggableIcon: {
            backgroundColor: "#000",
            width: 60,
          },
        }}
        customModalProps={{
          animationType: "fade",
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
        onClose={() => closefun("shet")}
      >
        <View style={styles.mainbottom}>
          {/* Draggable indicator */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={MainStyles.viewtwo}>
            <TouchableOpacity
              style={styles.close}
              onPress={() => closefun("shet")}
            >
              <AntDesign name="close" size={18} color={Colors.white} />
            </TouchableOpacity>
            <Text style={MainStyles.text20semibold}>HabitStack Preview</Text>
          </View>

          {/* Scrollable body */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Banner Image */}
            <Image
              source={
                dataitem?.bannerImage
                  ? { uri: dataitem?.bannerImage }
                  : { uri: getDefaultImageUrl2() }
              }
              style={styles.bannerImage}
              resizeMode="cover"
            />

            {/* Icon and Name */}
            <View style={[MainStyles.viewtwo, { marginTop: 12 }]}>
              <View style={styles.iconNameContainer}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: dataitem?.iconColor || Colors.icon_back },
                  ]}
                >
                  {dataitem?.icon ? (
                    <Image
                      source={{ uri: dataitem.icon }}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <MaterialIcons name="fitness-center" size={24} color={Colors.white} />
                  )}
                </View>
                <Text style={[MainStyles.text16white, { marginLeft: 10 }]}>
                  {dataitem?.name}
                </Text>
              </View>
              <View style={styles.personsBadge}>
                <MaterialIcons name="person-outline" size={14} color={Colors.white} />
                <Text style={[MainStyles.text12Regular, { marginLeft: 4 }]}>
                  {dataitem?.personsCount || 0}
                </Text>
              </View>
            </View>

            {/* 2-Column Grid */}
            <View style={styles.grid2Col}>
              {/* Left Column */}
              <View style={styles.gridCol}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>SECTOR</Text>
                  <Text style={styles.infoValue}>{dataitem?.sectorId || "N/A"}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>FOCUS</Text>
                  <Text style={styles.infoValue}>{dataitem?.focus || "N/A"}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>PRIORITY</Text>
                  <Text style={styles.infoValue}>{dataitem?.priority || "N/A"}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>UNIT</Text>
                  <Text style={styles.infoValue}>{dataitem?.unit || "N/A"}</Text>
                </View>
                <View style={styles.visCard}>
                  <View style={styles.visRow}>
                    <View style={[styles.visDot, { backgroundColor: dataitem?.isPublic ? Colors.success : Colors.red }]} />
                    <Text style={styles.visLabel}>Public</Text>
                    <Text style={[styles.visValue, { color: dataitem?.isPublic ? Colors.success : Colors.red }]}>{dataitem?.isPublic ? "Yes" : "No"}</Text>
                  </View>
                  <View style={styles.visRow}>
                    <View style={[styles.visDot, { backgroundColor: !dataitem?.hideFromFriends ? Colors.success : Colors.red }]} />
                    <Text style={styles.visLabel}>Show Friends</Text>
                    <Text style={[styles.visValue, { color: !dataitem?.hideFromFriends ? Colors.success : Colors.red }]}>{!dataitem?.hideFromFriends ? "Yes" : "No"}</Text>
                  </View>
                </View>
              </View>

              {/* Right Column */}
              <View style={styles.gridCol}>
                <TouchableOpacity style={styles.descCard} onPress={() => setDescExpanded((v) => !v)} activeOpacity={0.7}>
                  <View style={styles.descHeaderRow}>
                    <View style={[styles.descAccent, { backgroundColor: accentColor }]} />
                    <Text style={styles.descSectionLabel}>Description</Text>
                    <MaterialIcons name={descExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={16} color="#111" />
                  </View>
                  {descExpanded && <Text style={styles.description}>{dataitem?.description || "No description available."}</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.idCard} onPress={() => Clipboard.setStringAsync(dataitem?.documentId ?? dataitem?.id ?? "")} activeOpacity={0.7}>
                  <Text style={styles.idLabel}>HABITSTACK ID</Text>
                  <View style={styles.idRow}>
                    <Text style={styles.idValue} numberOfLines={1}>{dataitem?.documentId ?? dataitem?.id ?? "N/A"}</Text>
                    <MaterialIcons name="content-copy" size={14} color={Colors.text_color} />
                  </View>
                </TouchableOpacity>

                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>CREATED</Text>
                  <Text style={styles.infoValueSmall}>{formatTimestamp(dataitem?.createdAt)}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>UPDATED</Text>
                  <Text style={styles.infoValueSmall}>{formatTimestamp(dataitem?.updatedAt)}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </RBSheet>

      <DefaultLoader status={loading} />
    </View>
  );
};

export default HabitStackPreview;

const styles = StyleSheet.create({
  bannerImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.borderline,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#000000ab",
    alignSelf: "center",
    marginVertical: 8,
  },
  mainbottom: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  iconNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: {
    width: 20,
    height: 20,
  },
  personsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.text_background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  grid2Col: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  gridCol: {
    flex: 1,
    gap: 6,
  },
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.borderline,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  infoLabel: {
    color: Colors.text_color,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  infoValue: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  infoValueSmall: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "500",
  },
  visCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.borderline,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  visRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  visLabel: {
    color: "#6b7280",
    fontSize: 11,
    fontWeight: "500",
    flex: 1,
  },
  visValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  visDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  descCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.borderline,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  descHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  descAccent: {
    width: 3,
    height: 16,
    borderRadius: 1.5,
  },
  descSectionLabel: {
    color: "#e2e8f0",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    flex: 1,
  },
  description: {
    color: "#9ca3af",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  idCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.borderline,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  idLabel: {
    color: Colors.text_color,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  idRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  idValue: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "500",
    flex: 1,
  },
});
