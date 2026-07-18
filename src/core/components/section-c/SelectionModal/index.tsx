import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { SimpleLineIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { ButtonSignIn } from "@/core/components/section-a";

export type SelectionItem = {
  id?: string | number;
  name?: string;
  label?: string;
};

type Props = {
  visible: boolean;
  title: string;
  items: SelectionItem[];
  selectedId: string | number | null;
  onSelect: (item: SelectionItem) => void;
  onClose: () => void;
};

const SelectionModal: React.FC<Props> = ({
  visible,
  title,
  items,
  selectedId,
  onSelect,
  onClose,
}) => {
  const [tempSelected, setTempSelected] = useState<string | number | null | undefined>(
    selectedId
  );

  useEffect(() => {
    if (visible) setTempSelected(selectedId);
  }, [visible, selectedId]);

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={35}
        tint="light"
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={MainStyles.viewtwo}>
            <Text style={MainStyles.text20}>{title}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <SimpleLineIcons name="close" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ maxHeight: hp(30), marginTop: hp(2) }}
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
          >
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.pill,
                  {
                    borderColor:
                      tempSelected === item.id
                        ? Colors.white
                        : "rgba(59,59,59,1)",
                  },
                ]}
                onPress={() => setTempSelected(item?.id)}
              >
                <Text style={[MainStyles.text10, { fontSize: 12 }]}>
                  {item?.label || item?.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{ alignSelf: "center", marginTop: hp(2) }}>
            <ButtonSignIn
              text="Apply"
              wid="84"
              bg={Colors.white}
              bd={Colors.white}
              txcl={Colors.black}
              ftn={16}
              mov={() => {
                const selected = items.find((i) => i.id === tempSelected);
                if (selected) onSelect(selected);
                onClose();
              }}
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default SelectionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    height: hp(100),
    width: wp(100),
    bottom: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOpacity: 0.15,
    paddingTop: hp(30),
    alignItems: "center",
  },
  container: {
    width: wp(95),
    borderRadius: wp(3),
    paddingHorizontal: wp(1.5),
    paddingVertical: hp(1.5),
    backgroundColor: Colors.content_back,
  },
  closeBtn: {
    backgroundColor: Colors.filtertext,
    width: wp(9),
    height: wp(9),
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    borderRadius: wp(10),
    marginRight: wp(2),
    marginBottom: hp(1),
    paddingHorizontal: wp(2.4),
    paddingVertical: wp(1.8),
    borderWidth: 1,
    borderColor: "rgba(59,59,59,1)",
    flexDirection: "row",
    alignItems: "center",
  },
});
