// Minimal expo-constants: code checks executionEnvironment ("storeClient" =
// Expo Go) and reads expoConfig. On web neither applies.
const Constants = {
  executionEnvironment: "bare",
  appOwnership: null as string | null,
  expoConfig: {} as any,
};

export default Constants;
