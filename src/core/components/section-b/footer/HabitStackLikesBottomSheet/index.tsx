import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Platform,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet,
  fs,
} from '@/core/utils/responsive';
import { Colors } from '@/core/constants/Colors';
import { HabitStackLikes } from '@/core/models/section-b/habit';
import { IUser } from '@/core/models/section-a';
import { GetUserByUserId } from '@/core/api/section-a/user';
import {
  createFriendRequest,
  fetchUserAreFriendsAndMapForPagination,
  fetchFriendsRequestsAndMapForPagination,
} from '@/core/services/section-b/section-b-1';
import { IUserComponent } from '@/core/models/section-a';

const isWeb = Platform.OS === 'web';

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

interface HabitStackLikesBottomSheetProps {
  habitStackLikes: HabitStackLikes[];
  currentUserId: string;
  localLiked: boolean;
}

type EmotionKey = 'all' | 'heart';

interface LikerEntry {
  user: IUser;
  like: HabitStackLikes;
}

const AVATAR_SIZE = wp(12);

const HabitStackLikesBottomSheet = React.forwardRef<RBSheetRef, HabitStackLikesBottomSheetProps>(
  ({ habitStackLikes, currentUserId, localLiked }, ref) => {
    const navigation = useNavigation<any>();
    const { width: winWidth, height: winHeight } = useWindowDimensions();
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setVisible(true),
      close: () => setVisible(false),
    }));

    useEffect(() => {
      if (visible) {
        fetchLikers();
      }
    }, [visible]);

    const [likerUsers, setLikerUsers] = useState<LikerEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState<EmotionKey>('all');
    const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
    const [friendUserIds, setFriendUserIds] = useState<Set<string>>(new Set());
    const [pendingSentUserIds, setPendingSentUserIds] = useState<Set<string>>(new Set());

    const fetchLikers = async () => {
      setLoading(true);
      const liked = habitStackLikes
        .filter((l) => l.isLike && l.userId)
        .filter((l) => localLiked || l.userId !== currentUserId);
      const currentUserInList = liked.some((l) => l.userId === currentUserId);
      if (localLiked && !currentUserInList) {
        liked.push({ userId: currentUserId, isLike: true, id: 'local' });
      }

      const [userResults, friendsResult, requestsResult] = await Promise.all([
        Promise.all(
          liked.map(async (like) => {
            const { data } = await GetUserByUserId({ userId: like.userId! });
            return data ? { user: data as IUser, like } : null;
          })
        ),
        fetchUserAreFriendsAndMapForPagination(currentUserId, 1, 500),
        fetchFriendsRequestsAndMapForPagination(currentUserId, 1, 500),
      ]);

      setLikerUsers(userResults.filter(Boolean) as LikerEntry[]);

      setFriendUserIds(
        new Set(
          (friendsResult.items as IUserComponent[])
            .map((u) => u.userId!)
            .filter(Boolean)
        )
      );

      setPendingSentUserIds(
        new Set(
          (requestsResult.items as IUserComponent[])
            .filter((u) => u.friend?.isSender)
            .map((u) => u.userId!)
            .filter(Boolean)
        )
      );

      setLoading(false);
    };

    const handleAddFriend = async (userId: string) => {
      try {
        setSentRequests((prev) => new Set(prev).add(userId));
        await createFriendRequest(currentUserId, userId);
        Toast.show('Friend request sent');
      } catch {
        setSentRequests((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
        Toast.show('Failed to send request');
      }
    };

    const emotionTabs: Array<{ key: EmotionKey; emoji: string | null; label: string }> = [
      { key: 'all', emoji: null, label: `All ${likerUsers.length}` },
      { key: 'heart', emoji: '❤️', label: `${likerUsers.length}` },
    ];

    const filteredLikers = likerUsers;

    const renderItem = ({ item }: { item: LikerEntry }) => {
      const { user, like } = item;
      const isMe = like.userId === currentUserId;
      const isFriend = friendUserIds.has(like.userId ?? '');
      const isPending = pendingSentUserIds.has(like.userId ?? '') || sentRequests.has(like.userId ?? '');
      const displayName =
        user.username ??
        `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ??
        'Unknown';
      const subName = user.username
        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
        : '';

      return (
        <View style={s.row}>
          <TouchableOpacity
            style={s.avatarWrap}
            activeOpacity={0.7}
            onPress={() => {
              if (like.userId) {
                setVisible(false);
                navigation.navigate('profile', {
                  originScreen: 'likes',
                  routerData: { destinationScreenTitle: 'Profile', userId: like.userId },
                });
              }
            }}
          >
            {user.photo ? (
              <Image source={{ uri: user.photo }} style={s.avatar} />
            ) : (
              <View style={[s.avatar, s.avatarFallback]}>
                <Text style={s.avatarInitial}>
                  {(displayName[0] ?? '?').toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={s.reactionBadge}>❤️</Text>
          </TouchableOpacity>

          <View style={s.nameWrap}>
            <Text style={s.username} numberOfLines={1}>
              {displayName}
            </Text>
            {subName ? (
              <Text style={s.subname} numberOfLines={1}>
                {subName}
              </Text>
            ) : null}
          </View>

          {!isMe && (
            <TouchableOpacity
              style={[s.addBtn, isFriend && s.addBtnFriend, isPending && s.addBtnSent]}
              onPress={() => {
                if (isFriend) {
                  setVisible(false);
                  navigation.navigate('my-friends-and-habits');
                } else if (!isPending) {
                  handleAddFriend(like.userId!);
                }
              }}
              disabled={isPending && !isFriend}
            >
              <Text style={[s.addBtnText, isFriend && s.addBtnTextFriend, isPending && s.addBtnTextSent]}>
                {isFriend ? 'Friends' : isPending ? 'Pending' : 'Add Friend'}
              </Text>
            </TouchableOpacity>
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
              <Text style={s.headerTitle}>People who reacted</Text>
            </View>

            {/* Emotion tabs */}
            <View style={s.tabRow}>
              {emotionTabs.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[s.tab, selectedEmotion === tab.key && s.tabActive]}
                  onPress={() => setSelectedEmotion(tab.key)}
                >
                  {tab.emoji ? <Text style={s.tabEmoji}>{tab.emoji}</Text> : null}
                  <Text style={[s.tabLabel, selectedEmotion === tab.key && s.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Content */}
            {loading ? (
              <View style={s.loader}>
                <ActivityIndicator size="large" color={Colors.blueback} />
              </View>
            ) : (
              <FlatList
                data={filteredLikers}
                keyExtractor={(item) =>
                  item.like.userId ?? item.like.id ?? Math.random().toString()
                }
                renderItem={renderItem}
                contentContainerStyle={s.listContent}
                ListEmptyComponent={
                  <View style={s.empty}>
                    <Text style={s.emptyText}>No reactions yet</Text>
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
      </Modal>
    );
  }
);

export default HabitStackLikesBottomSheet;

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
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: {
    color: '#f1f5f9',
    fontSize: fs(16),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    gap: wp(2),
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.7),
    borderRadius: wp(5),
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: wp(1),
  },
  tabActive: {
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tabEmoji: {
    fontSize: fs(14),
  },
  tabLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fs(13),
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.2),
    gap: wp(3),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  avatarWrap: {
    position: 'relative',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarFallback: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: fs(16),
    fontWeight: '700',
  },
  reactionBadge: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    fontSize: fs(13),
    lineHeight: fs(16),
  },
  nameWrap: {
    flex: 1,
  },
  username: {
    color: '#f1f5f9',
    fontSize: fs(14),
    fontWeight: '600',
  },
  subname: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fs(12),
    marginTop: hp(0.2),
  },
  addBtn: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: wp(2),
    borderWidth: 1.5,
    borderColor: Colors.blueback,
  },
  addBtnFriend: {
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  addBtnSent: {
    borderColor: 'rgba(255,255,255,0.15)',
    opacity: 0.6,
  },
  addBtnText: {
    color: Colors.blueback,
    fontSize: fs(13),
    fontWeight: '700',
  },
  addBtnTextFriend: {
    color: 'rgba(255,255,255,0.6)',
  },
  addBtnTextSent: {
    color: 'rgba(255,255,255,0.4)',
  },
  closeBtn: {
    marginHorizontal: wp(5),
    marginTop: hp(1.5),
    paddingVertical: hp(1.8),
    borderRadius: wp(3.5),
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
    fontSize: fs(15),
    fontWeight: '700',
  },
  empty: {
    paddingTop: hp(5),
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: fs(14),
    fontStyle: 'italic',
  },
});
