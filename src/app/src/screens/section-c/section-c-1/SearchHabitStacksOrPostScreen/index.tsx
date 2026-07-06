import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@/core/utils/responsive';
import { Colors } from '@/core/constants/Colors';
import {
  SectionLabel,
  UserRow,
  SearchTextInput,
  ValidationErrorModal,
  HabitStackPickerModal,
} from '@/core/components/section-c';
import { useSearchHabitStacksOrPostForm } from '@/core/hooks';

// ─── Screen ───────────────────────────────────────────────────────────────────

const SearchHabitStacksOrPostScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useSearchHabitStacksOrPostForm({ navigation, route });

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#080810" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={s.backCircle}>
            <Ionicons name="arrow-back" size={18} color={Colors.white} />
          </View>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Search HabitStacks or Posts</Text>
      </View>

      {/* Mode Toggle + GO */}
      <View style={s.modeRow}>
        <TouchableOpacity
          style={[s.modeBtn, form.mode === 'Post' && s.modeBtnActive]}
          onPress={() => form.setMode('Post')}
          activeOpacity={0.8}
        >
          <Text style={[s.modeBtnText, form.mode === 'Post' && s.modeBtnTextActive]}>
            Post
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.modeBtn, form.mode === 'HabitStacks' && s.modeBtnActive]}
          onPress={() => form.setMode('HabitStacks')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="layers-outline"
            size={14}
            color={form.mode === 'HabitStacks' ? '#080810' : '#9ca3af'}
            style={{ marginRight: 5 }}
          />
          <Text style={[s.modeBtnText, form.mode === 'HabitStacks' && s.modeBtnTextActive]}>
            HabitStacks
          </Text>
        </TouchableOpacity>

        {(form.selectedUsers.length > 0 || form.selectedFriends.length > 0) && (
          <View style={s.summaryPill}>
            <MaterialCommunityIcons name="check-circle-outline" size={16} color="#2ec4b6" />
            <Text style={s.summaryText}>
              {form.selectedUsers.length + form.selectedFriends.length}
            </Text>
          </View>
        )}

        <TouchableOpacity style={s.goBtn} activeOpacity={0.85} onPress={form.handleGo}>
          <Text style={s.goBtnText}>GO</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: hp(6) }}
      >
        {/* Search by HabitStack ID or Post ID */}
        <SectionLabel title={form.mode === 'Post' ? 'Search by Post ID' : 'Search by HabitStack ID'} />
        <View style={s.listCard}>
          <SearchTextInput
            value={form.idSearchValue}
            onChangeText={form.onIdSearchValueChange}
            placeholder={form.mode === 'Post' ? 'Paste Post ID...' : 'Paste HabitStack ID...'}
            onClear={() => form.onIdSearchValueChange('')}
          />
        </View>

        {/* Sectors */}
        <SectionLabel title="Sectors" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.sectorsRow}
        >
          {form.sectors.map((sector) => {
            const id = sector.documentId ?? sector.id;
            const active = form.activeSector === id;
            return (
              <TouchableOpacity
                key={id}
                style={[s.sectorChip, active && s.sectorChipActive]}
                onPress={() => form.toggleSector(id)}
                activeOpacity={0.75}
              >
                <Text style={[s.sectorLabel, active && s.sectorLabelActive]}>
                  {sector.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Recommendations */}
        {form.recommendations.length > 0 && (
          <>
            <SectionLabel title="Recommendations" />
            <View style={s.listCard}>
              {form.recommendations.map((user, idx) => (
                <React.Fragment key={user.id}>
                  <UserRow
                    user={user}
                    selected={form.selectedUsers.includes(user.id)}
                    onSelect={() => form.toggleUser(user.id)}
                  />
                  {idx < form.recommendations.length - 1 && <View style={s.divider} />}
                </React.Fragment>
              ))}
            </View>
          </>
        )}

        {/* Select User(s) */}
        {/* <SectionLabel title="Select User(s)" />
        <View style={s.listCard}>
          <SearchTextInput
            value={form.userQuery}
            onChangeText={form.setUserQuery}
            placeholder="Search user"
            onClear={() => form.setUserQuery('')}
          />
          {form.filteredUsers.length > 0 && <View style={s.divider} />}
          {form.filteredUsers.map((user, idx) => (
            <React.Fragment key={user.id}>
              <UserRow
                user={user}
                selected={form.selectedUsers.includes(user.id)}
                onSelect={() => form.toggleUser(user.id)}
              />
              {idx < form.filteredUsers.length - 1 && <View style={s.divider} />}
            </React.Fragment>
          ))}
          {form.filteredUsers.length === 0 && (
            <View style={s.emptyState}>
              <Text style={s.emptyText}>No users found</Text>
            </View>
          )}
        </View> */}

        {/* Select HabitStack(s) */}
        <SectionLabel title="Select HabitStack(s)" />
        <View style={s.listCard}>
          <SearchTextInput
            value={form.habitStackSearchName}
            onChangeText={form.onHabitStackSearchNameChange}
            placeholder="Type HabitStack name..."
            onClear={() => form.setHabitStackSearchName('')}
          />
          <View style={s.divider} />
          <TouchableOpacity
            style={s.habitStackRow}
            activeOpacity={0.75}
            onPress={form.openHabitStackPicker}
          >
            <View style={s.habitStackRowLeft}>
              <MaterialCommunityIcons
                name="layers-outline"
                size={wp(5)}
                color="#9ca3af"
              />
              <Text style={s.habitStackRowText}>Select HabitStack(s)</Text>
            </View>
            <View style={s.habitStackRowRight}>
              {form.selectedHabitStackIds.length > 0 && (
                <View style={s.habitStackCountPill}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={14}
                    color="#2ec4b6"
                  />
                  <Text style={s.habitStackCountText}>
                    {form.selectedHabitStackIds.length}
                  </Text>
                </View>
              )}
                  <Ionicons name="chevron-forward" size={wp(5)} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Select Friend(s) */}
        <SectionLabel title="Select Friend(s)" />
        <View style={s.listCard}>
          <SearchTextInput
            value={form.friendQuery}
            onChangeText={form.setFriendQuery}
            placeholder="Search Friends"
            onClear={() => form.setFriendQuery('')}
          />
          {form.filteredFriends.length > 0 && <View style={s.divider} />}
          {form.filteredFriends.map((friend, idx) => (
            <React.Fragment key={friend.id}>
              <UserRow
                user={friend}
                selected={form.selectedFriends.includes(friend.id)}
                onSelect={() => form.toggleFriend(friend.id)}
              />
              {idx < form.filteredFriends.length - 1 && <View style={s.divider} />}
            </React.Fragment>
          ))}
          {form.filteredFriends.length === 0 && (
            <View style={s.emptyState}>
              <Text style={s.emptyText}>No friends found</Text>
            </View>
          )}
        </View>

      </ScrollView>

      <ValidationErrorModal
        errors={form.errorModal}
        onDismiss={() => form.setErrorModal([])}
      />

      <HabitStackPickerModal
        visible={form.habitStackPickerVisible}
        title="Select HabitStack(s)"
        searchName={form.habitStackSearchName}
        selectedIds={form.selectedHabitStackIds}
        onApply={form.onApplyHabitStacks}
        onClose={() => form.setHabitStackPickerVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SearchHabitStacksOrPostScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#080810',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingTop: Platform.OS === 'android' ? hp(1.5) : hp(1),
    paddingBottom: hp(2),
    gap: wp(3),
  },
  backBtn: { flexShrink: 0 },
  backCircle: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    color: '#f1f5f9',
    fontSize: wp(4.3),
    fontFamily: 'poppins_semibold',
    flexShrink: 1,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    gap: wp(2),
    marginBottom: hp(2.5),
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(1.2),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  modeBtnActive: {
    backgroundColor: '#f1f5f9',
    borderColor: '#f1f5f9',
  },
  modeBtnText: {
    color: '#9ca3af',
    fontSize: wp(3.5),
    fontFamily: 'poppins_semibold',
  },
  modeBtnTextActive: {
    color: '#080810',
  },
  goBtn: {
    marginLeft: 'auto',
    backgroundColor: '#e63946',
    paddingHorizontal: wp(5.5),
    paddingVertical: hp(1.2),
    borderRadius: wp(10),
  },
  goBtnText: {
    color: Colors.white,
    fontSize: wp(3.5),
    fontFamily: 'poppins_semibold',
    letterSpacing: 1,
  },
  sectorsRow: {
    paddingHorizontal: wp(4),
    gap: wp(2),
    paddingBottom: hp(2.5),
    paddingRight: wp(6),
  },
  sectorChip: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.1),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  sectorChipActive: {
    backgroundColor: '#f1f5f9',
    borderColor: '#f1f5f9',
  },
  sectorLabel: {
    color: '#9ca3af',
    fontSize: wp(3.3),
    fontFamily: 'poppins_semibold',
  },
  sectorLabelActive: {
    color: '#080810',
  },
  listCard: {
    marginHorizontal: wp(4),
    marginBottom: hp(2.5),
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: wp(3.5),
  },
  emptyState: {
    padding: hp(2.5),
    alignItems: 'center',
  },
  emptyText: {
    color: '#4b5563',
    fontSize: wp(3.3),
    fontFamily: 'poppins_regular',
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(10),
    backgroundColor: 'rgba(46,196,182,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(46,196,182,0.25)',
  },
  summaryText: {
    color: '#2ec4b6',
    fontSize: wp(3.3),
    fontFamily: 'poppins_semibold',
  },
  habitStackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  habitStackRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  habitStackRowText: {
    color: '#f1f5f9',
    fontSize: wp(3.8),
    fontFamily: 'poppins_semibold',
  },
  habitStackRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  habitStackCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(10),
    backgroundColor: 'rgba(46,196,182,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(46,196,182,0.25)',
  },
  habitStackCountText: {
    color: '#2ec4b6',
    fontSize: wp(3.2),
    fontFamily: 'poppins_semibold',
  },
});
