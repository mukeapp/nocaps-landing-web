import storage from "redux-persist/lib/storage";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => ({
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, value: any) => Promise.resolve(value),
  removeItem: (_key: string) => Promise.resolve(),
});

export const persistStorage =
  typeof window === "undefined" ? createNoopStorage() : storage;

export { createWebStorage };
