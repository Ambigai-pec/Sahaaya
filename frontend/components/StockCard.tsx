import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface Props {
  medicationName: string;
  dosage?: string;
  remainingTablets: number;
  dailyConsumption: number;
  daysRemaining: number;
  needsRefill: boolean;
  refillThreshold?: number;
  onRefill?: () => void;
}

export default function StockCard({
  medicationName,
  dosage = '',
  remainingTablets,
  dailyConsumption,
  daysRemaining,
  needsRefill,
  refillThreshold = 7,
  onRefill,
}: Props) {
  const isCritical = daysRemaining <= 2;
  const isWarning = needsRefill || daysRemaining <= refillThreshold;

  const statusColor = isCritical ? Colors.error : isWarning ? Colors.warning : Colors.success;
  const statusBg = isCritical ? Colors.errorMuted : isWarning ? Colors.warningMuted : Colors.successMuted;
  const statusBorder = isCritical ? Colors.errorBorder : isWarning ? Colors.warningBorder : Colors.successBorder;
  const statusLabel = isCritical ? 'CRITICAL LOW' : isWarning ? 'REFILL SOON' : 'ADEQUATE';
  const statusIcon = isCritical ? 'alert-circle' : isWarning ? 'warning-outline' : 'checkmark-circle-outline';

  // Stock percentage (approx based on a 30-day baseline)
  const maxTablets = Math.max(30, remainingTablets, dailyConsumption * 30);
  const percent = Math.min(100, Math.max(5, (remainingTablets / maxTablets) * 100));

  return (
    <View style={[styles.card, { borderLeftColor: statusColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.medName}>{medicationName}</Text>
          {dosage ? <Text style={styles.dosageText}>{dosage}</Text> : null}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusBg, borderColor: statusBorder }]}>
          <Ionicons name={statusIcon as any} size={12} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: statusColor }]} />
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: statusColor }]}>{remainingTablets}</Text>
          <Text style={styles.metricLabel}>Tablets Left</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{dailyConsumption}/day</Text>
          <Text style={styles.metricLabel}>Daily Usage</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: statusColor }]}>
            {Math.floor(daysRemaining)} d
          </Text>
          <Text style={styles.metricLabel}>Est. Days Left</Text>
        </View>
      </View>

      {/* Refill Action */}
      {onRefill && (
        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            {isWarning
              ? `Stock is at or below the ${refillThreshold}-day safety threshold.`
              : 'Inventory is currently within safe parameters.'}
          </Text>
          <TouchableOpacity style={styles.refillBtn} onPress={onRefill} activeOpacity={0.8}>
            <Ionicons name="add-circle-outline" size={15} color={Colors.primary} />
            <Text style={styles.refillBtnText}>Add Refill</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  titleArea: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  medName: {
    ...Typography.heading3,
    fontSize: 16,
    color: Colors.text,
  },
  dosageText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  statusText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.backgroundSubtle,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginVertical: Spacing.xs + 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    ...Typography.heading3,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  metricLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.borderLight,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  footerNote: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
    marginRight: Spacing.sm,
  },
  refillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  refillBtnText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});
