import * as Clipboard from "expo-clipboard";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { NocapPost } from "@/core/models/section-c";
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
import { heightPercentageToDP as hp } from "@/core/utils/responsive";

interface NocapPostPreviewProps {
  rnsheet?: boolean;
  closefun?: (obj: string) => void;
  dataitem?: NocapPost;
}

const AVATAR = 40;

const NocapPostPreview: React.FC<NocapPostPreviewProps> = ({
  rnsheet = false,
  closefun = () => {},
  dataitem,
}) => {
  interface RBSheetRef {
    open: () => void;
    close: () => void;
  }
  const refRBSheet = useRef<RBSheetRef>(null);

  const [contentExpanded, setContentExpanded] = useState(false);

  useEffect(() => {
    if (rnsheet) {
      refRBSheet.current?.open();
    } else {
      refRBSheet.current?.close();
    }
  }, [rnsheet]);

  const formatTimestamp = (ts?: { _seconds: number; _nanoseconds: number }) => {
    if (!ts?._seconds) return "N/A";
    const date = new Date(ts._seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const likesCount = dataitem?.nocapPostLikes?.filter((l) => l.isLiked).length ?? 0;
  const accentColor = "#6b7280";

  return (
    <View style={{ position: "absolute" }}>
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        height={hp(150)}
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
            <Text style={MainStyles.text20semibold}>Post Preview</Text>
          </View>

          {/* Scrollable body */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Banner Image */}
            <Image
              source={
                dataitem?.imageUrl
                  ? { uri: dataitem.imageUrl }
                  : { uri: getDefaultImageUrl2() }
              }
              style={styles.bannerImage}
              resizeMode="cover"
            />

            {/* User row + likes badge */}
            <View style={[MainStyles.viewtwo, { marginTop: 12 }]}>
              <View style={styles.userRow}>
                {dataitem?.user?.photo ? (
                  <Image
                    source={{ uri: dataitem.user.photo }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <MaterialIcons name="person" size={20} color={Colors.white} />
                  </View>
                )}
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text
                    style={[MainStyles.text16white, { fontWeight: "700" }]}
                    numberOfLines={1}
                  >
                    {dataitem?.user?.username ?? "Unknown"}
                  </Text>
                  {!!dataitem?.location && (
                    <Text style={styles.locationText} numberOfLines={1}>
                      {dataitem.location}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.likesBadge}>
                <View style={styles.likesDot} />
                <Text style={styles.likesText}>{likesCount} likes</Text>
              </View>
            </View>

            {/* 2-Column Grid */}
            <View style={styles.grid2Col}>
              {/* Left Column */}
              <View style={styles.gridCol}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>TITLE</Text>
                  <Text style={styles.infoValue}>{dataitem?.title || "N/A"}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>SECTOR</Text>
                  <Text style={styles.infoValue}>{dataitem?.sector || "N/A"}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>HABIT TYPE</Text>
                  <Text style={styles.infoValue}>{dataitem?.habitType || "N/A"}</Text>
                </View>
              </View>

              {/* Right Column */}
              <View style={styles.gridCol}>
                <TouchableOpacity
                  style={styles.descCard}
                  onPress={() => setContentExpanded((v) => !v)}
                  activeOpacity={0.7}
                >
                  <View style={styles.descHeaderRow}>
                    <View style={[styles.descAccent, { backgroundColor: accentColor }]} />
                    <Text style={styles.descSectionLabel}>Content</Text>
                    <MaterialIcons
                      name={contentExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                      size={16}
                      color="#111"
                    />
                  </View>
                  {contentExpanded && (
                    <Text style={styles.description}>
                      {dataitem?.content || "No content available."}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.idCard}
                  onPress={() =>
                    Clipboard.setStringAsync(dataitem?.documentId ?? dataitem?.id ?? "")
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.idLabel}>POST ID</Text>
                  <View style={styles.idRow}>
                    <Text style={styles.idValue} numberOfLines={1}>
                      {dataitem?.documentId ?? dataitem?.id ?? "N/A"}
                    </Text>
                    <MaterialIcons name="content-copy" size={14} color={Colors.text_color} />
                  </View>
                </TouchableOpacity>

                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>CREATED</Text>
                  <Text style={styles.infoValueSmall}>
                    {formatTimestamp(dataitem?.createdAt as any)}
                  </Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>UPDATED</Text>
                  <Text style={styles.infoValueSmall}>
                    {formatTimestamp(dataitem?.updatedAt as any)}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default NocapPostPreview;

const styles = StyleSheet.create({
  bannerImage: {
    width: "100%",
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
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    resizeMode: "cover",
  },
  avatarFallback: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: Colors.borderline,
    alignItems: "center",
    justifyContent: "center",
  },
  locationText: {
    color: Colors.text_color,
    fontSize: 12,
    marginTop: 2,
  },
  likesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(75,181,67,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 6,
  },
  likesDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  likesText: {
    color: Colors.success,
    fontSize: 13,
    fontWeight: "700",
  },
  grid2Col: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
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
