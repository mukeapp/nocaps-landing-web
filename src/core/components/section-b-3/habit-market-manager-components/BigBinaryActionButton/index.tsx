import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import {useSelector} from "react-redux";
import {ConstantsUtils, showToastSuccess} from "@/core/utils";

interface BigBinaryActionButtonProps {
  onSendText?: string;
  onDeleteText?: string;
  showSend?: boolean;
  showDelete?: boolean;
  data?: any;
  selectedActionId?: number;
  onSend?: (
    habitStackId: string,
    oldOwnerUserId: string,
    action: string,
    actionId: number
  ) => void;
  onDelete?: (
    habitStackId: string,
    oldOwnerUserId: string,
    action: string,
    actionId: number
  ) => void;
}

const BigBinaryActionButton: React.FC<BigBinaryActionButtonProps> = ({
  onSendText = "Send To Pending",
  onDeleteText = "Remove",
  showSend = true,
  showDelete = true,
  data = null,
  selectedActionId = 0,
  onSend = (
    habitStackId: string,
    oldOwnerUserId: string,
    action: string,
    actionId: number
  ) => {
    console.log("Send to pending:", habitStackId, oldOwnerUserId, action, actionId);
  },
  onDelete = (
    habitStackId: string,
    oldOwnerUserId: string,
    action: string,
    actionId: number
  ) => {
    console.log("Delete:", habitStackId, oldOwnerUserId, action, actionId);
  },
}) => {

  const user = useSelector((s: any) => s?.user?.userdata);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const isMarketAdmin = true;
  //const isMarketAdmin = user?.id === ConstantsUtils.marketAdminUserId;


  const getOnSendText = () => {

    switch (selectedActionId) {
      case 1:
        return onSendText; // Send To Pending
      case 2:
        return "Send to Ready to Publish";
      case 3:
        return "Publish to Market";
      case 4:
        return "Market Published";
      default:
        return onSendText;
    }
  };


  const getOnSendTextIsEnabled = () => {

    switch (selectedActionId) {
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return false;
      default:
        return true;
    }
  };


  const handleOnSend = () => {
    if (!getOnSendTextIsEnabled()) {
      switch (selectedActionId) {
        // case 2:
        //   showToastSuccess("Please wait for NoCap approval..");
        //   break;
        case 4:
          showToastSuccess("Already ready to published to market.");
          break;
        default:
          showToastSuccess("Action not allowed.");
      }
      return;
    }
    onSend(data.id, data.userId, "send", selectedActionId);
  }

  const handleDeletePress = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirmation(false);
    onDelete(data.id, data.userId, "delete", selectedActionId);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <View style={styles.container}>
        {showSend && (
          <TouchableOpacity
            style={[styles.button, styles.sendToPendingButton]}
            onPress={handleOnSend}
            activeOpacity={0.8}
          >
            <Text style={styles.sendToPendingText}>{getOnSendText()}</Text>
          </TouchableOpacity>
        )}

        {showDelete && (
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeletePress}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteText}>{onDeleteText}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirmation}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCancelDelete}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to remove this item? This action cannot be undone.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelDelete}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmDelete}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: wp(2),
    marginBottom: hp(1),
    justifyContent: "space-between",
  },
  button: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(2),
    alignItems: "center",
    justifyContent: "center",
    minWidth: wp(30),
  },
  sendToPendingButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.blue,
  },
  sendToPendingText: {
    color: Colors.blue,
    fontSize: wp(3.2),
    fontFamily: "poppins_semibold",
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF4444",
  },
  deleteText: {
    color: "#FF4444",
    fontSize: wp(3.2),
    fontFamily: "poppins_semibold",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    borderRadius: wp(4),
    padding: wp(6),
    width: wp(85),
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: wp(5),
    fontFamily: "poppins_semibold",
    color: Colors.white || "#FFFFFF",
    marginBottom: hp(1.5),
  },
  modalMessage: {
    fontSize: wp(3.8),
    fontFamily: "poppins_regular",
    color: Colors.gray || "#A9A9A9",
    marginBottom: hp(3),
    lineHeight: hp(3),
  },
  modalButtons: {
    flexDirection: "row",
    gap: wp(3),
  },
  modalButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.borderline || "#E0E0E0",
  },
  cancelButtonText: {
    color: Colors.white || "#FFFFFF",
    fontSize: wp(3.8),
    fontFamily: "poppins_semibold",
  },
  confirmButton: {
    backgroundColor: "#FF4444",
  },
  confirmButtonText: {
    color: Colors.white || "#FFFFFF",
    fontSize: wp(3.8),
    fontFamily: "poppins_semibold",
  },
});

export default BigBinaryActionButton;