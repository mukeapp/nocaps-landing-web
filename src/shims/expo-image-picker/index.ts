// expo-image-picker → <input type="file"> returning the same result shape
// ({ canceled, assets: [{ uri, width, height, fileName, mimeType }] }).

export const MediaTypeOptions = {
  All: "All",
  Videos: "Videos",
  Images: "Images",
};

export async function requestMediaLibraryPermissionsAsync() {
  return { status: "granted" as const, granted: true };
}

export async function launchImageLibraryAsync(options: any = {}) {
  return new Promise<any>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept =
      options?.mediaTypes === MediaTypeOptions.Videos ? "video/*" : "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        resolve({ canceled: true, assets: null });
        return;
      }
      const uri = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () =>
        resolve({
          canceled: false,
          assets: [
            {
              uri,
              width: img.width,
              height: img.height,
              fileName: file.name,
              mimeType: file.type,
              file,
            },
          ],
        });
      img.onerror = () =>
        resolve({
          canceled: false,
          assets: [{ uri, width: 0, height: 0, fileName: file.name, mimeType: file.type, file }],
        });
      img.src = uri;
    };
    // If the picker dialog is dismissed no event fires reliably; cancel on focus
    // return without a change event.
    window.addEventListener(
      "focus",
      () => {
        setTimeout(() => {
          if (!input.files || input.files.length === 0) {
            resolve({ canceled: true, assets: null });
          }
        }, 500);
      },
      { once: true }
    );
    input.click();
  });
}
