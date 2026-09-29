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
import { useNotificationStore } from '../../store/notificationStore';
import { useAuthStore } from '../../store/authStore';
import RiskBadge from '../../components/RiskBadge';
import AppShell from '../../components/AppShell';

export default function AdminHome() {
  const router = useRouter();
  const { logout, switchRole } = useAuthStore();
  const { medications, stocks, weeklyAdherence, missedThisWeek } = useMedicationStore();
  const { entries } = useMoodStore();
  const { currentAssessment } = useRiskStore();
  const { notifications } = useNotificationStore();

  const totalAlerts = notifications.filter(n => !n.isRead).length;
  const criticalAlerts = notifications.filter(n => n.severity === 'critical' && !n.isRead).length;
  const moodsThisWeek = entries.slice(-7).length;
  const medsNeedRefill = stocks.filter(s => s.needsRefill).length;

  const handleRoleSwitch = (newRole: 'patient' | 'caregiver' | 'admin', name: string, targetPath: any) => {
    switchRole(newRole, name);
    router.replace(targetPath);
  };

  return (
    <AppShell
      title="Admin Console"
      subtitle="System Telemetry & Clinical Governance"
      showEmergency={false}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Banner */}
        <View style={styles.topCard}>
          <View style={styles.topCardLeft}>
            <View style={styles.telemetryTag}>
              <View style={styles.liveDot} />
              <Text style={styles.telemetryTagText}>Sahaaya Clinical Telemetry · Live</Text>
            </View>
            <Text style={styles.topCardTitle}>System Overview & Safety Governance</Text>
            <Text style={styles.topCardSub}>
              Real-time monitoring of enrolled patients, caregiver escalation pipelines, and automated wellness inference.
            </Text>
          </View>
        </View>

        {/* 4 KPI Cards Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="people" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Enrolled Patients</Text>
            <Text style={styles.statNote}>Radha (Age 65)</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="heart" size={20} color={Colors.clinicalBlue} />
            </View>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Active Caregivers</Text>
            <Text style={styles.statNote}>Meena (Daughter)</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: totalAlerts > 0 ? '#FEF3C7' : Colors.successSurface }]}>
              <Ionicons
                name="notifications"
                size={20}
                color={totalAlerts > 0 ? Colors.warning : Colors.success}
              />
            </View>
            <Text style={[styles.statValue, totalAlerts > 0 && { color: Colors.warning }]}>
              {totalAlerts}
            </Text>
            <Text style={styles.statLabel}>Unread Alerts</Text>
            <Text style={styles.statNote}>Caregiver notifications</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: criticalAlerts > 0 ? '#FEE2E2' : Colors.successSurface }]}>
              <Ionicons
                name="alert-circle"
                size={20}
                color={criticalAlerts > 0 ? Colors.error : Colors.success}
              />
            </View>
            <Text style={[styles.statValue, criticalAlerts > 0 && { color: Colors.error }]}>
              {criticalAlerts}
            </Text>
            <Text style={styles.statLabel}>Critical Safety Escalations</Text>
            <Text style={styles.statNote}>Escalation Level 3</Text>
          </View>
        </View>

        {/* Telemetry Summary Cards */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="pulse-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Medication Adherence Telemetry</Text>
            </View>
          </View>

          <View style={styles.telemetryRow}>
            <View style={styles.telemetryMetric}>
              <Text style={styles.telemetryNumber}>{medications.length}</Text>
              <Text style={styles.telemetryLabel}>Active Prescriptions</Text>
              <Text style={styles.telemetrySub}>Scheduled daily</Text>
            </View>

            <View style={styles.telemetryMetric}>
              <Text style={[
                styles.telemetryNumber,
                { color: weeklyAdherence >= 80 ? Colors.success : weeklyAdherence >= 60 ? Colors.warning : Colors.error }
              ]}>
                {weeklyAdherence}%
              </Text>
              <Text style={styles.telemetryLabel}>Weekly Adherence</Text>
              <Text style={styles.telemetrySub}>Target &gt; 80%</Text>
            </View>

            <View style={styles.telemetryMetric}>
              <Text style={[
                styles.telemetryNumber,
                { color: missedThisWeek > 2 ? Colors.error : missedThisWeek > 0 ? Colors.warning : Colors.text }
              ]}>
                {missedThisWeek}
              </Text>
              <Text style={styles.telemetryLabel}>Missed Doses (7d)</Text>
              <Text style={styles.telemetrySub}>Auto-escalated</Text>
            </View>

            <View style={styles.telemetryMetric}>
              <Text style={styles.telemetryNumber}>{moodsThisWeek}</Text>
              <Text style={styles.telemetryLabel}>Wellness Logs</Text>
              <Text style={styles.telemetrySub}>Past 7 days</Text>
            </View>
          </View>
        </View>

        {/* Support Priority Determinants */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="shield-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Clinical Support Priority Analysis</Text>
            </View>
            {currentAssessment && (
              <RiskBadge level={currentAssessment.supportPriority} size="medium" />
            )}
          </View>

          {currentAssessment ? (
            <View style={styles.riskBreakdown}>
              <View style={styles.patientInfoMini}>
                <View style={styles.miniAvatar}>
                  <Text style={styles.miniAvatarText}>R</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.miniPatientName}>Radha (Age 65)</Text>
                  <Text style={styles.miniPatientConditions}>Type 2 Diabetes, Hypertension · Monitored by Meena</Text>
                </View>
              </View>

              <Text style={styles.factorsHeading}>Determinant Risk Factors:</Text>
              {currentAssessment.factors.map((f, i) => (
                <View key={i} style={styles.factorItem}>
                  <Ionicons name="alert-circle" size={14} color={Colors.warning} style={{ marginTop: 2 }} />
                  <Text style={styles.factorText}>{f}</Text>
                </View>
              ))}

              <View style={styles.rationaleBox}>
                <Ionicons name="information-circle-outline" size={16} color={Colors.primary} style={{ marginTop: 1 }} />
                <Text style={styles.rationaleText}>
                  Rule-based inference assesses missed doses (&gt;1 = moderate, &gt;2 = high), low emotional scores, and depleted inventory buffers.
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyNote}>No active risk evaluation data available.</Text>
          )}
        </View>

        {/* User Directory */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="people-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Registered Users Directory</Text>
            </View>
          </View>

          {[
            {
              name: 'Radha',
              role: 'PATIENT',
              details: 'Age 65 · Bangalore · Type 2 Diabetes, Hypertension',
              contact: 'Meena (Primary Caregiver)',
              roleColor: Colors.primary,
              icon: 'person',
            },
            {
              name: 'Meena',
              role: 'CAREGIVER',
              details: 'Daughter & Primary Caregiver for Radha · Verified Escalation Contact',
              contact: '+91 98765 43210 (SMS & WhatsApp)',
              roleColor: Colors.clinicalBlue,
              icon: 'heart',
            },
            {
              name: 'Admin',
              role: 'ADMINISTRATOR',
              details: 'System Security, Health Governance & Telemetry Audit',
              contact: 'admin@sahaaya.internal',
              roleColor: Colors.secondary,
              icon: 'shield',
            },
          ].map((u, idx) => (
            <View key={u.name} style={[styles.userRow, idx > 0 && styles.dividerTop]}>
              <View style={[styles.userAvatar, { backgroundColor: `${u.roleColor}15` }]}>
                <Ionicons name={u.icon as any} size={20} color={u.roleColor} />
              </View>
              <View style={styles.userInfoCol}>
                <View style={styles.userNameLine}>
                  <Text style={styles.userName}>{u.name}</Text>
                  <View style={[styles.roleTag, { backgroundColor: `${u.roleColor}15`, borderColor: u.roleColor }]}>
                    <Text style={[styles.roleTagText, { color: u.roleColor }]}>{u.role}</Text>
                  </View>
                </View>
                <Text style={styles.userDetails}>{u.details}</Text>
                <Text style={styles.userContact}>Contact: {u.contact}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Medicine Stock Overview */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="cube-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Prescription Stock & Refill Buffers</Text>
            </View>
          </View>

          {medsNeedRefill > 0 ? (
            stocks.filter(s => s.needsRefill).map(s => (
              <View key={s.medicationId} style={styles.stockAlertRow}>
                <View style={styles.stockAlertIconCircle}>
                  <Ionicons name="warning" size={18} color={Colors.warning} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stockName}>{s.medicationName}</Text>
                  <Text style={styles.stockSub}>
                    {s.remainingTablets} tablets remaining · Estimated {Math.floor(s.daysRemaining)} days left
                  </Text>
                </View>
                <View style={styles.refillBadge}>
                  <Text style={styles.refillBadgeText}>REFILL REQUIRED</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.allStocksGood}>
              <Ionicons name="checkmark-circle-outline" size={22} color={Colors.success} />
              <Text style={styles.allStocksGoodText}>All patient prescription stocks have adequate buffer (&gt; 4 days).</Text>
            </View>
          )}
        </View>

        {/* Evaluation Demo Perspective Switcher */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="swap-horizontal-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Evaluation Role Quick Switcher</Text>
            </View>
          </View>
          <Text style={styles.switchDesc}>
            Inspect the live application through different stakeholder lenses:
          </Text>

          <View style={styles.roleGrid}>
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => handleRoleSwitch('patient', 'Radha', '/(patient)/home')}
              activeOpacity={0.7}
            >
              <View style={[styles.roleIconCircle, { backgroundColor: Colors.primarySurface }]}>
                <Ionicons name="person" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.roleCardTitle}>Patient Portal</Text>
              <Text style={styles.roleCardSub}>Radha (Age 65)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => handleRoleSwitch('caregiver', 'Meena', '/(caregiver)/home')}
              activeOpacity={0.7}
            >
              <View style={[styles.roleIconCircle, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="people" size={20} color={Colors.clinicalBlue} />
              </View>
              <Text style={styles.roleCardTitle}>Caregiver Portal</Text>
              <Text style={styles.roleCardSub}>Meena (Daughter)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Notice */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.footerText}>
            Sahaaya Healthcare Companion · Architectural Prototype · Rule-based Safety Telemetry
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
  topCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  topCardLeft: {
    flex: 1,
  },
  telemetryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  telemetryTagText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topCardTitle: {
    ...Typography.heading2,
    color: Colors.text,
    marginBottom: 4,
  },
  topCardSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: 180,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  statIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 34,
  },
  statLabel: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 2,
  },
  statNote: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    ...Typography.heading3,
    color: Colors.text,
  },
  telemetryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  telemetryMetric: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
  },
  telemetryNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  telemetryLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 2,
    textAlign: 'center',
  },
  telemetrySub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  riskBreakdown: {
    gap: Spacing.sm,
  },
  patientInfoMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primarySurface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderTeal,
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  miniPatientName: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text,
  },
  miniPatientConditions: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  factorsHeading: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 2,
  },
  factorText: {
    ...Typography.bodySmall,
    color: Colors.text,
    flex: 1,
  },
  rationaleBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginTop: 4,
  },
  rationaleText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  emptyNote: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dividerTop: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    marginTop: Spacing.xs,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoCol: {
    flex: 1,
  },
  userNameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  userName: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text,
  },
  roleTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  userDetails: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userContact: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  stockAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: '#FFFBEB',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: Spacing.xs,
  },
  stockAlertIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockName: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text,
  },
  stockSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  refillBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  refillBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  allStocksGood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.successSurface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  allStocksGoodText: {
    ...Typography.bodySmall,
    color: Colors.success,
    fontWeight: '600',
  },
  switchDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  roleCardTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  roleCardSub: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
