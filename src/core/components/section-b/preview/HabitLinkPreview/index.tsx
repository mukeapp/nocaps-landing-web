import * as Clipboard from "expo-clipboard";
import { DefaultLoader } from "@/core/components/section-a";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { getDefaultImageUrl2 } from "@/core/utils/utilities/images";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
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
  fs,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
} from "@/core/utils/responsive";
import {HabitLinkComponent} from "@/core/models/section-b";
interface HabitLinkPreviewProps {
  canEdit?: boolean;
  rnsheet?: boolean;
  closefun?: (obj: string) => void;
  dataitem?: HabitLinkComponent;
}

const HabitLinkPreview: React.FC<HabitLinkPreviewProps> = ({
  canEdit = false,
  rnsheet = false,
  closefun = (obj: string) => {},
  dataitem = {} as HabitLinkComponent,
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

  const formatTimestamp = (timestamp?: any) => {
    if (!timestamp) return "N/A";

    let date: Date;

    if (timestamp._seconds) {
      date = new Date(timestamp._seconds * 1000);
    } else if (typeof timestamp === 'string' || timestamp instanceof Date) {
      date = new Date(timestamp);
    } else {
      return "N/A";
    }

    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <View style={{ position: "absolute" }}>
      {/* Preview Bottom Sheet */}
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        height={isTablet ? hp(150) : hp(90)}
        customStyles={{
          container: {
            backgroundColor: Colors.content_back,
            borderRadius: wp(5),
          },
          wrapper: {
            backgroundColor: "#000000ab",
          },
          draggableIcon: {
            backgroundColor: "#000",
            width: wp(30),
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
            <Text style={MainStyles.text20semibold}>HabitLink Preview</Text>
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
            <View style={[MainStyles.viewtwo, { marginTop: hp(3) }]}>
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
                    <MaterialIcons name="link" size={24} color={Colors.white} />
                  )}
                </View>
                <Text style={[MainStyles.text16white, { marginLeft: wp(3), flex: 1 }]}>
                  {dataitem?.name || "Untitled Link"}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.bord} />

            {/* Company and Location */}
            {dataitem?.company && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="business" size={18} color={Colors.white} />
                  <Text style={[MainStyles.text16, { marginLeft: wp(2) }]}>
                    Company:{" "}
                    <Text style={MainStyles.text16white}>
                      {dataitem?.company}
                    </Text>
                  </Text>
                </View>
              </View>
            )}

            {dataitem?.location && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Entypo name="location-pin" size={18} color={Colors.white} />
                  <Text style={[MainStyles.text16, { marginLeft: wp(2) }]}>
                    Location:{" "}
                    <Text style={MainStyles.text16white}>
                      {dataitem?.location}
                    </Text>
                  </Text>
                </View>
              </View>
            )}

            {/* Description — expandable */}
            <View style={styles.descSection}>
              <TouchableOpacity
                style={styles.descHeaderRow}
                onPress={() => setDescExpanded((v) => !v)}
                activeOpacity={0.7}
              >
                <View style={styles.descHeaderLeft}>
                  <View style={[styles.descAccent, { backgroundColor: accentColor }]} />
                  <Text style={styles.descSectionLabel}>Description</Text>
                </View>
                <View style={styles.descToggle}>
                  <MaterialIcons
                    name={descExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={18}
                    color="#111"
                  />
                </View>
              </TouchableOpacity>
              {descExpanded && (
                <View style={[styles.descCard, { borderLeftColor: accentColor }]}>
                  <Text style={styles.description}>
                    {dataitem?.description || "No description available."}
                  </Text>
                </View>
              )}
            </View>

            {/* Divider */}
            <View style={styles.bord} />

            {/* IDs */}
            <View style={styles.idsRow}>
              <TouchableOpacity
                style={styles.idBtn}
                onPress={() => Clipboard.setStringAsync(dataitem?.habitId ?? "")}
                activeOpacity={0.7}
              >
                <View style={styles.idBtnInner}>
                  <Text style={styles.idLabel}>HABIT ID</Text>
                  <Text style={styles.idValue} numberOfLines={1}>
                    {dataitem?.habitId || "N/A"}
                  </Text>
                </View>
                <MaterialIcons name="content-copy" size={16} color={Colors.text_color} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.idBtn}
                onPress={() => Clipboard.setStringAsync(dataitem?.documentId ?? dataitem?.id ?? "")}
                activeOpacity={0.7}
              >
                <View style={styles.idBtnInner}>
                  <Text style={styles.idLabel}>LINK ID</Text>
                  <Text style={styles.idValue} numberOfLines={1}>
                    {dataitem?.documentId ?? dataitem?.id ?? "N/A"}
                  </Text>
                </View>
                <MaterialIcons name="content-copy" size={16} color={Colors.text_color} />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.bord} />

            {/* Timestamps */}
            <View style={styles.infoRow}>
              <Text style={MainStyles.text16}>
                Created:{" "}
                <Text style={[MainStyles.text12semibold, { color: Colors.text_color }]}>
                  {formatTimestamp(dataitem?.createdAt)}
                </Text>
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={MainStyles.text16}>
                Updated:{" "}
                <Text style={[MainStyles.text12semibold, { color: Colors.text_color }]}>
                  {formatTimestamp(dataitem?.updatedAt)}
                </Text>
              </Text>
            </View>
          </ScrollView>
        </View>
      </RBSheet>

      <DefaultLoader status={loading} />
    </View>
  );
};

export default HabitLinkPreview;

const styles = StyleSheet.create({
  bord: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderline,
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  close: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: Colors.borderline,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: wp(32),
    height: hp(1),
    borderRadius: wp(10),
    backgroundColor: "#000000ab",
    alignSelf: "center",
    marginVertical: hp(1),
  },
  bannerImage: {
    width: isTablet ? '100%' : wp(90),
    height: isTablet ? hp(40) : hp(20),
    marginTop: hp(2),
    borderRadius: wp(2),
  },
  mainbottom: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  scrollContent: {
    paddingBottom: hp(3),
  },
  iconNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(2.5),
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: {
    width: wp(7),
    height: wp(7),
  },
  infoRow: {
    marginTop: hp(1),
  },
  infoIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  descSection: {
    marginTop: hp(1),
    marginBottom: hp(1.5),
  },
  descHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(0.8),
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: wp(3),
    paddingVertical: hp(1.2),
    paddingLeft: wp(3),
    paddingRight: wp(2),
  },
  descHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2.5),
    flex: 1,
  },
  descAccent: {
    width: wp(0.8),
    height: hp(2.5),
    borderRadius: wp(0.4),
  },
  descSectionLabel: {
    color: "#e2e8f0",
    fontSize: fs(12),
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  descToggle: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  descCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderLeftWidth: wp(1),
    borderRadius: wp(1.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  description: {
    color: "#9ca3af",
    fontSize: fs(13),
    lineHeight: fs(20),
  },
  idsRow: {
    gap: hp(1),
    marginTop: hp(0.5),
  },
  idBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.borderline,
    borderRadius: wp(2.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
  },
  idBtnInner: {
    flex: 1,
    marginRight: wp(2),
  },
  idLabel: {
    color: Colors.text_color,
    fontSize: fs(9),
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: hp(0.3),
  },
  idValue: {
    color: Colors.white,
    fontSize: fs(12),
    fontWeight: "600",
  },
});
