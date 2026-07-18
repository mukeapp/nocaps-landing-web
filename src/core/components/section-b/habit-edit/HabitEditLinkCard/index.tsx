import {HabitLinkPreview, LinearProgress} from "@/core/components/section-b";
import {HabitLinkDetailSheet} from "@/core/components/section-d";
import {Colors} from "@/core/constants/Colors";
import {Images} from "@/core/constants/Images";
import {MainStyles} from "@/core/constants/styles";
import {HabitStyles} from "@/core/styles";
import {formatCost, formatCostAsNumber, truncateString} from "@/core/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, {useState} from "react";
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";

export default function HabitEditLinkCard({
  costSymbol = "",
  item,
  onEdit,
  onDelete,
  onAddItem,
  canInteract,
}: {
  costSymbol: string;
  item: any;
  onEdit: () => void;
  onDelete: () => void;
  onAddItem: (habitLink: any) => void;
  canInteract: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLinkDetail, setShowLinkDetail] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const imageKey = item?.icon?.split("/")?.pop()?.replace(".png", "");

  const handleInfoClick = () => {
    setMenuOpen(false);
    setTimeout(() => {
      setShowPreview(true);
    }, 400);
  };

  const handleEditClick = () => {
    setMenuOpen(false);
    setTimeout(() => {
      onEdit();
    }, 400);
  };

  const handleDeleteClick = () => {
    setMenuOpen(false);
    setTimeout(() => {
      setShowDeleteConfirm(true);
    }, 400);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    setTimeout(() => {
      onDelete();
    }, 400);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <View style={[HabitStyles.additem, isWeb && wstyles.additem]}>
      <View style={HabitStyles.globalmart}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={[HabitStyles.iconback, isWeb && wstyles.iconback]}>
            <Image
              source={imageKey ? Images[imageKey] : Images.dollar}
              resizeMode="contain"
              style={[HabitStyles.dollar, isWeb && wstyles.dollar]}
            />
            {/* Icon Top Right Button */}
            <TouchableOpacity
              style={[HabitStyles.fileview, isWeb && wstyles.fileview]}
              onPress={() => onAddItem(item)}
              disabled={!canInteract}
            >
              <Image
                source={Images.file}
                resizeMode="contain"
                style={[HabitStyles.file, isWeb && wstyles.file]}
              />
            </TouchableOpacity>
          </View>
          <View style={[{ marginLeft: wp(4) }]}>
            <View style={MainStyles.columnalign}>
              <Text style={MainStyles.text14}>
                {truncateString(item?.name ?? "", 22) ?? "Item"}
              </Text>
              <View
                style={{
                  borderRadius: wp(10),
                  backgroundColor: Colors.text_background,
                  alignSelf: "flex-start",
                  marginTop: hp(0.3),
                  paddingVertical: hp(0.3),
                  paddingHorizontal: wp(1),
                }}
              >
                <Text style={MainStyles.text12semibold}>
                  {costSymbol}
                  {item?.scoreComponent?.cost
                    ? formatCost(item?.scoreComponent?.cost)
                    : 0}
                </Text>
              </View>
            </View>
            <View style={{ marginLeft: wp(0) }}>
              <LinearProgress
                progress={
                  item?.scoreComponent?.score
                    ? formatCostAsNumber(item?.scoreComponent?.score, false)
                    : 0
                }
                backgroundColor="#ddd"
                progressColor={
                  item?.scoreComponent?.scoreInfo?.color?.toLowerCase() ||
                  Colors.inputback
                }
              />
            </View>
          </View>
        </View>

        <View
          style={[
            MainStyles.viewone,
            { marginBottom: 0, flexDirection: "row" },
          ]}
        >
          <TouchableOpacity
            style={[HabitStyles.lasticon, isWeb && wstyles.lasticon]}
            onPress={() => setMenuOpen(true)}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
          {/* go to HabitLink Screen button */}
          <TouchableOpacity
            style={[HabitStyles.lasticon2, isWeb && wstyles.lasticon]}
            onPress={() => setShowLinkDetail(true)}
          >
            <MaterialIcons name="dashboard" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[HabitStyles.additems, isWeb && wstyles.additems]}
        onPress={() => onAddItem(item)}
        disabled={!canInteract}
      >
        <Text style={MainStyles.text12Bold}>+ Add Item</Text>
      </TouchableOpacity>

      {/* Info Detail Sheet */}
      <HabitLinkDetailSheet
        link={showLinkDetail ? item : null}
        onClose={() => setShowLinkDetail(false)}
      />

      {/* Info Preview Sheet */}
      <HabitLinkPreview
        rnsheet={showPreview}
        canEdit={canInteract}
        dataitem={item}
        closefun={() => setShowPreview(false)}
      />

      {/* Menu Modal */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.menuModal}>
            <TouchableOpacity style={styles.menuItem} onPress={handleInfoClick}>
              <MaterialIcons name="info" size={20} color={Colors.white} />
              <Text style={styles.menuItemText}>Info</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleEditClick}>
              <MaterialIcons name="edit" size={20} color={Colors.white} />
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDeleteClick}
            >
              <MaterialIcons name="delete" size={20} color={Colors.red} />
              <Text style={[styles.menuItemText, { color: Colors.red }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModal}>
            <View style={styles.deleteIconContainer}>
              <AntDesign
                name="exclamationcircle"
                size={50}
                color={Colors.red}
              />
            </View>

            <Text style={styles.deleteTitle}>Delete Item</Text>
            <Text style={styles.deleteMessage}>
              Are you sure you want to delete{" "}
              <Text style={styles.deleteItemName}>{item?.name}</Text>?
            </Text>
            <Text style={styles.deleteWarning}>
              This action cannot be undone.
            </Text>

            <View style={styles.deleteButtons}>
              <TouchableOpacity
                style={[styles.deleteButton, styles.cancelButton]}
                onPress={handleCancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteButton, styles.confirmButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Menu Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuModal: {
    backgroundColor: Colors.content_back,
    borderRadius: 12,
    width: isWeb ? 220 : wp(50),
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "regular",
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.borderline,
    marginHorizontal: 8,
  },
  // Delete Confirmation Modal Styles
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModal: {
    backgroundColor: Colors.content_back,
    borderRadius: 16,
    width: isWeb ? 360 : wp(85),
    padding: isWeb ? 24 : wp(6),
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.red,
  },
  deleteIconContainer: {
    marginBottom: hp(2),
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: hp(1),
    textAlign: "center",
  },
  deleteMessage: {
    fontSize: 16,
    color: Colors.text_color,
    textAlign: "center",
    marginBottom: hp(0.5),
  },
  deleteItemName: {
    color: Colors.white,
    fontWeight: "600",
  },
  deleteWarning: {
    fontSize: 14,
    color: Colors.red,
    textAlign: "center",
    marginBottom: hp(3),
  },
  deleteButtons: {
    flexDirection: "row",
    gap: wp(3),
    width: "100%",
  },
  deleteButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.content_back,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  cancelButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: Colors.red,
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

// Web-only size overrides for the shared HabitStyles values (kept scoped to this
// card instead of editing the shared HabitStyles used across habit components).
const wstyles = StyleSheet.create({
  additem: { width: "100%", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginTop: 12 },
  additems: { width: "100%", height: 40, borderRadius: 10, marginTop: 12 },
  iconback: { width: 44, height: 44, borderRadius: 12 },
  dollar: { width: 26, height: 26 },
  fileview: { width: 18, height: 18, borderRadius: 9, top: -5, right: -5 },
  file: { width: 12, height: 12 },
  lasticon: { width: 30, height: 30, borderRadius: 15, marginLeft: 6 },
});
