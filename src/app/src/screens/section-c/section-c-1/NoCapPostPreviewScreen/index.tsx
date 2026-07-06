// import { setUserLogout, selectUser } from "@/core/redux/user-data";
// import { useDispatch } from "react-redux";
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   FlatList,
//   ScrollView,
//   Alert,
//   TouchableOpacity,
// } from "react-native";
// import { useSelector } from "react-redux";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "@/core/utils/responsive";
// import { useFocusEffect } from "@react-navigation/native";

// import { MainStyles } from "@/core/constants/styles";
// import { Images } from "@/core/constants/Images";
// import { Colors } from "@/core/constants/Colors";
// import { HabitStackCard, Header2 } from "@/core/components/section-b";
// import {
//   DefaultLoader as Loader,
//   ButtonSignIn as Button,
// } from "@/core/components/section-a";
// import {
//   getHabitStackComponentsByUserId,
//   DeleteHabitStack,
// } from "@/core/api/section-b";
// import Toast from "react-native-root-toast";
// import { HabitStackComponent } from "@/core/models/section-b";
// import { useFriendRequestForm, useHabitCalendarForm, useNewFriendsForm, useYourFriendsForm } from "@/core/hooks";
// import { FriendsVerticalList } from "@/core/components/section-b-1";


// const NoCapPostPreviewScreen: React.FC<{ navigation: any; route: any }> = ({
//   navigation,
//   route,
// }) => {
//   const form = useNoCapPostPreviewForm({ navigation, route });
//   // const [key, setKey] = useState(0);

//   // // Force reload FlatList when screen is focused
//   // useFocusEffect(
//   //   useCallback(() => {
//   //     // Reset the stacks and reload
//   //     form.load?.();
//   //     // Force FlatList to remount by changing key
//   //     setKey((prev) => prev + 1);
//   //   }, [form.load])
//   // );

//   return (
//     <View style={MainStyles.root2}>
//       <Header2
//         title={form.destinationScreenTitle}
//         titleTextFormat={1}
//         titleVisibilityIcon={false}
//         showSettingsIcon={true}
//         navigation={navigation}
//         cameFromDrawerTab={form.cameFromDrawerTab}
//       />

//       <Loader status={form.loading} />
//     </View>
//   );
// };

// export default NoCapPostPreviewScreen;

// const styles = StyleSheet.create({

// });
