import { Images } from "@/core/constants/Images";

/** Extract a local image key from a backend icon url like ".../cup.png" */
export function imageKeyFromUrl(url?: string): keyof typeof Images | undefined {
  if (!url) return;
  const key = url.split("/").pop()?.replace(".png", "");
  return key as any;
}

/** Resolve either a local image from key or fallback image */
export function resolveImageSource(urlOrKey?: string, fallback: any = Images.cup) {
  const key = imageKeyFromUrl(urlOrKey);
  if (key && Images[key]) return Images[key];
  if (urlOrKey?.startsWith("http")) return { uri: urlOrKey };
  return Images[urlOrKey as keyof typeof Images] ?? fallback;
}

export const getImageKey = (url?: string | null) =>
  url ? url.split("/").pop()?.replace(".png", "") : undefined;

export const getDefaultImageUrl = () => {
  return 'https://firebasestorage.googleapis.com/v0/b/muke-shop-pipes.appspot.com/o/food-explorer%2Fdefault_banner_image_000.png?alt=media&token=ae1a595c-3c28-46c9-8bdf-0a9bc18b3a8c';
};

export const getDefaultImageUrl2 = () => {
  return 'https://firebasestorage.googleapis.com/v0/b/muke-shop-pipes.appspot.com/o/food-explorer%2FA001_SplashScreen.jpg?alt=media&token=da10d285-112e-4303-a0af-6cae2ccccc38';
};