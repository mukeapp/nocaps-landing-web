import * as Clipboard from "expo-clipboard";
import { DefaultLoader } from "@/core/components/section-a";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
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
        height={hp(140)}
        customStyles={{
          container: {
            backgroundColor: Colors.content_back,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            width: "50%",
            maxWidth: 600,
            minWidth: 500,
            alignSelf: "center",
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
                    <MaterialIcons name="link" size={24} color={Colors.white} />
                  )}
                </View>
                <Text style={[MainStyles.text16white, { marginLeft: 10, flex: 1 }]}>
                  {dataitem?.name || "Untitled Link"}
                </Text>
              </View>
            </View>

            {/* 2-Column Grid */}
            <View style={styles.grid2Col}>
              {/* Left Column */}
              <View style={styles.gridCol}>
                {dataitem?.company && (
                  <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>COMPANY</Text>
                    <Text style={styles.infoValue}>{dataitem?.company}</Text>
                  </View>
                )}
                {dataitem?.location && (
                  <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>LOCATION</Text>
                    <Text style={styles.infoValue}>{dataitem?.location}</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.descCard} onPress={() => setDescExpanded((v) => !v)} activeOpacity={0.7}>
                  <View style={styles.descHeaderRow}>
                    <View style={[styles.descAccent, { backgroundColor: accentColor }]} />
                    <Text style={styles.descSectionLabel}>Description</Text>
                    <MaterialIcons name={descExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={16} color="#111" />
                  </View>
                  {descExpanded && <Text style={styles.description}>{dataitem?.description || "No description available."}</Text>}
                </TouchableOpacity>
              </View>

              {/* Right Column */}
              <View style={styles.gridCol}>
                <TouchableOpacity style={styles.idCard} onPress={() => Clipboard.setStringAsync(dataitem?.habitId ?? "")} activeOpacity={0.7}>
                  <Text style={styles.idLabel}>HABIT ID</Text>
                  <View style={styles.idRow}>
                    <Text style={styles.idValue} numberOfLines={1}>{dataitem?.habitId || "N/A"}</Text>
                    <MaterialIcons name="content-copy" size={14} color={Colors.text_color} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.idCard} onPress={() => Clipboard.setStringAsync(dataitem?.documentId ?? dataitem?.id ?? "")} activeOpacity={0.7}>
                  <Text style={styles.idLabel}>LINK ID</Text>
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

export default HabitLinkPreview;

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
    flex: 1,
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
