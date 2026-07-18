"use client";

import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

export interface IconProps extends TextProps {
  name: string;
  size?: number;
  color?: string;
  solid?: boolean;
  brand?: boolean;
}

type GlyphMap = Record<string, number | string>;

export default function createIconSet(
  glyphMap: GlyphMap,
  fontFamily: string,
  fontFamilies?: { solid?: string; regular?: string; brand?: string },
  meta?: Record<string, string[]>
) {
  const Icon = ({ name, size = 12, color, solid, brand, style, ...rest }: IconProps) => {
    let glyph = glyphMap[name];
    if (glyph === undefined) {
      glyph = "?";
    }
    const char = typeof glyph === "number" ? String.fromCodePoint(glyph) : glyph;

    let family = fontFamily;
    if (fontFamilies) {
      if (brand || (meta && meta.brands?.includes(name))) {
        family = fontFamilies.brand ?? fontFamily;
      } else if (solid || (meta && !meta.regular?.includes(name))) {
        family = fontFamilies.solid ?? fontFamily;
      } else {
        family = fontFamilies.regular ?? fontFamily;
      }
    }

    const iconStyle: TextStyle = {
      fontFamily: family,
      fontSize: size,
      color,
      fontWeight: "normal",
      fontStyle: "normal",
    };

    return (
      <Text selectable={false} {...rest} style={[iconStyle, style]}>
        {char}
      </Text>
    );
  };

  Icon.displayName = `Icon(${fontFamily})`;
  return Icon;
}
