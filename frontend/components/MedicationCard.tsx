import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface Props {
  name: string;
  dosage: string;
  time: string;
  status: 'taken' | 'missed' | 'delayed' | 'pending';
  foodInstruction?: 'before' | 'after' | 'with' | string;
  remainingStock?: number;
  onMark?: (status: 'taken' | 'missed' | 'delayed') => void;
}

export default function MedicationCard({
  name,
  dosage,
  time,
  status,
  foodInstruction = 'after',
  remainingStock,
  onMark,
}: Props) {
  const getStatusConfig = () => {
    switch (status) {
      case 'taken':
        return {
          label: 'Taken',
          icon: 'checkmark-circle' as const,
          color: Colors.taken,
          bgColor: Colors.takenBg,
          borderColor: Colors.takenBorder,
        };
      case 'missed':
        return {
          label: 'Missed',
          icon: 'alert-circle' as const,
          color: Colors.missed,
          bgColor: Colors.missedBg,
          borderColor: Colors.missedBorder,
        };
      case 'delayed':
        return {
          label: 'Delayed',
          icon: 'time' as const,
          color: Colors.delayed,
          bgColor: Colors.delayedBg,
          borderColor: Colors.delayedBorder,
        };
      default:
        return {
          label: 'Scheduled',
          icon: 'calendar-outline' as const,
          color: Colors.primary,
          bgColor: Colors.backgroundSubtle,
          borderColor: Colors.border,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const foodLabel =
    foodInstruction === 'before'
      ? 'Before food'
      : foodInstruction === 'with'
      ? 'With food'
      : 'After food';

  return (
    <View style={[styles.card, { borderLeftColor: statusConfig.color }]}>
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleArea}>
          <Text style={styles.medName}>{name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.dosageBadge}>
              <Text style={styles.dosageText}>{dosage}</Text>
            </View>
            <View style={styles.foodBadge}>
              <Ionicons name="restaurant-outline" size={12} color={Colors.textMuted} />
              <Text style={styles.foodText}>{foodLabel}</Text>
            </View>
            {remainingStock !== undefined && (
              <View style={[styles.stockBadge, remainingStock <= 5 && styles.stockLowBadge]}>
                <Ionicons
                  name={remainingStock <= 5 ? 'warning-outline' : 'cube-outline'}
                  size={12}
                  color={remainingStock <= 5 ? Colors.warning : Colors.textMuted}
                />
                <Text style={[styles.stockText, remainingStock <= 5 && styles.stockLowText]}>
                  {remainingStock} tabs
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Time and Status Badge */}
        <View style={styles.statusArea}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.timeText}>{time}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusConfig.bgColor, borderColor: statusConfig.borderColor },
            ]}
          >
            <Ionicons name={statusConfig.icon} size={13} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons for Pending Doses */}
      {onMark && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              status === 'taken' ? styles.actionBtnActiveTaken : styles.actionBtnTaken,
            ]}
            onPress={() => onMark('taken')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="checkmark"
              size={16}
              color={status === 'taken' ? '#FFFFFF' : Colors.taken}
            />
            <Text
              style={[
                styles.actionBtnText,
                { color: status === 'taken' ? '#FFFFFF' : Colors.taken },
              ]}
            >
              {status === 'taken' ? 'Taken ✓' : 'Mark Taken'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              status === 'delayed' ? styles.actionBtnActiveDelayed : styles.actionBtnDelayed,
            ]}
            onPress={() => onMark('delayed')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="time-outline"
              size={16}
              color={status === 'delayed' ? '#FFFFFF' : Colors.delayed}
            />
            <Text
              style={[
                styles.actionBtnText,
                { color: status === 'delayed' ? '#FFFFFF' : Colors.delayed },
              ]}
            >
              {status === 'delayed' ? 'Delayed' : 'Delay / Snooze'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              status === 'missed' ? styles.actionBtnActiveMissed : styles.actionBtnMissed,
            ]}
            onPress={() => onMark('missed')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="close"
              size={16}
              color={status === 'missed' ? '#FFFFFF' : Colors.missed}
            />
            <Text
              style={[
                styles.actionBtnText,
                { color: status === 'missed' ? '#FFFFFF' : Colors.missed },
              ]}
            >
              {status === 'missed' ? 'Missed ✕' : 'Missed'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    padding: Spacing.md,
    marginBottom: Spacing.sm + 4,
    ...Shadows.subtle,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  dosageBadge: {
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  dosageText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  foodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  foodText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  stockLowBadge: {
    backgroundColor: Colors.warningMuted,
  },
  stockText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  stockLowText: {
    color: Colors.warning,
    fontWeight: '600',
  },
  statusArea: {
    alignItems: 'flex-end',
    gap: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
    fontSize: 13,
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
    fontWeight: '600',
    fontSize: 11,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.sm + 4,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  actionBtnTaken: {
    backgroundColor: Colors.takenBg,
    borderColor: Colors.takenBorder,
  },
  actionBtnActiveTaken: {
    backgroundColor: Colors.taken,
    borderColor: Colors.taken,
  },
  actionBtnDelayed: {
    backgroundColor: Colors.delayedBg,
    borderColor: Colors.delayedBorder,
  },
  actionBtnActiveDelayed: {
    backgroundColor: Colors.delayed,
    borderColor: Colors.delayed,
  },
  actionBtnMissed: {
    backgroundColor: Colors.missedBg,
    borderColor: Colors.missedBorder,
  },
  actionBtnActiveMissed: {
    backgroundColor: Colors.missed,
    borderColor: Colors.missed,
  },
  actionBtnText: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 12,
  },
});
