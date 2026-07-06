import React from "react";
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
} from "@/core/utils/responsive";
// ----------drawer
import {Colors} from "@/core/constants/Colors";
import {Images} from "@/core/constants/Images";
import {MainStyles} from "@/core/constants/styles";
import {UserDataAction} from "@/core/redux/user-data";
import {setUserRevenuCatLogOut} from "@/core/redux/user-revenue-cat";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { auth } from "@/core/firebase";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Constants from "expo-constants";
import {DrawerContentScrollView} from "@react-navigation/drawer";
import {useDispatch} from "react-redux";

const CustomDrawerContent = ({ navigation, ...props }) => {
  const dispatch = useDispatch();
  const logoutCall = async () => {
    try { await auth.signOut(); } catch (_) {}
    try { await GoogleSignin.signOut(); } catch (_) {}
    dispatch(UserDataAction.setTempData({}));
    dispatch(UserDataAction.setUserData({}));
    dispatch(UserDataAction.setUserAuth(""));
    dispatch(setUserRevenuCatLogOut());
  };
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        backgroundColor: Colors.content_back,
        width: isTablet ? wp(100) : wp(100),
        height: isTablet ? '100%' : hp(106),
        // backgroundColor: 'pink',
      }}
    >
      <ImageBackground
        source={Images.draw}
        resizeMode="stretch"
        style={{
          width: isTablet ? wp(100) : wp(100),
          height: isTablet ? '100%' : hp(106),
          paddingTop: hp(7),
          top: hp(-6.3),
          left: wp(-3.4),
          paddingHorizontal: wp(5),
        }}
      >
        <View style={MainStyles.viewtwo}>
          <View style={[MainStyles.viewone, { marginBottom: 0 }]}>
            <View style={styles.box}>
              <Image
                source={Images.logo}
                resizeMode="contain"
                style={styles.logo}
              />
            </View>
            <Text style={MainStyles.text20}>NoCaps</Text>
          </View>
          <TouchableOpacity
            style={styles.crosview}
            onPress={() => navigation.closeDrawer()}
          >
            <MaterialCommunityIcons
              name="window-close"
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginTop: hp(4) }}>
          <View
            style={[styles.mainview, { backgroundColor: Colors.content_back }]}
          >
            <TouchableOpacity
              style={styles.itemlist}
              onPress={() => navigation.navigate("nocap-drawer")}
            >
              <Image
                source={Images.hm}
                resizeMode="contain"
                style={[styles.icn, { tintColor: Colors.white }]}
              />
              <Text style={[styles.title, { color: Colors.white }]}>Home</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.itemlist}
            onPress={() => navigation.navigate("no-cap-subscription")}
          >
            <Image
              source={Images.taj}
              resizeMode="contain"
              style={styles.icn}
            />
            <Text style={styles.title}>Subscribe</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemlist}
            onPress={() => navigation.navigate("profile")}
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={wp(5.5)}
              color={Colors.text_color}
              style={{ marginRight: wp(3) }}
            />
            <Text style={styles.title}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemlist}
            onPress={() => navigation.navigate("habit-market")}
          >
            <Image
              source={Images.box}
              resizeMode="contain"
              style={styles.icn}
            />
            <Text style={styles.title}>Market</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemlist}
            onPress={() => navigation.navigate("no-cap-post-home")}
          >
            <MaterialCommunityIcons
              name="post-outline"
              size={wp(5.5)}
              color={Colors.text_color}
              style={{ marginRight: wp(3) }}
            />
            <Text style={styles.title}>MyPosts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemlist}
            onPress={() => navigation.navigate("my-friends-and-habits")}
          >
            <Image
              source={Images.per}
              resizeMode="contain"
              style={styles.icn}
            />
            <Text style={styles.title}>Friends & Habits</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemlist}
            onPress={() => navigation.navigate("nocap-drawer")}
          >
            <MaterialCommunityIcons
              name="layers-outline"
              size={wp(5.5)}
              color={Colors.text_color}
              style={{ marginRight: wp(3) }}
            />
            <Text style={styles.title}>My Habit Stacks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemlist}
            onPress={() => navigation.navigate("my-habit-library")}
          >
            <MaterialCommunityIcons
              name="book-open-outline"
              size={wp(5.5)}
              color={Colors.text_color}
              style={{ marginRight: wp(3) }}
            />
            <Text style={styles.title}>My Habit Library</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.itemlist}>
            <Image
              source={Images.menu}
              resizeMode="contain"
              style={styles.icn}
            />
            <Text style={styles.title}>My Habit Parteners</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.itemlist}>
            <Image
              source={Images.dil}
              resizeMode="contain"
              style={styles.icn}
            />
            <Text style={styles.title}>Favourite</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.itemlist}
            onPress={() => navigation.navigate("settings")}
          >
            <Image
              source={Images.set}
              resizeMode="contain"
              style={styles.icn}
            />
            <Text style={styles.title}>Settings</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.itemlist}>
            <Image
              source={Images.info}
              resizeMode="contain"
              style={styles.icn}
            />
            <Text style={styles.title}>Help Center</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.itemlist}
            onPress={() =>
              Alert.alert("Logout", "Are you sure you want to logout?", [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Logout",
                  onPress: () => logoutCall(),
                },
              ])
            }
          >
            <MaterialIcons
              name="logout"
              size={24}
              style={[styles.icn, { marginLeft: wp(0.3) }]}
              color={Colors.text_color}
            />
            <Text style={styles.title}>Logout</Text>
          </TouchableOpacity>
          <Text style={styles.version}>NoCaps v{Constants.expoConfig?.version ?? '1.0.0'}</Text>
        </View>
      </ImageBackground>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  txt: {
    fontSize: 14,
    fontFamily: "medium",
    color: Colors.white,
  },
  box: {
    width: wp(11),
    height: wp(11),
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp(3),
    marginRight: wp(3),
  },
  logo: {
    width: wp(7),
    height: wp(7),
  },
  crosview: {
    width: wp(10),
    height: wp(10),
    backgroundColor: Colors.content_back,
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  icn: {
    width: wp(5.5),
    height: wp(5.5),
    marginRight: wp(3),
    tintColor: Colors.text_color,
  },
  itemlist: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderline,
    width: wp(38),
    marginBottom: hp(1),
    borderRadius: wp(1.5),
    paddingTop: hp(1),
  },
  title: {
    fontSize: 15,
    color: Colors.text_color,
    fontFamily: "regular",
  },
  mainview: {
    width: wp(42),
    alignItems: "center",
    borderRadius: wp(1.5),
  },
  version: {
    fontSize: 12,
    color: 'white',
    fontFamily: "regular",
    textAlign: "center",
    marginTop: hp(4),
    paddingBottom: hp(2),
    opacity: 0.5,
  },
});
