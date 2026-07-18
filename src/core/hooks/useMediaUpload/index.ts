import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { storage } from "@/core/firebase";
import { compressImage } from "@/core/utils";

export default function useMediaUpload() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const pickImg = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (res.canceled) return;

    const uri = res.assets[0].uri;
    setLoading(true);
    try {
      setPreview(uri);
      const compressed = await compressImage(uri);
      const info = await FileSystem.getInfoAsync(compressed);

      const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(new TypeError("Network request failed"));
        xhr.responseType = "blob";
        xhr.open("GET", info.uri, true);
        xhr.send(null);
      });

      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const ref = storage.ref().child(`food-explorer/${filename}`);
      await ref.put(blob);
      const url = await ref.getDownloadURL();
      setPreview(url); // caller can read this as “uploaded preview”
    } finally {
      setLoading(false);
    }
  };

  return { loading, preview, pickImg, setPreview };
}
