"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { makeStore, AppStore } from "@/redux/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof makeStore>>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current.store as AppStore}>
      <PersistGate loading={null} persistor={storeRef.current.persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
