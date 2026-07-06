// Only used by SigninScreenExpoGo (Expo Go variant, not routed on web).
// Kept compiling so the verbatim section-a barrel resolves.
export function useAuthRequest(_config: any): [any, any, () => Promise<any>] {
  const promptAsync = async () => ({ type: "dismiss" as const });
  return [null, null, promptAsync];
}
