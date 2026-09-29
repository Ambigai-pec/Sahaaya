import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useMedicationStore } from '../../store/medicationStore';
import { useMoodStore } from '../../store/moodStore';
import { useRiskStore } from '../../store/riskStore';
import { useNotificationStore } from '../../store/notificationStore';
import AppShell from '../../components/AppShell';
import RiskBadge from '../../components/RiskBadge';
import AlertCard from '../../components/AlertCard';
import SectionHeader from '../../components/SectionHeader';

const MOOD_EMOJIS: Record<number, string> = { 1: '😭', 2: '😔', 3: '😟', 4: '😐', 5: '🙂', 6: '😊' };

export default function CaregiverHome() {
  const router = useRouter();
  const { weeklyAdherence, missedThisWeek, todayDoses, stocks } = useMedicationStore();
  const { entries, todayEntry } = useMoodStore();
  const { currentAssessment } = useRiskStore();
  const { notifications } = useNotificationStore();

  const recentAlerts = notifications
    .filter((n) => n.severity === 'warning' || n.severity === 'critical')
    .slice(0, 3);

  const stockAlert = stocks.filter((s) => s.needsRefill || s.daysRemaining <= 5);
  const moodEmoji = todayEntry ? MOOD_EMOJIS[todayEntry.moodScore] : '—';
  const moodLabel = todayEntry?.moodLabel || 'Not logged';
  const priority = currentAssessment?.supportPriority || 'moderate';

  const handleSendMessage = () => {
    Alert.alert('Send Encouragement to Radha', 'Choose a supportive reach-out message:', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send "Thinking of you, hope you took your Metformin 💙"',
        onPress: () => {
          Alert.alert('✅ Message Sent', 'Radha will see your encouragement on her Sahaaya dashboard.');
        },
      },
    ]);
  };

  return (
    <AppShell title="Caregiver Console" subtitle="Remote Family Clinical & Behavioral Monitoring">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Caregiver Profile Banner */}
        <View style={styles.caregiverBanner}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Meena</Text>
            <Text style={styles.roleSub}>Primary Family Caregiver · Daughter of Radha</Text>
          </View>
          <View style={styles.activeMonitoringTag}>
            <View style={styles.greenPulseDot} />
            <Text style={styles.monitoringText}>Live Remote Sync</Text>
          </View>
        </View>

        {/* Section: Patients Requiring Attention */}
        <SectionHeader
          title="Patients Requiring Attention"
          subtitle="Monitored family members with behavioral or adherence alerts"
          icon="people-outline"
        />

        <View style={styles.patientCard}>
          {/* Top Patient Header */}
          <View style={styles.patientHeader}>
            <View style={styles.patientAvatarBox}>
              <Text style={styles.patientAvatarText}>R</Text>
            </View>
            <View style={styles.patientMainInfo}>
              <View style={styles.patientNameRow}>
                <Text style={styles.patientName}>Radha</Text>
                <Text style={styles.patientAge}>Age 65 · Mother</Text>
              </View>
              <Text style={styles.conditionSub}>Type 2 Diabetes, Hypertension</Text>
            </View>
            <RiskBadge level={priority} size="default" />
          </View>

          {/* Explainable Attention Reason Box */}
          <View style={styles.attentionReasonBox}>
            <View style={styles.attentionReasonHeader}>
              <Ionicons name="information-circle" size={14} color={Colors.primary} />
              <Text style={styles.attentionReasonTitle}>Why attention is recommended:</Text>
            </View>
            {currentAssessment?.factors ? (
              currentAssessment.factors.slice(0, 3).map((f, i) => (
                <View key={i} style={styles.reasonBulletRow}>
                  <View style={styles.reasonDot} />
                  <Text style={styles.reasonText}>{f}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.reasonText}>Mild adherence variance detected this week.</Text>
            )}
          </View>

          {/* Clinical KPIs Grid */}
          <View style={styles.kpisGrid}>
            <View style={styles.kpiCell}>
              <Text
                style={[
                  styles.kpiVal,
                  { color: weeklyAdherence >= 80 ? Colors.success : weeklyAdherence >= 60 ? Colors.warning : Colors.error },
                ]}
              >
                {weeklyAdherence}%
              </Text>
              <Text style={styles.kpiLbl}>Adherence (7d)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.kpiCell}>
              <Text style={[styles.kpiVal, missedThisWeek > 0 && { color: Colors.error }]}>
                {missedThisWeek}
              </Text>
              <Text style={styles.kpiLbl}>Missed Doses</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.kpiCell}>
              <Text style={styles.kpiVal}>{moodEmoji} {moodLabel}</Text>
              <Text style={styles.kpiLbl}>Today's Mood</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.kpiCell}>
              <Text style={[styles.kpiVal, stockAlert.length > 0 && { color: Colors.warning }]}>
                {stockAlert.length > 0 ? `${Math.floor(stockAlert[0].daysRemaining)} d` : 'Adequate'}
              </Text>
              <Text style={styles.kpiLbl}>Stock Health</Text>
            </View>
          </View>

          {/* Today's Medication Mini Summary */}
          <View style={styles.dosesMiniSection}>
            <Text style={styles.dosesMiniHeader}>TODAY'S SCHEDULE STATUS</Text>
            <View style={styles.dosesMiniList}>
              {todayDoses.map((d) => (
                <View key={d.id} style={styles.dosePill}>
                  <Text style={styles.dosePillTime}>{d.scheduledTime}</Text>
                  <Text style={styles.dosePillName}>{d.medicationName}</Text>
                  <View
                    style={[
                      styles.doseStatusDot,
                      {
                        backgroundColor:
                          d.status === 'taken'
                            ? Colors.taken
                            : d.status === 'missed'
                            ? Colors.missed
                            : Colors.warning,
                      },
                    ]}
                  />
                  <Text style={styles.dosePillStatus}>
                    {d.status.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.actionBtnOutline}
              onPress={handleSendMessage}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-outline" size={15} color={Colors.primary} />
              <Text style={styles.actionBtnOutlineText}>Send Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={() => router.push('/(caregiver)/patient-detail')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnPrimaryText}>Full Patient Record</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Active Alerts */}
        <SectionHeader
          title="Recent Clinical Alerts"
          subtitle="Automated adherence, stock, and distress signals"
          actionText="All Alerts"
          onAction={() => router.push('/(caregiver)/alerts')}
          icon="warning-outline"
        />

        {recentAlerts.length === 0 ? (
          <View style={styles.emptyAlertsCard}>
            <Ionicons name="checkmark-circle-outline" size={32} color={Colors.success} />
            <Text style={styles.emptyAlertsTitle}>No Critical Alerts Active</Text>
            <Text style={styles.emptyAlertsSub}>Radha's health and adherence are within safe monitoring thresholds.</Text>
          </View>
        ) : (
          recentAlerts.map((n) => (
            <AlertCard
              key={n.id}
              title={n.title}
              description={n.body}
              severity={n.severity}
              patient="Radha"
              time={new Date(n.createdAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              recommendation={
                n.type === 'missed_dose'
                  ? 'Contact Radha to check in and verify she took her prescription with water.'
                  : n.type === 'refill'
                  ? 'Arrange medicine delivery or visit pharmacy for Metformin replenishment.'
                  : 'Reach out with emotional support.'
              }
              actionLabel="Review Alert"
              onPressAction={() => router.push('/(caregiver)/alerts')}
            />
          ))
        )}
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
  caregiverBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  greeting: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.text,
  },
  roleSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  activeMonitoringTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.successMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.successBorder,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  monitoringText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  patientCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.sm,
  },
  patientAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  patientAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  patientMainInfo: {
    flex: 1,
  },
  patientNameRow: {
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
  conditionSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  attentionReasonBox: {
    backgroundColor: Colors.primarySurface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
    marginBottom: Spacing.md,
  },
  attentionReasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  attentionReasonTitle: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  reasonBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 2,
  },
  reasonDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  reasonText: {
    ...Typography.bodySmall,
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 17,
  },
  kpisGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSubtle,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  kpiCell: {
    flex: 1,
    alignItems: 'center',
  },
  kpiVal: {
    ...Typography.heading3,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  kpiLbl: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  dosesMiniSection: {
    marginBottom: Spacing.md,
  },
  dosesMiniHeader: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  dosesMiniList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dosePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  dosePillTime: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 11,
    color: Colors.text,
  },
  dosePillName: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  doseStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dosePillStatus: {
    ...Typography.caption,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  actionBtnOutlineText: {
    ...Typography.buttonSmall,
    color: Colors.primary,
    fontSize: 12,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
  },
  actionBtnPrimaryText: {
    ...Typography.buttonSmall,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  emptyAlertsCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyAlertsTitle: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  emptyAlertsSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
});
