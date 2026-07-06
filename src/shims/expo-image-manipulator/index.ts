// expo-image-manipulator → canvas. Supports the resize + compress + format
// usage in core/ (manipulateAsync(uri, actions, { compress, format })).

export const SaveFormat = {
  JPEG: "jpeg",
  PNG: "png",
  WEBP: "webp",
} as const;

export async function manipulateAsync(
  uri: string,
  actions: any[] = [],
  saveOptions: { compress?: number; format?: string } = {}
) {
  const img = await loadImage(uri);
  let width = img.width;
  let height = img.height;

  for (const action of actions) {
    if (action.resize) {
      const { width: rw, height: rh } = action.resize;
      if (rw && rh) {
        width = rw;
        height = rh;
      } else if (rw) {
        height = Math.round((rw / img.width) * img.height);
        width = rw;
      } else if (rh) {
        width = Math.round((rh / img.height) * img.width);
        height = rh;
      }
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);

  const format = saveOptions.format ?? SaveFormat.JPEG;
  const mime = `image/${format}`;
  const dataUri = canvas.toDataURL(mime, saveOptions.compress ?? 1);

  return { uri: dataUri, width, height };
}

function loadImage(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = uri;
  });
}
