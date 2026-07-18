"use client";

import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/core/redux/store";
import BetaAccessComponent from "@/core/components/section-a/BetaAccessComponent";

const SignUpContent = dynamic(
  () => import("./SignUpContent"),
  { ssr: false }
);

export default function SignUpPage() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BetaAccessComponent>
          <SignUpContent />
        </BetaAccessComponent>
      </PersistGate>
    </Provider>
  );
}
