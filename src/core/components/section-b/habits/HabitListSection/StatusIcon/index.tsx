import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/core/constants/Colors";

type Props = { status?: string }; // STOP | PLAY | PAUSE | PREVIOUS | NEXT

const StatusIcon: React.FC<Props> = ({ status }) => {
  const s = (status ?? "").toUpperCase();
  if (s === "STOP") return <MaterialIcons name="check-box-outline-blank" size={12} color={Colors.white} />;
  if (s === "PLAY") return <Feather name="play" size={12} color={Colors.white} />;
  if (s === "PAUSE") return <FontAwesome5 name="pause" size={12} color={Colors.white} />;
  if (s === "PREVIOUS") return <FontAwesome5 name="step-backward" size={12} color={Colors.white} />;
  if (s === "NEXT") return <FontAwesome5 name="step-forward" size={12} color={Colors.white} />;
  return null;
};

export default StatusIcon;
