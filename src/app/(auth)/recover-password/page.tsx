"use client";

import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/core/redux/store";

const RecoverPasswordContent = dynamic(
  () => import("./RecoverPasswordContent"),
  { ssr: false }
);

export default function RecoverPasswordPage() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RecoverPasswordContent />
      </PersistGate>
    </Provider>
  );
}
