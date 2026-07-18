import React from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { DefaultLoader } from "@/core/components/section-a";
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { Images } from "@/core/constants/Images";
import WebDashboardHeader from "@/core/components/section-b/header/WebDashboardHeader";

import {
  HabitLinkLocationSection,
  ModalsPanelV2,
} from "@/core/components/section-b";

import { useHabitLinkAddEditForm, useMediaUploadV2 } from "@/core/hooks/";

// Web-adapted rewrite (July 2026 direction: web UX over pixel-mobile parity),
// matching the sibling add-edit screens. State/data stay in the form hook; the
// color/icon pickers (ModalsPanelV2 → ColorModalShow/IconModalShow) are already
// web-sized. HabitLinkLocationSection is kept to preserve the Places autocomplete.

type Props = { navigation: any; route: any };

const HabitLinkAddEditScreen: React.FC<Props> = ({ navigation, route }) => {
  const media = useMediaUploadV2();
  const form = useHabitLinkAddEditForm({ navigation, route, media });

  return (
    <View style={[MainStyles.root2, { paddingHorizontal: 0, paddingTop: 0 }]}>
      <WebDashboardHeader title="Habit Link" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto w-full">
            {/* Page header */}
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              New Habit Link
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Link an item — a place, product, or service — to your habit.
            </p>

            {/* Cover image */}
            <label className="mt-6 block text-sm font-medium text-foreground">
              Cover image
            </label>
            {media.preview ?? media.local ?? form.routeBannerImage ? (
              <div className="relative mt-2 overflow-hidden rounded-2xl">
                <img
                  src={(media.preview ?? media.local ?? form.routeBannerImage) as string}
                  alt="Cover"
                  className="w-full aspect-[16/6] object-cover"
                />
                <button
                  onClick={media.pickImg}
                  aria-label="Change image"
                  className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-[#27AE60] ring-2 ring-white/80"
                >
                  <MaterialCommunityIcons name="image-plus-outline" size={18} color={Colors.white} />
                </button>
              </div>
            ) : (
              <button
                onClick={media.pickImg}
                className="mt-2 flex aspect-[16/6] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
              >
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-white/5">
                  <MaterialCommunityIcons name="image-plus-outline" size={26} color={Colors.text_color} />
                </span>
                <span className="text-sm text-muted-foreground">
                  Click to upload a cover photo
                </span>
              </button>
            )}

            {/* Name */}
            <label className="mt-6 block text-sm font-medium text-foreground">
              Habit link name
            </label>
            <input
              value={form.name}
              onChange={(e) => form.setName(e.target.value)}
              placeholder="e.g. Grocery run"
              className="mt-2 w-full rounded-xl bg-card px-4 py-2.5 text-sm text-foreground ring-1 ring-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D9CDB]"
            />

            {/* Icon + Color */}
            <div className="mt-6 grid max-w-xs grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Icon</label>
                <button
                  onClick={form.openIconPicker}
                  className="mt-2 grid h-14 w-14 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
                >
                  <Image
                    source={form.iconName ? Images[form.iconName] : Images.dollar}
                    resizeMode="contain"
                    style={{ width: 28, height: 28 }}
                  />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Color</label>
                <button
                  onClick={form.openColorPicker}
                  aria-label="Pick color"
                  className="mt-2 h-14 w-14 rounded-xl ring-1 ring-white/10 hover:ring-white/25 transition-shadow"
                  style={{ backgroundColor: form.color }}
                />
              </div>
            </div>

            {/* Company */}
            <label className="mt-6 block text-sm font-medium text-foreground">
              Company <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              value={form.company}
              onChange={(e) => form.setCompany(e.target.value)}
              placeholder="FoodMart"
              className="mt-2 w-full rounded-xl bg-card px-4 py-2.5 text-sm text-foreground ring-1 ring-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D9CDB]"
            />

            {/* Location (keeps Google Places autocomplete; renders its own label) */}
            <div className="mt-2">
              <HabitLinkLocationSection
                location={form.location}
                setLocation={form.setLocation}
              />
            </div>

            {/* Description */}
            <label className="mt-6 block text-sm font-medium text-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => form.setDescription(e.target.value)}
              placeholder="Write here..."
              rows={4}
              className="mt-2 w-full resize-y rounded-xl bg-card px-4 py-3 text-sm text-foreground ring-1 ring-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D9CDB]"
            />

            {/* Footer actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
              <button
                onClick={() => navigation.goBack()}
                className="rounded-full px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={form.onSave}
                className="rounded-full bg-[#2D9CDB] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2D9CDB]/85 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </ScrollView>
      </KeyboardAvoidingView>

      <DefaultLoader status={form.loading} />

      <ModalsPanelV2
        colorModal={{
          open: form.colorModalOpen,
          data: form.colorsList,
          onClose: () => form.setColorModalOpen(false),
          onPick: form.onPickColor,
        }}
        iconModal={{
          open: form.iconModalOpen,
          data: form.iconsList,
          onClose: () => form.setIconModalOpen(false),
          onPick: form.onPickIcon,
        }}
      />
    </View>
  );
};

export default HabitLinkAddEditScreen;
