import { Colors } from "@/core/constants/Colors";
import { GetFeaturedCarouselSlides } from "@/core/api/section-b/section-b-3/market";
import { CarouselSlide, DEFAULT_SLIDES } from "@/core/models/section-b/market/carousel";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import { ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";

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
        {/* Gradient overlay — dark at bottom, transparent at top */}
        <View style={styles.gradientOverlay} />

        {/* Text block at bottom of carousel */}
        {(showTitle || showSubtitle) && (
          <View style={styles.textBlock}>
            {showSubtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {activeSlide.subtitle}
              </Text>
            )}
            {showTitle && (
              <Text style={styles.title} numberOfLines={2}>
                {activeSlide.title}
              </Text>
            )}
          </View>
        )}
      </ImageBackground>

      {/* Arrow controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={handlePrev} style={styles.arrowButton} {...(isWeb ? { className: "carousel-arrow" } : {})}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.arrowButton} {...(isWeb ? { className: "carousel-arrow" } : {})}>
          <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.white} />
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
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.inputback,
    marginBottom: hp(2),
    position: 'relative',
    ...(isWeb ? { minHeight: 200, maxHeight: 300 } : { height: hp(25) }),
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    minHeight: 200,
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    ...(isWeb
      ? {
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)',
        }
      : {
          // Native fallback: darker overlay at bottom via two layers
          borderBottomWidth: 120,
          borderBottomColor: 'rgba(0,0,0,0.5)',
          borderLeftWidth: 0,
          borderRightWidth: 0,
          opacity: 0.6,
        }),
  },
  textBlock: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(3.5),
    paddingTop: hp(2),
    zIndex: 2,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '700',
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    zIndex: 3,
    pointerEvents: 'box-none',
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    ...(isWeb ? { cursor: 'pointer', transition: 'background-color 0.2s ease, transform 0.2s ease' } : {}),
  },
  dotsContainer: {
    position: 'absolute',
    bottom: hp(1.2),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
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
