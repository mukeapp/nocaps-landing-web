import storage from "@react-native-async-storage/async-storage";
import {configureStore} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import AIModelsCostMultiplier from "../ai-models-cost-multiplier";
import CreditPresets from "../credit-presets";
import HabitIntelligenceCost from "../habit-intelligence-cost";
import SubscriptionPlan from "../subscription-plan";
import UserData from "../user-data";
import UserRevenueCat from "../user-revenue-cat";
import WebBetaAccess from "../web-beta-access";

const UserDataReducer = persistReducer(
  { key: "root", storage },
  UserData.reducer,
);

const UserRevenueCatReducer = persistReducer(
  { key: "userRevenueCat", storage },
  UserRevenueCat.reducer,
);

const HabitIntelligenceCostReducer = persistReducer(
  { key: "habitIntelligenceCost", storage },
  HabitIntelligenceCost.reducer,
);

const SubscriptionPlanReducer = persistReducer(
  { key: "subscriptionPlan", storage },
  SubscriptionPlan.reducer,
);

const CreditPresetsReducer = persistReducer(
  { key: "creditPresets", storage },
  CreditPresets.reducer,
);

const AIModelsCostMultiplierReducer = persistReducer(
  { key: "aiModelsCostMultiplier", storage },
  AIModelsCostMultiplier.reducer,
);

const WebBetaAccessReducer = persistReducer(
  { key: "webBetaAccess", storage },
  WebBetaAccess.reducer,
);

const store = configureStore({
  reducer: {
    user: UserDataReducer,
    revenueCat: UserRevenueCatReducer,
    habitIntelligenceCost: HabitIntelligenceCostReducer,
    subscriptionPlan: SubscriptionPlanReducer,
    creditPresets: CreditPresetsReducer,
    aiModelsCostMultiplier: AIModelsCostMultiplierReducer,
    webBetaAccess: WebBetaAccessReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disables the middleware entirely
    }),
});

const persistor = persistStore(store);
export {persistor, store};

