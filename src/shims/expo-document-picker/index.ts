// expo-document-picker → <input type="file"> with the same result shape.

export async function getDocumentAsync(options: any = {}) {
  return new Promise<any>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    if (options?.type && options.type !== "*/*") {
      input.accept = Array.isArray(options.type) ? options.type.join(",") : options.type;
    }
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        resolve({ canceled: true, assets: null });
        return;
      }
      resolve({
        canceled: false,
        assets: [
          {
            uri: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            mimeType: file.type,
            file,
          },
        ],
      });
    };
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
