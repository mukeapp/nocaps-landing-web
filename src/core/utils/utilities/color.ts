import { Colors } from "@/core/constants/Colors";

export type ColorFormat = "rgba" | "rgb" | "hex" | "named";

export const getColorFormat = (color: string): ColorFormat => {
  if (!color) return "named";
  const c = color.trim().toLowerCase();
  if (c.startsWith("rgba(")) return "rgba";
  if (c.startsWith("rgb(")) return "rgb";
  if (c.startsWith("#")) return "hex";
  return "named";
};

/**
 * Returns the color as an rgba string with the given opacity.
 * Handles rgba, rgb, hex (3, 6, 8 char), and named colors.
 * Named colors that cannot be parsed are returned unchanged.
 */
export const withOpacity = (color: string, opacity: number): string => {
  if (!color) return `rgba(0, 0, 0, ${opacity})`;

  const format = getColorFormat(color);

  if (format === "rgba" || format === "rgb") {
    return color.replace(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/,
      `rgba($1, $2, $3, ${opacity})`,
    );
  }

  if (format === "hex") {
    const hex = color.trim().replace("#", "");
    let r: number, g: number, b: number;

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6 || hex.length === 8) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else {
      return color;
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
};

// Helper function to normalize color format
export const normalizeColor = (color: string): string => {
  //console.log("Normalizing color:", color);
  if (!color) return Colors.sub_title;

  // If it's already in hex format, return as is
  if (color.startsWith("#")) {
    //console.log("Color is in hex format:", color);
    return color;
  }

  // If it's in rgba format, return as is (React Native supports both)
  if (color.startsWith("rgba") || color.startsWith("rgb")) {
    //console.log("Color is in rgba/rgb format:", color);
    return color;
  }

  // Fallback to default color
  return Colors.sub_title;
};
