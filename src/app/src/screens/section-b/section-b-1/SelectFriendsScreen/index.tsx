import {
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  View,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MainStyles } from "@/core/constants/styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DefaultLoader } from "@/core/components/section-a";
import { GetFirestoreUserPaginated } from "@/core/api/section-a";
import Toast from "react-native-root-toast";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useSelector } from "react-redux";


const SelectFriendScreen = ({ navigation, route }) => {
  const userdata = useSelector((state) => state?.user?.userdata);
  console.log(userdata, "::");
  const [val, setval] = useState("");
  const [loding, setloding] = useState(false);
  const [currentpage, setcurrentpage] = useState(1);
  const [friendData, setfriendData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const handleGoBack = (user = []) => {
    route.params.onGoBack(user);
    navigation.goBack();
  };
  const handleToggleUser = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      if (exists) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const renderItems = ({ item }) => (
    <>
      <View
        style={[MainStyles.viewtwo, { marginBottom: hp(1.2) }]}
        key={item.id}
      >
        <View style={[MainStyles.viewone, { marginBottom: 0 }]}>
          <View style={styles.flatimg}>
            <Image
              source={{ uri: item?.photo }}
              resizeMode="cover"
              style={styles.img}
            />
          </View>
          <View
            style={[
              MainStyles.newview,
              {
                marginLeft: wp(2),
              },
            ]}
          >
            <Text style={MainStyles.text14}>
              {item?.firstName + " " + item?.lastName}
            </Text>
            <Text style={styles.text12}>@{item?.username}</Text>
          </View>
          {item?.relationShip == "LOVE_PARTENER" ? (
            <Image source={Images.g1} resizeMode="contain" style={styles.icn} />
          ) : item?.relationShip == "FRIEND" ? (
            <Image source={Images.g3} resizeMode="contain" style={styles.icn} />
          ) : item?.relationShip == "FAMILY" ? (
            <Image source={Images.g2} resizeMode="contain" style={styles.icn} />
          ) : null}
        </View>
        <View
          style={[
            MainStyles.viewone,
            {
              marginBottom: 0,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.add,
              {
                backgroundColor: selectedUsers?.some((u) => u.id === item.id)
                  ? "#252525"
                  : Colors.white,
              },
            ]}
            onPress={() => handleToggleUser(item)}
          >
            <Text
              style={[
                styles.text10,
                {
                  color: selectedUsers?.some((u) => u.id === item.id)
                    ? Colors.white
                    : Colors.black,
                },
              ]}
            >
              {selectedUsers?.some((u) => u.id === item.id) ? "Added" : "Add"}
            </Text>
          </TouchableOpacity>
          <View style={styles.lasticon}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color={Colors.white}
            />
          </View>
        </View>
      </View>
      <View style={styles.borderview} />
    </>
  );
  useEffect(() => {
    getalluser();
  }, []);
  const getalluser = async () => {
    setloding(true);
    const pno = currentpage;
    const psize = 10;
    const uid = userdata?.collectdata?.userId;
    await GetFirestoreUserPaginated({ pno, psize, uid })
      .then((res) => {
        // console.log("ppppi---", JSON.stringify(res));
        setfriendData(res?.data?.users);
        setloding(false);
      })
      .catch((error) => {
        setloding(false);
        console.log("first---", error);
      });
  };
  const loadmoredata = async (pno, psize) => {
    setloding(true);
    setcurrentpage((prev) => prev + 1);
    await GetFirestoreUserPaginated({ pno, psize })
      .then((res) => {
        const collectdata = res?.data?.users;
        if (collectdata.length === 0) {
          Toast.show("No More data To Show");
        } else {
          // console.log("****", collectdata.orders);
          setfriendData((prevHomedata) => [...prevHomedata, ...collectdata]);
        }
        setloding(false);
      })
      .catch((error) => {
        console.log("first", error);
      });
  };
  return (
    <View style={MainStyles.root}>
      <View style={styles.headertop}>
        <TouchableOpacity
          style={styles.icnviews}
          onPress={() => handleGoBack(selectedUsers)}
        >
          <FontAwesome6
            name="arrow-left"
            size={17}
            color={Colors.background_color}
          />
        </TouchableOpacity>
        <Text style={MainStyles.text20semibold}>Friends HabitStack</Text>
      </View>
      <View style={[MainStyles.viewtwo, { marginVertical: hp(2) }]}>
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
        <TouchableOpacity style={styles.icnview}>
          <Image
            source={Images.filter}
            resizeMode="contain"
            style={styles.filter}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.faltview}>
        <FlatList
          data={friendData}
          renderItem={renderItems}
          showsVerticalScrollIndicator={false}
          onEndReached={() => loadmoredata(currentpage + 1, 10)}
        />
      </View>
      <DefaultLoader status={loding} />
    </View>
  );
};

export default SelectFriendScreen;

const styles = StyleSheet.create({
  headertop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icnviews: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(4),
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  lasticon: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(7),
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.07)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(1),
  },
  borderview: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderline,
    width: wp(76),
    alignSelf: "flex-end",
    marginBottom: hp(2),
  },
  add: {
    backgroundColor: Colors.white,
    borderRadius: wp(10),
    paddingVertical: wp(1),
    paddingHorizontal: wp(2),
  },
  icn: {
    width: wp(6),
    height: wp(6),
    marginLeft: wp(2.5),
    top: hp(-0.5),
  },
  text10: {
    fontSize: 12,
    color: Colors.background_color,
    fontFamily: "bold",
  },
  text12: {
    fontSize: 14,
    color: Colors.music,
    fontFamily: "bold",
  },
  flatmain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faltview: {
    flex: 1,
  },
  flatimg: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
  },
  img: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
  },
  icnview: {
    width: wp(12),
    height: hp(6),
    borderRadius: wp(3),
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  filter: {
    width: wp(7),
    height: hp(6),
  },
  inputview: {
    width: wp(75),
    height: hp(6),
    borderRadius: wp(3),
    backgroundColor: Colors.inputback,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(1.5),
  },
  input: {
    width: wp(55),
    height: hp(6),
    paddingLeft: wp(2),
  },
  icnzise: {
    width: wp(10),
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
  },
});
