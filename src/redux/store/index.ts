import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { persistStorage } from "@/redux/persist-storage";
import AIModelsCostMultiplier from "@/redux/ai-models-cost-multiplier";
import CreditPresets from "@/redux/credit-presets";
import HabitIntelligenceCost from "@/redux/habit-intelligence-cost";
import SubscriptionPlan from "@/redux/subscription-plan";
import UserData from "@/redux/user-data";
import UserRevenueCat from "@/redux/user-revenue-cat";

const rootReducer = combineReducers({
  user: persistReducer({ key: "root", storage: persistStorage }, UserData.reducer),
  revenueCat: persistReducer(
    { key: "userRevenueCat", storage: persistStorage },
    UserRevenueCat.reducer,
  ),
  habitIntelligenceCost: persistReducer(
    { key: "habitIntelligenceCost", storage: persistStorage },
    HabitIntelligenceCost.reducer,
  ),
  subscriptionPlan: persistReducer(
    { key: "subscriptionPlan", storage: persistStorage },
    SubscriptionPlan.reducer,
  ),
  creditPresets: persistReducer(
    { key: "creditPresets", storage: persistStorage },
    CreditPresets.reducer,
  ),
  aiModelsCostMultiplier: persistReducer(
    { key: "aiModelsCostMultiplier", storage: persistStorage },
    AIModelsCostMultiplier.reducer,
  ),
});

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // matches mobile: redux-persist actions aren't serializable
      }),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>["store"];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
