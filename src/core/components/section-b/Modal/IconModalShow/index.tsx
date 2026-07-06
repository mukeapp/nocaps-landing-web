import {
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  Text,
  View,
  Image,
} from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { DefaultLoader, ButtonSignIn } from "@/core/components/section-a";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { MainStyles } from "@/core/constants/styles";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { Images } from "@/core/constants/Images";
import { BlurView } from "expo-blur";
import { Colors } from "@/core/constants/Colors";

const IconModalShow = ({ popup = false, icn = (obj: string, icn: string) => {}, onClose = () => {console.log("Closed")} }) => {
  const [val, setval] = useState("");
  const [selected, setselected] = useState({});
  const data = [
    {
      createdAt: { _nanoseconds: 235000000, _seconds: 1744677164 },
      documentId: "059f3a37-197b-4ea7-bfd6-2038420c7f63",
      iconLibrary: "NONE",
      iconName: "Communication",
      iconType: "IMAGE_LOCAL",
      id: "059f3a37-197b-4ea7-bfd6-2038420c7f63",
      imageLocation: "assets/images/i14.png",
      label: "Communication",
      updatedAt: { _nanoseconds: 235000000, _seconds: 1744677164 },
      value: "Communication",
    },
    {
      createdAt: { _nanoseconds: 531000000, _seconds: 1744677161 },
      documentId: "2d5b81f4-7a42-47fd-87f5-109eac898f0f",
      iconLibrary: "NONE",
      iconName: "Food & Nutrition",
      iconType: "IMAGE_LOCAL",
      id: "2d5b81f4-7a42-47fd-87f5-109eac898f0f",
      imageLocation: "assets/images/i11.png",
      label: "Food & Nutrition",
      updatedAt: { _nanoseconds: 532000000, _seconds: 1744677161 },
      value: "Food & Nutrition",
    },
    {
      createdAt: { _nanoseconds: 956000000, _seconds: 1744677161 },
      documentId: "2f1a1a1f-55d2-4a7c-83ac-f0627900a841",
      iconLibrary: "NONE",
      iconName: "Exercise & Sport",
      iconType: "IMAGE_LOCAL",
      id: "2f1a1a1f-55d2-4a7c-83ac-f0627900a841",
      imageLocation: "assets/images/i13.png",
      label: "Exercise & Sport",
      updatedAt: { _nanoseconds: 956000000, _seconds: 1744677161 },
      value: "Exercise & Sport",
    },
    {
      createdAt: { _nanoseconds: 765000000, _seconds: 1744677161 },
      documentId: "34293a36-52fd-47de-8f10-14cf6012bafe",
      iconLibrary: "NONE",
      iconName: "Finance",
      iconType: "IMAGE_LOCAL",
      id: "34293a36-52fd-47de-8f10-14cf6012bafe",
      imageLocation: "assets/images/i12.png",
      label: "Finance",
      updatedAt: { _nanoseconds: 765000000, _seconds: 1744677161 },
      value: "Finance",
    },
    {
      createdAt: { _nanoseconds: 619000000, _seconds: 1744677163 },
      documentId: "45251a25-30a0-4061-9538-1ef4dcb380d2",
      iconLibrary: "NONE",
      iconName: "Organization",
      iconType: "IMAGE_LOCAL",
      id: "45251a25-30a0-4061-9538-1ef4dcb380d2",
      imageLocation: "assets/images/i1.png",
      label: "Organization",
      updatedAt: { _nanoseconds: 619000000, _seconds: 1744677163 },
      value: "Organization",
    },
    {
      createdAt: { _nanoseconds: 835000000, _seconds: 1744677163 },
      documentId: "4a8a5e69-f47e-490b-a14e-cf709f03ff5c",
      iconLibrary: "NONE",
      iconName: "Learning & Growth",
      iconType: "IMAGE_LOCAL",
      id: "4a8a5e69-f47e-490b-a14e-cf709f03ff5c",
      imageLocation: "assets/images/i9.png",
      label: "Learning & Growth",
      updatedAt: { _nanoseconds: 835000000, _seconds: 1744677163 },
      value: "Learning & Growth",
    },
    {
      createdAt: { _nanoseconds: 803000000, _seconds: 1744677162 },
      documentId: "4c120b58-04c4-4fd7-84de-fc1e52fa6e78",
      iconLibrary: "NONE",
      iconName: "Environment",
      iconType: "IMAGE_LOCAL",
      id: "4c120b58-04c4-4fd7-84de-fc1e52fa6e78",
      imageLocation: "assets/images/i5.png",
      label: "Environment",
      updatedAt: { _nanoseconds: 803000000, _seconds: 1744677162 },
      value: "Environment",
    },
    {
      createdAt: { _nanoseconds: 202000000, _seconds: 1744677163 },
      documentId: "5d469f48-d850-49db-8bd0-07ed94363c5f",
      iconLibrary: "NONE",
      iconName: "Mental Health",
      iconType: "IMAGE_LOCAL",
      id: "5d469f48-d850-49db-8bd0-07ed94363c5f",
      imageLocation: "assets/images/i3.png",
      label: "Mental Health",
      updatedAt: { _nanoseconds: 202000000, _seconds: 1744677163 },
      value: "Mental Health",
    },
    {
      createdAt: { _nanoseconds: 419000000, _seconds: 1744677163 },
      documentId: "67f30d7c-60c6-4a96-aaf1-9bbd93861a20",
      iconLibrary: "NONE",
      iconName: "Self-Care",
      iconType: "IMAGE_LOCAL",
      id: "67f30d7c-60c6-4a96-aaf1-9bbd93861a20",
      imageLocation: "assets/images/i2.png",
      label: "Self-Care",
      updatedAt: { _nanoseconds: 419000000, _seconds: 1744677163 },
      value: "Self-Care",
    },
    {
      createdAt: { _nanoseconds: 615000000, _seconds: 1744677162 },
      documentId: "7e5b7395-e81c-4865-a8c1-3f1d697c07a2",
      iconLibrary: "NONE",
      iconName: "Productivity",
      iconType: "IMAGE_LOCAL",
      id: "7e5b7395-e81c-4865-a8c1-3f1d697c07a2",
      imageLocation: "assets/images/i6.png",
      label: "Productivity",
      updatedAt: { _nanoseconds: 615000000, _seconds: 1744677162 },
      value: "Productivity",
    },
    {
      createdAt: { _nanoseconds: 38000000, _seconds: 1744677164 },
      documentId: "a06b4875-d050-44b0-9307-b213e1d0d393",
      iconLibrary: "NONE",
      iconName: "Financial Management",
      iconType: "IMAGE_LOCAL",
      id: "a06b4875-d050-44b0-9307-b213e1d0d393",
      imageLocation: "assets/images/i10.png",
      label: "Financial Management",
      updatedAt: { _nanoseconds: 38000000, _seconds: 1744677164 },
      value: "Financial Management",
    },
    {
      createdAt: { _nanoseconds: 997000000, _seconds: 1744677162 },
      documentId: "ad86b99f-9c49-4e01-b71c-3f90fdbb00d7",
      iconLibrary: "NONE",
      iconName: "Social & Relationships",
      iconType: "IMAGE_LOCAL",
      id: "ad86b99f-9c49-4e01-b71c-3f90fdbb00d7",
      imageLocation: "assets/images/i4.png",
      label: "Social & Relationships",
      updatedAt: { _nanoseconds: 997000000, _seconds: 1744677162 },
      value: "Social & Relationships",
    },
    {
      createdAt: { _nanoseconds: 408000000, _seconds: 1744677162 },
      documentId: "e5e6d74a-1d3d-4993-b1cc-7e6a2e95ee9c",
      iconLibrary: "NONE",
      iconName: "Personal Development",
      iconType: "IMAGE_LOCAL",
      id: "e5e6d74a-1d3d-4993-b1cc-7e6a2e95ee9c",
      imageLocation: "assets/images/i7.png",
      label: "Personal Development",
      updatedAt: { _nanoseconds: 408000000, _seconds: 1744677162 },
      value: "Personal Development",
    },
    {
      createdAt: { _nanoseconds: 169000000, _seconds: 1744677162 },
      documentId: "ee8a5b11-6b89-48b6-85a4-0c943347cabe",
      iconLibrary: "NONE",
      iconName: "Health & Wellness",
      iconType: "IMAGE_LOCAL",
      id: "ee8a5b11-6b89-48b6-85a4-0c943347cabe",
      imageLocation: "assets/images/i8.png",
      label: "Health & Wellness",
      updatedAt: { _nanoseconds: 169000000, _seconds: 1744677162 },
      value: "Health & Wellness",
    },
  ];
  return (
    <Modal animationType="slide" visible={popup} transparent={true}>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={35}
        tint="light"
        style={styles.main}
      >
        <View style={styles.container}>
          <View style={MainStyles.viewtwo}>
            <Text style={MainStyles.text20}>Select Icon</Text>
            <TouchableOpacity
              style={styles.close}
              onPress={() => {
                //icn("false", "no");
                onClose();
              }}
            >
              <SimpleLineIcons name="close" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.inputview}>
            <View style={styles.icnzise}>
              <Feather name="search" size={19} color={Colors.white} />
            </View>

            <TextInput
              value={val}
              onChangeText={(txt) => setval(txt)}
              style={styles.input}
              placeholder="Search here"
              placeholderTextColor={Colors.music}
              multiline={false}
              keyboardType="url"
            />
            <View style={styles.icnzise}>
              <Entypo name="cross" size={20} color={Colors.white} />
            </View>
          </View>
          <View style={[MainStyles.viewone, { flexWrap: "wrap" }]}>
            {data?.map((obj) => {
              const imageKey = obj?.imageLocation
                ?.split("/")
                .pop()
                ?.replace(".png", "");
              return (
                <TouchableOpacity
                  key={obj?.documentId}
                  style={[
                    styles.box,
                    {
                      borderColor:
                        selected?.documentId == obj?.documentId
                          ? Colors.white
                          : "rgba(59, 59, 59, 1)",
                    },
                  ]}
                  onPress={() => setselected(obj)}
                >
                  <Image
                    source={Images[imageKey]}
                    resizeMode="contain"
                    style={styles.logo}
                  />
                  <Text style={MainStyles.text10}>{obj?.iconName}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <ButtonSignIn
            text="Apply"
            wid="84"
            bg={Colors.white}
            bd={Colors.white}
            txcl={Colors.black}
            ftn={16}
            mov={() =>{
               icn("false", selected?.imageLocation)
               onClose();
              }}
          />
        </View>
      </BlurView>
    </Modal>
  );
};

export default IconModalShow;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    height: hp(100),
    width: wp(100),
    bottom: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOpacity: 0.15,
    paddingTop: hp(15),
    alignItems: "center",
  },
  container: {
    width: wp(90),
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    backgroundColor: Colors.content_back,
  },
  inputview: {
    width: wp(84),
    height: hp(6),
    borderRadius: wp(3),
    backgroundColor: Colors.inputback,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(1.5),
  },
  input: {
    width: wp(64),
    height: hp(6),
    paddingLeft: wp(2),
  },
  close: {
    backgroundColor: Colors.filtertext,
    width: wp(9),
    height: wp(9),
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    borderRadius: wp(10),
    marginRight: wp(3.5),
    marginBottom: hp(1),
    paddingHorizontal: wp(2.3),
    paddingVertical: wp(1.7),
    borderWidth: 1,
    borderColor: "rgba(59, 59, 59, 1)",
    flexDirection: "row",
    alignItems: "center",
  },
  icnzise: {
    width: wp(10),
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(1),
  },
});
