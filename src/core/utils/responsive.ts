import { Dimensions, Platform } from "react-native";
import {
  widthPercentageToDP as _wpBase,
  heightPercentageToDP as _hpBase,
} from "react-native-responsive-screen";

const { width } = Dimensions.get("window");

export const isTablet = width >= 768;
const isWeb = Platform.OS === "web";

// On iPad Pro 12.9" (1024pt), wp(4) would normally be 41px.
// TABLET_LAYOUT_SCALE caps effective width to ~565pt so it becomes ~22.5px (1.3× phone).
const TABLET_LAYOUT_SCALE = 0.55;

// Hardcoded font sizes don't scale with wp() — this grows them on tablet.
// fs(16) → 22px on tablet vs 16px on phone (1.4×).
const TABLET_FONT_SCALE = 1.4;

// On web, react-native-responsive-screen's percentage-of-window approach gives
// absurdly large values (e.g. wp(3.4) = 49px on a 1440px screen). Use a fixed
// multiplier instead so values stay in a sane pixel range.
const WEB_MULTIPLIER = 3.8;

export const wp = (v: number | string): number => {
  if (isWeb) return +(Number(v) * WEB_MULTIPLIER).toFixed(1);
  const raw = _wpBase(v as any);
  return isTablet ? raw * TABLET_LAYOUT_SCALE : raw;
};

export const hp = (v: number | string): number => {
  if (isWeb) return +(Number(v) * WEB_MULTIPLIER).toFixed(1);
  const raw = _hpBase(v as any);
  return isTablet ? raw * TABLET_LAYOUT_SCALE : raw;
};

export const fs = (size: number): number =>
  isTablet ? Math.round(size * TABLET_FONT_SCALE) : size;

export const widthPercentageToDP = wp;
export const heightPercentageToDP = hp;
