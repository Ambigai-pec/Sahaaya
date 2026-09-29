import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useMedicationStore } from '../../store/medicationStore';
import { useNotificationStore } from '../../store/notificationStore';
import AppShell from '../../components/AppShell';

export default function Reminder() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { todayDoses, markDose, missedThisWeek } = useMedicationStore();
  const { addNotification } = useNotificationStore();
  const [snoozed, setSnoozed] = useState(false);
  const [responded, setResponded] = useState(false);

  // Find the first pending dose or use params
  const doseId = (params.doseId as string) || todayDoses.find((d) => d.status === 'pending')?.id || '';
  const dose = todayDoses.find((d) => d.id === doseId) || todayDoses[0];
  const medName = dose?.medicationName || (params.medName as string) || 'Metformin 500mg';
  const dosage = (params.dosage as string) || '1 tablet (500 mg)';
  const time = dose?.scheduledTime || (params.time as string) || '08:00 AM';

  const handleTaken = () => {
    if (doseId) markDose(doseId, 'taken');
    addNotification({
      title: 'Medication Taken ✓',
      body: `${medName} recorded as taken. Stock updated.`,
      type: 'medication_reminder',
      severity: 'info',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    setResponded(true);
    setTimeout(() => router.replace('/(patient)/home'), 1200);
  };

  const handleSnooze = () => {
    if (doseId) markDose(doseId, 'delayed');
    setSnoozed(true);
    addNotification({
      title: 'Reminder Snoozed',
      body: `You will be reminded about ${medName} in 30 minutes.`,
      type: 'medication_reminder',
      severity: 'info',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    setTimeout(() => router.replace('/(patient)/home'), 1200);
  };

  const handleMissed = () => {
    if (doseId) markDose(doseId, 'missed');
    const newMissed = missedThisWeek + 1;
    addNotification({
      title: 'Dose Recorded as Missed',
      body: `${medName} dose was missed. Consult prescription directions.`,
      type: 'missed_dose',
      severity: 'warning',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    router.replace({
      pathname: '/(patient)/escalation',
      params: { missed: String(newMissed), doseId },
    });
  };

  if (responded || snoozed) {
    return (
      <AppShell title="Medication Reminder" subtitle="Status Confirmation">
        <View style={styles.feedbackContainer}>
          <View style={[styles.feedbackCircle, { backgroundColor: snoozed ? Colors.warningMuted : Colors.successMuted }]}>
            <Ionicons
              name={snoozed ? 'time' : 'checkmark-circle'}
              size={54}
              color={snoozed ? Colors.warning : Colors.success}
            />
          </View>
          <Text style={styles.feedbackTitle}>
            {snoozed ? 'Reminder Snoozed' : 'Dose Recorded as Taken!'}
          </Text>
          <Text style={styles.feedbackSub}>
            {snoozed ? 'Sahaaya will remind you again in 30 minutes.' : 'Adherence and inventory records updated.'}
          </Text>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell title="Medication Reminder" subtitle="Scheduled Treatment Alert">
      <View style={styles.outerContainer}>
        <View style={styles.reminderCard}>
          {/* Top Pill Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="medical" size={32} color={Colors.primary} />
          </View>

          {/* Heading */}
          <View style={styles.alertTag}>
            <Ionicons name="alarm-outline" size={13} color={Colors.primaryDark} />
            <Text style={styles.alertTagText}>SCHEDULED DOSE ALERT</Text>
          </View>

          <Text style={styles.promptText}>It's time to take your medication</Text>

          {/* Medication details box */}
          <View style={styles.medBox}>
            <Text style={styles.medName}>{medName}</Text>
            <Text style={styles.dosageText}>{dosage} · Scheduled for {time}</Text>
            <View style={styles.foodTag}>
              <Ionicons name="restaurant-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.foodTagText}>Take after food with water</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsGrid}>
            {/* 1. Mark as Taken */}
            <TouchableOpacity style={styles.takenBtn} onPress={handleTaken} activeOpacity={0.8}>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.takenBtnText}>I Have Taken This Dose</Text>
                <Text style={styles.takenBtnSub}>Update adherence and reduce stock count</Text>
              </View>
            </TouchableOpacity>

            {/* 2. Remind me later / Snooze */}
            <TouchableOpacity style={styles.snoozeBtn} onPress={handleSnooze} activeOpacity={0.8}>
              <Ionicons name="time-outline" size={18} color={Colors.warning} />
              <View style={{ flex: 1 }}>
                <Text style={styles.snoozeBtnText}>Remind Me Later (30 mins)</Text>
                <Text style={styles.snoozeBtnSub}>Postpone reminder without marking missed</Text>
              </View>
            </TouchableOpacity>

            {/* 3. Missed dose */}
            <TouchableOpacity style={styles.missedBtn} onPress={handleMissed} activeOpacity={0.8}>
              <Ionicons name="close-circle-outline" size={18} color={Colors.error} />
              <View style={{ flex: 1 }}>
                <Text style={styles.missedBtnText}>I Missed This Dose</Text>
                <Text style={styles.missedBtnSub}>Record missed event & check support escalation</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  reminderCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    maxWidth: 520,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.elevated,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  alertTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xs,
  },
  alertTagText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 0.6,
  },
  promptText: {
    ...Typography.heading2,
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  medBox: {
    width: '100%',
    backgroundColor: Colors.backgroundSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  medName: {
    ...Typography.heading3,
    fontSize: 18,
    color: Colors.primaryDark,
  },
  dosageText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  foodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  foodTagText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  actionsGrid: {
    width: '100%',
    gap: Spacing.sm,
  },
  takenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.taken,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.subtle,
  },
  takenBtnText: {
    ...Typography.button,
    color: '#FFFFFF',
    fontSize: 14,
  },
  takenBtnSub: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
  },
  snoozeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.warningMuted,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
    paddingVertical: 11,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  snoozeBtnText: {
    ...Typography.button,
    color: Colors.warning,
    fontSize: 14,
  },
  snoozeBtnSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  missedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.errorMuted,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    paddingVertical: 11,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  missedBtnText: {
    ...Typography.button,
    color: Colors.error,
    fontSize: 14,
  },
  missedBtnSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  feedbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  feedbackCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  feedbackTitle: {
    ...Typography.heading2,
    color: Colors.text,
    textAlign: 'center',
  },
  feedbackSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
