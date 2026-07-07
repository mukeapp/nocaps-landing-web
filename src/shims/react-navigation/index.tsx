"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { ROUTE_NAME_TO_PATH } from "./routes";

// In-memory param store keyed by route name (primary — supports non-serializable
// params such as callbacks). sessionStorage mirror survives a page refresh for the
// JSON-serializable subset.
const paramsStore = new Map<string, any>();

function persistParams(name: string, params: any) {
  paramsStore.set(name, params);
  try {
    sessionStorage.setItem(`nocap_nav_params:${name}`, JSON.stringify(params));
  } catch {
    // non-serializable params stay in-memory only
  }
}

export function readParams(name: string): any {
  if (paramsStore.has(name)) return paramsStore.get(name);
  try {
    const raw = sessionStorage.getItem(`nocap_nav_params:${name}`);
    if (raw != null) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return undefined;
}

type Listener = () => void;

export interface NavigationShim {
  navigate: (name: string, params?: any) => void;
  replace: (name: string, params?: any) => void;
  goBack: () => void;
  addListener: (event: string, cb: Listener) => () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setParams: (params: any) => void;
}

interface NavigationContextValue {
  navigation: NavigationShim;
  routeName: string;
  drawerOpen: boolean;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({
  routeName,
  children,
}: {
  routeName: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const focusListeners = useRef<Set<Listener>>(new Set());
  const initialFocusDelivered = useRef(false);

  const navigate = useCallback(
    (name: string, params?: any) => {
      const path = ROUTE_NAME_TO_PATH[name];
      if (!path) {
        console.warn(`[navigation shim] unknown route name: ${name}`);
        return;
      }
      if (params !== undefined) persistParams(name, params);
      else paramsStore.delete(name);
      router.push(path);
    },
    [router]
  );

  const replace = useCallback(
    (name: string, params?: any) => {
      const path = ROUTE_NAME_TO_PATH[name];
      if (!path) {
        console.warn(`[navigation shim] unknown route name: ${name}`);
        return;
      }
      if (params !== undefined) persistParams(name, params);
      router.replace(path);
    },
    [router]
  );

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const addListener = useCallback((event: string, cb: Listener) => {
    if (event === "focus") {
      focusListeners.current.add(cb);
      // React Navigation fires "focus" once when the screen first mounts, but NOT on
      // re-subscription (e.g. when a hook's load callback changes identity). Firing on
      // every subscribe loops any screen whose load deps are unstable.
      // Delivered is marked inside the timeout (not at scheduling) so that if an effect
      // re-subscribes before the timeout fires (cleanup clears it), the next subscribe
      // schedules again and the initial load is never lost.
      let t: ReturnType<typeof setTimeout> | undefined;
      if (!initialFocusDelivered.current) {
        t = setTimeout(() => {
          initialFocusDelivered.current = true;
          cb();
        }, 0);
      }
      return () => {
        if (t !== undefined) clearTimeout(t);
        focusListeners.current.delete(cb);
      };
    }
    return () => {};
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const setParams = useCallback(
    (params: any) => {
      const prev = readParams(routeName) ?? {};
      persistParams(routeName, { ...prev, ...params });
    },
    [routeName]
  );

  const navigation = useMemo<NavigationShim>(
    () => ({ navigate, replace, goBack, addListener, openDrawer, closeDrawer, setParams }),
    [navigate, replace, goBack, addListener, openDrawer, closeDrawer, setParams]
  );

  const value = useMemo(
    () => ({ navigation, routeName, drawerOpen }),
    [navigation, routeName, drawerOpen]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationShim {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return ctx.navigation;
}

export function useRoute(): { name: string; params: any } {
  const ctx = useContext(NavigationContext);
  const name = ctx?.routeName ?? "";
  return { name, params: readParams(name) ?? {} };
}

export function useIsFocused(): boolean {
  return true;
}

export function useFocusEffect(effect: () => void | (() => void)) {
  const effectRef = useRef(effect);
  effectRef.current = effect;
  useEffect(() => {
    const cleanup = effectRef.current();
    return typeof cleanup === "function" ? cleanup : undefined;
  }, []);
}

export function useDrawerOpen(): boolean {
  const ctx = useContext(NavigationContext);
  return ctx?.drawerOpen ?? false;
}

// Passthroughs so files importing these names still compile.
export const NavigationContainer = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const NavigationIndependentTree = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const DarkTheme = {} as any;
export const DefaultTheme = {} as any;

// Convenience for Next.js page wrappers: builds the screen props the mobile
// stack navigator would pass ({ navigation, route }).
export function useScreenProps() {
  const navigation = useNavigation();
  const route = useRoute();
  const pathname = usePathname();
  void pathname;
  return { navigation, route };
}
