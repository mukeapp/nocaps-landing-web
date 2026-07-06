import React from "react";
// import ColorShow from "../../../component/colormodal";
// import Showicon from "../../../component/selecticon";

import { ColorModalShow, IconModalShow } from "@/core/components/section-b";


type ColorModalProps = {
  open: boolean;
  data: any[];
  onClose: () => void;
  onPick: (obj: string, color: string) => void; // matches your ColorShow signature
};

type IconModalProps = {
  open: boolean;
  data: any[];
  onClose: () => void;
  onPick: (obj: string, iconUrl: string) => void; // matches your Showicon signature
};

type Props = {
  colorModal: ColorModalProps;
  iconModal: IconModalProps;
};

const ModalsPanelV2: React.FC<Props> = ({ colorModal, iconModal }) => {
  return (
    <>
      <ColorModalShow
        popup={colorModal.open}
        clor={(obj: string, clr: string) => {
          colorModal.onPick(obj, clr);
        }}
        data={colorModal.data}
        onClose={colorModal.onClose}
      />
      <IconModalShow
        popup={iconModal.open}
        icn={(obj: string, icn: string) => {
          iconModal.onPick(obj, icn);
        }}
        data={iconModal.data}
        onClose={iconModal.onClose}
      />
    </>
  );
};

export default ModalsPanelV2;
