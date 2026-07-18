// HabitLinkItemImporterScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import { Header2 } from "@/core/components/section-b";
import { DefaultLoader as Loader } from "@/core/components/section-a";
import { useHabitLinkItemImporterForm } from "@/core/hooks";
import BannerSectionV3 from "@/core/components/section-b/banner/BannerSectionV3";
import * as DocumentPicker from "expo-document-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const HabitLinkItemImporterScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useHabitLinkItemImporterForm({ navigation, route });

  return (
    <View style={MainStyles.root2}>
      <BannerSectionV3
        overlayText={form.habitLink?.name || ""}
        remoteImage={form.habitLink?.bannerImage || ""}
        onPick={() => console.log("Pick Banner Image")}
      />
      <Header2
        title="Import Items"
        titleTextFormat={1}
        titleVisibilityIcon={false}
        showSettingsIcon={true}
        navigation={navigation}
      />

      <ScrollView style={styles.container}>
        {/* Download Sample Section */}
        <View style={styles.downloadSection}>
          <Text style={styles.sectionTitle}>Need a Template?</Text>
          <Text style={styles.sectionSubtitle}>
            Download a sample CSV file to see the correct format
          </Text>

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={form.downloadSampleCSV}
          >
            <AntDesign name="download" size={20} color={Colors.white} />
            <Text style={styles.downloadButtonText}>Download Sample CSV</Text>
          </TouchableOpacity>
        </View>

        {/* File Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload CSV File</Text>
          <Text style={styles.sectionSubtitle}>
            Select a CSV file with product data to import
          </Text>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={form.pickDocument}
            disabled={form.uploading}
          >
            <AntDesign name="upload" size={24} color={Colors.white} />
            <Text style={styles.uploadButtonText}>
              {form.selectedFile ? "Change File" : "Select CSV File"}
            </Text>
          </TouchableOpacity>

          {/* Selected File Display */}
          {form.selectedFile && (
            <View style={styles.fileInfo}>
              <MaterialIcons name="insert-drive-file" size={20} color={Colors.primary} />
              <Text style={styles.fileName}>{form.selectedFile.name}</Text>
              <TouchableOpacity onPress={form.clearFile}>
                <AntDesign name="closecircle" size={20} color={Colors.red} />
              </TouchableOpacity>
            </View>
          )}

          {/* Import Button */}
          {form.selectedFile && (
            <TouchableOpacity
              style={[styles.importButton, form.uploading && styles.importButtonDisabled]}
              onPress={form.uploadFile}
              disabled={form.uploading}
            >
              {form.uploading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <AntDesign name="cloud-upload" size={20} color={Colors.white} />
                  <Text style={styles.importButtonText}>Import Data</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Validation Results */}
        {form.validationResult && !form.validationResult.ok && (
          <View style={styles.errorSection}>
            <View style={styles.errorHeader}>
              <AntDesign name="exclamationcircle" size={24} color={Colors.red} />
              <Text style={styles.errorTitle}>Validation Errors Found</Text>
            </View>

            {/* Global Errors */}
            {form.validationResult.globalErrors && form.validationResult.globalErrors.length > 0 && (
              <View style={styles.globalErrorsBox}>
                <Text style={styles.globalErrorsTitle}>File Issues:</Text>
                {form.validationResult.globalErrors.map((error, idx) => (
                  <Text key={idx} style={styles.globalError}>• {error}</Text>
                ))}
              </View>
            )}

            {/* Column Errors */}
            {form.validationResult.columns?.filter(col => !col.valid).map((column, idx) => (
              <View key={idx} style={styles.columnErrorBox}>
                <Text style={styles.columnName}>{column.header}</Text>
                <Text style={styles.columnErrorCount}>
                  {column.issuesCount} issue{column.issuesCount > 1 ? 's' : ''}
                </Text>
                {column.issues.map((issue, issueIdx) => (
                  <View key={issueIdx} style={styles.issueRow}>
                    <Text style={styles.issueRowNumber}>Row {issue.rowNumber}:</Text>
                    <Text style={styles.issueValue}>"{issue.value}"</Text>
                    <Text style={styles.issueMessage}>{issue.message}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Success Results */}
        {form.importResult && (
          <View style={styles.successSection}>
            <View style={styles.successHeader}>
              <AntDesign name="checkcircle" size={24} color={Colors.green} />
              <Text style={styles.successTitle}>Import Complete</Text>
            </View>

            <View style={styles.statsBox}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Rows:</Text>
                <Text style={styles.statValue}>{form.importResult.totalRows}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Imported:</Text>
                <Text style={[styles.statValue, { color: Colors.green }]}>
                  {form.importResult.importedCount}
                </Text>
              </View>
              {form.importResult.failedCount > 0 && (
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Failed:</Text>
                  <Text style={[styles.statValue, { color: Colors.red }]}>
                    {form.importResult.failedCount}
                  </Text>
                </View>
              )}
            </View>

            {/* Row Errors */}
            {form.importResult.rowErrors && form.importResult.rowErrors.length > 0 && (
              <View style={styles.rowErrorsBox}>
                <Text style={styles.rowErrorsTitle}>Row Errors:</Text>
                {form.importResult.rowErrors.map((error, idx) => (
                  <Text key={idx} style={styles.rowError}>• {error}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>CSV Format Requirements:</Text>
          <Text style={styles.instructionItem}>• PNGImageURL (optional)</Text>
          <Text style={styles.instructionItem}>• Name (required)</Text>
          <Text style={styles.instructionItem}>• CompanyName (optional)</Text>
          <Text style={styles.instructionItem}>• Location (optional)</Text>
          <Text style={styles.instructionItem}>• Price (required, numeric)</Text>
          <Text style={styles.instructionItem}>• Quantity (required, integer)</Text>
          <Text style={styles.instructionItem}>• ItemURL (optional)</Text>
          <Text style={styles.instructionItem}>• Description (required)</Text>
          <Text style={[styles.instructionItem, { marginTop: hp(1.5) }]}>
            • Score (optional, numeric). Mapped as:
          </Text>
          {/* Score legend with circle on the side (right) */}
          <View style={styles.legendRow}>
            <Text style={styles.legendText}>equal to 0.0 → Unknown (gray)</Text>
            <View style={[styles.colorDot, { backgroundColor: Colors.gray }]} />
          </View>
          <View style={styles.legendRow}>
            <Text style={styles.legendText}>less than 0.2 → Bad (red)</Text>
            <View style={[styles.colorDot, { backgroundColor: Colors.red }]} />
          </View>
          <View style={styles.legendRow}>
            <Text style={styles.legendText}>less than 0.6 → Poor (purple)</Text>
            <View style={[styles.colorDot, { backgroundColor: Colors.purple }]} />
          </View>
          <View style={styles.legendRow}>
            <Text style={styles.legendText}>less than 0.8 → Average (orange)</Text>
            <View style={[styles.colorDot, { backgroundColor: Colors.orange }]} />
          </View>
          <View style={styles.legendRow}>
            <Text style={styles.legendText}>less than 0.9 → Good (green)</Text>
            <View style={[styles.colorDot, { backgroundColor: Colors.green }]} />
          </View>
          <View style={styles.legendRow}>
            <Text style={styles.legendText}>0.9 and above → Excellent (gold)</Text>
            <View style={[styles.colorDot, { backgroundColor: Colors.gold }]} />
          </View>
        </View>
      </ScrollView>

      <Loader status={form.loading} />
    </View>
  );
};

export default HabitLinkItemImporterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  uploadSection: {
    backgroundColor: Colors.title_background,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: hp(0.5),
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text_color,
    marginBottom: hp(2),
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: wp(2),
    padding: hp(1.5),
    gap: wp(2),
  },
  uploadButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.content_back,
    borderRadius: wp(2),
    padding: wp(3),
    marginTop: hp(2),
    gap: wp(2),
  },
  fileName: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
  },
  importButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.green,
    borderRadius: wp(2),
    padding: hp(1.5),
    marginTop: hp(2),
    gap: wp(2),
  },
  importButtonDisabled: {
    opacity: 0.6,
  },
  importButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  errorSection: {
    backgroundColor: Colors.title_background,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 2,
    borderColor: Colors.red,
  },
  errorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
    marginBottom: hp(2),
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.red,
  },
  globalErrorsBox: {
    backgroundColor: Colors.content_back,
    borderRadius: wp(2),
    padding: wp(3),
    marginBottom: hp(2),
  },
  globalErrorsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.red,
    marginBottom: hp(1),
  },
  globalError: {
    fontSize: 13,
    color: Colors.white,
    marginBottom: hp(0.5),
  },
  columnErrorBox: {
    backgroundColor: Colors.content_back,
    borderRadius: wp(2),
    padding: wp(3),
    marginBottom: hp(1.5),
  },
  columnName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: hp(0.5),
  },
  columnErrorCount: {
    fontSize: 13,
    color: Colors.red,
    marginBottom: hp(1),
  },
  issueRow: {
    marginLeft: wp(3),
    marginBottom: hp(0.5),
  },
  issueRowNumber: {
    fontSize: 12,
    color: Colors.text_color,
  },
  issueValue: {
    fontSize: 12,
    color: Colors.orange,
    marginLeft: wp(2),
  },
  issueMessage: {
    fontSize: 12,
    color: Colors.white,
    marginLeft: wp(2),
  },
  successSection: {
    backgroundColor: Colors.title_background,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 2,
    borderColor: Colors.green,
  },
  successHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
    marginBottom: hp(2),
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.green,
  },
  statsBox: {
    backgroundColor: Colors.content_back,
    borderRadius: wp(2),
    padding: wp(3),
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1),
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text_color,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
  rowErrorsBox: {
    backgroundColor: Colors.content_back,
    borderRadius: wp(2),
    padding: wp(3),
    marginTop: hp(2),
  },
  rowErrorsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.red,
    marginBottom: hp(1),
  },
  rowError: {
    fontSize: 13,
    color: Colors.white,
    marginBottom: hp(0.5),
  },
  instructionsSection: {
    backgroundColor: Colors.title_background,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: hp(1.5),
  },
  instructionItem: {
    fontSize: 13,
    color: Colors.text_color,
    marginBottom: hp(0.5),
    marginLeft: wp(2),
  },
  downloadSection: {
  backgroundColor: Colors.content_back,        // rgba(25, 25, 25, 1)
  borderRadius: wp(3),
  padding: wp(4),
  marginBottom: hp(2),
  borderWidth: 1,
  borderColor: Colors.borderline,              // rgba(255, 255, 255, 0.04)
},
downloadButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: Colors.blueback,            // rgba(45, 156, 219, 1)
  borderRadius: wp(2),
  padding: hp(1.5),
  gap: wp(2),
},
downloadButtonText: {
  color: Colors.white,                         // #F2F2F2
  fontSize: 15,
  fontWeight: "600",
},
legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(0.5),
    marginLeft: wp(2),
  },
  colorDot: {
    width: wp(3.5),
    height: wp(3.5),
    borderRadius: wp(3.5) / 2,
  },
  legendText: {
    fontSize: 13,
    color: Colors.text_color,
    flexShrink: 1,
    marginRight: wp(2),
  },
});