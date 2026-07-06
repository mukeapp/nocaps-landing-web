import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";

import { useSelector } from "react-redux";
import { SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { ButtonSignIn } from "@/core/components/section-a";
import { getDefaultImageUrl2, ConstantsUtils } from "@/core/utils";
import { fetchHabitStacksByNameLike } from "@/core/services/section-b/section-b-0/habitstack";

type Props = {
  visible: boolean;
  title: string;
  searchName: string;
  selectedIds: string[];
  onApply: (ids: string[]) => void;
  onClose: () => void;
};

const HabitStackPickerModal: React.FC<Props> = ({
  visible,
  title,
  searchName,
  selectedIds,
  onApply,
  onClose,
}) => {
  const userdata = useSelector((s: any) => s?.user?.userdata);
  // console.log("userdata in useHabitStackAddEditForm:", userdata); // --- IGNORE ---
  const username = userdata?.collectdata?.username;
  const userId = userdata?.collectdata?.userId?.trim();

  const userIdsToIgnore = ConstantsUtils.marketAdminUserId;
  //const userIdsToIgnore = ConstantsUtils.marketAdminUserId + "," + userId;

  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedIds);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) setTempSelectedIds(selectedIds);
  }, [visible, selectedIds]);

  const fetchItems = useCallback(async () => {
    if (!visible || !searchName.trim()) return;
    setLoading(true);
    setItems([]);
    try {
      const results = await fetchHabitStacksByNameLike({
        name: searchName.trim().toLowerCase(),
        isPublic: true,
        hideFromFriends: false,
        pageSize: 10,
        pageNumber: 1,
        userIdsToIgnore,
      });
      setItems(results);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [visible, searchName]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const getItemId = (item: any): string => item?.documentId ?? item?.id ?? "";
  const getItemName = (item: any): string => item?.name ?? "Untitled";

  const toggleItem = (id: string) => {
    setTempSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApply(tempSelectedIds);
    onClose();
  };

  const getBannerImage = (item: any): string | null =>
    item?.bannerImage || item?.imageUrl || getDefaultImageUrl2();

  const getIcon = (item: any): string => "star-outline";
  const getIconColor = (item: any): string => item?.iconColor || "#888";

  const getScore = (item: any): number | null => {
    const score =
      item?.scoreComponent?.score ?? item?.scoreObject?.score ?? item?.score;
    return score != null ? score : null;
  };

  const getScoreLabel = (item: any): string =>
    item?.scoreComponent?.scoreInfo?.label ??
    item?.scoreObject?.scoreInfo?.label ??
    item?.scoreCode ??
    "";

  const getScoreRgb = (item: any): string =>
    item?.scoreComponent?.scoreInfo?.rgb ??
    item?.scoreObject?.scoreInfo?.rgb ??
    "rgb(128,128,128)";

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={35}
        tint="light"
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={MainStyles.viewtwo}>
            <Text style={MainStyles.text20}>{title}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <SimpleLineIcons name="close" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {tempSelectedIds.length > 0 && (
            <View style={styles.selectionBadge}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={14}
                color="#2ec4b6"
              />
              <Text style={styles.selectionBadgeText}>
                {tempSelectedIds.length} selected
              </Text>
            </View>
          )}

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color="#9ca3af" />
              </View>
            ) : items.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No HabitStacks found.</Text>
              </View>
            ) : (
              items.map((item) => {
                const id = getItemId(item);
                const isSelected = tempSelectedIds.includes(id);
                const banner = getBannerImage(item);
                const icon = getIcon(item);
                const iconColor = getIconColor(item);
                const score = getScore(item);
                const scoreLabel = getScoreLabel(item);
                const scoreRgb = getScoreRgb(item);

                return (
                  <TouchableOpacity
                    key={id}
                    activeOpacity={0.8}
                    style={[styles.card, isSelected && styles.cardSelected]}
                    onPress={() => toggleItem(id)}
                  >
                    {/* Multi-select indicator */}
                    <View style={styles.checkIndicator}>
                      {isSelected ? (
                        <MaterialCommunityIcons
                          name="checkbox-marked-circle"
                          size={wp(5.5)}
                          color="#4BB543"
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="checkbox-blank-circle-outline"
                          size={wp(5.5)}
                          color="rgba(255,255,255,0.3)"
                        />
                      )}
                    </View>

                    {/* Banner */}
                    <View style={styles.bannerContainer}>
                      {banner ? (
                        <Image
                          source={{ uri: banner }}
                          style={styles.bannerImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={[
                            styles.bannerPlaceholder,
                            { backgroundColor: iconColor },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={icon as any}
                            size={wp(10)}
                            color="rgba(255,255,255,0.4)"
                          />
                        </View>
                      )}
                    </View>

                    {/* Info row */}
                    <View style={styles.infoRow}>
                      <View
                        style={[styles.iconCircle, { backgroundColor: iconColor }]}
                      >
                        <MaterialCommunityIcons
                          name={icon as any}
                          size={wp(5)}
                          color="#fff"
                        />
                      </View>

                      <Text
                        style={[
                          styles.cardName,
                          isSelected && styles.cardNameSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {getItemName(item)}
                      </Text>

                      {score != null && (
                        <View
                          style={[styles.scoreBadge, { backgroundColor: scoreRgb }]}
                        >
                          <Text style={styles.scoreBadgeText}>{score}%</Text>
                          {scoreLabel ? (
                            <Text style={styles.scoreLabelText}>{scoreLabel}</Text>
                          ) : null}
                        </View>
                      )}
                    </View>

                    {item?.description ? (
                      <Text style={styles.cardDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          <View style={{ alignSelf: "center", marginTop: hp(2) }}>
            <ButtonSignIn
              text="Apply"
              wid="84"
              bg={Colors.white}
              bd={Colors.white}
              txcl={Colors.black}
              ftn={16}
              mov={handleApply}
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default HabitStackPickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    height: hp(100),
    width: wp(100),
    bottom: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOpacity: 0.15,
    paddingTop: hp(12),
    alignItems: "center",
  },
  container: {
    width: wp(95),
    maxHeight: hp(75),
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    backgroundColor: Colors.content_back,
  },
  closeBtn: {
    backgroundColor: Colors.filtertext,
    width: wp(9),
    height: wp(9),
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  selectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    alignSelf: "flex-start",
    marginTop: hp(0.8),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(10),
    backgroundColor: "rgba(46,196,182,0.1)",
    borderWidth: 1,
    borderColor: "rgba(46,196,182,0.25)",
  },
  selectionBadgeText: {
    color: "#2ec4b6",
    fontSize: wp(3.2),
    fontFamily: "poppins_semibold",
  },
  scrollArea: {
    maxHeight: hp(52),
    marginTop: hp(1.5),
  },
  scrollContent: {
    paddingBottom: hp(1),
  },
  card: {
    borderRadius: wp(3),
    borderWidth: 1.5,
    borderColor: "rgba(59,59,59,1)",
    backgroundColor: Colors.text_background ?? "#1C1C1E",
    marginBottom: hp(1.5),
    overflow: "hidden",
  },
  cardSelected: {
    borderColor: "#4BB543",
  },
  checkIndicator: {
    position: "absolute",
    top: wp(2),
    right: wp(2),
    zIndex: 10,
  },
  bannerContainer: {
    width: "100%",
    height: hp(15),
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
    marginTop: -wp(5),
  },
  iconCircle: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.text_background ?? "#1C1C1E",
  },
  cardName: {
    flex: 1,
    color: Colors.white,
    fontSize: wp(4),
    fontFamily: "poppins_semibold",
    marginLeft: wp(2),
    marginTop: wp(5),
  },
  cardNameSelected: {
    color: "#4BB543",
  },
  scoreBadge: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    alignItems: "center",
    justifyContent: "center",
    marginTop: wp(5),
  },
  scoreBadgeText: {
    color: "#fff",
    fontSize: wp(3.2),
    fontFamily: "poppins_semibold",
  },
  scoreLabelText: {
    color: "#fff",
    fontSize: wp(2),
    fontFamily: "poppins_regular",
    marginTop: -2,
  },
  cardDescription: {
    color: Colors.gray ?? "#A9A9A9",
    fontSize: wp(3.2),
    fontFamily: "poppins_regular",
    paddingHorizontal: wp(3),
    paddingBottom: hp(1.5),
    marginTop: hp(0.5),
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(4),
  },
  emptyText: {
    color: Colors.gray ?? "#A9A9A9",
    fontSize: wp(3.6),
    fontFamily: "poppins_regular",
  },
});
