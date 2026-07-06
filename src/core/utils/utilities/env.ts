import {Alert} from "react-native";

/*
TODO: Add more environment variable checks as needed.
For example, if you add EXPO_PUBLIC_SOME_KEY, add a getEnv("EXPO_PUBLIC_SOME_KEY") check here.
Also Code below in getEnv() do not work when installing with APK !!!!
*/

/**
 * Safe env accessor with a friendly error if a required key is missing.
 * Expo public envs: EXPO_PUBLIC_*
 */
export function getEnv(key: string): string {
  const val = (process.env as any)?.[key];
  if (!val) {
    // You can throw to fail fast, or return an empty string and warn.
    Alert.alert("Missing environment variable", key);
    console.warn(`[env] Missing environment variable: ${key}`);
    return "";
  }
  return val;
}
