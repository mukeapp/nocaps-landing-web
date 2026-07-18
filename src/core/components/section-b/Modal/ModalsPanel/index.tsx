import React from "react";
import ColorModalShow from "../ColorModalShow";
import IconModalShow from "../IconModalShow";
import ModalShow from "../ModalShow";
type Props = {
  // main selector
  modalVisible: boolean;
  tempName: string;
  tempData: any[];
  onSelect: (name: string, check: boolean, item: any) => void;
  onClose: () => void;

  // color
  popupclr: boolean;
  colorData: any[];
  onPickColor: (clr: string) => void;
  onCloseColor?: () => void;

  // icon
  showicon: boolean;
  iconData: any[];
  onPickIcon: (icn: string) => void;
  onCloseIcon?: () => void;
};

const ModalsPanel: React.FC<Props> = (p) => (
  <>
    <ModalShow
      name={p.tempName}
      popup={p.modalVisible}
      items={p.tempData}
      onSelect={p.onSelect}
      onClose={p.onClose}
    />
    <ColorModalShow
      popup={p.popupclr}
      clor={(_obj: string, clr: string) => p.onPickColor(clr)}
      data={p.colorData}
      onClose={p.onCloseColor}
    />
    <IconModalShow
      popup={p.showicon}
      icn={(_obj: string, icn: string) => p.onPickIcon(icn)}
      data={p.iconData}
      onClose={p.onCloseIcon}
    />
  </>
);

export default ModalsPanel;
