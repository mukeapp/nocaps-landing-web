import createIconSet from "./createIconSet";
import glyphMap from "./glyphmaps/FontAwesome6Free.json";
import meta from "./glyphmaps/FontAwesome6Free_meta.json";

const FontAwesome6 = createIconSet(
  glyphMap as any,
  "FontAwesome6Free-Regular",
  {
    solid: "FontAwesome6Free-Solid",
    regular: "FontAwesome6Free-Regular",
    brand: "FontAwesome6Brands-Regular",
  },
  meta as any
);
export default FontAwesome6;
