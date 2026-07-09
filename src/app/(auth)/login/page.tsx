"use client";

import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/core/redux/store";

const LoginPageContent = dynamic(
  () => import("./LoginPageContent"),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LoginPageContent />
      </PersistGate>
    </Provider>
  );
}
