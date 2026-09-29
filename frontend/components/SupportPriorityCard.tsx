import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import RiskBadge from './RiskBadge';

interface Props {
  priority: 'low' | 'moderate' | 'high' | 'critical' | string;
  factors?: string[];
  lastUpdated?: string;
}

export default function SupportPriorityCard({
  priority = 'low',
  factors = [],
  lastUpdated,
}: Props) {
  const normPriority = (priority || 'low').toLowerCase();

  const getPriorityTheme = () => {
    switch (normPriority) {
      case 'critical':
      case 'high':
        return {
          border: Colors.priorityHigh,
          bg: Colors.priorityHighBg,
          accent: Colors.priorityHigh,
          icon: 'warning' as const,
          description: 'Caregiver attention recommended to assist with current adherence and wellness needs.',
        };
      case 'moderate':
        return {
          border: Colors.priorityModerate,
          bg: Colors.priorityModerateBg,
          accent: Colors.priorityModerate,
          icon: 'alert-circle' as const,
          description: 'Mild behavioral or schedule fluctuations detected. Supportive guidance active.',
        };
      default:
        return {
          border: Colors.priorityLow,
          bg: Colors.priorityLowBg,
          accent: Colors.priorityLow,
          icon: 'shield-checkmark' as const,
          description: 'Routine health adherence and wellness parameters are stable.',
        };
    }
  };

  const theme = getPriorityTheme();

  return (
    <View style={[styles.card, { borderLeftColor: theme.border }]}>
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.title}>Support Priority</Text>
          <Text style={styles.subtitle}>Explainable Behavioral Analysis</Text>
        </View>
        <RiskBadge level={normPriority} size="default" />
      </View>

      {/* Contextual Description */}
      <Text style={styles.descriptionText}>{theme.description}</Text>

      {/* Explainable Factor Rationale */}
      {factors && factors.length > 0 && (
        <View style={styles.factorsBox}>
          <View style={styles.factorsHeader}>
            <Ionicons name="information-circle-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.factorsTitle}>Why this priority:</Text>
          </View>
          {factors.map((factor, index) => (
            <View key={index} style={styles.factorRow}>
              <View style={[styles.factorDot, { backgroundColor: theme.border }]} />
              <Text style={styles.factorText}>{factor}</Text>
            </View>
          ))}
        </View>
      )}

      {lastUpdated && (
        <Text style={styles.timestampText}>Assessed {lastUpdated}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    ...Typography.heading3,
    fontSize: 16,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  descriptionText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  factorsBox: {
    marginTop: Spacing.sm + 2,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  factorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  factorsTitle: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  factorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 7,
  },
  factorText: {
    ...Typography.bodySmall,
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  timestampText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'right',
  },
});
