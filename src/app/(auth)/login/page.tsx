"use client";

import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/core/redux/store";
import BetaAccessComponent from "@/core/components/section-a/BetaAccessComponent";

const LoginPageContent = dynamic(
  () => import("./LoginPageContent"),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BetaAccessComponent>
          <LoginPageContent />
        </BetaAccessComponent>
      </PersistGate>
    </Provider>
  );
}
