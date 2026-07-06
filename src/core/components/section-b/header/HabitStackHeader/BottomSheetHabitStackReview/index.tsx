import React, { useState, useRef, useImperativeHandle } from 'react';
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
  Pressable,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
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
import { HabitStackComponent, HabitStackRating } from '@/core/models/section-b/habit';
import { IUser } from '@/core/models/section-a';
import { GetUserByUserId } from '@/core/api/section-a/user';
import { uuidUtils } from '@/core/utils';
import {
  CreateHabitStackRating,
  UpdateHabitStackRating,
  DeleteHabitStackRating,
} from '@/core/api/section-b/section-b-0/habit-stack';
import Toast from 'react-native-root-toast';

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
  habitStack: HabitStackComponent | null;
  habitStackRatings: HabitStackRating[];
  onRatingsChange: (ratings: HabitStackRating[]) => void;
  currentUserId: string;
}

interface RatingEntry {
  user: IUser;
  rating: HabitStackRating;
  expanded: boolean;
}

const AVATAR_SIZE = wp(11);

const BottomSheetHabitStackReview = React.forwardRef<RBSheetRef, Props>(
  ({ habitStack, habitStackRatings, onRatingsChange, currentUserId }, ref) => {
    const rbSheetRef = useRef<any>(null);
    useImperativeHandle(ref, () => ({
      open: () => rbSheetRef.current?.open(),
      close: () => rbSheetRef.current?.close(),
    }));

    const [entries, setEntries] = useState<RatingEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [ownerComment, setOwnerComment] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [menuEntryId, setMenuEntryId] = useState<string | null>(null);

    const rateScore =
      habitStackRatings.length > 0
        ? habitStackRatings.reduce((sum, r) => sum + (r.rating ?? 0), 0) / habitStackRatings.length
        : 0;
    const scoreIdx = Math.max(0, Math.min(5, Math.round(rateScore)));
    const alreadyRated = habitStackRatings.some((r) => r.userId === currentUserId);
    const [hasRated, setHasRated] = useState(alreadyRated);

    const fetchEntries = async () => {
      setLoading(true);
      const results = await Promise.all(
        habitStackRatings.map(async (rating) => {
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
        const { data } = await CreateHabitStackRating({
          id: newId,
          userId: currentUserId,
          habitStackId: habitStack?.id ?? habitStack?.documentId,
          rating: 0,
          comment: '',
          createdAt: now,
          updatedAt: now,
        });
        const newRating: HabitStackRating = {
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
        onRatingsChange([...habitStackRatings, newRating]);
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
        await UpdateHabitStackRating(docId, {
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
          habitStackRatings.map((r) =>
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
                await DeleteHabitStackRating(docId);
                setEntries((prev) =>
                  prev.filter(
                    (e) =>
                      (e.rating.id ?? e.rating.documentId) !==
                      (entry.rating.id ?? entry.rating.documentId)
                  )
                );
                onRatingsChange(
                  habitStackRatings.filter(
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
        await UpdateHabitStackRating(docId, { rating: newRating, comment: commentToSave, updatedAt: new Date().toISOString() });
        onRatingsChange(
          habitStackRatings.map((r) =>
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
            {user.photo ? (
              <Image source={{ uri: user.photo }} style={s.avatar} />
            ) : (
              <View style={[s.avatar, s.avatarFallback]}>
                <Text style={s.avatarInitial}>{(displayName[0] ?? '?').toUpperCase()}</Text>
              </View>
            )}
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
      <RBSheet
        ref={rbSheetRef}
        useNativeDriver={false}
        height={isTablet ? hp(150) : hp(75)}
        onOpen={fetchEntries}
        customStyles={{
          container: {
            backgroundColor: '#1c1e1c',
            borderTopLeftRadius: wp(5),
            borderTopRightRadius: wp(5),
          },
          wrapper: { backgroundColor: '#000000ab' },
          draggableIcon: { backgroundColor: Colors.gray, width: wp(10) },
        }}
        customModalProps={{ animationType: 'fade', statusBarTranslucent: true }}
        customAvoidingViewProps={{ enabled: false }}
      >
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.headerTitle}>HabitStack Reviews</Text>
            {rateScore > 0 && (
              <View style={[s.scoreChip, { backgroundColor: SCORE_COLORS[scoreIdx] + '33' }]}>
                <AntDesign name="star" size={fs(11)} color={SCORE_COLORS[scoreIdx]} />
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
              <AntDesign name="plus" size={fs(16)} color="#000" />
            </TouchableOpacity>
          )}
        </View>

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
            contentContainerStyle={{ paddingHorizontal: wp(4), paddingBottom: hp(4) }}
            ListEmptyComponent={
              <View style={s.empty}>
                <Text style={s.emptyText}>No reviews yet</Text>
              </View>
            }
          />
        )}

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
                <Feather name="flag" size={fs(16)} color="#e74c3c" />
                <Text style={s.menuOptionTextRed}>Report</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </RBSheet>
    );
  }
);

export default BottomSheetHabitStackReview;

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2.5),
  },
  headerTitle: {
    color: '#fff',
    fontSize: fs(16),
    fontWeight: '600',
  },
  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: wp(4),
  },
  scoreChipText: {
    fontSize: fs(12),
    fontWeight: '600',
  },
  addBtn: {
    width: wp(7.5),
    height: wp(7.5),
    borderRadius: wp(3.75),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingRow: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(1),
    borderBottomWidth: 0.5,
    borderBottomColor: '#2a2a2a',
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarFallback: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: fs(15),
    fontWeight: '700',
  },
  nameStars: {
    flex: 1,
    gap: hp(0.3),
  },
  username: {
    color: '#fff',
    fontSize: fs(14),
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
    gap: wp(0.75),
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  actionBtn: {
    padding: wp(1.5),
  },
  chevronBtn: {
    width: wp(6.5),
    height: wp(6.5),
    borderRadius: wp(3.25),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: wp(6.5),
    height: wp(6.5),
    borderRadius: wp(3.25),
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentBubble: {
    marginTop: hp(1),
    marginLeft: wp(3) + AVATAR_SIZE,
    backgroundColor: '#2a2a2a',
    borderRadius: wp(2),
    borderLeftWidth: 3,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  commentBubbleText: {
    color: '#ddd',
    fontSize: fs(13),
    lineHeight: fs(19),
    fontStyle: 'italic',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: hp(1),
    gap: wp(2),
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#444',
    color: '#fff',
    fontSize: fs(13),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    minHeight: hp(5),
    maxHeight: hp(12),
    textAlignVertical: 'top',
  },
  submitCommentBtn: {
    width: wp(7.5),
    height: wp(7.5),
    borderRadius: wp(3.75),
    backgroundColor: Colors.blueback,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    paddingTop: hp(5),
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: fs(14),
  },
  menuDotBtn: {
    width: wp(6.5),
    height: wp(6.5),
    borderRadius: wp(3.25),
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    backgroundColor: '#1c1e1c',
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
    paddingBottom: isTablet ? hp(40) : hp(30),
  },
  menuHandle: {
    width: wp(10),
    height: hp(0.5),
    borderRadius: hp(0.25),
    backgroundColor: '#555',
    alignSelf: 'center',
    marginBottom: hp(2),
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    paddingVertical: hp(1.8),
  },
  menuOptionTextRed: {
    color: '#e74c3c',
    fontSize: fs(15),
    fontWeight: '600',
  },
  timeAgoText: {
    color: '#666',
    fontSize: fs(11),
    marginTop: hp(0.4),
    marginLeft: wp(3) + AVATAR_SIZE,
  },
});
