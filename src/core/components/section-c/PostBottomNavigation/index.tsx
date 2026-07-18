import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AntDesign from  "@expo/vector-icons/AntDesign";
import Ionic from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleTabPress('home')}
        style={styles.tab}>
        <Ionic
          name={currentTab === 'home' ? 'home' : 'home-outline'}
          size={26}
          color={getColor('home')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress('search')}
        style={styles.tab}>
        <Ionic
          name={currentTab === 'search' ? 'search' : 'search-outline'}
          size={26}
          color={getColor('search')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress('create')}
        style={styles.tab}>
        <AntDesign
          name="plus-square"
          size={26}
          color={getColor('create')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress('friends')}
        style={styles.tab}>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={26}
            color={getColor('profile')}
          />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress('profile')}
        style={styles.tab}>
        {userPhoto ? (
          <Image
            source={{ uri: userPhoto }}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              borderWidth: currentTab === 'profile' ? 2 : 0,
              borderColor: '#fff',
            }}
          />
        ) : (
          <Ionic
            name={currentTab === 'profile' ? 'person-circle-sharp' : 'person-outline'}
            size={26}
            color={getColor('profile')}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PostBottomNavigation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: 24,
    backgroundColor: '#000',
    borderTopColor: '#222',
    borderTopWidth: 0.5,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});