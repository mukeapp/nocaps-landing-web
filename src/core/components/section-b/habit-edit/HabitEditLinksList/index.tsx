import React, { useEffect } from "react";
import { View } from "react-native";
import { MainStyles } from "@/core/constants/styles";
import HabitEditLinkCard from "../HabitEditLinkCard";
import { Unit } from "@/core/models/section-b";
import { fetchUnitsByDocumentId } from "@/core/services/section-b/section-b-0/units";
import { fetchHabitComponentByHabitId } from "@/core/services/section-b";

type Props = {
  items: any[];
  onEdit: (obj: any) => void;
  onDelete: (id: string) => void;
  onAddItem: (habitLink: any) => void;
  canInteract: boolean;
};

export default function HabitLinksList(p: Props) {
  const [costUnit, setCostUnit] = React.useState<Unit | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const fetchUnit = async () => {
      if (!p.items || p.items.length === 0) return;
      try {
        const habit = await fetchHabitComponentByHabitId(
          p.items[0].habitId || ""
        );
        //console.log(" HabitLinksList --> Fetched habit:", habit);

        const unit = habit?.unit;
        //console.log(" HabitLinksList --> Fetching unit for unit ID:", unit);

        const fetchedUnits = await fetchUnitsByDocumentId(unit || "");
        //console.log(" HabitLinksList --> Fetched units:", fetchedUnits);

        if (isMounted && fetchedUnits && fetchedUnits.length > 0) {
          setCostUnit(fetchedUnits[0]);
        }
      } catch (error) {
        console.error(" HabitLinksList --> Error fetching unit:", error);
      }
    };
    fetchUnit();

    return () => {
      isMounted = false;
    };
  }, [p.items]);

  if (!p.items?.length) return null;

  return (
    <>
      {p.items.map((obj, idx) => (
        <HabitEditLinkCard
          key={obj?.id || idx}
          item={obj}
          onEdit={() => p.onEdit(obj)}
          onDelete={() => p.onDelete(obj.documentId)}
          onAddItem={p.onAddItem}
          canInteract={p.canInteract}
          costSymbol={costUnit?.symbol || ""}
        />
      ))}
    </>
  );
}
