import React from "react";
import {
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

type MenuIconItem = {
  readonly iconSet: "feather" | "ionicons" | "mci";
  readonly icon: string;
};

const renderMenuIcon = (item: MenuIconItem) => {
  const size = wp(5.5);
  const color = "#fff";
  switch (item.iconSet) {
    case "feather":
      return <Feather name={item.icon as any} size={size} color={color} />;
    case "ionicons":
      return <Ionicons name={item.icon as any} size={size} color={color} />;
    case "mci":
      return (
        <MaterialCommunityIcons
          name={item.icon as any}
          size={size}
          color={color}
        />
      );
  }
};

export default renderMenuIcon;
