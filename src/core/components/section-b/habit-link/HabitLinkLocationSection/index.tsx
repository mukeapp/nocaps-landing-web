import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";
import React, {useEffect, useRef} from "react";
import {StyleSheet, Text, View} from "react-native";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";

type Props = {
  location: string;
  setLocation: (v: string) => void;
};

const HabitLinkLocationSection: React.FC<Props> = ({
  location,
  setLocation,
}) => {
  const placesRef = useRef<any>(null);

  useEffect(() => {
    if (placesRef.current && location) {
      placesRef.current.setAddressText(location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text style={[MainStyles.text14, { marginTop: hp(2) }]}>Location</Text>
      <GooglePlacesAutocomplete
        ref={placesRef}
        placeholder="12 eve foo, New York, USA"
        onPress={(data) => setLocation(data.description)}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
          language: "en",
        }}
        textInputProps={{
          onChangeText: setLocation,
          placeholderTextColor: "rgba(134, 134, 134, 1)",
        }}
        fetchDetails={false}
        enablePoweredByContainer={false}
        keepResultsAfterBlur={false}
        isRowScrollable={false}
        styles={{
          container: styles.placesContainer,
          textInput: styles.placesInput,
          listView: styles.placesList,
          row: styles.placesRow,
          description: styles.placesDescription,
        }}
      />
    </View>
  );
};

export default HabitLinkLocationSection;

export const styles = StyleSheet.create({
  wrapper: {
    zIndex: 10,
  },
  placesContainer: {
    marginTop: hp(1),
    width: wp(90),
  },
  placesInput: {
    backgroundColor: Colors.content_back,
    borderRadius: wp(3),
    height: hp(6),
    color: Colors.white,
    paddingLeft: wp(3),
    fontSize: wp(3.5),
    marginBottom: 0,
  },
  placesList: {
    backgroundColor: Colors.title_background,
    borderRadius: wp(2),
    marginTop: 4,
  },
  placesRow: {
    backgroundColor: Colors.title_background,
    paddingVertical: hp(1),
  },
  placesDescription: {
    color: Colors.white,
    fontSize: wp(3.5),
  },
});
