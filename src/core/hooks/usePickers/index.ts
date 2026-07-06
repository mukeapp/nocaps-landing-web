import { useState } from "react";

type Form = {
  sectors: any[]; focusList: any[]; unitList: any[]; priorityList: any[];
  setSectorFromItem: (item: any) => Promise<void>;
  setFocus: (v: any) => void; setUnit: (v: any) => void; setPriority: (v: any) => void;
  setColor: (c: string) => void; setIcon: (i: string) => void;
  allColors: any[]; allIcons: any[];
};

export default function usePickers({ form }: { form: Form }) {
  // main selector (sector/focus/unit/priority)
  const [modalVisible, setModalVisible] = useState(false);
  const [tempName, setTempName] = useState<"habitstack" | "focus" | "unit" | "priority" | "">("");
  const [tempData, setTempData] = useState<any[]>([]);

  const openMain = (name: "habitstack" | "focus" | "unit" | "priority") => {
    setTempName(name);
    if (name === "habitstack") setTempData(form.sectors);
    else if (name === "focus") setTempData(form.focusList);
    else if (name === "unit") setTempData(form.unitList);
    else setTempData(form.priorityList);
    setModalVisible(true);
  };

  const onSelectMain = async (name: string, _check: boolean, item: any) => {
    if (name === "habitstack") await form.setSectorFromItem(item);
    else if (name === "focus") form.setFocus(item);
    else if (name === "unit") form.setUnit(item);
    else form.setPriority(item);
    setModalVisible(false);
  };
  const closeMain = () => setModalVisible(false);

  // color
  const [colorVisible, setColorVisible] = useState(false);
  const openColor = () => setColorVisible(true);
  const pickColor = (clr: string) => form.setColor(clr);
  const closeColor = () => setColorVisible(false);

  // icon
  const [iconVisible, setIconVisible] = useState(false);
  const openIcon = () => setIconVisible(true);
  const pickIcon = (icn: string) => form.setIcon(icn);
  const closeIcon = () => setIconVisible(false);

  return {
    // main
    modalVisible, tempName, tempData, openMain, onSelectMain, closeMain,
    // color
    colorVisible, openColor, pickColor, closeColor,
    // icon
    iconVisible, openIcon, pickIcon, closeIcon,
  };
}
