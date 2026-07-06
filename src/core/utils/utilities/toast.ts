
import Toast from "react-native-root-toast";
import { ToastColors } from "@/core/constants/Colors";

export const showToast = (message: string) =>
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
  });


export const showToastError = (message: string) =>
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    backgroundColor: ToastColors.error,
  });

  export const showToastSuccess= (message: string) =>
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    backgroundColor: ToastColors.success,
  });