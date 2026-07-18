import { Dimensions } from "react-native";
import { fs } from "@/core/utils/responsive";

const { width, height } = Dimensions.get("window");

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  largeTitle: fs(40),
  h1: fs(30),
  h2: fs(22),
  h3: fs(16),
  h4: fs(14),
  h5: fs(12),
  body1: fs(30),
  body2: fs(22),
  body3: fs(16),
  body4: fs(14),
  body5: fs(12),

  width,
  height,
};
