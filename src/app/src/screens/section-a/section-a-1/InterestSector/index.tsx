import Feather from "@expo/vector-icons/Feather";
import React, {useEffect, useRef, useState} from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
  fs,
} from "@/core/utils/responsive";
import {SwiperFlatList} from "react-native-swiper-flatlist";
import {useSelector} from "react-redux";

import {ButtonSignIn} from "@/core/components/section-a";
import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";
import {
  fetchInterestSectors,
  saveUserInterests,
} from "@/core/services/section-a";
import {showToast} from "@/core/utils";

const SCREEN_W = Dimensions.get("window").width;

const InterestSector = ({ navigation }: any) => {
  const userdata = useSelector((state: any) => state?.user?.userdata);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);

  const swiperRef = useRef<SwiperFlatList>(null);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const isSelected = (id: string) => selectedIds.includes(id);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchInterestSectors();
        setSlides(data);
      } catch (e) {
        setLoading(false);
        console.log("Error fetching interest sectors:");
        console.log("Error Fetching interest sectors:", e);
        showToast("Unable to load interests. Pull to retry.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleNext = async () => {
    if (slideIndex < slides.length - 1) {
      const next = slideIndex + 1;
      setSlideIndex(next);
      swiperRef.current?.scrollToIndex({ index: next });
      return;
    }

    // Last slide → require at least one selection
    if (!selectedIds.length) {
      setLoading(false);
      console.log("No interests selected");
      showToast("Please select at least one interest.");
      return;
    }

    setLoading(true);
    try {
      await saveUserInterests({
        selectedIds,
        userAccountId: userdata?.collectdata?.id,
        userDocumentId: userdata?.collectdata?.documentId,
      });
      navigation.navigate("onboardlocation");
    } catch (e) {
      setLoading(false);
      console.log("Error saving user interests");
      console.log("Error saving user interests:", e);
      // showToast("Unable to save interests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!selectedIds.length) {
      navigation.navigate("onboardlocation");
      return;
    }
    setLoading(true);
    try {
      await saveUserInterests({
        selectedIds,
        userAccountId: userdata?.collectdata?.id,
        userDocumentId: userdata?.collectdata?.documentId,
      });
    } catch (e) {
      setLoading(false);
      console.log("Error saving user interests on skip");
      console.log("Error saving user interests on skip:", e);
    } finally {
      setLoading(false);
      navigation.navigate("onboardlocation");
    }
  };

  return (
    <View style={[MainStyles.root, { paddingHorizontal: 0 }]}>
      <View style={styles.container}>
        <SwiperFlatList
          ref={swiperRef}
          onChangeIndex={({ index }) => setSlideIndex(index)}
          autoplayLoop={false}
          index={0}
          showPagination
          disableGesture
          data={slides}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Text style={MainStyles.text20}>
                Explore {item?.label} Interests
              </Text>
              <Text
                style={[
                  MainStyles.text12Regular,
                  {
                    color: Colors.text_color,
                    marginTop: hp(0.5),
                    marginBottom: hp(3),
                  },
                ]}
              >
                {item?.description}
              </Text>

              <View style={styles.chips}>
                {item?.interests?.map((obj: any) => {
                  const id = obj?.documentId; // single source of truth
                  const selected = isSelected(id);

                  return (
                    <Pressable
                      key={id}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() => toggle(id)}
                      hitSlop={6}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      {selected ? (
                        <Feather name="check" size={fs(15)} color={Colors.white} />
                      ) : null}
                      <Text
                        style={[
                          MainStyles.text12semibold,
                          { marginLeft: selected ? wp(1) : 0, fontSize: fs(12) },
                        ]}
                      >
                        {obj?.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.buttonWrap}>
        <ButtonSignIn
          text="Next"
          bg={Colors.white}
          txcl={Colors.black}
          wid="90"
          top="5"
          mov={handleNext}
          disabled={loading}
        />
        <ButtonSignIn
          text="Skip"
          bg={Colors.background_color}
          txcl={Colors.white}
          wid="90"
          bd={Colors.background_color}
          ftn={14}
          top="1"
          mov={handleSkip}
          disabled={loading}
        />
      </View>

      {loading && (
        <View style={styles.loaderOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

export default InterestSector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: SCREEN_W,
    paddingHorizontal: isTablet ? wp(15) : wp(5),
    paddingTop: hp(2),
  },
  chips: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: Colors.content_back,
    borderWidth: 1,
    borderColor: Colors.inputback,
    borderRadius: wp(5),
    marginRight: isTablet ? wp(2) : wp(1.5),
    marginBottom: isTablet ? hp(1.5) : hp(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(2),
    width: isTablet ? wp(26) : wp(28),
    height: isTablet ? hp(5.5) : hp(5),
  },
  chipSelected: {},
  buttonWrap: {
    paddingHorizontal: isTablet ? wp(15) : wp(5),
    paddingBottom: hp(2),
    alignItems: 'center',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
});
