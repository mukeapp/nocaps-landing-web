import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  Platform,
  Image,
  Pressable,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet,
  fs
} from "@/core/utils/responsive";
import Toast from "react-native-root-toast";

import { Colors } from "@/core/constants/Colors";
import { NocapPostCommentComponent, NocapPostCommentLikes } from "@/core/models/section-c";
import { IUser } from "@/core/models/section-a";
import { RouterData } from "@/core/models/section-b";
import { uuidUtils } from "@/core/utils";
import { GetUserByUserId } from "@/core/api/section-a/user";
import {
  fetchNocapPostCommentComponentsByPostId,
  createNocapPostComment,
  deleteNocapPostCommentPurge,
  createNocapPostCommentLike,
  deleteNocapPostCommentLike,
  deleteNocapPostCommentLikeByIdAndUserId,
  updateNocapPostComment,
} from "@/core/services/section-c/section-c-1/comment";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

interface CommentsBottomSheetProps {
  nocapPostId: string;
  currentUserId: string;
  postTitle?: string;
}

const PAGE_SIZE = 10;

const getTimeAgo = (date?: Date | string | { _seconds: number; _nanoseconds: number }): string => {
  if (!date) return "";

  let d: Date;
  if (typeof date === "object" && "_seconds" in date) {
    d = new Date(date._seconds * 1000);
  } else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${diffYear}y ago`;
};

const CommentsBottomSheet = React.forwardRef<RBSheetRef, CommentsBottomSheetProps>(
  ({ nocapPostId, currentUserId, postTitle }, ref) => {
    const navigation = useNavigation<any>();
    const [comments, setComments] = useState<NocapPostCommentComponent[]>([]);
    const [userMap, setUserMap] = useState<Record<string, IUser>>({});
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [sending, setSending] = useState(false);
    const [menuCommentId, setMenuCommentId] = useState<string | null>(null);
    const [editCommentId, setEditCommentId] = useState<string | null>(null);
    const [editCommentContent, setEditCommentContent] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [keyboardOffset, setKeyboardOffset] = useState(0);

    const flatListRef = useRef<FlatList>(null);
    const rbSheetRef = useRef<any>(null);
    useImperativeHandle(ref, () => ({
      open: () => rbSheetRef.current?.open(),
      close: () => rbSheetRef.current?.close(),
    }));

    useEffect(() => {
      const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
      const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
      const show = Keyboard.addListener(showEvent, (e) => setKeyboardOffset(e.endCoordinates.height));
      const hide = Keyboard.addListener(hideEvent, () => setKeyboardOffset(0));
      return () => { show.remove(); hide.remove(); };
    }, []);

    const loadComments = useCallback(async (pageNum: number = 1, append: boolean = false) => {
      if (loading && pageNum === 1) return;
      if (loadingMore && pageNum > 1) return;

      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const allComments = await fetchNocapPostCommentComponentsByPostId(nocapPostId);
        const sorted = allComments.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt as any).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt as any).getTime() : 0;
          return dateB - dateA;
        });

        const start = (pageNum - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const pageItems = sorted.slice(start, end);

        if (append) {
          setComments((prev) => [...prev, ...pageItems]);
        } else {
          setComments(pageItems);
        }

        setHasMore(end < sorted.length);
        setPage(pageNum);

        const uniqueIds = [...new Set(allComments.map((c) => c.userId).filter(Boolean))] as string[];
        const userEntries = await Promise.all(
          uniqueIds.map(async (uid) => {
            const { data } = await GetUserByUserId({ userId: uid });
            return data ? [uid, data as IUser] as const : null;
          })
        );
        setUserMap(Object.fromEntries(userEntries.filter(Boolean) as [string, IUser][]));
      } catch (err) {
        console.error("Failed to load comments:", err);
        Toast.show("Failed to load comments");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }, [nocapPostId, loading, loadingMore]);

    const handleLoadMore = useCallback(() => {
      if (!hasMore || loadingMore) return;
      loadComments(page + 1, true);
    }, [hasMore, loadingMore, page, loadComments]);

    const handleSendComment = useCallback(async () => {
      if (!newComment.trim() || sending) return;

      setSending(true);
      try {
        const now = new Date().toISOString();
        await createNocapPostComment({
          id: uuidUtils.generateUUID(),
          userId: currentUserId,
          nocapPostId,
          content: newComment.trim(),
          createdAt: now,
          updatedAt: now,
        });
        setNewComment("");
        setPage(1);
        setHasMore(true);
        await loadComments(1, false);
      } catch (err) {
        console.error("Failed to send comment:", err);
        Toast.show("Failed to send comment");
      } finally {
        setSending(false);
      }
    }, [newComment, sending, currentUserId, nocapPostId, loadComments]);

    const handleDeleteComment = useCallback(async (commentId: string) => {
      setMenuCommentId(null);
      try {
        await deleteNocapPostCommentPurge(commentId);
        Toast.show("Comment deleted");
        setPage(1);
        setHasMore(true);
        await loadComments(1, false);
      } catch (err) {
        console.error("Failed to delete comment:", err);
        Toast.show("Failed to delete comment");
      }
    }, [loadComments]);

    const handleStartEdit = useCallback((commentId: string) => {
      setMenuCommentId(null);
      const comment = comments.find((c) => (c.id ?? c.documentId) === commentId);
      if (comment) {
        setEditCommentId(commentId);
        setEditCommentContent(comment.content ?? "");
      }
    }, [comments]);

    const handleEditComment = useCallback(async (newContent: string) => {
      if (!editCommentId || !newContent.trim()) return;
      try {
        await updateNocapPostComment(editCommentId, {
          content: newContent.trim(),
          //updatedAt: new Date().toISOString(),
        });
        Toast.show("Comment updated");
        setPage(1);
        setHasMore(true);
        await loadComments(1, false);
      } catch (err) {
        console.error("Failed to update comment:", err);
        Toast.show("Failed to update comment");
      } finally {
        setEditCommentId(null);
        setEditCommentContent("");
      }
    }, [editCommentId, loadComments]);

    const handleToggleLike = useCallback(async (comment: NocapPostCommentComponent) => {
      const commentId = comment.id ?? comment.documentId;
      if (!commentId) return;

      console.log("Toggling like for comment:", commentId, "Current user:", currentUserId);

      const existingLike = comment.noCapPostCommentLikes?.find(
        (like) => like.userId === currentUserId
      );

      console.log("Toggling like for commentId:", commentId, "Existing like:", existingLike);

      try {
        if (existingLike) {
          const likeDocId = existingLike.documentId ?? existingLike.id;
          const nocapPostCommentId = existingLike?.nocapPostCommentId ?? commentId;
          if (nocapPostCommentId && likeDocId) {
            await deleteNocapPostCommentLikeByIdAndUserId(nocapPostCommentId, currentUserId);
          }
        } else {
          const now = new Date().toISOString();
          await createNocapPostCommentLike({
            id: uuidUtils.generateUUID(),
            userId: currentUserId,
            nocapPostCommentId: commentId,
            isLike: true,
            createdAt: now,
            updatedAt: now,
          });
        }

        // Optimistic update
        setComments((prev) =>
          prev.map((c) => {
            const cId = c.id ?? c.documentId;
            if (cId !== commentId) return c;

            const likes = c.noCapPostCommentLikes ?? [];
            if (existingLike) {
              return {
                ...c,
                noCapPostCommentLikes: likes.filter(
                  (l) => l.userId !== currentUserId
                ),
              };
            } else {
              return {
                ...c,
                noCapPostCommentLikes: [
                  ...likes,
                  {
                    id: "temp",
                    userId: currentUserId,
                    nocapPostCommentId: commentId,
                    isLike: true,
                  } as NocapPostCommentLikes,
                ],
              };
            }
          })
        );
      } catch (err) {
        console.error("Failed to toggle like:", err);
        Toast.show("Failed to update like");
        await loadComments(1, false);
      }
    }, [currentUserId, loadComments]);

    const renderComment = useCallback(({ item }: { item: NocapPostCommentComponent }) => {
      const isMyComment = item.userId === currentUserId;
      const commentId = item.id ?? item.documentId;
      const likes = item.noCapPostCommentLikes ?? [];
      const likesCount = likes.length;
      const isLikedByMe = likes.some((l) => l.userId === currentUserId);
      const user = userMap[item.userId ?? ''];
      const displayName = user?.username ?? user?.firstName ?? '?';

      const goToProfile = () => {
        if (!item.userId) return;
        rbSheetRef.current?.close();
        navigation.navigate('profile', {
          originScreen: 'comments',
          routerData: { destinationScreenTitle: 'Profile', userId: item.userId } as RouterData,
        });
      };

      const avatarNode = (
        <Pressable onPress={goToProfile} style={s.avatarWrap}>
          {user?.photo ? (
            <Image source={{ uri: user.photo }} style={s.avatar} />
          ) : (
            <View style={[s.avatar, s.avatarFallback]}>
              <Text style={s.avatarInitial}>{displayName[0].toUpperCase()}</Text>
            </View>
          )}
        </Pressable>
      );

      return (
        <View style={[s.commentRow, isMyComment ? s.commentRowRight : s.commentRowLeft]}>
          {!isMyComment && avatarNode}

          <View style={[s.commentBubble, isMyComment ? s.commentBubbleRight : s.commentBubbleLeft]}>
            <Text style={s.commentContent}>{item.content}</Text>

            <View style={s.commentFooter}>
              <View>
                <Text style={s.commentUsername}>@{displayName}</Text>
                <Text style={s.commentTime}>{getTimeAgo(item.createdAt)}</Text>
              </View>

              <View style={s.commentActions}>
                <TouchableOpacity style={s.likeButton} onPress={() => handleToggleLike(item)}>
                  <MaterialCommunityIcons
                    name={isLikedByMe ? "thumb-up" : "thumb-up-outline"}
                    size={wp(3.5)}
                    color={isLikedByMe ? Colors.blueback : "#888"}
                  />
                  {likesCount > 0 && (
                    <Text style={[s.likeCount, isLikedByMe && { color: Colors.blueback }]}>
                      {likesCount}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMenuCommentId(commentId ?? null)} style={s.moreButton}>
                  <Entypo name="dots-three-horizontal" size={wp(3.5)} color="#888" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {isMyComment && avatarNode}
        </View>
      );
    }, [currentUserId, handleToggleLike, userMap, navigation]);

    const renderFooter = useCallback(() => {
      if (!loadingMore) return null;
      return (
        <View style={s.loadingMore}>
          <ActivityIndicator size="small" color={Colors.blueback} />
        </View>
      );
    }, [loadingMore]);

    const isMenuCommentMine = menuCommentId
      ? comments.find((c) => (c.id ?? c.documentId) === menuCommentId)?.userId === currentUserId
      : false;

    return (
      <RBSheet
        ref={rbSheetRef}
        useNativeDriver={false}
        height={isTablet ? hp(150) : hp(70)}
        onOpen={() => loadComments(1, false)}
        customStyles={{
          container: {
            backgroundColor: "#1c1e1c",
            borderTopLeftRadius: wp(5),
            borderTopRightRadius: wp(5),
          },
          wrapper: {
            backgroundColor: "#000000ab",
          },
          draggableIcon: {
            backgroundColor: Colors.gray,
            width: wp(10),
          },
        }}
        customModalProps={{
          animationType: "fade",
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
      >
        <View
          style={[s.sheetContainer, { paddingBottom: keyboardOffset }]}
          pointerEvents={menuCommentId || editCommentId ? "none" : "auto"}
        >
          {/* Header */}
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Comments</Text>
          </View>

          {/* Post title preview */}
          {postTitle ? (
            <View style={s.postPreview}>
              <Text style={s.postPreviewText} numberOfLines={2}>
                {postTitle}
              </Text>
            </View>
          ) : null}

          {/* Comments list */}
          {loading ? (
            <View style={s.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.blueback} />
            </View>
          ) : comments.length === 0 ? (
            <View style={s.emptyContainer}>
              <Text style={s.emptyText}>No comments yet. Be the first!</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={comments}
              keyExtractor={(item) => item.id ?? item.documentId ?? String(Math.random())}
              renderItem={renderComment}
              contentContainerStyle={s.commentsList}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={renderFooter}
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* Input area */}
          <View style={s.inputContainer}>
            <TextInput
              style={s.input}
              placeholder="Add a comment..."
              placeholderTextColor="#666"
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                s.sendButton,
                !newComment.trim() && s.sendButtonDisabled,
              ]}
              onPress={handleSendComment}
              disabled={!newComment.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Feather name="send" size={wp(4.5)} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Comment Menu Modal */}
        {!!menuCommentId && (
          <View style={s.modalOverlay}>
            <TouchableOpacity
              style={s.modalOverlay}
              activeOpacity={1}
              onPress={() => setMenuCommentId(null)}
            >
              <View style={s.menuModal}>
                {isMenuCommentMine && (
                  <TouchableOpacity
                    style={s.menuItem}
                    onPress={() => menuCommentId && handleStartEdit(menuCommentId)}
                  >
                    <Feather name="edit" size={20} color={Colors.white} />
                    <Text style={s.menuItemText}>Edit</Text>
                  </TouchableOpacity>
                )}

                {isMenuCommentMine && <View style={s.menuDivider} />}

                {isMenuCommentMine && (
                  <TouchableOpacity
                    style={s.menuItem}
                    onPress={() => menuCommentId && handleDeleteComment(menuCommentId)}
                  >
                    <MaterialIcons name="delete" size={20} color={Colors.red} />
                    <Text style={[s.menuItemText, { color: Colors.red }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={s.menuDivider} />

                <TouchableOpacity
                  style={s.menuItem}
                  onPress={() => {
                    setMenuCommentId(null);
                    Toast.show("Comment shared");
                  }}
                >
                  <Feather name="share" size={20} color={Colors.white} />
                  <Text style={s.menuItemText}>Share</Text>
                </TouchableOpacity>

                <View style={s.menuDivider} />

                <TouchableOpacity
                  style={s.menuItem}
                  onPress={() => {
                    setMenuCommentId(null);
                    Toast.show("Comment reported");
                  }}
                >
                  <MaterialIcons name="report" size={20} color={Colors.orange} />
                  <Text style={[s.menuItemText, { color: Colors.orange }]}>
                    Report
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Edit Comment Modal */}
        {!!editCommentId && (
          <View style={s.modalOverlay}>
            <TouchableOpacity
              style={s.modalOverlay}
              activeOpacity={1}
              onPress={() => {
                setEditCommentId(null);
                setEditCommentContent("");
              }}
            >
              <View style={s.editModal}>
                <Text style={s.editModalTitle}>Edit Comment</Text>
                <TextInput
                  style={s.editInput}
                  value={editCommentContent}
                  onChangeText={setEditCommentContent}
                  multiline
                  maxLength={500}
                  autoFocus
                  placeholderTextColor="#666"
                  placeholder="Edit your comment..."
                />
                <View style={s.editModalActions}>
                  <TouchableOpacity
                    style={s.editCancelButton}
                    onPress={() => {
                      setEditCommentId(null);
                      setEditCommentContent("");
                    }}
                  >
                    <Text style={s.editCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      s.editSaveButton,
                      !editCommentContent.trim() && s.sendButtonDisabled,
                    ]}
                    onPress={() => handleEditComment(editCommentContent)}
                    disabled={!editCommentContent.trim()}
                  >
                    <Text style={s.editSaveText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </RBSheet>
    );
  }
);

export default CommentsBottomSheet;

const s = StyleSheet.create({
  sheetContainer: {
    flex: 1,
  },
  sheetHeader: {
    alignItems: "center",
    paddingVertical: hp(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  sheetTitle: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "700",
  },
  postPreview: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  postPreviewText: {
    color: "#aaa",
    fontSize: wp(3.2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: wp(3.5),
  },
  commentsList: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  commentRow: {
    marginBottom: hp(1.2),
    flexDirection: "row",
    alignItems: "flex-end",
    gap: wp(2),
  },
  commentRowLeft: {
    justifyContent: "flex-start",
  },
  commentRowRight: {
    justifyContent: "flex-end",
  },
  commentBubble: {
    maxWidth: wp(70),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(3),
  },
  commentBubbleLeft: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 0,
  },
  commentBubbleRight: {
    backgroundColor: "#fff",
    borderTopRightRadius: 0,
  },
  commentContent: {
    color: "#000",
    fontSize: wp(3.3),
    lineHeight: wp(4.5),
  },
  commentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(0.5),
  },
  avatarWrap: {},
  avatar: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
  },
  avatarFallback: {
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    color: "#fff",
    fontSize: wp(3),
    fontWeight: "700" as const,
  },
  commentUsername: {
    color: "#000",
    fontSize: wp(2.8),
    fontWeight: "600" as const,
    marginBottom: 1,
  },
  commentTime: {
    color: "#000",
    fontSize: wp(2.5),
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  likeCount: {
    color: "#888",
    fontSize: wp(2.5),
  },
  moreButton: {
    padding: wp(1),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderTopWidth: 0.5,
    borderTopColor: "#333",
    backgroundColor: "#1C1C1E",
  },
  input: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    borderRadius: wp(5),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    color: "#fff",
    fontSize: wp(3.3),
    maxHeight: hp(10),
  },
  sendButton: {
    marginLeft: wp(2),
    backgroundColor: Colors.blueback,
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  loadingMore: {
    paddingVertical: hp(2),
    alignItems: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuModal: {
    backgroundColor: Colors.content_back,
    borderRadius: 12,
    width: wp(50),
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemText: {
    color: Colors.white,
    fontSize: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.borderline,
    marginHorizontal: 8,
  },
  editModal: {
    backgroundColor: Colors.content_back,
    borderRadius: 12,
    width: wp(80),
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  editModalTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  editInput: {
    color: "#fff",
    fontSize: wp(3.5),
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    maxHeight: hp(15),
  },
  editModalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 12,
  },
  editCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editCancelText: {
    color: "#888",
    fontSize: 16,
  },
  editSaveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.blueback,
  },
  editSaveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
