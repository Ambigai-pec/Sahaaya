import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useNotificationStore } from '../../store/notificationStore';
import { useMedicationStore } from '../../store/medicationStore';
import { useMoodStore } from '../../store/moodStore';
import { useRiskStore } from '../../store/riskStore';
import AppShell from '../../components/AppShell';

const ALERT_FILTERS = [
  { label: 'All Alerts', type: 'All', icon: 'layers-outline' },
  { label: 'Medication', type: 'Medication', icon: 'medical-outline' },
  { label: 'Well-being', type: 'Mood', icon: 'heart-outline' },
  { label: 'Stock & Refills', type: 'Stock', icon: 'cube-outline' },
  { label: 'Escalations', type: 'Escalation', icon: 'shield-outline' },
];

export default function CaregiverAlerts() {
  const router = useRouter();
  const { notifications, markRead, markAllRead } = useNotificationStore();
  const { missedThisWeek, stocks } = useMedicationStore();
  const { entries } = useMoodStore();
  const { currentAssessment } = useRiskStore();

  const [filter, setFilter] = useState('All');

  // Build comprehensive alert list from notifications + current state
  const systemAlerts = [
    ...notifications.map(n => ({
      id: n.id,
      title: n.title,
      body: n.body,
      type: n.type,
      severity: n.severity,
      isRead: n.isRead,
      time: n.createdAt,
      patient: 'Radha',
      recommendation: n.type === 'missed_dose'
        ? 'Contact Radha to verify if she took her medication or needs assistance.'
        : n.type === 'refill'
        ? 'Verify pharmacy order status to ensure continuity of care.'
        : '',
      source: 'notification' as const,
    })),
    // Add dynamic alerts based on current state
    ...(missedThisWeek >= 2 ? [{
      id: 'dynamic-1',
      title: 'Repeated Missed Medication',
      body: `Radha missed scheduled Metformin doses ${missedThisWeek} times this week.`,
      type: 'missed_dose',
      severity: 'warning' as const,
      isRead: false,
      time: new Date().toISOString(),
      patient: 'Radha',
      recommendation: 'Check if Radha is experiencing digestive discomfort or routine disruption.',
      source: 'system' as const,
    }] : []),
    ...(stocks.some(s => s.needsRefill) ? [{
      id: 'dynamic-2',
      title: 'Prescription Stock Depletion',
      body: `${stocks.filter(s => s.needsRefill).map(s => `${s.medicationName}: ${Math.floor(s.daysRemaining)} days remaining`).join(', ')}.`,
      type: 'refill',
      severity: 'warning' as const,
      isRead: false,
      time: new Date().toISOString(),
      patient: 'Radha',
      recommendation: 'Order a prescription refill before inventory falls below the 3-day critical buffer.',
      source: 'system' as const,
    }] : []),
    ...(entries.filter(e => e.moodScore <= 2).length >= 2 ? [{
      id: 'dynamic-3',
      title: 'Persistent Low Mood Observed',
      body: "Radha's recent daily check-ins reflect elevated anxiety and fatigue over consecutive days.",
      type: 'wellness',
      severity: 'warning' as const,
      isRead: false,
      time: new Date().toISOString(),
      patient: 'Radha',
      recommendation: 'Consider a warm phone call or spending time together to provide reassurance.',
      source: 'system' as const,
    }] : []),
    ...(currentAssessment?.supportPriority === 'high' ? [{
      id: 'dynamic-4',
      title: 'Support Priority Escalation',
      body: "Radha's calculated Support Priority escalated to HIGH based on combined adherence and mood signals.",
      type: 'escalation',
      severity: 'critical' as const,
      isRead: false,
      time: new Date().toISOString(),
      patient: 'Radha',
      recommendation: 'Direct caregiver contact strongly recommended today. Verify safety and vitals.',
      source: 'system' as const,
    }] : []),
  ];

  const typeMap: Record<string, string[]> = {
    Medication: ['missed_dose', 'medication_reminder'],
    Mood: ['wellness'],
    Stock: ['refill'],
    Escalation: ['escalation', 'caregiver_alert'],
  };

  const filtered = filter === 'All'
    ? systemAlerts
    : systemAlerts.filter(a => typeMap[filter]?.includes(a.type));

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === 'critical') return { name: 'alert-circle', color: Colors.error, bg: '#FEE2E2' };
    if (type === 'missed_dose' || type === 'medication_reminder') return { name: 'medical', color: Colors.warning, bg: '#FEF3C7' };
    if (type === 'refill') return { name: 'cube', color: Colors.clinicalBlue, bg: '#E0F2FE' };
    if (type === 'wellness') return { name: 'heart', color: Colors.secondary, bg: '#CCFBF1' };
    if (type === 'caregiver_alert' || type === 'escalation') return { name: 'shield-alert', color: Colors.error, bg: '#FEE2E2' };
    return { name: 'notifications', color: Colors.textSecondary, bg: Colors.surfaceElevated };
  };

  const getTimeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const unreadCount = systemAlerts.filter(a => !a.isRead).length;

  return (
    <AppShell
      title="Alert Center"
      subtitle="Safety Escalations, Missed Doses & Clinical Notices"
      showEmergency={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Summary Banner */}
        <View style={styles.topSummaryCard}>
          <View style={styles.summaryLeft}>
            <View style={styles.summaryBadge}>
              <Ionicons name="notifications-outline" size={18} color={Colors.primary} />
              <Text style={styles.summaryBadgeText}>Caregiver Alert Log</Text>
            </View>
            <Text style={styles.summaryTitle}>
              {unreadCount === 0 ? 'All safety alerts reviewed' : `${unreadCount} Active Alert${unreadCount > 1 ? 's' : ''} Require Attention`}
            </Text>
            <Text style={styles.summarySub}>
              Real-time telemetry for Radha (Age 65) · Automated safety monitoring
            </Text>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllBtn}
              onPress={() => markAllRead()}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-done-outline" size={16} color={Colors.primary} />
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips Bar */}
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {ALERT_FILTERS.map(f => {
              const active = filter === f.type;
              const count = f.type === 'All'
                ? systemAlerts.length
                : systemAlerts.filter(a => typeMap[f.type]?.includes(a.type)).length;

              return (
                <TouchableOpacity
                  key={f.type}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setFilter(f.type)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={f.icon as any}
                    size={16}
                    color={active ? '#FFFFFF' : Colors.textSecondary}
                  />
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>
                    {f.label}
                  </Text>
                  <View style={[styles.chipCountBadge, active && styles.chipCountBadgeActive]}>
                    <Text style={[styles.chipCountText, active && styles.chipCountTextActive]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Alerts List */}
        {filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="shield-checkmark" size={36} color={Colors.success} />
            </View>
            <Text style={styles.emptyTitle}>All Clear</Text>
            <Text style={styles.emptySub}>
              There are no {filter !== 'All' ? filter.toLowerCase() : ''} alerts at this time.
              Radha's health telemetry is within normal parameters.
            </Text>
          </View>
        ) : (
          filtered.map(alert => {
            const icon = getAlertIcon(alert.type, alert.severity);
            const isCrit = alert.severity === 'critical';

            return (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  isCrit ? styles.cardCritical : styles.cardWarning,
                  !alert.isRead && styles.cardUnread,
                ]}
              >
                <View style={[styles.alertIconCircle, { backgroundColor: icon.bg }]}>
                  <Ionicons name={icon.name as any} size={22} color={icon.color} />
                </View>

                <View style={styles.alertContent}>
                  {/* Alert Header */}
                  <View style={styles.alertTopRow}>
                    <View style={styles.titleWrap}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      <View style={styles.metaRow}>
                        <View style={styles.patientBadge}>
                          <Ionicons name="person-outline" size={11} color={Colors.primary} />
                          <Text style={styles.patientBadgeText}>Radha (Mother)</Text>
                        </View>
                        <Text style={styles.timeDot}>•</Text>
                        <Text style={styles.timeText}>{getTimeAgo(alert.time)}</Text>
                      </View>
                    </View>

                    <View style={[
                      styles.severityBadge,
                      isCrit ? styles.badgeCritical : styles.badgeWarning
                    ]}>
                      <Ionicons
                        name={isCrit ? 'alert-circle' : 'warning-outline'}
                        size={12}
                        color={isCrit ? Colors.error : Colors.warning}
                      />
                      <Text style={[
                        styles.severityText,
                        isCrit ? styles.textCritical : styles.textWarning
                      ]}>
                        {isCrit ? 'CRITICAL' : 'WARNING'}
                      </Text>
                    </View>
                  </View>

                  {/* Body text */}
                  <Text style={styles.alertBody}>{alert.body}</Text>

                  {/* Clinical Recommendation Box */}
                  {alert.recommendation ? (
                    <View style={styles.recommendBox}>
                      <Ionicons name="bulb-outline" size={15} color={Colors.primary} style={styles.recommendIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.recommendTitle}>Suggested Caregiver Action:</Text>
                        <Text style={styles.recommendText}>{alert.recommendation}</Text>
                      </View>
                    </View>
                  ) : null}

                  {/* Bottom Action Footer */}
                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      style={styles.viewPatientAction}
                      onPress={() => router.push('/(caregiver)/patient-detail')}
                    >
                      <Text style={styles.viewPatientText}>View Clinical Chart</Text>
                      <Ionicons name="arrow-forward" size={13} color={Colors.primary} />
                    </TouchableOpacity>

                    {alert.source === 'notification' && !alert.isRead && (
                      <TouchableOpacity
                        onPress={() => markRead(alert.id)}
                        style={styles.markReadBtn}
                      >
                        <Ionicons name="checkmark" size={14} color={Colors.textMuted} />
                        <Text style={styles.markReadText}>Mark Reviewed</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}

        {/* Clinical Safety Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Ionicons name="shield-outline" size={18} color={Colors.clinicalBlue} />
          <Text style={styles.disclaimerText}>
            Sahaaya Wellness Telemetry Engine delivers automated caregiver insights based on scheduled doses, self-reported mood, and prescription depletion thresholds. It does not replace professional emergency services or acute clinical intervention.
          </Text>
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
  topSummaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  summaryLeft: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  summaryBadgeText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryTitle: {
    ...Typography.heading2,
    color: Colors.text,
    marginBottom: 4,
  },
  summarySub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderTeal,
  },
  markAllText: {
    ...Typography.buttonSmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: Spacing.lg,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    ...Typography.buttonSmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  chipCountBadge: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  chipCountBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  chipCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  chipCountTextActive: {
    color: '#FFFFFF',
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.md,
    ...Shadows.subtle,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.successSurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.heading2,
    color: Colors.success,
    marginBottom: Spacing.xs,
  },
  emptySub: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 420,
    lineHeight: 22,
  },
  alertCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    ...Shadows.card,
  },
  cardCritical: {
    borderLeftColor: Colors.error,
  },
  cardWarning: {
    borderLeftColor: Colors.warning,
  },
  cardUnread: {
    backgroundColor: '#FAFCFC',
    borderColor: Colors.borderTeal,
  },
  alertIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  titleWrap: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  alertTitle: {
    ...Typography.heading3,
    color: Colors.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  patientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  patientBadgeText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.primary,
  },
  timeDot: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  timeText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  badgeCritical: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  severityText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textCritical: {
    color: Colors.error,
  },
  textWarning: {
    color: Colors.warning,
  },
  alertBody: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginTop: 4,
    marginBottom: Spacing.sm,
  },
  recommendBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.primarySurface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderTeal,
    marginBottom: Spacing.sm,
  },
  recommendIcon: {
    marginTop: 2,
  },
  recommendTitle: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  recommendText: {
    ...Typography.bodySmall,
    color: Colors.text,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
  },
  viewPatientAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewPatientText: {
    ...Typography.buttonSmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  markReadText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.md,
  },
  disclaimerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});
