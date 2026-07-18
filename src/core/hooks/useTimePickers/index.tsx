import { useState } from "react";
import moment from "moment";

type Field = "startDate" | "endDate" | "startTime" | "endTime";
type Mode = "date" | "time";

export default function useTimePickers(routeData?: any) {
  const [startDate, setStartDate] = useState<Date | null>(routeData?.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(routeData?.endDate || null);
  const [startTime, setStartTime] = useState<Date | null>(routeData?.startTime || null);
  const [endTime, setEndTime] = useState<Date | null>(routeData?.endTime || null);

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<Mode>("date");
  const [field, setField] = useState<Field | null>(null);

  const showPicker = (f: Field, m: Mode) => {
    setField(f);
    setMode(m);
    setShow(true);
  };
  const hide = () => setShow(false);

  const handleConfirm = (date: Date) => {
    if (!date || !field) return hide();
    switch (field) {
      case "startDate":
        setStartDate(date);
        break;
      case "endDate":
        setEndDate(date);
        break;
      case "startTime":
        setStartTime(date);
        break;
      case "endTime":
        setEndTime(date);
        break;
    }
    hide();
  };

  return {
    startDate,
    endDate,
    startTime,
    endTime,
    show,
    mode,
    showPicker,
    hide,
    handleConfirm,
  };
}
