// useHabitLinkItemImporterForm.ts
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { canEditScreen } from "@/core/utils";
import { RouterData } from "@/core/models/section-b";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

type RootState = any;
type Props = { navigation: any; route: any };

interface ValidationColumn {
  header: string;
  required: boolean;
  type: string;
  valid: boolean;
  issuesCount: number;
  issues: Array<{
    rowNumber: number;
    value: string;
    message: string;
  }>;
}

interface ValidationResult {
  ok: boolean;
  totalRows: number;
  columns: ValidationColumn[];
  globalErrors: string[];
}

interface ImportResult {
  totalRows: number;
  importedCount: number;
  failedCount: number;
  rowErrors: string[];
}

interface SelectedFile {
  name: string;
  uri: string;
  type: string;
  size: number;
}

export default function useHabitLinkItemImporterForm({ navigation, route }: Props) {
  const userId: string | undefined = useSelector(
    (s: RootState) => s?.user?.userdata?.collectdata?.userId
  );
  const userdata = useSelector((s: any) => s?.user?.userdata);
  const originScreen = route.params?.originScreen;
  const canEdit = canEditScreen(originScreen);
  const routerData: RouterData = route.params?.routerData || null;
  const habitLink = routerData?.habitLink || null;
  const habit = routerData?.habit || null;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const API_BASE_URL = "https://recent-ros-mukeapps-be63a855.koyeb.app"; // Replace with your actual API URL

  // Download sample CSV
  const downloadSampleCSV = async () => {
    try {
      // Sample CSV content with proper format
      const sampleCSV = `PNGImageURL,Name,CompanyName,Location,Price,Quantity,ItemURL,Score,Description
https://example.com/images/laptop.png,Dell XPS 15,Dell Technologies,"Austin, TX",1299.99,25,https://example.com/products/laptop,0.2,"High-performance laptop with 15.6-inch display, Intel i7 processor, 16GB RAM"
https://example.com/images/mouse.png,Wireless Mouse Pro,Logitech,"Newark, CA",49.99,150,https://example.com/products/mouse,,"Ergonomic wireless mouse with precision tracking and 6-month battery life"`;

      const fileName = "sample_habit_link_items.csv";
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Write CSV content to file
      await FileSystem.writeAsStringAsync(fileUri, sampleCSV, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Download Sample CSV",
          UTI: "public.comma-separated-values-text",
        });
        Toast.show("Sample CSV ready to download");
      } else {
        Toast.show("File saved to: " + fileUri);
      }
    } catch (error) {
      console.error("Error downloading sample CSV:", error);
      Toast.show("Failed to download sample CSV");
    }
  };

  // Pick CSV file
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values", "application/csv"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setSelectedFile({
        name: file.name,
        uri: file.uri,
        type: file.mimeType || "text/csv",
        size: file.size || 0,
      });

      // Clear previous results
      setValidationResult(null);
      setImportResult(null);

      Toast.show("File selected: " + file.name);
    } catch (error) {
      console.error("Error picking document:", error);
      Toast.show("Failed to select file");
    }
  };

  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null);
    setValidationResult(null);
    setImportResult(null);
  };

  // Upload file to API
  const uploadFile = async () => {
    if (!selectedFile || !habitLink?.documentId || !habitLink.userId) {
      Toast.show("Missing required information");
      return;
    }

    setUploading(true);
    setValidationResult(null);
    setImportResult(null);

    try {
      const formData = new FormData();

      // Construct file object for FormData
      const fileToUpload: any = {
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: selectedFile.name,
      };

      formData.append("file", fileToUpload);

      const url = `${API_BASE_URL}/habit-links-items-import/habitLinkId/${habitLink.documentId}/users/${habitLink.userId}/items:import`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 422) {
        // Validation failed
        setValidationResult(data);
        Toast.show("Validation errors found. Please fix and try again.", {
          duration: Toast.durations.LONG,
        });
      } else if (response.ok) {
        // Import successful
        setImportResult(data);
        Toast.show(
          `Successfully imported ${data.importedCount} of ${data.totalRows} items`,
          {
            duration: Toast.durations.LONG,
          }
        );

        // Navigate back after a delay
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        Toast.show("Import failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      Toast.show("Failed to upload file: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Load initial data
  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Add any initial data loading here
    } catch (e) {
      console.error(e);
      Toast.show("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);

  return {
    loading,
    uploading,
    userdata,
    userId,
    habitLink,
    habit,
    selectedFile,
    validationResult,
    importResult,
    downloadSampleCSV,
    pickDocument,
    clearFile,
    uploadFile,
  };
}