import { StyleSheet } from "react-native";
import { wp, hp, fs } from "@/core/utils/responsive";
import { Colors } from "./Colors";
import { SIZES } from "./Size";

export const MainStyles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(6),
    backgroundColor: Colors.background_color,
  },
  root2: {
    flex: 1,
    paddingHorizontal: wp(1),
    paddingTop: hp(6),
    backgroundColor: Colors.background_color,
  },
  root3: {
    flex: 1,
    paddingHorizontal: wp(1),
    paddingTop: hp(6),
    backgroundColor: Colors.title_background,
  },
  viewone: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(3),
  },
  viewtwo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  text20: {
    fontSize: fs(20),
    color: Colors.white,
    fontFamily: "bold",
  },
  text20semibold: {
    fontSize: fs(20),
    color: Colors.white,
    fontFamily: "semibold",
  },
  text24: {
    fontSize: fs(24),
    color: Colors.white,
    fontFamily: "semibold",
    width: wp(80),
  },
  text12: {
    fontSize: fs(12),
    color: Colors.text_color,
    fontFamily: "semibold",
    top: hp(1),
    textDecorationLine: "underline",
  },
  text16: {
    fontSize: fs(16),
    color: Colors.text_color,
    fontFamily: "bold",
  },
  text15: {
    fontSize: fs(15),
    color: Colors.text_color,
    fontFamily: "bold",
  },
  text14: {
    fontSize: fs(14),
    color: Colors.white,
    fontFamily: "bold",
  },
  text13: {
    fontSize: fs(13),
    color: Colors.white,
    fontFamily: "bold",
  },
  text16white: {
    fontSize: fs(16),
    color: Colors.white,
    fontFamily: "semibold",
    letterSpacing: 1,
  },
  text12black: {
    fontSize: fs(12),
    color: Colors.black,
    fontFamily: "medium",
  },
  text12boldblack: {
    fontSize: fs(12),
    color: "purple",
    fontFamily: "bold",
    textDecorationLine: "underline",
  },
  text10: {
    fontSize: fs(10),
    color: Colors.white,
    fontFamily: "bold",
  },
  text16Simple: {
    fontSize: fs(16),
    color: Colors.white,
    fontFamily: "semibold",
  },
  text15Simple: {
    fontSize: fs(15),
    color: Colors.white,
    fontFamily: "semibold",
  },
  text14Simple: {
    fontSize: fs(14),
    color: Colors.white,
    fontFamily: "semibold",
  },
  text13Simple: {
    fontSize: fs(13),
    color: Colors.white,
    fontFamily: "semibold",
  },
  text12Simple: {
    fontSize: fs(12),
    color: Colors.white,
    fontFamily: "semibold",
  },
  text8: {
    fontSize: fs(8),
    color: Colors.white,
    fontFamily: "bold",
  },
  text12Regular: {
    fontSize: fs(12),
    color: Colors.white,
    fontFamily: "regular",
  },
  text12Bold: {
    fontSize: fs(12),
    color: Colors.white,
    fontFamily: "bold",
  },
  text14Medium: {
    fontSize: fs(14),
    color: Colors.text_color,
    fontFamily: "regular",
    textAlign: "center",
    letterSpacing: 1,
  },
  text14Regular: {
    fontSize: fs(12),
    color: Colors.white,
    fontFamily: "regular",
  },
  columnalign: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  text12semibold: {
    fontSize: fs(14),
    color: Colors.white,
    fontFamily: "semibold",
  },
  text10semibold: {
    fontSize: fs(10),
    color: Colors.white,
    fontFamily: "semibold",
  },
  sheeticon: {
    width: wp(8.5),
    height: wp(8.5),
    borderRadius: wp(5),
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  newview: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  circlrview: {
    marginLeft: wp(3),
  },
  largeTitle: { fontFamily: "poppins_black", fontSize: SIZES.largeTitle },
  h1: { fontFamily: "poppins_bold", fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: "poppins_bold", fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: "poppins_semibold", fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: "poppins_semibold", fontSize: SIZES.h4, lineHeight: 22 },
  h5: { fontFamily: "poppins_semibold", fontSize: SIZES.h5, lineHeight: 22 },
  body1: {
    fontFamily: "poppins_regular",
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: "poppins_regular",
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: "poppins_regular",
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: "poppins_regular",
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: "poppins_regular",
    fontSize: SIZES.body5,
    lineHeight: 22,
  },
});

export default { MainStyles };
