import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../constants/theme';

interface Props {
  emoji: string;
  label: string;
  score?: number;
  color?: string;
  selected: boolean;
  onPress: () => void;
}

export default function MoodButton({ emoji, label, score, color = Colors.primary, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        selected && [styles.selected, { borderColor: color, backgroundColor: `${color}15` }],
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, selected && [styles.selectedLabel, { color }]]}>
        {label}
      </Text>
      {selected && (
        <View style={[styles.indicatorDot, { backgroundColor: color }]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    minWidth: 85,
    alignItems: 'center',
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    margin: Spacing.xs,
    position: 'relative',
    ...Shadows.subtle,
  },
  selected: {
    borderWidth: 2,
  },
  emoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  selectedLabel: {
    fontWeight: '700',
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 6,
    right: 6,
  },
});
