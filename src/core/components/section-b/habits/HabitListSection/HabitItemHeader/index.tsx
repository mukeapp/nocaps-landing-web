import {Colors} from "@/core/constants/Colors";
import {Images} from "@/core/constants/Images";
import {MainStyles} from "@/core/constants/styles";
import {truncateString} from "@/core/utils/utilities/string";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import React, {useState} from "react";
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import MetaRow from "../MetaRow";

import {HabitPreview} from "@/core/components/section-b";
import {HabitComponent} from "@/core/models/section-b";
import {withOpacity} from "@/core/utils/utilities/color";

type Props = {
  iconColor?: string;
  costSymbol?: string;
  name: string;
  iconKey?: string;
  interest?: string;
  cost?: number;
  focus?: string;
  priority?: string;
  status?: string; // STOP | PLAY | PAUSE | PREVIOUS | NEXT
  starTint?: string;
  onEdit: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
  onOpenCalendar?: () => void;
  habit?: HabitComponent;
  hideSwap?: boolean;
};

const HabitItemHeader: React.FC<Props> = ({
  iconColor = 'rgba(128, 128, 128, 1)',
  costSymbol = "",
  name,
  iconKey,
  interest,
  cost,
  focus,
  priority,
  status,
  starTint,
  onEdit,
  onDelete,
  onToggleExpand,
  onOpenCalendar,
  habit,
  hideSwap = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const reviewColor = 'rgba(128, 128, 128, 1)'; // default review dot color (can be customized via props)

  // Add this function
  const handleInfoClick = () => {
    setMenuOpen(false);
    setTimeout(() => {
      setShowPreview(true);
    }, 400);
  };

  // Add this function
  const handlePreviewClose = (obj: string) => {
    setShowPreview(false);
  };

  const handleEditClick = () => {
    setMenuOpen(false);
    // Add delay to ensure modal closes before navigation
    setTimeout(() => {
      onEdit();
    }, 400);
  };

  const handleDeleteClick = () => {
    setMenuOpen(false);
    // Add delay to ensure menu modal closes before showing delete modal
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
    <View style={[s.row, { marginTop: hp(1) }]}>
      <View style={[s.iconback, { backgroundColor: withOpacity(iconColor, 0.2) }]}>
        <Image
          source={iconKey ? Images[iconKey] : Images.dollar}
          resizeMode="contain"
          style={s.dollar}
        />
        <View style={s.starview}>
          <Image
            source={Images.star}
            resizeMode="contain"
            style={[s.star, { tintColor: reviewColor }]}
          />
        </View>
      </View>

      <View style={{ marginLeft: wp(2), flex: 1 }}>
        <View style={s.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={MainStyles.text16Simple}>{truncateString(name ?? "", 20)}</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={s.round} onPress={() => setMenuOpen(true)}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={20}
                color={Colors.white}
              />
            </TouchableOpacity>

            {/* <View style={[s.roundWhite]}>
              <SimpleLineIcons name="compass" size={14} color="black" />
            </View> */}

            {!hideSwap && <View
              style={[
                s.roundWhite,
                { backgroundColor: starTint || Colors.white },
              ]}
            >
              <Fontisto name="arrow-swap" size={14} color="black" />
            </View>}

            {onOpenCalendar && (
              <TouchableOpacity style={s.round} onPress={onOpenCalendar}>
                <FontAwesome5
                  name="calendar-alt"
                  size={15}
                  color={Colors.white}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={s.round} onPress={onToggleExpand}>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.header}>
          <MetaRow
            cost={cost}
            focus={focus}
            priority={priority}
            status={status}
            interest={interest}
            costSymbol={costSymbol}
          />
        </View>
      </View>

      {/* Add HabitPreview */}
      <HabitPreview
        rnsheet={showPreview}
        canEdit={true}
        dataitem={habit}
        closefun={handlePreviewClose}
      />

      {/* Menu Modal */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={s.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={s.menuModal}>

            {/* Infos */}
            <TouchableOpacity style={s.menuItem} onPress={handleInfoClick}>
              <MaterialIcons name="info" size={20} color={Colors.white} />
              <Text style={s.menuItemText}>
                Info
              </Text>
            </TouchableOpacity>

            <View style={s.menuDivider} />

            <TouchableOpacity style={s.menuItem} onPress={handleEditClick}>
              <MaterialIcons name="edit" size={20} color={Colors.white} />
              <Text style={s.menuItemText}>Edit</Text>
            </TouchableOpacity>

            <View style={s.menuDivider} />

            <TouchableOpacity style={s.menuItem} onPress={handleDeleteClick}>
              <MaterialIcons name="delete" size={20} color={Colors.red} />
              <Text style={[s.menuItemText, { color: Colors.red }]}>Delete</Text>
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
        <View style={s.deleteModalOverlay}>
          <View style={s.deleteModal}>
            <View style={s.deleteIconContainer}>
              <AntDesign name="exclamationcircle" size={50} color={Colors.red} />
            </View>

            <Text style={s.deleteTitle}>Delete Habit</Text>
            <Text style={s.deleteMessage}>
              Are you sure you want to delete{" "}
              <Text style={s.deleteItemName}>{name}</Text>?
            </Text>
            <Text style={s.deleteWarning}>This action cannot be undone.</Text>

            <View style={s.deleteButtons}>
              <TouchableOpacity
                style={[s.deleteButton, s.cancelButton]}
                onPress={handleCancelDelete}
              >
                <Text style={s.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.deleteButton, s.confirmButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={s.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderline,
  },
  iconback: {
    width: wp(12),
    height: wp(12),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.text_background,
    borderRadius: wp(3),
    marginTop: hp(1),
  },
  dollar: { width: wp(7), height: wp(7) },
  starview: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(3),
    backgroundColor: Colors.title_background,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: -hp(0.7),
    right: -hp(0.7),
  },
  star: { width: wp(2), height: wp(2) },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  round: {
    width: wp(6.5),
    height: wp(6.5),
    borderRadius: wp(7),
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(1),
  },
  roundWhite: {
    width: wp(6.5),
    height: wp(6.5),
    borderRadius: wp(7),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(1),
    backgroundColor: Colors.white,
  },
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
    width: wp(50),
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
    width: wp(85),
    padding: wp(6),
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

export default HabitItemHeader;