import { Colors } from "@/core/constants/Colors";
import { GetFeaturedCarouselSlides } from "@/core/api/section-b/section-b-3/market";
import { CarouselSlide, DEFAULT_SLIDES } from "@/core/models/section-b/market/carousel";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";

interface FeaturedCarouselProps {
  slides?: CarouselSlide[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ slides: slidesProp }) => {
  const [slides, setSlides] = useState<CarouselSlide[]>(DEFAULT_SLIDES);
  const [loading, setLoading] = useState(!slidesProp);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slidesProp) {
      setSlides(slidesProp);
      return;
    }
    (async () => {
      const result = await GetFeaturedCarouselSlides();
      if (result?.data && Array.isArray(result.data) && result.data.length > 0) {
        setSlides([...result.data].sort((a: CarouselSlide, b: CarouselSlide) => a.order - b.order));
      }
      setLoading(false);
    })();
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[activeIndex];
  const showTitle = !!(activeSlide.title && activeSlide.showTitle !== false);
  const showSubtitle = !!(activeSlide.subtitle && activeSlide.showSubtitle !== false);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={loading ? undefined : { uri: activeSlide.imageUrl }}
        style={styles.imageWrapper}
        resizeMode="cover"
      >
        {/* Dim overlay — absolute, doesn't affect flex layout of siblings */}
        <View style={styles.overlay} />

        {/* Text block — normal flex child pushed to bottom by imageWrapper's justifyContent */}
        {(showTitle || showSubtitle) && (
          <View style={styles.textBlock}>
            {showSubtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {activeSlide.subtitle}
              </Text>
            )}
            { (
              <Text style={styles.title} numberOfLines={2}>
                {showTitle && activeSlide.title}
              </Text>
            )}
          </View>
        )}
      </ImageBackground>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={handlePrev} style={styles.arrowButton}>
          <MaterialCommunityIcons name="chevron-left" size={30} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
          <MaterialCommunityIcons name="chevron-right" size={30} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(25),
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.inputback,
    marginBottom: hp(2),
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  textBlock: {
    backgroundColor: 'rgba(0,0,0,0.72)',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.70)',
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '700',
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
  },
  arrowButton: {
    padding: 5,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: hp(1.5),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.white,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default FeaturedCarousel;
