// Browser geolocation equivalents of the expo-location calls used in core/.

export const Accuracy = {
  Lowest: 1,
  Low: 2,
  Balanced: 3,
  High: 4,
  Highest: 5,
  BestForNavigation: 6,
};

export async function requestForegroundPermissionsAsync() {
  // The browser prompts on first getCurrentPosition call; report granted so the
  // mobile flow proceeds and the real prompt happens at read time.
  return { status: "granted" as const, granted: true };
}

export async function getCurrentPositionAsync(_options: any = {}) {
  return new Promise<{ coords: GeolocationCoordinates }>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ coords: pos.coords }),
      (err) => reject(err),
      { enableHighAccuracy: true }
    );
  });
}

export async function reverseGeocodeAsync(_location: {
  latitude: number;
  longitude: number;
}): Promise<any[]> {
  // No offline reverse geocoder in the browser; callers handle empty results.
  console.warn("[expo-location shim] reverseGeocodeAsync is not available on web");
  return [];
}
