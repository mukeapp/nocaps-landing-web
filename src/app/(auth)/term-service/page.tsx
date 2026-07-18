"use client";

import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/core/redux/store";

const TermServiceContent = dynamic(
  () => import("./TermServiceContent"),
  { ssr: false }
);

export default function TermServicePage() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TermServiceContent />
      </PersistGate>
    </Provider>
  );
}
