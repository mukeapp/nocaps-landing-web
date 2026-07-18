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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ROUTE_NAME_TO_PATH } from "./routes";

// In-memory param store keyed by a per-navigation TOKEN (primary — supports
// non-serializable params such as callbacks). sessionStorage mirror survives a page
// refresh for the JSON-serializable subset. The token travels in the URL query
// (`?n=<token>`) so params are URL-driven and reactive: a screen resolves its params
// from the token in its current URL, never from a stale route-name entry. A navigation
// with no params carries no token, so it always resolves to the screen's default
// (e.g. the logged-in user's own profile).
const paramsStore = new Map<string, any>();

// Monotonic, collision-resistant token (no crypto dependency). A fresh token per
// navigation guarantees the URL changes even when navigating to the same path, so the
// App Router actually re-renders and screens refetch.
let tokenSeq = 0;
function nextToken(): string {
  tokenSeq += 1;
  return `${Date.now().toString(36)}-${tokenSeq.toString(36)}`;
}

function persistParams(token: string, params: any) {
  paramsStore.set(token, params);
  try {
    sessionStorage.setItem(`nocap_nav_params:${token}`, JSON.stringify(params));
  } catch {
    // non-serializable params stay in-memory only
  }
}

export function readParams(token: string): any {
  if (paramsStore.has(token)) return paramsStore.get(token);
  try {
    const raw = sessionStorage.getItem(`nocap_nav_params:${token}`);
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
      if (params !== undefined) {
        const token = nextToken();
        persistParams(token, params);
        router.push(`${path}?n=${encodeURIComponent(token)}`);
      } else {
        // No params ⇒ resolve to the screen's default (e.g. self profile). Bare URL,
        // no token, so a previously-viewed target is never re-read.
        router.push(path);
      }
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
      if (params !== undefined) {
        const token = nextToken();
        persistParams(token, params);
        router.replace(`${path}?n=${encodeURIComponent(token)}`);
      } else {
        router.replace(path);
      }
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

  const setParams = useCallback((params: any) => {
    // Merge into the params entry for the token in the current URL (if any). Kept for
    // API compatibility; no screen currently calls this.
    let token: string | null = null;
    try {
      token = new URLSearchParams(window.location.search).get("n");
    } catch {
      // window/URLSearchParams unavailable
    }
    if (!token) return;
    const prev = readParams(token) ?? {};
    persistParams(token, { ...prev, ...params });
  }, []);

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
  // Params are resolved from the token in the current URL. `useSearchParams()` is
  // reactive, so consumers re-render whenever the token changes — including a
  // same-path navigation to a new target. No token ⇒ default (e.g. self profile).
  const searchParams = useSearchParams();
  const token = searchParams?.get("n") ?? null;
  return { name, params: token ? readParams(token) ?? {} : {} };
}

export function useIsFocused(): boolean {
  return true;
}

// React Navigation re-runs the effect whenever the (useCallback-wrapped)
// callback identity changes while the screen is focused — screens rely on this
// to refetch when their form.load deps change (e.g. market-manager tab clicks).
export function useFocusEffect(effect: () => void | (() => void)) {
  useEffect(() => {
    const cleanup = effect();
    return typeof cleanup === "function" ? cleanup : undefined;
  }, [effect]);
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
