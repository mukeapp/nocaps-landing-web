import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from  "@expo/vector-icons/AntDesign";
import Ionic from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@/core/utils/responsive';
import { useNavigation } from '@react-navigation/native';

const TAB_SCREEN_MAP: Record<string, string> = {
  home: 'no-cap-post-home',
  profile: 'profile',
  create: 'no-cap-post-create',
  friends: 'my-friends-and-habits',
  search: 'search-habitstacks-or-posts',
};

interface PostBottomNavigationProps {
  currentTab: string;
  onTabPress: (tab: string) => void;
  userPhoto?: string;
}

const PostBottomNavigation = ({ currentTab, onTabPress, userPhoto }: PostBottomNavigationProps) => {
  const navigation = useNavigation<any>();
  const getColor = (tab: string) => (currentTab === tab ? '#fff' : '#888');

  const handleTabPress = (tab: string) => {
    onTabPress(tab);
    const screenName = TAB_SCREEN_MAP[tab];
    if (screenName) {
      navigation.navigate(screenName);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: hp('1.2%'),
        paddingBottom: hp('3%'),
        backgroundColor: '#000',
        borderTopColor: '#222',
        borderTopWidth: 0.5,
      }}>
      <TouchableOpacity
        onPress={() => handleTabPress('home')}
        style={{ alignItems: 'center', padding: wp('2%') }}>
        <Ionic
          name={currentTab === 'home' ? 'home' : 'home-outline'}
          style={{ fontSize: wp('6%'), color: getColor('home') }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress('search')}
        style={{ alignItems: 'center', padding: wp('2%') }}>
        <Ionic
          name={currentTab === 'search' ? 'search' : 'search-outline'}
          style={{ fontSize: wp('6%'), color: getColor('search') }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress('create')}
        style={{ alignItems: 'center', padding: wp('2%') }}>
        <AntDesign
          name="plus-square"
          style={{ fontSize: wp('6%'), color: getColor('create') }}
        />
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => handleTabPress('reels')}
        style={{ alignItems: 'center', padding: wp('2%') }}>
        <Feather
          name="play-circle"
          style={{ fontSize: wp('6%'), color: getColor('reels') }}
        />
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => handleTabPress('friends')}
        style={{ alignItems: 'center', padding: wp('2%') }}>
          <MaterialCommunityIcons
            name="account-group-outline"
            style={{ fontSize: wp('6%'), color: getColor('profile') }}
          />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress('profile')}
        style={{ alignItems: 'center', padding: wp('2%') }}>
        {userPhoto ? (
          <Image
            source={{ uri: userPhoto }}
            style={{
              width: wp('7%'),
              height: wp('7%'),
              borderRadius: wp('3.5%'),
              borderWidth: currentTab === 'profile' ? 2 : 0,
              borderColor: '#fff',
            }}
          />
        ) : (
          <Ionic
            name={currentTab === 'profile' ? 'person-circle-sharp' : 'person-outline'}
            style={{ fontSize: wp('6%'), color: getColor('profile') }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PostBottomNavigation;