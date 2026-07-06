import { StyleSheet } from "react-native";
import { Colors } from "@/core/constants/Colors";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "@/core/utils/responsive";

export const HabitStyles = StyleSheet.create({
  // Banner

  imgbannerFull: { width: wp(100), height: hp(20), marginTop: hp(1), borderRadius: wp(3) },
  imgbanner: { width: wp(90), height: hp(20), marginTop: hp(1), borderRadius: wp(3) },
  uploadview: {
    borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", borderStyle: "dashed",
    width: wp(90), height: hp(16), borderRadius: wp(2), marginTop: hp(1),
    alignItems: "center", paddingVertical: hp(2), paddingHorizontal: wp(20),
  },
  uploadimg: {
    width: wp(12), height: wp(12), borderRadius: wp(1.5),
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(242,242,242,0.08)", marginBottom: hp(1.5),
  },
  pik: {
    position: "absolute", right: wp(1), bottom: wp(1), backgroundColor: Colors.green,
    borderRadius: wp(5), width: wp(6), height: wp(6), alignItems: "center",
    justifyContent: "center", borderWidth: 1.5, borderColor: Colors.white,
  },

  // Basics
  iconback: {
    width: wp(12), height: wp(12), alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(45,156,219,0.15)", borderRadius: wp(3), marginTop: hp(1),
  },
  colorview: { width: wp(12), height: wp(12), borderRadius: wp(3), marginTop: hp(1) },
  dollar: { width: wp(7), height: wp(7) },

  // Date rows
  dateview: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: Colors.content_back, width: wp(43), height: hp(6),
    borderRadius: wp(3), paddingHorizontal: wp(3),
  },
  input: { fontSize: 14, width: wp(26), paddingLeft: wp(2), color: Colors.white, fontFamily: "semibold" },

  // Status
  musicview: {
    width: wp(44), height: hp(6), backgroundColor: Colors.content_back, borderRadius: wp(3),
    marginTop: hp(1), flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingHorizontal: wp(5),
  },

  // Weekdays
  week: {
    width: wp(11), height: wp(12), borderRadius: wp(3), backgroundColor: Colors.content_back,
    alignItems: "center", borderWidth: 1, justifyContent: "center",
  },

  // Links
  additem: {
    width: wp(90), backgroundColor: Colors.content_back, borderRadius: wp(3),
    paddingHorizontal: wp(3), paddingVertical: hp(1), marginTop: hp(1.5),
  },
  additems: {
    width: wp(84), height: hp(4.5), borderRadius: wp(2), alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: Colors.white,
    alignSelf: "center", marginTop: hp(1),
  },
  globalmart: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingBottom: hp(2), borderBottomWidth: 2, borderBottomColor: Colors.borderline, marginTop: hp(1.3),
  },
  martview: { flexDirection: "row", alignItems: "center" },
  lasticon: {
    width: wp(8), height: wp(8), borderRadius: wp(7),
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)",
    alignItems: "center", justifyContent: "center", marginLeft: wp(1),
  },
  lasticon2: {
    width: wp(8), height: wp(8), borderRadius: wp(7),
    borderWidth: 1.5, borderColor: Colors.blueback,
    backgroundColor: Colors.blueback,
    alignItems: "center", justifyContent: "center", marginLeft: wp(1),
  },
  fileview: {
    width: wp(5), height: wp(5), borderRadius: wp(3), backgroundColor: Colors.blueback,
    position: "absolute", alignItems: "center", justifyContent: "center",
    top: hp(-0.7), right: hp(-0.7),
  },
  file: { width: wp(4), height: wp(4), tintColor: Colors.white },

  dotview: {
    position: "absolute", width: wp(12), backgroundColor: Colors.inuptborder,
    paddingVertical: hp(0.5), alignItems: "flex-start", paddingHorizontal: wp(1.5),
    borderRadius: wp(1.5), right: wp(6), top: hp(0), zIndex: 1,
    borderWidth: 1, borderColor: Colors.inuptborder,
  },
  dotbtntxt: { color: Colors.white, fontSize: 12, fontFamily: "regular" },
  dotbtn: { width: wp(12), height: hp(2) },
});
