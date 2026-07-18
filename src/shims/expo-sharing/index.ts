export async function isAvailableAsync(): Promise<boolean> {
  return typeof navigator !== "undefined" && !!navigator.share;
}

export async function shareAsync(url: string, options: any = {}) {
  if (navigator.share) {
    await navigator.share({ url, title: options?.dialogTitle });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
