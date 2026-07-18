import { useState, useMemo } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { storage } from "@/core/firebase";
import { compressImage } from "@/core/utils";

type Props = {
  setLoading: (val: boolean) => void;
};

export default function useMediaUploadV2() {
  const [loading, setLoading] = useState(false);
  const [local, setLocal] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const pickImg = async () => {
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

    const uri = result.assets[0].uri;
    setLocal(uri);
    await uploadMedia(uri);
  };

  const uploadMedia = async (img: string) => {
    try {
      setLoading(true);
      const compressedUri = await compressImage(img);
      const { uri } = await FileSystem.getInfoAsync(compressedUri);

      const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(new TypeError("Network request failed"));
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = img.substring(img.lastIndexOf("/") + 1);
      const ref = storage.ref().child(`food-explorer/${filename}`);
      await ref.put(blob);
      const downloadURL = await ref.getDownloadURL();
      setPreview(downloadURL);
    } finally {
      setLoading(false);
    }
  };

  return useMemo(
    () => ({ loading, local, preview, pickImg }),
    [loading, local, preview]
  );
}
