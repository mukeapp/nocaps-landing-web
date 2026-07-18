// No AdMob SDK on web — BannerAd renders nothing (flagged in the approved plan).
export const BannerAd = (_props: any) => null;

export const BannerAdSize = {
  ANCHORED_ADAPTIVE_BANNER: "ANCHORED_ADAPTIVE_BANNER",
  BANNER: "BANNER",
  FULL_BANNER: "FULL_BANNER",
  LARGE_BANNER: "LARGE_BANNER",
  MEDIUM_RECTANGLE: "MEDIUM_RECTANGLE",
};

export const TestIds = {
  BANNER: "ca-app-pub-3940256099942544/6300978111",
};

export default function mobileAds() {
  return { initialize: async () => [] };
}
