import * as Clipboard from "expo-clipboard";
import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {getDefaultImageUrl2} from "@/core/utils/utilities/images";
import {openUrlIfValid} from "@/core/utils/utilities/urls";
import {fetchCostSymbolByHabitLinkId} from "@/core/services/section-b/section-b-0/units";
import {formatCost} from "@/core/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import React, {useEffect, useRef, useState} from "react";
import {
  Platform,
  Image,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {BlurView} from "expo-blur";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  fs,
  heightPercentageToDP as _hp,
  widthPercentageToDP as _wp,
  isTablet,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _wp(p);
const hp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _hp(p);

const HabitLinkItemPreview = ({
  rnsheet = false,
  shotlist = false,
  closefun = (obj: string) => {},
  dataitem = {} as any,
  costSymbol = "",
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

  const [descExpanded, setDescExpanded] = useState(false);
  const [aiDescExpanded, setAiDescExpanded] = useState(false);
  const [resolvedCostSymbol, setResolvedCostSymbol] = useState(costSymbol);

  useEffect(() => {
    if (costSymbol) {
      setResolvedCostSymbol(costSymbol);
      return;
    }
    if (!rnsheet || !dataitem?.habitLinkId) return;
    fetchCostSymbolByHabitLinkId(dataitem.habitLinkId).then((symbol) => {
      if (symbol) setResolvedCostSymbol(symbol);
    });
  }, [rnsheet, dataitem?.habitLinkId, costSymbol]);

  const accentColor =
    dataitem?.scoreObject?.scoreInfo?.color?.toLowerCase?.() || "#6b7280";

  const formatTimestamp = (ts?: Date | string) => {
    if (!ts) return "N/A";
    const date = ts instanceof Date ? ts : new Date(ts as string);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: dataitem?.name ?? "",
        url: dataitem?.itemUrl ?? "",
      });
    } catch (_) {}
  };

  const handleOpenLocation = () => {
    const encoded = encodeURIComponent(dataitem?.location ?? "");
    openUrlIfValid(`https://maps.google.com/?q=${encoded}`);
  };

  return (
    <View style={{position: "absolute"}}>
      {/* Delete confirmation modal */}
      <Modal animationType="fade" visible={shotlist} transparent={true}>
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={60}
          tint="dark"
          style={styles.deleteview}
        >
          <View style={styles.deletecontainer}>
            <View style={styles.dangerIconWrap}>
              <MaterialIcons
                name="delete-forever"
                size={wp(9)}
                color={Colors.red}
              />
            </View>
            <Text
              style={[
                MainStyles.text20semibold,
                {textAlign: "center", marginTop: hp(2)},
              ]}
            >
              Delete Item?
            </Text>
            <Text style={styles.deleteSubtitle}>
              This will permanently remove{"\n"}
              <Text
                style={{color: Colors.white, fontFamily: "poppins_semibold"}}
              >
                {dataitem?.name ?? "this item"}
              </Text>
              {"\n"}and cannot be undone.
            </Text>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => closefun("deleteit")}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="delete-forever"
                size={wp(5)}
                color={Colors.white}
                style={{marginRight: wp(2)}}
              />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => closefun("false")}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {/* Habit Link Item Preview RBSheet */}
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        height={hp(170)}
        customStyles={{
          container: {
            backgroundColor: Colors.content_back,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            width: "50%",
            maxWidth: 600,
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
          {/* Handle — fixed */}
          <View style={styles.handle} />

          {/* Header — fixed */}
          <View style={MainStyles.viewtwo}>
            <TouchableOpacity
              style={styles.close}
              onPress={() => closefun("shet")}
            >
              <AntDesign name="close" size={fs(18)} color={Colors.white} />
            </TouchableOpacity>
            <Text style={MainStyles.text20semibold}>Preview</Text>
            <View style={{width: 36}} />
          </View>

          {/* Scrollable body */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Image banner */}
            <Image
              source={
                dataitem?.imageUrl
                  ? {uri: dataitem?.imageUrl}
                  : {uri: getDefaultImageUrl2()}
              }
              style={styles.imo}
              resizeMode="cover"
            />

            {/* Action icons below image */}
            <View style={styles.iconRow}>
              {!!dataitem?.name && (
                <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                  <SimpleLineIcons
                    name="share"
                    size={fs(20)}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              )}
              {!!dataitem?.location && (
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={handleOpenLocation}
                >
                  <MaterialCommunityIcons
                    name="map-marker-radius-outline"
                    size={fs(20)}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              )}
              {!!dataitem?.itemUrl && (
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => openUrlIfValid(dataitem?.itemUrl)}
                >
                  <Fontisto name="world-o" size={fs(20)} color={Colors.white} />
                </TouchableOpacity>
              )}
            </View>

            {/* Company + Score badge */}
            <View style={[MainStyles.viewtwo, {marginTop: 16}]}>
              {!!dataitem?.companyName && (
                <Text style={styles.companyText}>{dataitem?.companyName}</Text>
              )}
              {!!dataitem?.scoreObject?.scoreInfo?.label && (
                <View
                  style={[
                    styles.scoreBadge,
                    {
                      backgroundColor:
                        dataitem?.scoreObject?.scoreInfo?.color?.toLowerCase() ||
                        Colors.inputback,
                    },
                  ]}
                >
                  <Text style={styles.scoreBadgeText}>
                    {dataitem?.scoreObject?.scoreInfo?.label}
                  </Text>
                </View>
              )}
            </View>

            {/* Title */}
            {!!dataitem?.name && (
              <Text style={styles.titleText}>{dataitem?.name}</Text>
            )}

            {/* Chip tags */}
            {(!!dataitem?.companyName || !!dataitem?.location) && (
              <View style={styles.chipRow}>
                {!!dataitem?.companyName && (
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{dataitem?.companyName}</Text>
                  </View>
                )}
                {!!dataitem?.location && (
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{dataitem?.location}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Score progress bar */}
            {!!dataitem?.scoreObject?.score && (
              <View style={styles.progressRow}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(dataitem?.scoreObject?.score, 100)}%` as any,
                        backgroundColor:
                          dataitem?.scoreObject?.scoreInfo?.color?.toLowerCase() ||
                          Colors.green,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressLabel}>
                  {parseFloat(Number(dataitem?.scoreObject?.score).toFixed(2))}%
                </Text>
              </View>
            )}

            {/* Cost callout */}
            {!!dataitem?.cost && (
              <Text style={styles.costCallout}>
                {resolvedCostSymbol}
                {formatCost(dataitem?.cost)}{" "}
                <Text style={styles.costLabel}>total cost</Text>
              </Text>
            )}

            <View style={styles.bord} />

            {/* Details */}
            <View style={styles.detailsGrid}>
              {!!dataitem?.price && (
                <View style={styles.detailCard}>
                  <View style={styles.detailCardHeader}>
                    <View style={styles.detailCardIconWrap}>
                      <MaterialIcons name="sell" size={fs(14)} color={accentColor} />
                    </View>
                    <Text style={styles.detailLabel}>UNIT / PRICE</Text>
                  </View>
                  <Text style={styles.detailValue}>
                    {resolvedCostSymbol} {formatCost(dataitem?.price)}
                  </Text>
                </View>
              )}

              {!!dataitem?.quantity && (
                <View style={styles.detailCard}>
                  <View style={styles.detailCardHeader}>
                    <View style={styles.detailCardIconWrap}>
                      <MaterialIcons name="inventory-2" size={fs(14)} color={accentColor} />
                    </View>
                    <Text style={styles.detailLabel}>QUANTITY</Text>
                  </View>
                  <Text style={styles.detailValue}>{dataitem?.quantity}</Text>
                </View>
              )}

              <View style={styles.detailCardFull}>
                <View style={styles.detailCardHeader}>
                  <View style={styles.detailCardIconWrap}>
                    <MaterialIcons name="auto-awesome" size={fs(14)} color={accentColor} />
                  </View>
                  <Text style={styles.detailLabel}>NOCAP AI SCORED</Text>
                </View>
                <View
                  style={[
                    styles.aiScoredBadge,
                    {backgroundColor: dataitem?.aiScored ? "rgba(75,181,67,0.15)" : "rgba(255,23,23,0.12)"},
                  ]}
                >
                  <View
                    style={[
                      styles.aiScoredDot,
                      {backgroundColor: dataitem?.aiScored ? Colors.success : Colors.red},
                    ]}
                  />
                  <Text
                    style={[
                      styles.aiScoredText,
                      {color: dataitem?.aiScored ? Colors.success : Colors.red},
                    ]}
                  >
                    {dataitem?.aiScored ? "Yes" : "No"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.bord} />

            {/* Description — expandable */}
            <View style={styles.descSection}>
              <TouchableOpacity
                style={styles.descHeaderRow}
                onPress={() => setDescExpanded((v) => !v)}
                activeOpacity={0.7}
              >
                <View style={styles.descHeaderLeft}>
                  <View
                    style={[styles.descAccent, {backgroundColor: accentColor}]}
                  />
                  <Text style={styles.descSectionLabel}>Description</Text>
                </View>
                <View style={styles.descToggle}>
                  <MaterialIcons
                    name={
                      descExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"
                    }
                    size={fs(18)}
                    color="#111"
                  />
                </View>
              </TouchableOpacity>
              {descExpanded && (
                <View style={[styles.descCard, {borderLeftColor: accentColor}]}>
                  <Text style={styles.description}>
                    {dataitem?.description || "No description available."}
                  </Text>
                </View>
              )}
            </View>

            {/* NoCap AI Description — expandable */}
            {!!dataitem?.aiScoredDescription && (
              <View style={styles.descSection}>
                <TouchableOpacity
                  style={styles.descHeaderRow}
                  onPress={() => setAiDescExpanded((v) => !v)}
                  activeOpacity={0.7}
                >
                  <View style={styles.descHeaderLeft}>
                    <View
                      style={[styles.descAccent, {backgroundColor: accentColor}]}
                    />
                    <MaterialIcons
                      name="auto-awesome"
                      size={fs(14)}
                      color={accentColor}
                    />
                    <Text style={styles.descSectionLabel}>
                      NoCap AI Description
                    </Text>
                  </View>
                  <View style={styles.descToggle}>
                    <MaterialIcons
                      name={
                        aiDescExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"
                      }
                      size={fs(18)}
                      color="#111"
                    />
                  </View>
                </TouchableOpacity>
                {aiDescExpanded && (
                  <View style={[styles.descCard, {borderLeftColor: accentColor}]}>
                    <Text style={styles.description}>
                      {dataitem?.aiScoredDescription}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Divider */}
            <View style={styles.bord} />

            {/* IDs */}
            <View style={styles.idsRow}>
              <TouchableOpacity
                style={styles.idBtn}
                onPress={() =>
                  Clipboard.setStringAsync(dataitem?.habitLinkId ?? "")
                }
                activeOpacity={0.7}
              >
                <View style={styles.idBtnInner}>
                  <Text style={styles.idLabel}>HABITLINK ID</Text>
                  <Text style={styles.idValue} numberOfLines={1}>
                    {dataitem?.habitLinkId || "N/A"}
                  </Text>
                </View>
                <MaterialIcons
                  name="content-copy"
                  size={fs(16)}
                  color={Colors.text_color}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.idBtn}
                onPress={() =>
                  Clipboard.setStringAsync(
                    dataitem?.documentId ?? dataitem?.id ?? "",
                  )
                }
                activeOpacity={0.7}
              >
                <View style={styles.idBtnInner}>
                  <Text style={styles.idLabel}>ITEM ID</Text>
                  <Text style={styles.idValue} numberOfLines={1}>
                    {dataitem?.documentId ?? dataitem?.id ?? "N/A"}
                  </Text>
                </View>
                <MaterialIcons
                  name="content-copy"
                  size={fs(16)}
                  color={Colors.text_color}
                />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.bord} />

            {/* Timestamps */}
            <View style={styles.infoRow}>
              <Text style={MainStyles.text16}>
                Created:{" "}
                <Text
                  style={[
                    MainStyles.text12semibold,
                    {color: Colors.text_color},
                  ]}
                >
                  {formatTimestamp(dataitem?.createdAt)}
                </Text>
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={MainStyles.text16}>
                Updated:{" "}
                <Text
                  style={[
                    MainStyles.text12semibold,
                    {color: Colors.text_color},
                  ]}
                >
                  {formatTimestamp(dataitem?.updatedAt)}
                </Text>
              </Text>
            </View>
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default HabitLinkItemPreview;

const styles = StyleSheet.create({
  bord: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderline,
    marginTop: 8,
    marginBottom: 8,
  },
  handle: {
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#000000ab",
    alignSelf: "center",
    marginVertical: 8,
  },
  imo: {
    width: "100%",
    height: 200,
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
  mainbottom: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderline,
    marginTop: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.borderline,
    alignItems: "center",
    justifyContent: "center",
  },
  companyText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
  },
  scoreBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  scoreBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  titleText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderline,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  chipText: {
    color: Colors.white,
    fontSize: 12,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressLabel: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
    minWidth: 40,
    textAlign: "right",
  },
  costCallout: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  costLabel: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "400",
  },
  infoRow: {
    marginTop: 8,
  },
  descSection: {
    marginTop: 8,
    marginBottom: 12,
  },
  descHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 8,
  },
  descHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  descAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  descSectionLabel: {
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  descToggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  descCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderLeftWidth: 4,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  description: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 20,
  },
  idsRow: {
    gap: 8,
    marginTop: 4,
  },
  idBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.borderline,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  idBtnInner: {
    flex: 1,
    marginRight: 8,
  },
  idLabel: {
    color: Colors.text_color,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  idValue: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  detailCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.borderline,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  detailCardFull: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.borderline,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  detailCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailCardIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  detailLabel: {
    color: "#6b7280",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  detailValue: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
  aiScoredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  aiScoredDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  aiScoredText: {
    fontSize: 13,
    fontWeight: "700",
  },
  deleteview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOpacity: 0.15,
  },
  deletecontainer: {
    width: wp(88),
    borderRadius: wp(4),
    paddingHorizontal: wp(5),
    alignSelf: "center",
    alignItems: "center",
    paddingTop: hp(3),
    paddingBottom: hp(2.5),
    backgroundColor: Colors.content_back,
  },
  dangerIconWrap: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: "rgba(255,23,23,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteSubtitle: {
    color: Colors.text_color,
    fontSize: fs(14),
    fontFamily: "poppins_regular",
    textAlign: "center",
    marginTop: hp(1),
    marginBottom: hp(2.5),
    lineHeight: fs(22),
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: hp(6),
    borderRadius: wp(3),
    backgroundColor: Colors.red,
    marginBottom: hp(1.2),
  },
  deleteBtnText: {
    color: Colors.white,
    fontSize: fs(15),
    fontFamily: "poppins_semibold",
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: hp(6),
    borderRadius: wp(3),
    backgroundColor: Colors.title_background,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  cancelBtnText: {
    color: Colors.white,
    fontSize: fs(15),
    fontFamily: "poppins_regular",
  },
});
