// expo-router's internal goBack — web equivalent is browser history back.
export function goBack() {
  if (typeof window !== "undefined") {
    window.history.back();
  }
}
