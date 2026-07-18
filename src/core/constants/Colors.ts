/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import {goBack} from "expo-router/build/global-state/routing";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const _Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const ToastColors = {
  success: "#4BB543",
  error: "#FF3333",
  info: "#3B82F6",
};

export const Colors = {
  success : "#4BB543",
  warning : "#FFAA00",
  error : "#FF3333",
  text_light: "#FFFFFF",
  text_dark: "#000000",
  purple: "#800080",
  gold : "#FFD700",
  sub_title: "#9E9E9E",
  root_background: "#0E0E0E",
  background_color: "#0D0D0D",
  content_back: "rgba(25, 25, 25, 1)",
  title_background: "#252525",
  text_background: "rgba(255, 255, 255, 0.05)",
  white: "#F2F2F2",
  text_color: "rgba(242, 242, 242, 0.5)",
  icon_back: "rgba(45, 156, 219, 0.15)",
  colorred: "rgba(235, 87, 87, 1)",
  borderline: "rgba(255, 255, 255, 0.04)",
  blueback: "rgba(45, 156, 219, 1)",
  green: "rgba(33, 150, 83, 1)",
  black: "rgba(28, 28, 28, 1)",
  filtertext: "rgba(255, 255, 255, 0.07)",
  button_back: "rgba(255, 255, 255, 0.1)",
  music: "rgba(137, 137, 137, 1)",
  inputback: "rgba(41, 41, 41, 1)",
  blue: "#0000FF",
  darkblack: "#000000",
  inuptborder: "#3A3A3A",
  primary: "rgba(45, 156, 219, 1)", //orange
  transparentPrimary: "rgba(227, 120, 75, 0.4)",
  transparentPrimary9: "rgba(255, 238, 233, 0.9)",
  orange: "#FFA133",
  lightOrange: "#FFA133",
  lightOrange2: "#FDDED4",
  lightOrange3: "#FFD9AD",
  ///green: "#27AE60",
  red: "#FF1717",
  red2: "#FF6C44",
  //blue: '#0064C0',
  darkBlue: "#111A2C",
  darkGray: "#525C67",
  darkGray2: "#757D85",
  gray: "#898B9A",
  gray2: "#BBBDC1",
  gray3: "#CFD0D7",
  lightGray1: "#DDDDDD",
  lightGray2: "#F5F5F8",
  white2: "#FBFBFB",
  //white: '#FFFFFF',
  ///black: "#000000",

  transparent: "transparent",
  transparentWhite1: "rgba(255, 255, 255, 0.1)",
  transparentBlack1: "rgba(0, 0, 0, 0.1)",
  transparentBlack7: "rgba(0, 0, 0, 0.7)",
};
