import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import { HabitLinkItemComponent } from "@/core/models/section-b/habit";
import {
  resolveImageSource,
  truncateString,
  formatCost,
  getDefaultImageUrl2,
} from "@/core/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import Entypo from "@expo/vector-icons/Entypo";
import { Banner } from "@/core/components/section-b";
import { fetchUserByUserId } from "@/core/services/section-a";

type Props = {
  item: HabitLinkItemComponent;
  costSymbol?: string;
  onOpenItem?: (item: HabitLinkItemComponent) => void;
  onInfo?: (item: HabitLinkItemComponent) => void;
  color?: string;
  username?: string;
  mustReloadUser?: boolean;
};

const HabitLinkItemCard: React.FC<Props> = ({
  item,
  costSymbol = "",
  onOpenItem,
  onInfo,
  color,
  username = "",
  mustReloadUser = true,
}) => {
  const [liveUsername, setLiveUsername] = useState(username || ""); // State to hold the username
  const [isExpanded, setIsExpanded] = useState(true);

  const scoreColor =
    item?.scoreObject?.scoreInfo?.color?.toLowerCase() ||
    color ||
    Colors.inputback;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  React.useEffect(() => {
    const loadUser = async () => {
      if (mustReloadUser) {
        // console.log("Reloading user for stack:", stack);
        const user = await fetchUserByUserId(item?.userId ?? "");
        //console.log("Fetched user:", user);
        if (user?.username) {
          setLiveUsername(user.username);
        }
      }
    };

    loadUser();
  }, [mustReloadUser, item?.userId]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onOpenItem?.(item)}
      activeOpacity={0.8}
    >
      {/* Image Banner */}
      <Banner
        dataType="habit-link"
        bannerImage={item?.imageUrl ? item.imageUrl : getDefaultImageUrl2()}
        showCopyButton={false}
        showCopyButtonText={"None"}
        onCopyPress={() => {
          console.log("Copy pressed");
        }}
        username={username ? username : liveUsername}
        data={item}
      />

      {/* Content Section */}
      <View style={styles.content}>
        {/* Header Row */}
        <View style={styles.header}>
          <View style={styles.textContainer}>
            <Text style={[MainStyles.text12Bold, styles.nameText]}>
              {truncateString(item?.name ?? "Item", 20)}
            </Text>
            {item?.companyName && (
              <Text style={[MainStyles.text10, styles.companyText]}>
                {truncateString(item.companyName, 25)}
              </Text>
            )}
          </View>

          <View style={styles.rightHeader}>
            {/* Quantity */}
            {item?.quantity && (
              <View style={styles.quantityContainer}>
                <Text style={[MainStyles.text10, styles.quantityText]}>
                  Qty: {item.quantity}
                </Text>
              </View>
            )}

            {/* Cost */}
            <View style={styles.costContainer}>
              <Text style={[MainStyles.text12Bold, styles.costText]}>
                {costSymbol} {formatCost(item?.cost)}
              </Text>
            </View>

            {/* Toggle Button */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleExpand}
              activeOpacity={0.7}
            >
              <Entypo
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Expandable Content */}
        {isExpanded && (
          <>
            {/* Description */}
            {item?.description && (
              <Text
                style={[MainStyles.text10, styles.description]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            )}

            {/* Bottom Row - Icons */}
            <View style={styles.bottomRow}>
              <View style={styles.leftIcons}>
                {/* Picture Icon with Badge */}
                <View
                  style={[
                    MainStyles.sheeticon,
                    styles.iconButton,
                    { backgroundColor: Colors.filtertext },
                  ]}
                >
                  <AntDesign name="picture" size={16} color={Colors.white} />
                  <View style={styles.badge}>
                    <Text style={MainStyles.text8}>1</Text>
                  </View>
                </View>

                {/* Score Icon */}
                <View
                  style={[
                    MainStyles.sheeticon,
                    styles.iconButton,
                    { backgroundColor: scoreColor },
                  ]}
                >
                  <Fontisto name="arrow-swap" size={15} color={Colors.white} />
                </View>
              </View>

              {/* Info Icon */}
              {onInfo && (
                <TouchableOpacity
                  onPress={() => onInfo(item)}
                  style={[
                    MainStyles.sheeticon,
                    styles.iconButton,
                    { backgroundColor: Colors.filtertext },
                  ]}
                >
                  <AntDesign
                    name="info-circle"
                    size={16}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Additional Info */}
            {item?.location && (
              <View style={styles.additionalInfo}>
                <Text style={[MainStyles.text10, styles.infoText]}>
                  📍 {truncateString(item.location, 20)}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default HabitLinkItemCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.title_background,
    borderRadius: 12,
    marginVertical: hp(1),
    marginHorizontal: wp(2),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageBanner: {
    width: "100%",
    height: hp(20),
    backgroundColor: Colors.inputback,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: wp(4),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp(1),
  },
  textContainer: {
    flex: 1,
    marginRight: wp(2),
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: hp(0.5),
  },
  companyText: {
    fontSize: 12,
    color: Colors.white,
  },
  rightHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityContainer: {
    backgroundColor: Colors.filtertext,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: 6,
    marginRight: wp(2),
  },
  quantityText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.white,
  },
  costContainer: {
    backgroundColor: Colors.inputback,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 6,
    marginRight: wp(2),
  },
  costText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.white,
  },
  toggleButton: {
    backgroundColor: Colors.filtertext,
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 12,
    color: Colors.white,
    lineHeight: 18,
    marginBottom: hp(1.5),
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  iconButton: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: hp(-0.7),
    right: hp(-0.7),
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    backgroundColor: Colors.colorred,
    alignItems: "center",
    justifyContent: "center",
  },
  additionalInfo: {
    marginTop: hp(1.5),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: Colors.inputback,
  },
  infoText: {
    fontSize: 11,
    color: Colors.white,
  },
});
