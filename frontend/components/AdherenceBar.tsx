import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, BorderRadius, Typography } from '../constants/theme';

interface Props {
  percentage: number;
  height?: number;
  showLabel?: boolean;
}

export default function AdherenceBar({ percentage = 0, height = 8, showLabel = false }: Props) {
  const normPct = Math.min(100, Math.max(0, Math.round(percentage)));
  const color = normPct >= 80 ? Colors.success : normPct >= 60 ? Colors.warning : Colors.error;

  return (
    <View style={styles.container}>
      <View style={[styles.bg, { height }]}>
        <View style={[styles.fill, { width: `${normPct}%`, backgroundColor: color }]} />
      </View>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>Adherence</Text>
          <Text style={[styles.pctText, { color }]}>{normPct}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  bg: {
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  labelText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
  },
  pctText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
});
