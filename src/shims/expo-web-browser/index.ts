export async function openBrowserAsync(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
  return { type: "opened" as const };
}

export function maybeCompleteAuthSession() {
  return { type: "failed" as const, message: "not applicable on web shim" };
}
