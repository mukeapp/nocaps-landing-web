import {
  CreateNocapPostLike,
  DeleteNocapPostLike,
} from "@/core/api/section-c/section-c-1/post";
import {NocapPostPreview} from "@/core/components/section-b";
import {Colors} from "@/core/constants/Colors";
import {RouterData} from "@/core/models/section-b";
import {NocapPost} from "@/core/models/section-c";
import {uuidUtils} from "@/core/utils";
import {
  fs,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionic from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useNavigation} from "@react-navigation/native";
import React, {useRef, useState} from "react";
import {
  Alert,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import CommentsBottomSheetWeb from "../CommentsBottomSheetWeb";
import PostLikesBottomSheet from "../PostLikesBottomSheet";

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

interface PostItemProps {
  post: NocapPost;
  canEdit?: boolean;
  currentUserId: string;
  onHabitPress?: (post: NocapPost) => void;
  onDeletePost?: (postId?: string) => void;
}

const AVATAR = 40;

const PostItem = ({
  post,
  canEdit = false,
  currentUserId,
  onHabitPress,
  onDeletePost,
}: PostItemProps) => {
  const isLikedByCurrentUser = post?.nocapPostLikes?.some(
    (like) => like.userId === currentUserId && like.isLiked,
  );
  const [liked, setLiked] = useState(isLikedByCurrentUser);
  const serverCount =
    post?.nocapPostLikes?.filter((l) => l.isLiked).length ?? 0;
  const displayCount =
    serverCount +
    (liked && !isLikedByCurrentUser ? 1 : 0) -
    (!liked && isLikedByCurrentUser ? 1 : 0);
  const othersCount = serverCount - (isLikedByCurrentUser ? 1 : 0);
  const existingLike = post?.nocapPostLikes?.find(
    (l) => l.userId === currentUserId && l.isLiked,
  );
  const [likeDocId, setLikeDocId] = useState<string | undefined>(
    existingLike?.documentId ?? existingLike?.id,
  );
  const [likeLoading, setLikeLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPostPreview, setShowPostPreview] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const likesSheetRef = useRef<RBSheetRef>(null);

  const navigation = useNavigation<any>();

  const goToProfileScreen = () => {
    const routerData: RouterData = {
      destinationScreenTitle: "Profile",
      userId: post?.user?.userId ?? post?.userId,
    };
    navigation.navigate("profile", {
      originScreen: "post-item",
      routerData,
    });
  };

  const openComments = () => {
    setShowComments(true);
  };

  const handleDeleteClick = () => {
    setMenuOpen(false);
    setTimeout(() => {
      setShowDeleteConfirm(true);
    }, 400);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    setTimeout(() => {
      onDeletePost?.(post.id ?? post.documentId);
    }, 400);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleShare = async () => {
    setMenuOpen(false);
    try {
      await Share.share({
        message: `Check out "${post.title}" on NoCap!`,
      });
    } catch (_) {}
  };

  const handleToggleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    const nowLiked = !liked;
    setLiked(nowLiked);
    try {
      if (nowLiked) {
        const now = new Date().toISOString();
        const newId = uuidUtils.generateUUID();
        const { data, status } = await CreateNocapPostLike({
          id: newId,
          userId: currentUserId,
          nocapPostId: post.id ?? post.documentId,
          isLiked: true,
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
          const { status } = await DeleteNocapPostLike(likeDocId);
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

  const handleReport = () => {
    setMenuOpen(false);
    setTimeout(() => {
      Alert.alert("Report Post", "Are you sure you want to report this post?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Reported",
              "Thanks for letting us know. We will review this post.",
            );
          },
        },
      ]);
    }, 400);
  };

  return (
    <View style={s.postContainer}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={goToProfileScreen}
          activeOpacity={0.7}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Image
            source={{ uri: post?.user?.photo }}
            style={{
              width: AVATAR,
              height: AVATAR,
              borderRadius: AVATAR / 2,
            }}
          />
          <View style={{ paddingLeft: wp(1.5) }}>
            <Text
              style={{ fontSize: fs(14), fontWeight: "bold", color: "#fff" }}
            >
              {post?.user?.username}
            </Text>
            {post.location ? (
              <Text style={{ fontSize: fs(12), color: "#888" }}>
                {post.location}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenuOpen(true)} hitSlop={8}>
          <Feather name="more-vertical" size={fs(18)} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <View
        style={{
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: post.imageUrl }}
          style={{ width: "100%", height: 400 }}
          resizeMode="cover"
        />
      </View>

      {/* Actions */}
      <View style={s.actions}>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: wp(4) }}
        >
          <View style={s.actionBtn}>
            <TouchableOpacity
              onPress={handleToggleLike}
              style={{ position: "relative" }}
            >
              <Ionic
                name={liked ? "heart" : "heart-outline"}
                size={fs(26)}
                color={liked ? "red" : "#fff"}
              />
              {displayCount > 0 && (
                <TouchableOpacity
                  style={s.likeBadge}
                  onPress={() => likesSheetRef.current?.open()}
                >
                  <Text style={s.likeBadgeText}>
                    {displayCount > 99 ? "99+" : displayCount}
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => likesSheetRef.current?.open()}>
              <Text style={s.actionLabel}>Like</Text>
            </TouchableOpacity> */}
          </View>
          <TouchableOpacity onPress={openComments} style={s.actionBtn}>
            <Ionic name="chatbox-outline" size={fs(22)} color="#fff" />
            <Text style={s.actionLabel}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onHabitPress?.(post)}
            style={s.actionBtn}
          >
            <Feather name="codesandbox" size={fs(22)} color="#fff" />
            <Text style={s.actionLabel}>Habit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPostPreview(true)}
            style={s.actionBtn}
          >
            <AntDesign name="info-circle" size={fs(22)} color="#fff" />
            <Text style={s.actionLabel}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Likes & Content */}
      <View style={{ paddingHorizontal: wp(4) }}>
        {(othersCount > 0 || liked) && (
          <TouchableOpacity
            onPress={
              othersCount > 0 ? () => likesSheetRef.current?.open() : undefined
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: wp(1),
            }}
          >
            <Text
              style={{ fontSize: fs(14), color: "#fff", fontWeight: "600" }}
            >
              Liked by {liked ? "you" : ""}
              {liked && othersCount > 0 ? " and" : ""}
            </Text>
            {othersCount > 0 && (
              <View
                style={{
                  backgroundColor: "#3a3a3a",
                  borderRadius: wp(4),
                  paddingHorizontal: wp(2.5),
                  paddingVertical: hp(0.3),
                }}
              >
                <Text
                  style={{ fontSize: fs(13), color: "#fff", fontWeight: "600" }}
                >
                  {othersCount} others
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        <Text
          style={{
            fontWeight: "700",
            fontSize: fs(14),
            paddingVertical: hp(0.3),
            color: "#fff",
          }}
        >
          {post.title}
        </Text>
        {post.content ? (
          <Text
            style={{
              fontSize: fs(13),
              paddingVertical: hp(0.3),
              color: "#ccc",
            }}
          >
            {post.content}
          </Text>
        ) : null}
        <TouchableOpacity onPress={openComments}>
          <Text
            style={{
              color: "#666",
              paddingVertical: hp(0.3),
              fontSize: fs(13),
            }}
          >
            View all comments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <View style={[s.modalOverlay, !menuOpen && s.modalHidden]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        />
        <View style={s.menuModal}>
          <TouchableOpacity style={s.menuItem} onPress={handleShare}>
            <Feather name="share" size={fs(20)} color={Colors.white} />
            <Text style={s.menuItemText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.menuItem} onPress={handleReport}>
            <MaterialIcons name="report" size={fs(20)} color={Colors.white} />
            <Text style={s.menuItemText}>Report</Text>
          </TouchableOpacity>
          {canEdit && (
            <>
              <View style={s.menuDivider} />
              <TouchableOpacity
                style={s.menuItem}
                onPress={handleDeleteClick}
              >
                <MaterialIcons
                  name="delete"
                  size={fs(20)}
                  color={Colors.red}
                />
                <Text style={[s.menuItemText, { color: Colors.red }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Delete Confirmation Modal */}
      <View style={[s.deleteModalOverlay, !showDeleteConfirm && s.modalHidden]}>
        <View style={s.deleteModal}>
          <View style={s.deleteIconContainer}>
            <AntDesign
              name="exclamation-circle"
              size={fs(46)}
              color={Colors.red}
            />
          </View>

          <Text style={s.deleteTitle}>Delete Post</Text>
          <Text style={s.deleteMessage}>
            Are you sure you want to delete{" "}
            <Text style={s.deleteItemName}>{post.title}</Text>?
          </Text>
          <Text style={s.deleteWarning}>This action cannot be undone.</Text>

          <View style={s.deleteButtons}>
            <TouchableOpacity
              style={[s.deleteButton, s.cancelButton]}
              onPress={handleCancelDelete}
            >
              <Text style={s.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.deleteButton, s.confirmButton]}
              onPress={handleConfirmDelete}
            >
              <Text style={s.confirmButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Comments Bottom Sheet */}
      <CommentsBottomSheetWeb
        visible={showComments}
        onClose={() => setShowComments(false)}
        nocapPostId={post.id ?? post.documentId ?? ""}
        currentUserId={currentUserId}
        postTitle={post.title}
      />
      <PostLikesBottomSheet
        ref={likesSheetRef}
        nocapPostLikes={post.nocapPostLikes ?? []}
        currentUserId={currentUserId}
        localLiked={!!liked}
      />
      <NocapPostPreview
        rnsheet={showPostPreview}
        closefun={() => setShowPostPreview(false)}
        dataitem={post}
      />
    </View>
  );
};

export default PostItem;

const s = StyleSheet.create({
  postContainer: {
    paddingBottom: 8,
    borderBottomColor: "#222",
    borderBottomWidth: 0.5,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  likeBadge: {
    position: "absolute",
    bottom: -6,
    right: -12,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  likeBadgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "700",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99998,
  },
  modalHidden: {
    display: "none",
  },
  menuModal: {
    backgroundColor: Colors.content_back,
    borderRadius: 12,
    width: 200,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "regular",
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.borderline,
    marginHorizontal: 16,
  },
  deleteModalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99998,
  },
  deleteModal: {
    backgroundColor: Colors.content_back,
    borderRadius: 16,
    width: 360,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.red,
  },
  deleteIconContainer: {
    marginBottom: 16,
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: 8,
    textAlign: "center",
  },
  deleteMessage: {
    fontSize: 15,
    color: Colors.text_color,
    textAlign: "center",
    marginBottom: 4,
  },
  deleteItemName: {
    color: Colors.white,
    fontWeight: "600",
  },
  deleteWarning: {
    fontSize: 13,
    color: Colors.red,
    textAlign: "center",
    marginBottom: 24,
  },
  deleteButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.content_back,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  cancelButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "poppins_semibold",
  },
  confirmButton: {
    backgroundColor: "#FF4444",
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "poppins_semibold",
  },
});
