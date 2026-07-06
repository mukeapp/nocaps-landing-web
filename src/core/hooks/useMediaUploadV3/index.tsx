import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { storage } from "@/core/firebase";
import { compressImage } from "@/core/utils";

export default function useMediaUploadV3() {
  const [imageLocalUri, setImageLocalUri] = useState<string | null>(null);
  const [imageRemoteUrl, setImageRemoteUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickAndUpload = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.canceled) return;

    const local = result.assets[0].uri;
    setImageLocalUri(local);

    try {
      setUploading(true);
      const compressedUri = await compressImage(local);
      const { uri } = await FileSystem.getInfoAsync(compressedUri);

      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(new TypeError("Network request failed"));
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = local.substring(local.lastIndexOf("/") + 1);
      const ref = storage.ref().child(`food-explorer/${filename}`);
      await ref.put(blob);
      const downloadURL = await ref.getDownloadURL();
      setImageRemoteUrl(downloadURL);
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    imageLocalUri,
    imageRemoteUrl,
    setRemoteUrl: setImageRemoteUrl,
    uploading,
    pickAndUpload,
  };
}
