import * as Clipboard from "expo-clipboard";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { NocapPost } from "@/core/models/section-c";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
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
  fs,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
} from "@/core/utils/responsive";

interface NocapPostPreviewProps {
  rnsheet?: boolean;
  closefun?: (obj: string) => void;
  dataitem?: NocapPost;
}

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
  const AVATAR = isTablet ? wp(12) : wp(10);

  return (
    <View style={{ position: "absolute" }}>
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Post Image */}
            {!!dataitem?.imageUrl && (
              <Image
                source={{ uri: dataitem.imageUrl }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            )}

            {/* User row */}
            <View style={[MainStyles.viewtwo, { marginTop: hp(2) }]}>
              <View style={styles.userRow}>
                {dataitem?.user?.photo ? (
                  <Image
                    source={{ uri: dataitem.user.photo }}
                    style={[styles.avatar, { borderRadius: AVATAR / 2, width: AVATAR, height: AVATAR }]}
                  />
                ) : (
                  <View style={[styles.avatarFallback, { width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2 }]}>
                    <MaterialIcons name="person" size={fs(20)} color={Colors.white} />
                  </View>
                )}
                <View style={{ marginLeft: wp(2) }}>
                  <Text style={[MainStyles.text16white, { fontWeight: "700" }]}>
                    {dataitem?.user?.username ?? "Unknown"}
                  </Text>
                  {!!dataitem?.location && (
                    <Text style={styles.locationText}>
                      {dataitem.location}
                    </Text>
                  )}
                </View>
              </View>

              {/* Likes badge */}
              <View style={styles.likesBadge}>
                <View style={styles.likesDot} />
                <Text style={styles.likesText}>{likesCount} likes</Text>
              </View>
            </View>

            <View style={styles.bord} />

            {/* Info rows */}
            <View style={styles.infoRow}>
              <Text style={MainStyles.text16}>
                Title:{" "}
                <Text style={MainStyles.text16white}>{dataitem?.title || "N/A"}</Text>
              </Text>
            </View>
            {!!dataitem?.content && (
              <View style={styles.infoRow}>
                <Text style={MainStyles.text16}>
                  Content:{" "}
                  <Text style={MainStyles.text16white}>{dataitem.content}</Text>
                </Text>
              </View>
            )}
            {!!dataitem?.sector && (
              <View style={styles.infoRow}>
                <Text style={MainStyles.text16}>
                  Sector:{" "}
                  <Text style={MainStyles.text16white}>{dataitem.sector}</Text>
                </Text>
              </View>
            )}
            {!!dataitem?.habitType && (
              <View style={styles.infoRow}>
                <Text style={MainStyles.text16}>
                  Habit Type:{" "}
                  <Text style={MainStyles.text16white}>{dataitem.habitType}</Text>
                </Text>
              </View>
            )}

            <View style={styles.bord} />

            {/* Post ID */}
            <View style={styles.idsRow}>
              <TouchableOpacity
                style={styles.idBtn}
                onPress={() =>
                  Clipboard.setStringAsync(dataitem?.documentId ?? dataitem?.id ?? "")
                }
                activeOpacity={0.7}
              >
                <View style={styles.idBtnInner}>
                  <Text style={styles.idLabel}>POST ID</Text>
                  <Text style={styles.idValue} numberOfLines={1}>
                    {dataitem?.documentId ?? dataitem?.id ?? "N/A"}
                  </Text>
                </View>
                <MaterialIcons name="content-copy" size={16} color={Colors.text_color} />
              </TouchableOpacity>
            </View>

            <View style={styles.bord} />

            {/* Timestamps */}
            <View style={styles.infoRow}>
              <Text style={MainStyles.text16}>
                Created:{" "}
                <Text style={[MainStyles.text12semibold, { color: Colors.text_color }]}>
                  {formatTimestamp(dataitem?.createdAt as any)}
                </Text>
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={MainStyles.text16}>
                Updated:{" "}
                <Text style={[MainStyles.text12semibold, { color: Colors.text_color }]}>
                  {formatTimestamp(dataitem?.updatedAt as any)}
                </Text>
              </Text>
            </View>
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default NocapPostPreview;

const styles = StyleSheet.create({
  bord: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderline,
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  bannerImage: {
    width: "100%",
    height: isTablet ? hp(40) : hp(25),
    marginTop: hp(2),
    borderRadius: wp(2),
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
  mainbottom: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  scrollContent: {
    paddingBottom: hp(3),
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    resizeMode: "cover",
  },
  avatarFallback: {
    backgroundColor: Colors.borderline,
    alignItems: "center",
    justifyContent: "center",
  },
  locationText: {
    color: Colors.text_color,
    fontSize: fs(12),
    marginTop: hp(0.2),
  },
  likesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(75,181,67,0.12)",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: wp(4),
    gap: wp(1.5),
  },
  likesDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: Colors.success,
  },
  likesText: {
    color: Colors.success,
    fontSize: fs(13),
    fontWeight: "700",
  },
  infoRow: {
    marginTop: hp(1),
  },
  idsRow: {
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
