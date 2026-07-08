import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  Platform,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet,
  fs,
} from '@/core/utils/responsive';
import { Colors } from '@/core/constants/Colors';
import { HabitComponent } from '@/core/models/section-b';
import { HabitRating } from '@/core/models/section-b/habit';
import { IUser } from '@/core/models/section-a';
import { GetUserByUserId } from '@/core/api/section-a/user';
import { uuidUtils } from '@/core/utils';
import {
  CreateHabitRating,
  UpdateHabitRating,
  DeleteHabitRating,
} from '@/core/api/section-b/section-b-0/habit';
import Toast from 'react-native-root-toast';

const isWeb = Platform.OS === 'web';

export const SCORE_COLORS = ['#6B7280', '#e74c3c', '#8e44ad', '#e67e22', '#27ae60', '#f1c40f'];
const SCORE_LABELS = ['UNKNOWN', 'BAD', 'POOR', 'AVERAGE', 'GOOD', 'EXCELLENT'];

const getTimeAgo = (date?: Date | string | { _seconds: number; _nanoseconds: number }): string => {
  if (!date) return '';
  let d: Date;
  if (typeof date === 'object' && '_seconds' in date) {
    d = new Date((date as any)._seconds * 1000);
  } else {
    d = new Date(date as any);
  }
  if (isNaN(d.getTime())) return '';
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

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

interface Props {
  habit: HabitComponent | null;
  habitRatings: HabitRating[];
  onRatingsChange: (ratings: HabitRating[]) => void;
  currentUserId: string;
}

interface RatingEntry {
  user: IUser;
  rating: HabitRating;
  expanded: boolean;
}

const AVATAR_SIZE = wp(11);

const BottomSheetHabitReview = React.forwardRef<RBSheetRef, Props>(
  ({ habit, habitRatings, onRatingsChange, currentUserId }, ref) => {
    const navigation = useNavigation<any>();
    const { width: winWidth, height: winHeight } = useWindowDimensions();
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setVisible(true),
      close: () => setVisible(false),
    }));

    useEffect(() => {
      if (visible) {
        fetchEntries();
      }
    }, [visible]);

    const [entries, setEntries] = useState<RatingEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [ownerComment, setOwnerComment] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [menuEntryId, setMenuEntryId] = useState<string | null>(null);

    const rateScore =
      habitRatings.length > 0
        ? habitRatings.reduce((sum, r) => sum + (r.rating ?? 0), 0) / habitRatings.length
        : 0;
    const scoreIdx = Math.max(0, Math.min(5, Math.round(rateScore)));
    const alreadyRated = habitRatings.some((r) => r.userId === currentUserId);
    const [hasRated, setHasRated] = useState(alreadyRated);

    const fetchEntries = async () => {
      setLoading(true);
      const results = await Promise.all(
        habitRatings.map(async (rating) => {
          const { data } = await GetUserByUserId({ userId: rating.userId! });
          return data
            ? {
                user: data as IUser,
                rating,
                expanded: !!(rating.comment && rating.comment.length > 0),
              }
            : null;
        })
      );
      const filtered = results.filter(Boolean) as RatingEntry[];
      setEntries(filtered);
      const ownerEntry = filtered.find((e) => e.rating.userId === currentUserId);
      setOwnerComment(ownerEntry?.rating.comment ?? '');
      setLoading(false);
    };

    const toggleExpand = (id: string) => {
      setEntries((prev) =>
        prev.map((e) =>
          (e.rating.id ?? e.rating.documentId) === id
            ? { ...e, expanded: !e.expanded }
            : e
        )
      );
    };

    const handleAddInitialReview = async () => {
      if (addLoading) return;
      setAddLoading(true);
      try {
        const now = new Date().toISOString();
        const newId = uuidUtils.generateUUID();
        const { data } = await CreateHabitRating({
          id: newId,
          userId: currentUserId,
          habitId: habit?.id ?? habit?.documentId,
          rating: 0,
          comment: '',
          createdAt: now,
          updatedAt: now,
        });
        const newRating: HabitRating = {
          id: data?.id ?? newId,
          userId: currentUserId,
          rating: 0,
          comment: '',
        };
        const { data: userData } = await GetUserByUserId({ userId: currentUserId });
        if (userData) {
          setEntries((prev) => [
            { user: userData as IUser, rating: newRating, expanded: false },
            ...prev,
          ]);
        }
        onRatingsChange([...habitRatings, newRating]);
        setHasRated(true);
        setOwnerComment('');
        Toast.show('Review added — tap a star to rate');
      } catch {
        Toast.show('Failed to add review');
      } finally {
        setAddLoading(false);
      }
    };

    const handleSubmitComment = async () => {
      const ownerEntry = entries.find((e) => e.rating.userId === currentUserId);
      if (!ownerEntry || commentSubmitting) return;
      setCommentSubmitting(true);
      try {
        const docId = ownerEntry.rating.documentId ?? ownerEntry.rating.id!;
        const now = new Date().toISOString();
        await UpdateHabitRating(docId, {
          rating: ownerEntry.rating.rating ?? 0,
          comment: ownerComment,
          updatedAt: now,
        });
        setEntries((prev) =>
          prev.map((e) =>
            e.rating.userId === currentUserId
              ? { ...e, rating: { ...e.rating, comment: ownerComment, updatedAt: new Date(now) } }
              : e
          )
        );
        onRatingsChange(
          habitRatings.map((r) =>
            r.userId === currentUserId ? { ...r, comment: ownerComment } : r
          )
        );
        Toast.show('Comment updated');
      } catch {
        Toast.show('Failed to save comment');
      } finally {
        setCommentSubmitting(false);
      }
    };

    const handleDelete = (entry: RatingEntry) => {
      Alert.alert(
        'Delete Review',
        'Are you sure you want to delete your review?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                const docId = entry.rating.documentId ?? entry.rating.id!;
                await DeleteHabitRating(docId);
                setEntries((prev) =>
                  prev.filter(
                    (e) =>
                      (e.rating.id ?? e.rating.documentId) !==
                      (entry.rating.id ?? entry.rating.documentId)
                  )
                );
                onRatingsChange(
                  habitRatings.filter(
                    (r) =>
                      (r.id ?? r.documentId) !==
                      (entry.rating.id ?? entry.rating.documentId)
                  )
                );
                if (entry.rating.userId === currentUserId) {
                  setHasRated(false);
                  setOwnerComment('');
                }
                Toast.show('Review deleted');
              } catch {
                Toast.show('Failed to delete review');
              }
            },
          },
        ]
      );
    };

    const handleStarTap = async (entry: RatingEntry, starIdx: number) => {
      const currentRating = entry.rating.rating ?? 0;
      const newRating = currentRating >= starIdx ? starIdx - 1 : starIdx;
      const entryKey = entry.rating.id ?? entry.rating.documentId;

      setEntries((prev) =>
        prev.map((e) =>
          (e.rating.id ?? e.rating.documentId) === entryKey
            ? { ...e, rating: { ...e.rating, rating: newRating } }
            : e
        )
      );

      try {
        const docId = entry.rating.documentId ?? entry.rating.id!;
        const commentToSave =
          entry.rating.userId === currentUserId
            ? ownerComment
            : (entry.rating.comment ?? '');
        await UpdateHabitRating(docId, { rating: newRating, comment: commentToSave, updatedAt: new Date().toISOString() });
        onRatingsChange(
          habitRatings.map((r) =>
            (r.id ?? r.documentId) === entryKey ? { ...r, rating: newRating } : r
          )
        );
      } catch {
        setEntries((prev) =>
          prev.map((e) =>
            (e.rating.id ?? e.rating.documentId) === entryKey
              ? { ...e, rating: { ...e.rating, rating: currentRating } }
              : e
          )
        );
        Toast.show('Failed to update rating');
      }
    };

    const renderStars = (count: number) => (
      <View style={s.starsRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Ionicons
            key={i}
            name={i <= count ? 'star' : 'star-outline'}
            size={fs(13)}
            color={i <= count ? SCORE_COLORS[Math.min(count, 5)] : '#555'}
          />
        ))}
      </View>
    );

    const renderItem = ({ item }: { item: RatingEntry }) => {
      const { user, rating, expanded } = item;
      const isOwner = rating.userId === currentUserId;
      const entryId = rating.id ?? rating.documentId ?? '';
      const displayName =
        (user.username ??
          `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()) ||
        'Unknown';

      return (
        <View style={s.ratingRow}>
          <View style={s.rowTop}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (rating.userId) {
                  setVisible(false);
                  navigation.navigate('profile', {
                    originScreen: 'reviews',
                    routerData: { destinationScreenTitle: 'Profile', userId: rating.userId },
                  });
                }
              }}
            >
              {user.photo ? (
                <Image source={{ uri: user.photo }} style={s.avatar} />
              ) : (
                <View style={[s.avatar, s.avatarFallback]}>
                  <Text style={s.avatarInitial}>{(displayName[0] ?? '?').toUpperCase()}</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={s.nameStars}>
              <Text style={s.username} numberOfLines={1}>{displayName}</Text>
              {isOwner ? (
                <View style={s.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => {
                    const filled = i <= (rating.rating ?? 0);
                    return (
                      <TouchableOpacity key={i} onPress={() => handleStarTap(item, i)} hitSlop={4}>
                        <Ionicons
                          name={filled ? 'star' : 'star-outline'}
                          size={fs(14)}
                          color={filled ? '#f1c40f' : '#555'}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                renderStars(rating.rating ?? 0)
              )}
            </View>
            <View style={s.rowActions}>
              <TouchableOpacity onPress={() => setMenuEntryId(entryId)} style={s.menuDotBtn}>
                <Feather name="more-vertical" size={fs(14)} color="#fff" />
              </TouchableOpacity>
              {isOwner && (
                <TouchableOpacity onPress={() => handleDelete(item)} style={s.deleteBtn}>
                  <Feather name="trash-2" size={fs(14)} color="#e74c3c" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => toggleExpand(entryId)} style={s.chevronBtn}>
                <Feather
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={fs(16)}
                  color="#333"
                />
              </TouchableOpacity>
            </View>
          </View>

          {isOwner ? (
            expanded ? (
              <>
                <View style={s.commentInputRow}>
                  <TextInput
                    style={s.commentTextInput}
                    value={ownerComment}
                    onChangeText={setOwnerComment}
                    placeholder="Add a comment..."
                    placeholderTextColor="#666"
                    multiline
                  />
                  <TouchableOpacity
                    style={[s.submitCommentBtn, commentSubmitting && { opacity: 0.5 }]}
                    onPress={handleSubmitComment}
                    disabled={commentSubmitting}
                  >
                    <Feather name="arrow-up" size={fs(15)} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text style={s.timeAgoText}>{getTimeAgo(rating.updatedAt ?? rating.createdAt)}</Text>
              </>
            ) : null
          ) : (
            expanded && rating.comment ? (
              <>
                <View style={[
                  s.commentBubble,
                  { borderLeftColor: SCORE_COLORS[Math.min(rating.rating ?? 0, 5)] },
                ]}>
                  <Text style={s.commentBubbleText}>{rating.comment}</Text>
                </View>
                <Text style={s.timeAgoText}>{getTimeAgo(rating.updatedAt ?? rating.createdAt)}</Text>
              </>
            ) : null
          )}
        </View>
      );
    };

    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <View style={[s.modalContainer, isWeb && s.modalContainerWeb]}>
          {/* Backdrop — tap outside sheet to close */}
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setVisible(false)} />

          <View style={[s.sheet, isWeb && s.sheetWeb]}>
            {/* Handle */}
            <View style={s.handle} />

            {/* Header */}
            <View style={s.header}>
              <View style={s.headerLeft}>
                <Text style={s.headerTitle}>Habit Review</Text>
                {rateScore > 0 && (
                  <View style={[s.scoreChip, { backgroundColor: SCORE_COLORS[scoreIdx] + '33' }]}>
                    <AntDesign name="star" size={isWeb ? 12 : fs(11)} color={SCORE_COLORS[scoreIdx]} />
                    <Text style={[s.scoreChipText, { color: SCORE_COLORS[scoreIdx] }]}>
                      {rateScore.toFixed(1)} · {SCORE_LABELS[scoreIdx]}
                    </Text>
                  </View>
                )}
              </View>
              {!hasRated && (
                <TouchableOpacity
                  style={[s.addBtn, addLoading && { opacity: 0.5 }]}
                  onPress={handleAddInitialReview}
                  disabled={addLoading}
                >
                  <AntDesign name="plus" size={isWeb ? 16 : fs(16)} color="#000" />
                </TouchableOpacity>
              )}
            </View>

            {/* Content */}
            {loading ? (
              <View style={s.loader}>
                <ActivityIndicator size="large" color={Colors.blueback} />
              </View>
            ) : (
              <FlatList
                data={[...entries].sort((a, b) =>
                  a.rating.userId === currentUserId ? -1 : b.rating.userId === currentUserId ? 1 : 0
                )}
                keyExtractor={(item) =>
                  item.rating.id ?? item.rating.documentId ?? Math.random().toString()
                }
                renderItem={renderItem}
                contentContainerStyle={s.listContent}
                ListEmptyComponent={
                  <View style={s.empty}>
                    <Text style={s.emptyText}>No reviews yet</Text>
                  </View>
                }
              />
            )}

            {/* Close button */}
            <TouchableOpacity
              style={[s.closeBtn, isWeb && s.closeBtnWeb]}
              onPress={() => setVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={s.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={menuEntryId !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setMenuEntryId(null)}
        >
          <Pressable style={s.menuBackdrop} onPress={() => setMenuEntryId(null)}>
            <View style={s.menuSheet}>
              <View style={s.menuHandle} />
              <TouchableOpacity
                style={s.menuOption}
                onPress={() => {
                  setMenuEntryId(null);
                  Toast.show('Report submitted');
                }}
              >
                <Feather name="flag" size={isWeb ? 16 : fs(16)} color="#e74c3c" />
                <Text style={s.menuOptionTextRed}>Report</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </Modal>
    );
  }
);

export default BottomSheetHabitReview;

const s = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.78)',
  },
  modalContainerWeb: {
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: wp(7),
    borderTopRightRadius: wp(7),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    height: isTablet ? hp(150) : hp(85),
    paddingBottom: Platform.OS === 'ios' ? hp(5.5) : hp(3),
  },
  sheetWeb: {
    width: '100%',
    maxWidth: 600,
    height: '65%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 18,
  },
  handle: {
    width: wp(10),
    height: hp(0.5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: wp(0.5),
    alignSelf: 'center',
    marginTop: hp(1.5),
    marginBottom: hp(1),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isWeb ? 20 : wp(4),
    paddingVertical: isWeb ? 14 : hp(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isWeb ? 10 : wp(2.5),
  },
  headerTitle: {
    color: '#f1f5f9',
    fontSize: isWeb ? 17 : fs(16),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isWeb ? 4 : wp(1),
    paddingHorizontal: isWeb ? 10 : wp(2.5),
    paddingVertical: isWeb ? 4 : hp(0.4),
    borderRadius: isWeb ? 12 : wp(4),
  },
  scoreChipText: {
    fontSize: isWeb ? 12 : fs(12),
    fontWeight: '600',
  },
  addBtn: {
    width: isWeb ? 32 : wp(7.5),
    height: isWeb ? 32 : wp(7.5),
    borderRadius: isWeb ? 16 : wp(3.75),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: isWeb ? 20 : wp(4),
    paddingBottom: isWeb ? 20 : hp(4),
  },
  ratingRow: {
    paddingVertical: isWeb ? 12 : hp(1.2),
    paddingHorizontal: isWeb ? 4 : wp(1),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isWeb ? 12 : wp(3),
  },
  avatar: {
    width: isWeb ? 44 : AVATAR_SIZE,
    height: isWeb ? 44 : AVATAR_SIZE,
    borderRadius: isWeb ? 22 : AVATAR_SIZE / 2,
  },
  avatarFallback: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: isWeb ? 16 : fs(15),
    fontWeight: '700',
  },
  nameStars: {
    flex: 1,
    gap: isWeb ? 4 : hp(0.3),
  },
  username: {
    color: '#f1f5f9',
    fontSize: isWeb ? 15 : fs(14),
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
    gap: isWeb ? 4 : wp(0.75),
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isWeb ? 6 : wp(1),
  },
  chevronBtn: {
    width: isWeb ? 28 : wp(6.5),
    height: isWeb ? 28 : wp(6.5),
    borderRadius: isWeb ? 14 : wp(3.25),
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: isWeb ? 28 : wp(6.5),
    height: isWeb ? 28 : wp(6.5),
    borderRadius: isWeb ? 14 : wp(3.25),
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentBubble: {
    marginTop: isWeb ? 10 : hp(1),
    marginLeft: isWeb ? 56 : wp(3) + AVATAR_SIZE,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: isWeb ? 10 : wp(2),
    borderLeftWidth: 3,
    paddingHorizontal: isWeb ? 14 : wp(3),
    paddingVertical: isWeb ? 10 : hp(1),
  },
  commentBubbleText: {
    color: '#9ca3af',
    fontSize: isWeb ? 13 : fs(13),
    lineHeight: isWeb ? 20 : fs(19),
    fontStyle: 'italic',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: isWeb ? 10 : hp(1),
    gap: isWeb ? 8 : wp(2),
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: isWeb ? 10 : wp(2),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: isWeb ? 13 : fs(13),
    paddingHorizontal: isWeb ? 14 : wp(3),
    paddingVertical: isWeb ? 10 : hp(0.8),
    minHeight: isWeb ? 44 : hp(5),
    maxHeight: isWeb ? 100 : hp(12),
    textAlignVertical: 'top',
  },
  submitCommentBtn: {
    width: isWeb ? 32 : wp(7.5),
    height: isWeb ? 32 : wp(7.5),
    borderRadius: isWeb ? 16 : wp(3.75),
    backgroundColor: Colors.blueback,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    paddingTop: isWeb ? 60 : hp(5),
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: isWeb ? 15 : fs(14),
    fontStyle: 'italic',
  },
  menuDotBtn: {
    width: isWeb ? 28 : wp(6.5),
    height: isWeb ? 28 : wp(6.5),
    borderRadius: isWeb ? 14 : wp(3.25),
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: isWeb ? 24 : wp(5),
    borderTopRightRadius: isWeb ? 24 : wp(5),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: isWeb ? 20 : wp(4),
    paddingTop: isWeb ? 12 : hp(1.5),
    paddingBottom: isWeb ? 40 : (isTablet ? hp(40) : hp(30)),
  },
  menuHandle: {
    width: isWeb ? 40 : wp(10),
    height: isWeb ? 4 : hp(0.5),
    borderRadius: isWeb ? 2 : hp(0.25),
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: isWeb ? 16 : hp(2),
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isWeb ? 12 : wp(3),
    paddingVertical: isWeb ? 14 : hp(1.8),
  },
  menuOptionTextRed: {
    color: '#e74c3c',
    fontSize: isWeb ? 15 : fs(15),
    fontWeight: '600',
  },
  timeAgoText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: isWeb ? 11 : fs(11),
    marginTop: isWeb ? 4 : hp(0.4),
    marginLeft: isWeb ? 56 : wp(3) + AVATAR_SIZE,
  },
  closeBtn: {
    marginHorizontal: isWeb ? 20 : wp(5),
    marginTop: isWeb ? 10 : hp(1.5),
    paddingVertical: isWeb ? 12 : hp(1.8),
    borderRadius: isWeb ? 12 : wp(3.5),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  closeBtnWeb: {
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeBtnText: {
    color: '#9ca3af',
    fontSize: isWeb ? 15 : fs(15),
    fontWeight: '700',
  },
});
