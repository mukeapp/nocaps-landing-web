import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";

import { MainStyles } from "@/core/constants/styles";
import { Images } from "@/core/constants/Images";
import { Colors } from "@/core/constants/Colors";
import { Header2 } from "@/core/components/section-b";
import { DefaultLoader as Loader } from "@/core/components/section-a";
import { useYourFriendsForm } from "@/core/hooks";
import { FriendsVerticalList } from "@/core/components/section-b-1";

const YourFriendsScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const form = useYourFriendsForm({ navigation, route });
  const [searchText, setSearchText] = useState("");

  const filteredFriends = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return form.friends;
    const filtered = (form.friends.data ?? []).filter((f: any) => {
      const fullName = `${f.firstName ?? ""} ${f.lastName ?? ""}`.toLowerCase();
      const handle = (f.username ?? "").toLowerCase();
      return fullName.includes(query) || handle.includes(query);
    });
    return { ...form.friends, data: filtered };
  }, [form.friends, searchText]);

  return (
    <View style={MainStyles.root2}>
      <Header2
        title="Your Friends"
        titleTextFormat={1}
        titleVisibilityIcon={false}
        showSettingsIcon={true}
        navigation={navigation}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Image source={Images.search} resizeMode="contain" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search here"
          placeholderTextColor={Colors.gray}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
      </View>

      <FriendsVerticalList
        btnAddText="Accept"
        btnRemoveText="Cancel"
        showBtnAdd={false}
        showBtnRemove={true}
        show3dotsBtn={true}
        friends={filteredFriends}
        showEmail={false}
        onAddFriend={(_f) => {}}
        onRemoveFriend={(f) => {
          form.deleteFriendRequestByDocId(f?.userId, f?.friend?.documentId);
        }}
        onOpenProfile={(f) => {
          navigation.navigate("profile", {
            originScreen: "your-friends",
            routerData: { destinationScreenTitle: "Profile", userId: f?.userId },
          });
        }}
      />

      <Loader status={form.loading} />
    </View>
  );
};

export default YourFriendsScreen;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(4),
    marginTop: hp(1.5),
    marginBottom: hp(1),
    paddingHorizontal: wp(3.5),
    height: hp(6),
    borderRadius: wp(3),
    backgroundColor: Colors.title_background,
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  searchIcon: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: Colors.gray,
  },
  searchInput: {
    flex: 1,
    marginLeft: wp(2.5),
    fontSize: wp(3.8),
    fontFamily: "poppins_regular",
    color: Colors.white,
  },
});
