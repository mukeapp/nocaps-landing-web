import React, { useEffect } from "react";
import { View } from "react-native";
import HabitItemCard from "./HabitItemCard";
import { Unit } from "@/core/models/section-b";
import { fetchUnitsByDocumentId } from "@/core/services/section-b";
import {IUser} from "@/core/models/section-a/user";

type Props = {
  username?: string;
  habits: any[];
  expandedIds: string[];
  onToggleExpand: (id: string) => void;
  menuId: string | null;
  onOpenMenu: (id: string) => void;
  onEdit: (habit: any) => void;
  onDelete: (id: string) => void;
  onOpenItem: (habitlink: any) => void;
  user:IUser;
  hideSwap?: boolean;
};

const HabitListSection: React.FC<Props> = ({
  username,
  habits,
  expandedIds,
  onToggleExpand,
  menuId,
  onOpenMenu,
  onEdit,
  onDelete,
  onOpenItem,
  user,
  hideSwap = false,
}) => {
  const [costUnit, setCostUnit] = React.useState<Unit | undefined>(undefined);

  useEffect(() => {
    const fetchUnit = async () => {
      if (habits.length === 0) return;
      const habit = habits[0]; // Just an example, you might want to handle multiple habits differently
      //console.log("HabitCard --> Fetching unit for habit:", habit);
      const unit = habit?.unit;
      //console.log("Fetching unit for unit ID:", unit);
      const fetchedUnits = await fetchUnitsByDocumentId(unit || "");
      //console.log("HabitCard --> Fetched units:", fetchedUnits);

      if (fetchedUnits && fetchedUnits.length > 0) {
        setCostUnit(fetchedUnits[0]);
      }
    };

    fetchUnit();
  }, [habits]);

  return (
    <View style={{ marginTop: 8 }}>
      {habits?.map((item) => (
        <HabitItemCard
          key={item?.documentId}
          item={item}
          username={username}
          user={user}
          expanded={expandedIds.includes(item?.documentId)}
          onToggleExpand={() => onToggleExpand(item?.documentId)}
          menuOpen={menuId === item?.id}
          onOpenMenu={() => onOpenMenu(item?.id)}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item?.documentId)}
          onOpenItem={onOpenItem}
          costSymbol={costUnit?.symbol || ""}
          hideSwap={hideSwap}
        />
      ))}
    </View>
  );
};

export default HabitListSection;
