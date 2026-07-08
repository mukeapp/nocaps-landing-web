"use client";

import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/core/redux/store";

const SignUpContent = dynamic(
  () => import("./SignUpContent"),
  { ssr: false }
);

export default function SignUpPage() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SignUpContent />
      </PersistGate>
    </Provider>
  );
}
