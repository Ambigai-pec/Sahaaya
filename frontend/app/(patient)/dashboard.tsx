import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useMedicationStore } from '../../store/medicationStore';
import { useMoodStore } from '../../store/moodStore';
import { useRiskStore } from '../../store/riskStore';
import AppShell from '../../components/AppShell';
import RiskBadge from '../../components/RiskBadge';
import AdherenceBar from '../../components/AdherenceBar';
import SectionHeader from '../../components/SectionHeader';

const MOOD_EMOJIS: Record<number, string> = { 1: '😭', 2: '😔', 3: '😟', 4: '😐', 5: '🙂', 6: '😊' };

export default function HealthDashboard() {
  const router = useRouter();
  const { weeklyAdherence, missedThisWeek, delayedThisWeek, todayDoses, stocks } = useMedicationStore();
  const { entries } = useMoodStore();
  const { currentAssessment } = useRiskStore();

  const takenToday = todayDoses.filter((d) => d.status === 'taken').length;
  const totalToday = todayDoses.length;
  const todayAdherence = totalToday > 0 ? Math.round((takenToday / totalToday) * 100) : 0;

  const weekEntries = entries.slice(-7);
  const avgMood =
    weekEntries.length > 0
      ? weekEntries.reduce((a, b) => a + b.moodScore, 0) / weekEntries.length
      : 4;
  const avgMoodEmoji = MOOD_EMOJIS[Math.round(avgMood)] || '😐';
  const lowMoodDays = weekEntries.filter((e) => e.moodScore <= 2).length;

  const medsNeedingRefill = stocks.filter((s) => s.needsRefill || s.daysRemaining <= 5);

  const StatTile = ({
    title,
    value,
    sub,
    color,
    icon,
  }: {
    title: string;
    value: string | number;
    sub: string;
    color?: string;
    icon: keyof typeof Ionicons.glyphMap;
  }) => (
    <View style={styles.tile}>
      <View style={styles.tileHeader}>
        <Text style={styles.tileTitle}>{title}</Text>
        <Ionicons name={icon} size={15} color={color || Colors.primary} />
      </View>
      <Text style={[styles.tileValue, color ? { color } : {}]}>{value}</Text>
      <Text style={styles.tileSub}>{sub}</Text>
    </View>
  );

  return (
    <AppShell title="Health Analytics" subtitle="Comprehensive Longitudinal Clinical Summary">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top 4 KPI Tiles Grid */}
        <View style={styles.tilesGrid}>
          <StatTile
            title="Weekly Adherence"
            value={`${weeklyAdherence}%`}
            sub="Past 7 days"
            color={weeklyAdherence >= 80 ? Colors.success : weeklyAdherence >= 60 ? Colors.warning : Colors.error}
            icon="medical-outline"
          />
          <StatTile
            title="Missed Doses"
            value={missedThisWeek}
            sub="Events this week"
            color={missedThisWeek > 0 ? Colors.error : Colors.success}
            icon="alert-circle-outline"
          />
          <StatTile
            title="Average Mood"
            value={`${avgMood.toFixed(1)} / 6`}
            sub={`${avgMoodEmoji} 7-day average`}
            color={Colors.primary}
            icon="heart-outline"
          />
          <StatTile
            title="Refills Due"
            value={medsNeedingRefill.length}
            sub="Medications low"
            color={medsNeedingRefill.length > 0 ? Colors.warning : Colors.success}
            icon="cube-outline"
          />
        </View>

        {/* Medication Analytics Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderTitleArea}>
              <Ionicons name="medical" size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>Medication Adherence Metrics</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(patient)/medications')}>
              <Text style={styles.cardLink}>View Schedule →</Text>
            </TouchableOpacity>
          </View>

          {/* Today's breakdown */}
          <Text style={styles.rowLabel}>TODAY'S COMPLETION RATE</Text>
          <AdherenceBar percentage={todayAdherence} height={10} showLabel />
          <Text style={styles.metricDetail}>
            {takenToday} of {totalToday} doses successfully taken today ({todayAdherence}%)
          </Text>

          <View style={styles.divider} />

          {/* Metrics summary list */}
          <View style={styles.metricsList}>
            <View style={styles.metricRow}>
              <Text style={styles.metricRowLabel}>7-Day Overall Adherence</Text>
              <Text style={[styles.metricRowVal, { color: Colors.primary }]}>{weeklyAdherence}%</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricRowLabel}>Missed Doses (Past Week)</Text>
              <Text style={[styles.metricRowVal, missedThisWeek > 0 && { color: Colors.error }]}>
                {missedThisWeek}
              </Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricRowLabel}>Delayed / Snoozed Doses</Text>
              <Text style={styles.metricRowVal}>{delayedThisWeek}</Text>
            </View>
          </View>
        </View>

        {/* Support Priority & Behavioral Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderTitleArea}>
              <Ionicons name="shield-checkmark" size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>Support Priority & Risk Assessment</Text>
            </View>
            <RiskBadge level={currentAssessment?.supportPriority || 'moderate'} size="small" />
          </View>

          <Text style={styles.riskDescription}>
            Sahaaya's multi-factor behavioral analysis continuously weighs missed doses, delayed schedules,
            self-reported mood patterns, and pharmacy inventory to compute support priority.
          </Text>

          {currentAssessment?.factors && currentAssessment.factors.length > 0 && (
            <View style={styles.factorsBox}>
              <Text style={styles.factorsBoxTitle}>Active Determinants:</Text>
              {currentAssessment.factors.map((factor, idx) => (
                <View key={idx} style={styles.factorRow}>
                  <View style={styles.factorDot} />
                  <Text style={styles.factorText}>{factor}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Mental Health & Well-being Trends Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderTitleArea}>
              <Ionicons name="heart" size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>Well-Being & Coping Analysis</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(patient)/wellbeing')}>
              <Text style={styles.cardLink}>Detailed Timeline →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricsList}>
            <View style={styles.metricRow}>
              <Text style={styles.metricRowLabel}>7-Day Mood Average</Text>
              <Text style={styles.metricRowVal}>{avgMoodEmoji} {avgMood.toFixed(1)} / 6.0</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricRowLabel}>Low Mood Days (≤ 2)</Text>
              <Text style={[styles.metricRowVal, lowMoodDays > 2 && { color: Colors.error }]}>
                {lowMoodDays} days
              </Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricRowLabel}>Total Check-in Entries</Text>
              <Text style={styles.metricRowVal}>{entries.length} logged</Text>
            </View>
          </View>
        </View>

        {/* Pharmacy Inventory Overview Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderTitleArea}>
              <Ionicons name="cube" size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>Medication Inventory Status</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(patient)/stock')}>
              <Text style={styles.cardLink}>Stock Management →</Text>
            </TouchableOpacity>
          </View>

          {stocks.map((s) => {
            const isLow = s.needsRefill || s.daysRemaining <= 5;
            return (
              <View key={s.medicationId} style={styles.stockItemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stockItemName}>{s.medicationName}</Text>
                  <Text style={styles.stockItemSub}>
                    {s.remainingTablets} tablets remaining · {s.dailyConsumption}/day
                  </Text>
                </View>
                <View style={styles.stockItemRight}>
                  <Text style={[styles.stockItemDays, isLow && { color: Colors.warning }]}>
                    {Math.floor(s.daysRemaining)} days
                  </Text>
                  <Text style={[styles.stockItemStatus, { color: isLow ? Colors.warning : Colors.success }]}>
                    {isLow ? 'Refill Soon' : 'Adequate'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tile: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tileTitle: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  tileValue: {
    ...Typography.heading2,
    fontSize: 20,
    color: Colors.text,
    marginVertical: 2,
  },
  tileSub: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  cardHeaderTitleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
  },
  cardLink: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
    fontSize: 12,
  },
  rowLabel: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  metricDetail: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  metricsList: {
    gap: Spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricRowLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  metricRowVal: {
    ...Typography.heading3,
    fontSize: 14,
    color: Colors.text,
  },
  riskDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: Spacing.sm,
  },
  factorsBox: {
    backgroundColor: Colors.backgroundSubtle,
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  factorsBoxTitle: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 3,
  },
  factorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  factorText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  stockItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  stockItemName: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
  stockItemSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  stockItemRight: {
    alignItems: 'flex-end',
  },
  stockItemDays: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 12,
    color: Colors.text,
  },
  stockItemStatus: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
});
