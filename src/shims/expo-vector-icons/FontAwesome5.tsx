import createIconSet from "./createIconSet";
import glyphMap from "./glyphmaps/FontAwesome5Free.json";
import meta from "./glyphmaps/FontAwesome5Free_meta.json";

const FontAwesome5 = createIconSet(
  glyphMap as any,
  "FontAwesome5Free-Regular",
  {
    solid: "FontAwesome5Free-Solid",
    regular: "FontAwesome5Free-Regular",
    brand: "FontAwesome5Brands-Regular",
  },
  meta as any
);
export default FontAwesome5;
