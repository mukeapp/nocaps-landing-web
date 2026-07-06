
import * as WebBrowser from "expo-web-browser";

export const openTOS = async () =>
  WebBrowser.openBrowserAsync("https://www.donocap.com/terms-and-conditions");

export const openPrivacy = async () =>
  WebBrowser.openBrowserAsync("https://www.donocap.com/privacy-policy");
