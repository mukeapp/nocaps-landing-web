import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

const TOTAL_SECONDS = 180; // 3 minutes

interface CountdownLoaderProps {
  text?: string;
  visible: boolean;
  totalSeconds?: number;
}

const CountdownLoader: React.FC<CountdownLoaderProps> = ({ visible, totalSeconds = TOTAL_SECONDS, text = "AI is searching for swap candidates" }) => {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) {
      setSecondsLeft(totalSeconds);
      return;
    }

    // Spin animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Countdown tick
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
      spinAnim.stopAnimation();
      pulseAnim.stopAnimation();
    };
  }, [visible, totalSeconds]);

  if (!visible) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeLabel = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const progress = 1 - secondsLeft / totalSeconds;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.ring, { transform: [{ rotate: spin }] }]} />
      <Animated.View style={[styles.center, { transform: [{ scale: pulseAnim }] }]}>
        <Text style={styles.timeText}>{timeLabel}</Text>
        <Text style={styles.subText}>Finding alternatives…</Text>
      </Animated.View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` as any }]} />
      </View>
      <Text style={styles.hintText}>{text}</Text>
    </View>
  );
};

export default CountdownLoader;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0f0f18",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  ring: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: "rgba(26,203,85,0.9)",
    borderRightColor: "rgba(26,203,85,0.3)",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
  },
  timeText: {
    color: "#f1f5f9",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 2,
  },
  subText: {
    color: "#6b7280",
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 1,
  },
  progressBar: {
    marginTop: 52,
    width: 200,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(26,203,85,0.8)",
  },
  hintText: {
    marginTop: 12,
    color: "#4b5563",
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
