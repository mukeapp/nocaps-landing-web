import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet,
} from "@/core/utils/responsive";
import { SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { ButtonSignIn } from "@/core/components/section-a";
import {getDefaultImageUrl2} from "@/core/utils";

type Props = {
  visible: boolean;
  title: string;
  items: any[];
  selectedId: string | null;
  onSelect: (item: any) => void;
  onClose: () => void;
};

const HabitPickerModal: React.FC<Props> = ({
  visible,
  title,
  items,
  selectedId,
  onSelect,
  onClose,
}) => {
  const [tempSelectedId, setTempSelectedId] = useState<string | null>(selectedId);

  useEffect(() => {
    if (visible) setTempSelectedId(selectedId);
  }, [visible, selectedId]);

  const getItemId = (item: any): string => item?.documentId ?? item?.id ?? "";
  const getItemName = (item: any): string => item?.name ?? "Untitled";

  const handleApply = () => {
    const selected = items.find((it) => getItemId(it) === tempSelectedId);
    if (selected) onSelect(selected);
    onClose();
  };

  const getBannerImage = (item: any): string | null =>
    item?.bannerImage || item?.imageUrl || getDefaultImageUrl2();

  const getIcon = (item: any): string =>
    "star-outline"; //item?.icon || "star-outline";

  const getIconColor = (item: any): string =>
    item?.iconColor || "#888";

  const getCost = (item: any): number | null => {
    const cost =
      item?.scoreComponent?.cost ?? item?.scoreObject?.cost ?? item?.cost;
    return cost != null ? cost : null;
  };

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

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {items.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No items found.</Text>
              </View>
            ) : (
              items.map((item) => {
                const id = getItemId(item);
                const isSelected = tempSelectedId === id;
                const banner = getBannerImage(item);
                const icon = getIcon(item);
                const iconColor = getIconColor(item);
                const cost = getCost(item);
                const score = getScore(item);
                const scoreLabel = getScoreLabel(item);
                const scoreRgb = getScoreRgb(item);

                return (
                  <TouchableOpacity
                    key={id}
                    activeOpacity={0.8}
                    style={[styles.card, isSelected && styles.cardSelected]}
                    onPress={() => setTempSelectedId(id)}
                  >
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

                    {/* Info row: icon circle + name + score badge */}
                    <View style={styles.infoRow}>
                      <View
                        style={[
                          styles.iconCircle,
                          { backgroundColor: iconColor },
                        ]}
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
                            <Text style={styles.scoreLabelText}>
                              {scoreLabel}
                            </Text>
                          ) : null}
                        </View>
                      )}
                    </View>

                    {/* Cost badge */}
                    {cost != null && (
                      <View style={styles.costRow}>
                        <View
                          style={[styles.costBadge, { backgroundColor: iconColor }]}
                        >
                          <Text style={styles.costText}>
                            $ {cost.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Description */}
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

export default HabitPickerModal;

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
    maxHeight: isTablet ? '100%' : hp(75),
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
  scrollArea: {
    maxHeight: isTablet ? '100%' : hp(55),
    marginTop: hp(2),
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
  costRow: {
    paddingHorizontal: wp(3),
    marginTop: hp(0.5),
    marginLeft: wp(12),
  },
  costBadge: {
    alignSelf: "flex-start",
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
  },
  costText: {
    color: "#fff",
    fontSize: wp(3),
    fontFamily: "poppins_semibold",
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
