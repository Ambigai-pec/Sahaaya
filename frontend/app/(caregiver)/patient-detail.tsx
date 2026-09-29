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

export default function PatientDetail() {
  const router = useRouter();
  const { medications, todayDoses, weeklyAdherence, missedThisWeek, delayedThisWeek, stocks } = useMedicationStore();
  const { entries } = useMoodStore();
  const { currentAssessment } = useRiskStore();

  const takenToday = todayDoses.filter((d) => d.status === 'taken').length;
  const weekEntries = entries.slice(-7);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken':
        return Colors.taken;
      case 'missed':
        return Colors.missed;
      case 'delayed':
        return Colors.delayed;
      default:
        return Colors.textMuted;
    }
  };

  return (
    <AppShell title="Patient Record: Radha" subtitle="Longitudinal Adherence & Clinical Details">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Link */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={16} color={Colors.primary} />
          <Text style={styles.backText}>Back to Caregiver Overview</Text>
        </TouchableOpacity>

        {/* Patient Profile Clinical Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>R</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.patientName}>Radha</Text>
                <Text style={styles.patientAge}>65 years · Female</Text>
              </View>
              <Text style={styles.patientSub}>Mother · Under Active Care of Meena</Text>
              <View style={styles.phoneRow}>
                <Ionicons name="call-outline" size={12} color={Colors.textMuted} />
                <Text style={styles.phoneText}>Emergency Contact: +91 99999 99997 (Demo)</Text>
              </View>
            </View>
            <RiskBadge level={currentAssessment?.supportPriority || 'moderate'} size="default" />
          </View>

          <View style={styles.conditionRow}>
            {['Type 2 Diabetes', 'Hypertension'].map((c) => (
              <View key={c} style={styles.conditionChip}>
                <Ionicons name="medical" size={12} color={Colors.primary} />
                <Text style={styles.conditionText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Support Priority Rationale */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Current Support Priority Rationale</Text>
          </View>
          {currentAssessment?.factors && currentAssessment.factors.length > 0 ? (
            currentAssessment.factors.map((factor, idx) => (
              <View key={idx} style={styles.factorRow}>
                <View style={styles.factorDot} />
                <Text style={styles.factorText}>{factor}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.factorText}>No active clinical warning determinants.</Text>
          )}
        </View>

        {/* Medication Adherence Analysis */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="stats-chart" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Medication Adherence (Past 7 Days)</Text>
          </View>

          <View style={styles.adherenceProgressArea}>
            <AdherenceBar percentage={weeklyAdherence} height={10} showLabel />
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: Colors.error }]}>{missedThisWeek}</Text>
              <Text style={styles.metricLbl}>Missed Doses</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: Colors.warning }]}>{delayedThisWeek}</Text>
              <Text style={styles.metricLbl}>Delayed Doses</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: Colors.success }]}>{takenToday}</Text>
              <Text style={styles.metricLbl}>Taken Today</Text>
            </View>
          </View>
        </View>

        {/* Today's Schedule Table */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Today's Prescribed Doses</Text>
          </View>

          {todayDoses.map((d) => (
            <View key={d.id} style={styles.tableRow}>
              <Text style={styles.timeCol}>{d.scheduledTime}</Text>
              <View style={styles.nameCol}>
                <Text style={styles.medColName}>{d.medicationName}</Text>
                <Text style={styles.medColDosage}>1 tablet · After food</Text>
              </View>
              <View style={[styles.statusCol, { borderColor: getStatusColor(d.status) }]}>
                <Text style={[styles.statusColText, { color: getStatusColor(d.status) }]}>
                  {d.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Medicine Inventory Overview */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cube" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Pharmacy Inventory & Depletion Forecast</Text>
          </View>

          {stocks.map((s) => {
            const isLow = s.needsRefill || s.daysRemaining <= 5;
            return (
              <View key={s.medicationId} style={styles.stockRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stockName}>{s.medicationName}</Text>
                  <Text style={styles.stockSub}>{s.remainingTablets} tablets remaining · Daily usage: {s.dailyConsumption}</Text>
                </View>
                <View style={styles.stockRight}>
                  <Text style={[styles.stockDays, isLow && { color: Colors.warning }]}>
                    {Math.floor(s.daysRemaining)} days left
                  </Text>
                  <Text style={[styles.stockStatus, { color: isLow ? Colors.warning : Colors.success }]}>
                    {isLow ? '⚠️ Refill Soon' : '✓ Adequate'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* 7-Day Mood Trend */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="heart" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Recent Emotional Well-Being</Text>
          </View>

          <View style={styles.moodsRow}>
            {weekEntries.map((e, idx) => (
              <View key={e.id || idx} style={styles.moodDayCol}>
                <Text style={styles.moodEmoji}>{MOOD_EMOJIS[e.moodScore] || '😐'}</Text>
                <Text style={styles.moodDayLabel}>{e.date ? e.date.slice(-5) : `D${idx + 1}`}</Text>
                <Text style={styles.moodScoreText}>{e.moodLabel}</Text>
              </View>
            ))}
          </View>
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
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  backText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
    fontSize: 12,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  patientName: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.text,
  },
  patientAge: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
  },
  patientSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  phoneText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  conditionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  conditionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  conditionText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.primaryDark,
    fontWeight: '600',
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
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  cardTitle: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
  },
  factorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  factorText: {
    ...Typography.bodySmall,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  adherenceProgressArea: {
    marginVertical: Spacing.xs,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
    backgroundColor: Colors.backgroundSubtle,
    borderRadius: BorderRadius.md,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricVal: {
    ...Typography.heading3,
    fontSize: 17,
    fontWeight: '700',
  },
  metricLbl: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  timeCol: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.text,
    width: 70,
  },
  nameCol: {
    flex: 1,
  },
  medColName: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
  medColDosage: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  statusCol: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  statusColText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  stockName: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
  stockSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  stockRight: {
    alignItems: 'flex-end',
  },
  stockDays: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 12,
    color: Colors.text,
  },
  stockStatus: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
  moodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xs,
  },
  moodDayCol: {
    alignItems: 'center',
    flex: 1,
  },
  moodEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  moodDayLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
  },
  moodScoreText: {
    ...Typography.caption,
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
