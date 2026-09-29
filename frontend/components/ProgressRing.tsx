import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, BorderRadius } from '../constants/theme';

interface Props {
  percentage: number;
  size?: number;
  label?: string;
}

export default function ProgressRing({ percentage = 0, size = 80, label }: Props) {
  const normPct = Math.min(100, Math.max(0, Math.round(percentage)));
  const color =
    normPct >= 80 ? Colors.success : normPct >= 60 ? Colors.warning : Colors.error;
  const bgTrack =
    normPct >= 80 ? Colors.successMuted : normPct >= 60 ? Colors.warningMuted : Colors.errorMuted;

  const borderWidth = Math.max(5, Math.floor(size / 12));

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: borderWidth,
            borderColor: color,
            backgroundColor: bgTrack,
          },
        ]}
      >
        <Text style={[styles.percentageText, { color, fontSize: Math.max(14, size / 4.2) }]}>
          {normPct}%
        </Text>
      </View>
      {label && <Text style={styles.labelText}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  labelText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
});
