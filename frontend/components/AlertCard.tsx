import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface Props {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  patient?: string;
  time?: string;
  recommendation?: string;
  onPressAction?: () => void;
  actionLabel?: string;
}

export default function AlertCard({
  title,
  description,
  severity,
  patient,
  time,
  recommendation,
  onPressAction,
  actionLabel,
}: Props) {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'critical':
        return {
          color: Colors.error,
          bgColor: Colors.errorMuted,
          borderColor: Colors.errorBorder,
          badgeBg: '#FEE2E2',
          icon: 'alert-circle' as const,
          label: 'CRITICAL',
        };
      case 'warning':
        return {
          color: Colors.warning,
          bgColor: Colors.warningMuted,
          borderColor: Colors.warningBorder,
          badgeBg: '#FEF3C7',
          icon: 'warning' as const,
          label: 'WARNING',
        };
      default:
        return {
          color: Colors.info,
          bgColor: Colors.infoMuted,
          borderColor: Colors.infoBorder,
          badgeBg: '#DBEAFE',
          icon: 'information-circle' as const,
          label: 'INFO',
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <View style={[styles.card, { borderLeftColor: config.color }]}>
      {/* Top Header */}
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
            <Ionicons name={config.icon} size={12} color={config.color} />
            <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
          </View>
          {patient && (
            <View style={styles.patientBadge}>
              <Ionicons name="person-outline" size={11} color={Colors.textSecondary} />
              <Text style={styles.patientText}>{patient}</Text>
            </View>
          )}
        </View>
        {time && <Text style={styles.timeText}>{time}</Text>}
      </View>

      {/* Main Content */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* Recommendation Box if provided */}
      {recommendation && (
        <View style={styles.recommendationBox}>
          <Ionicons name="bulb-outline" size={14} color={Colors.primary} style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.recommendationTitle}>Recommended Care Action:</Text>
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        </View>
      )}

      {/* Action button if provided */}
      {onPressAction && actionLabel && (
        <TouchableOpacity style={styles.actionBtn} onPress={onPressAction} activeOpacity={0.7}>
          <Text style={styles.actionBtnText}>{actionLabel}</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
        </TouchableOpacity>
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
    marginBottom: Spacing.sm + 4,
    ...Shadows.subtle,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  patientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.backgroundSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  patientText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  timeText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
  },
  title: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  recommendationBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: Colors.primarySurface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  recommendationTitle: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontSize: 11,
  },
  recommendationText: {
    ...Typography.bodySmall,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  actionBtnText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
});
