import {Images} from '@/core/constants/Images';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '@/core/utils/responsive';

const DefaultSplashScreen = () => {
  return (
    <Image
      source={Images?.splash}
      resizeMode='cover'
      style={[styles.img, StyleSheet.absoluteFill]}
    />
  );
};

export default DefaultSplashScreen;

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '100%',
  },
});
