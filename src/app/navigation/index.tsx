// Web counterpart of mobile app/navigation. On mobile this file default-exports
// the navigator App component, and HabitPreviewCard imports it to call
// `navigation.navigate(...)` at module level. On web the stack navigator is
// replaced by Next.js routes (see src/shims/react-navigation), so this exports
// a module-level navigate that uses the same route table.
import { ROUTE_NAME_TO_PATH } from "@/shims/react-navigation/routes";

const navigation = {
  navigate(name: string, params?: any) {
    const path = ROUTE_NAME_TO_PATH[name];
    if (!path) {
      console.warn(`[navigation] unknown route name: ${name}`);
      return;
    }
    if (params !== undefined) {
      try {
        sessionStorage.setItem(`nocap_nav_params:${name}`, JSON.stringify(params));
      } catch {
        // non-serializable params dropped for module-level navigation
      }
    }
    window.location.assign(path);
  },
  goBack() {
    window.history.back();
  },
};

export default navigation;
