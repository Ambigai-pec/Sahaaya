import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius } from '../constants/theme';

interface Props {
  level: 'low' | 'moderate' | 'high' | 'critical' | string;
  size?: 'small' | 'default' | 'medium' | 'large';
  showLabelPrefix?: boolean;
}

export default function RiskBadge({ level = 'low', size = 'default', showLabelPrefix = false }: Props) {
  const normLevel = (level || 'low').toLowerCase();

  const getConfig = () => {
    switch (normLevel) {
      case 'low':
        return {
          label: 'Low Priority',
          fullLabel: 'Low Support Priority',
          icon: 'shield-checkmark' as const,
          color: Colors.priorityLow,
          bgColor: Colors.priorityLowBg,
          borderColor: Colors.priorityLowBorder,
        };
      case 'moderate':
        return {
          label: 'Moderate Priority',
          fullLabel: 'Moderate Support Priority',
          icon: 'alert-circle' as const,
          color: Colors.priorityModerate,
          bgColor: Colors.priorityModerateBg,
          borderColor: Colors.priorityModerateBorder,
        };
      case 'high':
        return {
          label: 'High Priority',
          fullLabel: 'High Support Priority',
          icon: 'warning' as const,
          color: Colors.priorityHigh,
          bgColor: Colors.priorityHighBg,
          borderColor: Colors.priorityHighBorder,
        };
      case 'critical':
        return {
          label: 'Critical Priority',
          fullLabel: 'Critical Support Priority',
          icon: 'alert' as const,
          color: Colors.critical,
          bgColor: Colors.criticalMuted,
          borderColor: Colors.errorBorder,
        };
      default:
        return {
          label: normLevel.toUpperCase(),
          fullLabel: normLevel.toUpperCase(),
          icon: 'shield-outline' as const,
          color: Colors.textMuted,
          bgColor: Colors.backgroundSubtle,
          borderColor: Colors.border,
        };
    }
  };

  const config = getConfig();
  const textLabel = showLabelPrefix ? config.fullLabel : config.label;

  const iconSize = size === 'large' ? 16 : size === 'small' ? 12 : 14;
  const fontSize = size === 'large' ? 13 : size === 'small' ? 10 : 12;
  const px = size === 'large' ? 12 : size === 'small' ? 6 : 9;
  const py = size === 'large' ? 6 : size === 'small' ? 2 : 4;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          paddingHorizontal: px,
          paddingVertical: py,
        },
      ]}
    >
      <Ionicons name={config.icon} size={iconSize} color={config.color} />
      <Text style={[styles.text, { color: config.color, fontSize }]}>{textLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
