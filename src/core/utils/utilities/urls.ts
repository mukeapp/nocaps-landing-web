// utils/url-utils.ts (or inside Utils.ts)
import { Linking } from "react-native";
import Toast from "react-native-root-toast";

/**
 * Lightweight URL check using the built-in URL constructor.
 * Accepts only http / https URLs.
 */
export function isHttpUrl(value?: string | null): boolean {
  if (!value) return false;

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Normalize, validate, and open an external URL in the device browser.
 * - Adds https:// if missing
 * - Checks if it’s a valid http/https URL
 * - Uses Linking.canOpenURL before opening
 */
export async function openUrlIfValid(raw?: string | null): Promise<void> {
  if (!raw) {
    return;
  }

  let value = raw.trim();
  if (!value) return;

  // Add protocol if missing
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }

  if (!isHttpUrl(value)) {
    Toast.show("Invalid URL");
    return;
  }

  try {
    const supported = await Linking.canOpenURL(value);
    if (!supported) {
      Toast.show("Cannot open this link");
      return;
    }

    await Linking.openURL(value);
  } catch (err) {
    console.warn("Failed to open URL:", err);
    Toast.show("Failed to open link");
  }
}
