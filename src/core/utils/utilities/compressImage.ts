import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
export const compressImage = async (imageUri) => {
  // const MAX_SIZE_BYTES = 2 * 1024 * 1024;
  // const fileInfo = await FileSystem.getInfoAsync(imageUri);
  // if (!fileInfo.exists) {
  //   throw new Error("File does not exist at the given URI");
  // }
  // const originalSize = fileInfo.size;
  // if (originalSize <= MAX_SIZE_BYTES) {
  //   return imageUri;
  // }
  // let compression = MAX_SIZE_BYTES / originalSize;
  // compression = Math.min(1, Math.max(0.1, compression));
  // const result = await ImageManipulator.manipulateAsync(imageUri, [], {
  //   compress: compression,
  //   format: ImageManipulator.SaveFormat.JPEG,
  //   base64: false,
  // });
  // return result.uri;

  const MAX_SIZE_MB = 2;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const fileInfo = await FileSystem.getInfoAsync(imageUri);
  if (!fileInfo.exists) {
    throw new Error("File does not exist at provided URI");
  }
  if (fileInfo.size <= MAX_SIZE_BYTES) {
    return imageUri;
  }
  let compression = 0.9;
  while (compression > 0.1) {
    const result = await ImageManipulator.manipulateAsync(imageUri, [], {
      compress: compression,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: false,
    });
    const newFileInfo = await FileSystem.getInfoAsync(result.uri);
    if (newFileInfo.size <= MAX_SIZE_BYTES) {
      return result.uri;
    }
    compression -= 0.1;
  }
  const finalResult = await ImageManipulator.manipulateAsync(imageUri, [], {
    compress: 0.1,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: false,
  });
  return finalResult.uri;
};
