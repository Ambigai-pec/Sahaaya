import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useMedicationStore } from '../../store/medicationStore';
import { useRiskStore } from '../../store/riskStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useMoodStore } from '../../store/moodStore';
import AppShell from '../../components/AppShell';
import MedicationCard from '../../components/MedicationCard';
import SectionHeader from '../../components/SectionHeader';
import PrimaryButton from '../../components/PrimaryButton';

export default function Medications() {
  const router = useRouter();
  const {
    medications, todayDoses, markDose, stocks,
    weeklyAdherence, missedThisWeek, delayedThisWeek,
  } = useMedicationStore();
  const { runAssessment } = useRiskStore();
  const { addNotification } = useNotificationStore();
  const { entries } = useMoodStore();

  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');

  const handleMark = (doseId: string, status: 'taken' | 'missed' | 'delayed') => {
    const dose = todayDoses.find(d => d.id === doseId);
    if (!dose) return;

    Alert.alert(
      status === 'taken' ? '✓ Confirm Taken' : status === 'missed' ? '✕ Record as Missed' : '⏰ Delay Dose',
      `Record ${dose.medicationName} (${dose.scheduledTime}) as ${status}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: status === 'missed' ? 'destructive' : 'default',
          onPress: () => {
            markDose(doseId, status);

            if (status === 'taken') {
              addNotification({
                title: 'Medication Taken ✓',
                body: `${dose.medicationName} marked as taken. Inventory updated.`,
                type: 'medication_reminder',
                severity: 'info',
                isRead: false,
                createdAt: new Date().toISOString(),
              });
            } else if (status === 'missed') {
              addNotification({
                title: 'Dose Missed Alert',
                body: `${dose.medicationName} missed. Follow prescription schedule carefully.`,
                type: 'missed_dose',
                severity: 'warning',
                isRead: false,
                createdAt: new Date().toISOString(),
              });

              // Re-run risk assessment
              const newMissed = missedThisWeek + 1;
              const moodScores = entries.slice(-7).map(e => e.moodScore);
              const minStock = Math.min(...(stocks.map(s => s.daysRemaining) || [99]));
              runAssessment({
                missedDosesWeek: newMissed,
                delayedDosesWeek: delayedThisWeek,
                adherencePct: Math.max(0, weeklyAdherence - 5),
                moodScoresWeek: moodScores,
                minDaysRemainingStock: minStock,
                negativeMoodStreak: 0,
              });

              // Navigate to escalation if multiple missed
              if (newMissed >= 2) {
                setTimeout(() => {
                  router.push({ pathname: '/(patient)/escalation', params: { missed: String(newMissed) } });
                }, 400);
              }
            } else {
              addNotification({
                title: 'Dose Delayed',
                body: `${dose.medicationName} marked as delayed.`,
                type: 'medication_reminder',
                severity: 'info',
                isRead: false,
                createdAt: new Date().toISOString(),
              });
            }
          },
        },
      ]
    );
  };

  const takenCount = todayDoses.filter(d => d.status === 'taken').length;
  const pendingCount = todayDoses.filter(d => d.status === 'pending').length;

  return (
    <AppShell title="Medication Management" subtitle="Active Prescriptions & Today's Schedule">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Summary Banner */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryTitle}>Adherence Statistics</Text>
              <Text style={styles.summarySub}>7-day active treatment monitoring</Text>
            </View>
            <TouchableOpacity
              style={styles.addMedBtn}
              onPress={() => router.push('/(patient)/add-medication')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.addMedBtnText}>Add Medication</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: Colors.primary }]}>{weeklyAdherence}%</Text>
              <Text style={styles.statLbl}>Weekly Adherence</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: Colors.taken }]}>{takenCount}</Text>
              <Text style={styles.statLbl}>Taken Today</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: pendingCount > 0 ? Colors.warning : Colors.textMuted }]}>
                {pendingCount}
              </Text>
              <Text style={styles.statLbl}>Pending Today</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={[styles.statVal, missedThisWeek > 0 && { color: Colors.error }]}>
                {missedThisWeek}
              </Text>
              <Text style={styles.statLbl}>Missed (7d)</Text>
            </View>
          </View>
        </View>

        {/* Tab Filter Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'today' && styles.tabBtnActive]}
            onPress={() => setActiveTab('today')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="calendar-outline"
              size={15}
              color={activeTab === 'today' ? Colors.primary : Colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>
              Today's Schedule ({todayDoses.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="list-outline"
              size={15}
              color={activeTab === 'all' ? Colors.primary : Colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All Prescriptions ({medications.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Today's Schedule */}
        {activeTab === 'today' && (
          <View>
            <SectionHeader
              title="Today's Doses"
              subtitle="Mark doses as they are taken to keep adherence records current"
              icon="time-outline"
            />
            {todayDoses.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle-outline" size={40} color={Colors.success} />
                <Text style={styles.emptyTitle}>No Scheduled Doses</Text>
                <Text style={styles.emptyText}>All prescribed doses for today are completed.</Text>
              </View>
            ) : (
              todayDoses.map((dose) => (
                <MedicationCard
                  key={dose.id}
                  name={dose.medicationName}
                  dosage="1 tablet"
                  time={dose.scheduledTime}
                  status={dose.status}
                  remainingStock={stocks.find(s => s.medicationName === dose.medicationName)?.remainingTablets}
                  onMark={(status) => handleMark(dose.id, status)}
                />
              ))
            )}
          </View>
        )}

        {/* Tab 2: All Prescriptions */}
        {activeTab === 'all' && (
          <View>
            <SectionHeader
              title="Prescribed Treatments"
              subtitle="Registered chronic care regimens"
              icon="medical-outline"
            />
            {medications.map((med) => {
              const stock = stocks.find(s => s.medicationId === med.id);
              const isLow = stock && stock.daysRemaining <= 5;
              return (
                <View key={med.id} style={styles.medDetailCard}>
                  <View style={styles.medDetailHeader}>
                    <View style={styles.medDetailIconBox}>
                      <Ionicons name="medical" size={20} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.medDetailName}>{med.name}</Text>
                      <Text style={styles.medDetailDosage}>{med.dosage} · {med.frequency}</Text>
                    </View>
                    {isLow && (
                      <View style={styles.lowBadge}>
                        <Ionicons name="warning" size={11} color={Colors.warning} />
                        <Text style={styles.lowBadgeText}>Refill Soon</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.medMetaRow}>
                    <View style={styles.metaCol}>
                      <Text style={styles.metaLabel}>Scheduled Times</Text>
                      <Text style={styles.metaVal}>{med.times.join(', ')}</Text>
                    </View>
                    <View style={styles.metaCol}>
                      <Text style={styles.metaLabel}>Food Instructions</Text>
                      <Text style={styles.metaVal}>{med.foodInstruction} food</Text>
                    </View>
                    <View style={styles.metaCol}>
                      <Text style={styles.metaLabel}>Inventory</Text>
                      <Text style={[styles.metaVal, isLow && { color: Colors.warning, fontWeight: '700' }]}>
                        {stock ? `${stock.remainingTablets} tabs` : '—'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Simulation Reminder Shortcut */}
        <TouchableOpacity
          style={styles.simBox}
          onPress={() => router.push('/(patient)/reminder')}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={18} color={Colors.primary} />
          <Text style={styles.simText}>Open Interactive Reminder Modal Simulation →</Text>
        </TouchableOpacity>
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
  summaryCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  summaryTitle: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
  },
  summarySub: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
  },
  addMedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  addMedBtnText: {
    ...Typography.buttonSmall,
    color: '#FFFFFF',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    ...Typography.heading3,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  statLbl: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderLight,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm - 2,
  },
  tabBtnActive: {
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  tabText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  emptyText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  medDetailCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm + 2,
    ...Shadows.subtle,
  },
  medDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  medDetailIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medDetailName: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
  },
  medDetailDosage: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
  },
  lowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warningMuted,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  lowBadgeText: {
    ...Typography.caption,
    color: Colors.warning,
    fontWeight: '700',
    fontSize: 10,
  },
  medMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
  },
  metaVal: {
    ...Typography.bodySmall,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 1,
  },
  simBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  simText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontSize: 12,
  },
});
