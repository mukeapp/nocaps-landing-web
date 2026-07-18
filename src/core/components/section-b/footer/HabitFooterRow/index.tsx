import React, { useState, useRef } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import HabitStackLikesBottomSheet from "../HabitStackLikesBottomSheet";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import { useSelector } from "react-redux";

type RootState = any;
import { Colors } from "@/core/constants/Colors";
import { HabitStackComponent } from "@/core/models/section-b";
import { uuidUtils } from "@/core/utils";
import {
  CreateHabitStackLike,
  DeleteHabitStackLike,
} from "@/core/api/section-b/section-b-0/habit-stack";

type Props = {
  likesCount?: number;
  canEdit?: boolean;
  onEdit?: () => void;
  hideLikeIcon?: boolean;
  habitStack: HabitStackComponent;
};

const HabitFooterRow: React.FC<Props> = ({
  onEdit,
  canEdit = false,
  hideLikeIcon = false,
  habitStack = null,
}) => {
  const currentUserId = useSelector(
    (state: RootState) => state?.user?.userdata?.collectdata?.userId
  );

  const isLikedByCurrentUser = habitStack?.habitStackLikes?.some(
    (l) => l.userId === currentUserId && l.isLike
  );
  const existingLike = habitStack?.habitStackLikes?.find(
    (l) => l.userId === currentUserId && l.isLike
  );

  const [liked, setLiked] = useState(!!isLikedByCurrentUser);
  const [likeDocId, setLikeDocId] = useState<string | undefined>(
    existingLike?.documentId ?? existingLike?.id
  );
  const [likeLoading, setLikeLoading] = useState(false);

  interface RBSheetRef { open: () => void; close: () => void; }
  const likesSheetRef = useRef<RBSheetRef>(null);

  const serverCount = habitStack?.habitStackLikes?.length ?? 0;
  const displayCount =
    serverCount +
    (liked && !isLikedByCurrentUser ? 1 : 0) -
    (!liked && isLikedByCurrentUser ? 1 : 0);

  const handleToggleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    const nowLiked = !liked;
    setLiked(nowLiked);
    try {
      if (nowLiked) {
        const now = new Date().toISOString();
        const newId = uuidUtils.generateUUID();
        const { data, status } = await CreateHabitStackLike({
          id: newId,
          userId: currentUserId,
          habitStackId: habitStack?.id ?? habitStack?.documentId,
          isLike: true,
          createdAt: now,
          updatedAt: now,
        });
        if (status >= 200 && status < 300) {
          setLikeDocId(data?.id ?? data?.documentId ?? newId);
        } else {
          setLiked(!nowLiked);
        }
      } else {
        if (likeDocId) {
          const { status } = await DeleteHabitStackLike(likeDocId);
          if (status >= 200 && status < 300) {
            setLikeDocId(undefined);
          } else {
            setLiked(!nowLiked);
          }
        }
      }
    } catch {
      setLiked(!nowLiked);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <View style={s.footer}>
      <View style={s.likes}>
        {!hideLikeIcon && (
          <View style={s.heartWrap}>
            <Pressable onPress={handleToggleLike}>
              {liked ? (
                <MaterialCommunityIcons
                  name="cards-heart"
                  size={30}
                  color={Colors.colorred}
                />
              ) : (
                <FontAwesome5 name="heart" size={25} color={Colors.white} />
              )}
            </Pressable>
            {displayCount > 0 && (
              <Pressable
                onPress={() => likesSheetRef.current?.open()}
                style={s.countBadge}
              >
                <Text style={s.countText}>{displayCount}</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {canEdit && (
        <Pressable onPress={onEdit}>
          <Feather name="edit-3" size={20} color={Colors.white} />
        </Pressable>
      )}
      <HabitStackLikesBottomSheet
        ref={likesSheetRef}
        habitStackLikes={habitStack?.habitStackLikes ?? []}
        currentUserId={currentUserId}
        localLiked={!!liked}
      />
    </View>
  );
};

const s = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  likes: { flexDirection: "row", alignItems: "center" },
  heartWrap: {
    position: "relative",
  },
  countBadge: {
    position: "absolute",
    bottom: -5,
    right: -7,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  countText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "700",
  },
});

export default HabitFooterRow;
