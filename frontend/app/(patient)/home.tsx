import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useGreeting } from '../../hooks/useGreeting';
import { useAuthStore } from '../../store/authStore';
import { useMedicationStore } from '../../store/medicationStore';
import { useRiskStore } from '../../store/riskStore';
import { useMoodStore } from '../../store/moodStore';
import AppShell from '../../components/AppShell';
import MedicationCard from '../../components/MedicationCard';
import SectionHeader from '../../components/SectionHeader';
import SupportPriorityCard from '../../components/SupportPriorityCard';
import ProgressRing from '../../components/ProgressRing';

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const greeting = useGreeting(user?.name || 'Radha');
  const { todayDoses, markDose, weeklyAdherence, missedThisWeek, stocks } = useMedicationStore();
  const { currentAssessment } = useRiskStore();
  const { todayEntry, entries } = useMoodStore();

  useEffect(() => {
    if (todayDoses.length === 0) {
      useMedicationStore.getState().loadDemoData();
    }
    if (!currentAssessment) {
      useRiskStore.getState().loadDemoData();
    }
  }, []);

  const handleMarkDose = (doseId: string, status: 'taken' | 'missed' | 'delayed') => {
    markDose(doseId, status);
    if (status === 'missed') {
      const nextMissed = missedThisWeek + 1;
      router.push({ pathname: '/(patient)/escalation', params: { missed: String(nextMissed) } });
    }
  };

  const lowStock = stocks.find(s => s.needsRefill || s.daysRemaining <= 5);
  const takenCount = todayDoses.filter(d => d.status === 'taken').length;
  const totalCount = todayDoses.length;

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <AppShell title="Patient Dashboard" subtitle="Daily Care & Wellness Overview">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Greeting & Date Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroGreeting}>{greeting}</Text>
            <Text style={styles.heroDate}>{todayFormatted}</Text>
          </View>
          <View style={styles.patientTag}>
            <Ionicons name="medical" size={13} color={Colors.primary} />
            <Text style={styles.patientTagText}>Radha · Age 65</Text>
          </View>
        </View>

        {/* Primary Health Adherence Summary Widget */}
        <View style={styles.adherenceWidget}>
          <View style={styles.widgetHeader}>
            <View>
              <Text style={styles.widgetTitle}>Health Adherence Overview</Text>
              <Text style={styles.widgetSub}>7-day active treatment monitoring</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(patient)/dashboard')} activeOpacity={0.7}>
              <Text style={styles.analyticsLink}>View Analytics →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.widgetBody}>
            <View style={styles.ringWrapper}>
              <ProgressRing percentage={weeklyAdherence} size={78} />
              <Text style={styles.ringCaption}>Weekly Rate</Text>
            </View>

            <View style={styles.dividerVertical} />

            <View style={styles.kpiGrid}>
              <View style={styles.kpiItem}>
                <Text style={styles.kpiValue}>
                  {takenCount}/{totalCount}
                </Text>
                <Text style={styles.kpiLabel}>Taken Today</Text>
              </View>
              <View style={styles.kpiItem}>
                <Text style={[styles.kpiValue, missedThisWeek > 0 && { color: Colors.error }]}>
                  {missedThisWeek}
                </Text>
                <Text style={styles.kpiLabel}>Missed This Week</Text>
              </View>
              <View style={styles.kpiItem}>
                <Text style={styles.kpiValue}>
                  {todayEntry ? todayEntry.moodLabel : 'Pending'}
                </Text>
                <Text style={styles.kpiLabel}>Today's Mood</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Explainable Support Priority Card */}
        <SupportPriorityCard
          priority={currentAssessment?.supportPriority || 'moderate'}
          factors={currentAssessment?.factors || [
            'Missed 4 doses this week.',
            'Adherence is low at 68.0%.',
            'Consecutive low mood entries (2 days).',
            'Medicine stock is low (5.0 days remaining).',
          ]}
        />

        {/* Interactive Medication Reminder Demo Simulation Banner */}
        <TouchableOpacity
          style={styles.simulateBanner}
          onPress={() => router.push('/(patient)/reminder')}
          activeOpacity={0.8}
        >
          <View style={styles.simulateIconBox}>
            <Ionicons name="alarm" size={20} color={Colors.primary} />
          </View>
          <View style={styles.simulateTextContainer}>
            <View style={styles.simulateTitleRow}>
              <Text style={styles.simulateTitle}>Medication Reminder Simulation</Text>
              <View style={styles.demoPill}>
                <Text style={styles.demoPillText}>INTERACTIVE</Text>
              </View>
            </View>
            <Text style={styles.simulateSub}>
              Tap to simulate an incoming Metformin reminder modal & escalation test
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
        </TouchableOpacity>

        {/* Low Stock Warning Banner if applicable */}
        {lowStock && (
          <TouchableOpacity
            style={styles.stockWarningBanner}
            onPress={() => router.push('/(patient)/stock')}
            activeOpacity={0.8}
          >
            <Ionicons name="warning" size={18} color={Colors.warning} />
            <View style={styles.stockWarningTextContainer}>
              <Text style={styles.stockWarningTitle}>
                Refill Alert: {lowStock.medicationName}
              </Text>
              <Text style={styles.stockWarningSub}>
                Only {Math.floor(lowStock.daysRemaining)} days remaining. Tap to arrange inventory refill.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.warning} />
          </TouchableOpacity>
        )}

        {/* Today's Medications Section */}
        <SectionHeader
          title="Today's Medication Schedule"
          subtitle="Record timely consumption or delay"
          actionText="All Medicines"
          onAction={() => router.push('/(patient)/medications')}
          icon="medical-outline"
        />

        {todayDoses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-done-circle-outline" size={32} color={Colors.success} />
            <Text style={styles.emptyTitle}>No Pending Medications Today</Text>
            <Text style={styles.emptySub}>All scheduled treatments have been recorded.</Text>
          </View>
        ) : (
          todayDoses.map((dose) => (
            <MedicationCard
              key={dose.id}
              name={dose.medicationName}
              dosage="1 tablet"
              time={dose.scheduledTime}
              status={dose.status}
              foodInstruction="after"
              remainingStock={stocks.find(s => s.medicationName === dose.medicationName)?.remainingTablets}
              onMark={(status) => handleMarkDose(dose.id, status)}
            />
          ))
        )}

        {/* Mental Well-Being Summary Card */}
        <SectionHeader
          title="Mental Well-Being"
          subtitle="Emotional self-reflection and coping check-in"
          actionText="View History"
          onAction={() => router.push('/(patient)/wellbeing')}
          icon="heart-outline"
        />

        <View style={styles.moodCard}>
          <View style={styles.moodHeader}>
            <View style={styles.moodStatusArea}>
              <Text style={styles.moodStatusLabel}>Current State</Text>
              <Text style={styles.moodStatusValue}>
                {todayEntry ? `${todayEntry.moodLabel}` : 'Not logged today'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.moodBtn}
              onPress={() => router.push('/(patient)/mood')}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.moodBtnText}>
                {todayEntry ? 'Review Mood' : 'Log Daily Mood'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.moodHelperText}>
            Regular check-ins help detect subtle stress trends and provide early coping guidance.
          </Text>
        </View>

        {/* Quick Action Navigation Grid */}
        <SectionHeader title="Quick Actions & Services" icon="grid-outline" />
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(patient)/stock')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIconBox, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="cube-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.quickTitle}>Medicine Stock</Text>
            <Text style={styles.quickSub}>Inventory & Refills</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(patient)/dashboard')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIconBox, { backgroundColor: Colors.secondaryMuted }]}>
              <Ionicons name="stats-chart-outline" size={20} color={Colors.secondary} />
            </View>
            <Text style={styles.quickTitle}>Health Analytics</Text>
            <Text style={styles.quickSub}>Adherence reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(patient)/companion')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="chatbubbles-outline" size={20} color="#7E22CE" />
            </View>
            <Text style={styles.quickTitle}>AI Companion</Text>
            <Text style={styles.quickSub}>4-7-8 Breathing & tips</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { borderColor: Colors.errorBorder }]}
            onPress={() => router.push('/(patient)/emergency')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIconBox, { backgroundColor: Colors.errorMuted }]}>
              <Ionicons name="shield-outline" size={20} color={Colors.error} />
            </View>
            <Text style={[styles.quickTitle, { color: Colors.error }]}>Emergency SOS</Text>
            <Text style={styles.quickSub}>Helplines & Caregiver</Text>
          </TouchableOpacity>
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
  heroBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroGreeting: {
    ...Typography.heading1,
    color: Colors.text,
  },
  heroDate: {
    ...Typography.caption,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  patientTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  patientTagText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.primaryDark,
    fontSize: 11,
  },
  adherenceWidget: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  widgetTitle: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
  },
  widgetSub: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
  },
  analyticsLink: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
    fontSize: 12,
  },
  widgetBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  ringWrapper: {
    alignItems: 'center',
    paddingRight: Spacing.md,
  },
  ringCaption: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  dividerVertical: {
    width: 1,
    height: 50,
    backgroundColor: Colors.borderLight,
    marginRight: Spacing.md,
  },
  kpiGrid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kpiItem: {
    alignItems: 'center',
    flex: 1,
  },
  kpiValue: {
    ...Typography.heading3,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  kpiLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  simulateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  simulateIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 2,
  },
  simulateTextContainer: {
    flex: 1,
  },
  simulateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  simulateTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontSize: 13,
  },
  demoPill: {
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  demoPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  simulateSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  stockWarningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningMuted,
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  stockWarningTextContainer: {
    flex: 1,
  },
  stockWarningTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.warning,
    fontSize: 13,
  },
  stockWarningSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  emptySub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  moodCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  moodStatusArea: {
    flex: 1,
  },
  moodStatusLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  moodStatusValue: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
    marginTop: 1,
  },
  moodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 7,
    borderRadius: BorderRadius.sm,
  },
  moodBtnText: {
    ...Typography.buttonSmall,
    color: '#FFFFFF',
    fontSize: 12,
  },
  moodHelperText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  quickIconBox: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  quickTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.text,
    fontSize: 13,
  },
  quickSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
});
