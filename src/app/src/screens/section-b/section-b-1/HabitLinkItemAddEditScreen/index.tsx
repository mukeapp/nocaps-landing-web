import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { DefaultLoader } from "@/core/components/section-a";
import WebDashboardHeader from "@/core/components/section-b/header/WebDashboardHeader";
import { HabitLinkLocationSection } from "@/core/components/section-b";
import { getScoreCode, getScoreColor } from "@/core/utils/utilities/score";
import { useHabitLinkItemAddEditForm } from "@/core/hooks";

// Web-adapted rewrite (July 2026 direction: web UX over pixel-mobile parity),
// matching the sibling add-edit screens. State/data stay in the form hook;
// HabitLinkLocationSection is kept (already web-sized) to preserve the Places
// autocomplete. Score display reuses getScoreCode/getScoreColor verbatim.

type Props = { navigation: any; route: any };

const HabitLinkItemAddEditScreen: React.FC<Props> = ({ navigation, route }) => {
  const form = useHabitLinkItemAddEditForm({ navigation, route });

  const handlePriceChange = (txt: string) => {
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(txt) || txt === "") form.setPrice(txt);
  };

  const handleScoreChange = (txt: string) => {
    const numericValue = parseInt(txt, 10);
    const regex = /^\d{0,3}$/;
    if (regex.test(txt)) {
      if (txt === "" || (numericValue >= 0 && numericValue <= 100)) {
        form.setScore(txt);
      }
    }
  };

  const scoreInt = parseInt(form.score, 10);
  const decimalScore = isNaN(scoreInt) || scoreInt < 0 ? 0 : scoreInt / 100;
  const scoreResult = getScoreCode(decimalScore);
  const scoreColor = getScoreColor(scoreResult.scoreCode);

  const bannerUri = form.imageLocalUri ?? form.imageRemoteUrl ?? null;

  return (
    <View style={[MainStyles.root2, { paddingHorizontal: 0, paddingTop: 0 }]}>
      <WebDashboardHeader
        title={`${form.habitLinkName} : Item`}
        onBack={form.goBack}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto w-full">
            {/* Page header */}
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              New Item
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add an item to this habit link — with price, quantity, and score.
            </p>

            {/* Cover image */}
            <label className="mt-6 block text-sm font-medium text-foreground">
              Item image
            </label>
            {bannerUri ? (
              <div className="relative mt-2 overflow-hidden rounded-2xl">
                <img
                  src={bannerUri as string}
                  alt="Item"
                  className="w-full aspect-[16/6] object-cover"
                />
                <button
                  onClick={form.pickImageAndUpload}
                  aria-label="Change image"
                  className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-[#27AE60] ring-2 ring-white/80"
                >
                  <MaterialCommunityIcons name="image-plus-outline" size={18} color={Colors.white} />
                </button>
              </div>
            ) : (
              <button
                onClick={form.pickImageAndUpload}
                className="mt-2 flex aspect-[16/6] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
              >
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-white/5">
                  <MaterialCommunityIcons name="image-plus-outline" size={26} color={Colors.text_color} />
                </span>
                <span className="text-sm text-muted-foreground">
                  Click to upload an item photo
                </span>
              </button>
            )}

            {/* Name */}
            <label className="mt-6 block text-sm font-medium text-foreground">
              Item name
            </label>
            <input
              value={form.name}
              onChange={(e) => form.setName(e.target.value)}
              placeholder="Bread"
              className="mt-2 w-full rounded-xl bg-card px-4 py-2.5 text-sm text-foreground ring-1 ring-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D9CDB]"
            />

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

            {/* URL */}
            <label className="mt-6 block text-sm font-medium text-foreground">
              Item URL <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              value={form.itemUrl}
              onChange={(e) => form.setItemUrl(e.target.value)}
              placeholder="www.foodmart.com/bread"
              className="mt-2 w-full rounded-xl bg-card px-4 py-2.5 text-sm text-foreground ring-1 ring-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D9CDB]"
            />

            {/* Location (keeps Google Places autocomplete; renders its own label) */}
            <div className="mt-2">
              <HabitLinkLocationSection
                location={form.location}
                setLocation={form.setLocation}
              />
            </div>

            {/* Price + Quantity */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground">Item price</label>
                <div className="mt-2 flex items-center gap-1 rounded-xl bg-card px-4 py-2.5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-[#2D9CDB]">
                  <span className="text-sm text-foreground">{form.symbol?.symbol}</span>
                  <input
                    value={form.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="-"
                    inputMode="decimal"
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Item quantity</label>
                <div className="mt-2 inline-flex items-center overflow-hidden rounded-xl bg-card ring-1 ring-white/10">
                  <button
                    onClick={() => form.setQuantity(Math.max(0, form.quantity - 1))}
                    aria-label="Decrease"
                    className="grid h-11 w-12 place-items-center hover:bg-white/5 transition-colors"
                  >
                    <AntDesign name="minus" size={18} color={Colors.white} />
                  </button>
                  <div className="flex h-11 w-16 items-center justify-center border-x border-white/10">
                    <span className="text-sm font-semibold text-foreground">{form.quantity}</span>
                  </div>
                  <button
                    onClick={() => form.setQuantity(form.quantity + 1)}
                    aria-label="Increase"
                    className="grid h-11 w-12 place-items-center hover:bg-white/5 transition-colors"
                  >
                    <AntDesign name="plus" size={18} color={Colors.white} />
                  </button>
                </div>
              </div>
            </div>

            {/* Score */}
            <label className="mt-6 block text-sm font-medium text-foreground">
              Item score <span className="text-muted-foreground">(optional)</span>
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-[#2D9CDB]">
              <input
                value={form.score}
                onChange={(e) => handleScoreChange(e.target.value)}
                placeholder="0"
                inputMode="numeric"
                maxLength={3}
                className="w-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <span className="text-sm text-muted-foreground">%</span>
              <span className="ml-auto flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: scoreColor }} />
                <span className="text-sm font-semibold text-foreground">{scoreResult.scoreCode}</span>
              </span>
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
                onClick={form.goBack}
                className="rounded-full px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={form.save}
                className="rounded-full bg-[#2D9CDB] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2D9CDB]/85 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </ScrollView>
      </KeyboardAvoidingView>

      <DefaultLoader status={form.loading} />
    </View>
  );
};

export default HabitLinkItemAddEditScreen;
