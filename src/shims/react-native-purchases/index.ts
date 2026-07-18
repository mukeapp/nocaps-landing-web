// RevenueCat stub (user-approved): identical subscription UI, but purchases
// must be completed in the mobile app. No billing SDK on web.

export const LOG_LEVEL = { VERBOSE: "VERBOSE", DEBUG: "DEBUG", INFO: "INFO", WARN: "WARN", ERROR: "ERROR" };
export const PURCHASE_TYPE = { INAPP: "inapp", SUBS: "subs" };

const notAvailable = () =>
  Promise.reject(new Error("Purchases are available in the NoCaps mobile app."));

const Purchases = {
  configure: (_opts: any) => {},
  setLogLevel: (_level: string) => {},
  getCustomerInfo: async () => ({ entitlements: { active: {} }, activeSubscriptions: [] }),
  getOfferings: async () => ({ current: null, all: {} }),
  getProducts: async (_ids: string[], _type?: string) => [],
  purchasePackage: notAvailable,
  purchaseStoreProduct: notAvailable,
  restorePurchases: async () => ({ entitlements: { active: {} } }),
  logIn: async (_id: string) => ({ customerInfo: { entitlements: { active: {} } } }),
  logOut: async () => ({ entitlements: { active: {} } }),
};

export default Purchases;
