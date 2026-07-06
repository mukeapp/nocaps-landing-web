// expo-file-system/legacy → browser equivalents for the calls used in core/:
// getInfoAsync (existence/size probe), writeAsStringAsync + documentDirectory
// (used to stage a file before sharing/downloading).

export const documentDirectory = "nocap-web://documents/";

export const EncodingType = {
  UTF8: "utf8",
  Base64: "base64",
} as const;

const memoryFiles = new Map<string, { content: string; encoding: string }>();

export async function getInfoAsync(uri: string, _options: any = {}) {
  if (memoryFiles.has(uri)) {
    const f = memoryFiles.get(uri)!;
    return { exists: true, uri, size: f.content.length, isDirectory: false };
  }
  if (uri.startsWith("blob:") || uri.startsWith("data:")) {
    try {
      const res = await fetch(uri);
      const blob = await res.blob();
      return { exists: true, uri, size: blob.size, isDirectory: false };
    } catch {
      return { exists: false, uri, isDirectory: false };
    }
  }
  return { exists: false, uri, isDirectory: false };
}

export async function writeAsStringAsync(
  uri: string,
  content: string,
  options: { encoding?: string } = {}
) {
  memoryFiles.set(uri, { content, encoding: options.encoding ?? EncodingType.UTF8 });
  // Web equivalent of writing to the sandbox: offer the file as a download.
  const filename = uri.split("/").pop() || "download";
  const blob =
    options.encoding === EncodingType.Base64
      ? base64ToBlob(content)
      : new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function base64ToBlob(b64: string): Blob {
  const bytes = atob(b64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr]);
}
