import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Feather, Ionicons } from "@expo/vector-icons";

import { Colors } from "@/core/constants/Colors";
import {
  DefaultLoader as Loader,
} from "@/core/components/section-a";
import { useNoCapPostCreateForm, useMediaUploadV3 } from "@/core/hooks";
import { ConstantsUtils } from "@/core/utils";
import {
  AlertModal,
  HabitPickerModal,
  SelectionModal,
  TextInputModal,
  renderMenuIcon,
} from "@/core/components/section-c";
import type { SelectionItem } from "@/core/components/section-c";

// --------------- Main Screen ---------------
const NoCapPostCreateScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useNoCapPostCreateForm({ navigation, route });
  const media = useMediaUploadV3();

  // Modal state
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Sync media upload URL to local state
  useEffect(() => {
    if (media.imageRemoteUrl) form.setImage_video_url(media.imageRemoteUrl);
  }, [media.imageRemoteUrl]);

  const handleMenuPress = (label: string) => {
    if (label === "Image") {
      media.pickAndUpload();
      return;
    }
    if (!form.checkPrerequisite(label)) return;
    setActiveModal(label);
  };

  const getDisplayValue = (label: string): string => {
    switch (label) {
      case "Title":
        return form.title;
      case "Image":
        if (media.uploading) return "Uploading...";
        return form.image_video_url ? "Image selected" : "";
      case "Music":
        return form.music_url;
      case "Select Sector":
        return form.sector?.name || "";
      case "Habit Type":
        return form.habitType?.label || "";
      case "Select Habit":
        return form.habit;
      case "Location":
        return form.location;
      default:
        return "";
    }
  };

  const clearValue = (label: string) => {
    switch (label) {
      case "Title":
        form.setTitle("");
        break;
      case "Image":
        form.setImage_video_url("");
        media.setRemoteUrl(null);
        break;
      case "Music":
        form.setMusic_url("");
        break;
      case "Select Sector":
        form.setSector(null);
        break;
      case "Habit Type":
        form.setHabitType(null);
        break;
      case "Select Habit":
        form.setHabit("");
        break;
      case "Location":
        form.setLocation("");
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={wp(6)} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CREATE POST</Text>
        <TouchableOpacity style={styles.postButton} onPress={form.createPost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: form.user?.photo }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {form.user?.firstName} {form.user?.lastName}
            </Text>
            <View style={styles.chipsRow}>
              <TouchableOpacity
                style={styles.chip}
                onPress={() => setActiveModal("Post Visibility")}
              >
                <Text style={styles.chipText}>Post Visibility</Text>
                <Feather name="chevron-down" size={wp(3)} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chip}
              >
                <Ionicons
                  name="globe-outline"
                  size={wp(3.5)}
                  color="#fff"
                />
                <Text style={styles.chipText}>{form.postVisibility.label}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Write your thoughts here..."
          placeholderTextColor="#888"
          multiline
          value={form.content}
          onChangeText={form.setContent}
          textAlignVertical="top"
        />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {form.MENU_ITEMS.map((item) => {
            const displayVal = getDisplayValue(item.label);
            return (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.label)}
              >
                <View style={styles.menuItemLeft}>
                  {renderMenuIcon(item)}
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {displayVal ? (
                    <>
                      <View style={styles.valuePill}>
                        <Text style={styles.valueText} numberOfLines={1}>
                          {displayVal}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => clearValue(item.label)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Feather
                          name="x-circle"
                          size={wp(4.5)}
                          color="#888"
                        />
                      </TouchableOpacity>
                    </>
                  ) : null}
                  <Feather name="chevron-right" size={wp(5)} color="#888" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ---- Modals ---- */}

      {/* Text Input Modals */}
      <TextInputModal
        visible={activeModal === "Title"}
        title="Title"
        value={form.title}
        placeholder="Enter post title..."
        onApply={form.setTitle}
        onClose={() => setActiveModal(null)}
      />
      <TextInputModal
        visible={activeModal === "Music"}
        title="Music"
        value={form.music_url}
        placeholder="Enter music URL..."
        onApply={form.setMusic_url}
        onClose={() => setActiveModal(null)}
      />
      <HabitPickerModal
        visible={activeModal === "Select Habit"}
        title="Select Habit"
        items={form.habitItems}
        selectedId={form.selectedHabitItemId}
        onSelect={(item) => {
          form.selectHabitItem(item);
          setActiveModal(null);
        }}
        onClose={() => setActiveModal(null)}
      />
      <TextInputModal
        visible={activeModal === "Location"}
        title="Location"
        value={form.location}
        placeholder="Enter location..."
        onApply={form.setLocation}
        onClose={() => setActiveModal(null)}
      />

      {/* Selection Modals */}
      <SelectionModal
        visible={activeModal === "Select Sector"}
        title="Select Sector"
        items={[...form.SECTORS]}
        selectedId={form.sector?.id ?? null}
        onSelect={(item) => form.setSector(item)}
        onClose={() => setActiveModal(null)}
      />
      <SelectionModal
        visible={activeModal === "Habit Type"}
        title="Habit Type"
        items={[...form.HABIT_TYPES]}
        selectedId={form.habitType?.id ?? null}
        onSelect={(item) => form.setHabitType(item)}
        onClose={() => setActiveModal(null)}
      />
      <SelectionModal
        visible={activeModal === "Post Visibility"}
        title="Post Visibility"
        items={[...form.POST_VISIBILITY_OPTIONS]}
        selectedId={form.postVisibility.id}
        onSelect={(item) =>
          form.setPostVisibility(
            item as (typeof form.POST_VISIBILITY_OPTIONS)[number]
          )
        }
        onClose={() => setActiveModal(null)}
      />

      {/* Styled Alert Modal */}
      <AlertModal
        visible={form.alertVisible}
        title={form.alertTitle}
        message={form.alertMessage}
        onClose={form.dismissAlert}
      />

      <Loader status={form.loading || media.uploading} />
    </View>
  );
};

export default NoCapPostCreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: hp(6),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backButton: {
    padding: wp(1),
  },
  headerTitle: {
    color: "#fff",
    fontSize: wp(4.2),
    fontWeight: "700",
    letterSpacing: 1,
  },
  postButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: wp(5),
    paddingHorizontal: wp(5),
    paddingVertical: hp(0.8),
  },
  postButtonText: {
    color: "#fff",
    fontSize: wp(3.5),
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: Colors.title_background,
  },
  profileInfo: {
    marginLeft: wp(3),
  },
  userName: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "600",
    marginBottom: hp(0.5),
  },
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.title_background,
    borderRadius: wp(4),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    gap: wp(1),
  },
  chipText: {
    color: "#fff",
    fontSize: wp(2.8),
  },
  textInput: {
    color: "#fff",
    fontSize: wp(4),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    minHeight: hp(20),
  },
  divider: {
    height: 0.5,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: wp(4),
  },
  menuSection: {
    paddingTop: hp(1),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
  },
  menuItemText: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "400",
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  valuePill: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: wp(4),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    maxWidth: wp(30),
  },
  valueText: {
    color: "#fff",
    fontSize: wp(2.8),
  },
});
