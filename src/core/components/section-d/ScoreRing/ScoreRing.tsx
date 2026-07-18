import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { getScoreTier } from '../utils';

export interface ScoreRingProps {
  scorePct: number;
  size?: number;
  label?: string;
  sublabel?: string;
}

const ScoreRing: React.FC<ScoreRingProps> = ({ scorePct, size = 54, label, sublabel }) => {
  const sw = 4;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (scorePct / 100) * circ;
  const color = getScoreTier(scorePct).hex;
  const c = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFillObject}>
        <Circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
        <Circle
          cx={c} cy={c} r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${c}, ${c}`}
        />
      </Svg>
      {label && (
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.label}>{label}</Text>
          {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: { color: '#f1f5f9', fontSize: 11, fontWeight: '800' },
  sublabel: { color: '#6b7280', fontSize: 8 },
});

export default ScoreRing;
