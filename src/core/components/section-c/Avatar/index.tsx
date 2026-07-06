import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from '@/core/utils/responsive';

export interface AvatarUser {
  id?: string;
  displayName?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  documentId?: string; // Unique identifier for the user document
  userId?: string; // This is firebase user id When i login firebase give this unique id
  fullName?: string; // User's full name
  tags?: string[]; // Array of interests or tags
  roles?: string[]; // Array of roles (can be empty)
  description?: string; // Description or bio of the user
  photo?: string; // URL of the user's profile photo
  bannerImage?: string; // URL of the user's banner image
}

interface Props {
  user: AvatarUser;
  size?: number;
}

const Avatar: React.FC<Props> = ({ user, size = 46 }) => {

  const displayName = user?.displayName?.trim()
  || user?.fullName?.trim()
  || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
  || `${user?.email ?? ""}  ${user?.lastName ?? ""}`.trim()
  || `Unknown User`
  ;

  const initials = displayName
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  const PLACEHOLDER = 'https://www.mtsolar.us/wp-content/uploads/2020/04/avatar-placeholder.png';
  const hasPhoto = !!user?.photo?.trim() && user.photo !== PLACEHOLDER;

  return (
    <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      {hasPhoto ? (
        <Image
          source={{ uri: user.photo }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <Text style={[s.text, { fontSize: size * 0.35 }]}>{initials}</Text>
      )}
    </View>
  );
};

export default Avatar;

const s = StyleSheet.create({
  avatar: {
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: 'rgba(230,57,70,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#e63946',
    fontFamily: 'poppins_semibold',
  },
});
