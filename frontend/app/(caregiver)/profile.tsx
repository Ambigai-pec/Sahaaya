import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import PrimaryButton from '../../components/PrimaryButton';
import AppShell from '../../components/AppShell';

export default function CaregiverProfile() {
  const { user, logout, switchRole } = useAuthStore();
  const router = useRouter();

  const [instantAlerts, setInstantAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [stockReminders, setStockReminders] = useState(true);

  const handleRoleSwitch = (newRole: 'patient' | 'caregiver' | 'admin', name: string, targetPath: any) => {
    switchRole(newRole, name);
    router.replace(targetPath);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to end your caregiver session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        }
      }
    ]);
  };

  return (
    <AppShell
      title="Caregiver Settings"
      subtitle="Profile, Notifications & Monitored Patients"
      showEmergency={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Caregiver Identity Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>M</Text>
            </View>
            <View style={styles.identityDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>Meena</Text>
                <View style={styles.activeBadge}>
                  <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
                  <Text style={styles.activeBadgeText}>Active Caregiver</Text>
                </View>
              </View>
              <Text style={styles.profileRole}>Primary Family Caregiver · Daughter</Text>
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.contactText}>+91 98765 43210 (SMS & Escalation Verified)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Assigned Monitored Patient Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="people-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Assigned Patient</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(caregiver)/patient-detail')}
              style={styles.viewChartLink}
            >
              <Text style={styles.viewChartText}>Open Chart</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.patientBox}>
            <View style={styles.patientAvatarBox}>
              <Ionicons name="person" size={28} color={Colors.primary} />
            </View>
            <View style={styles.patientInfoWrap}>
              <View style={styles.patientTitleRow}>
                <Text style={styles.patientName}>Radha</Text>
                <View style={styles.patientAgePill}>
                  <Text style={styles.patientAgeText}>65 Years</Text>
                </View>
              </View>
              <Text style={styles.patientRelation}>Mother · Residence: Bangalore, Karnataka</Text>
              
              <View style={styles.conditionTags}>
                <View style={styles.conditionTag}>
                  <Ionicons name="fitness-outline" size={11} color={Colors.clinicalBlue} />
                  <Text style={styles.conditionTagText}>Type 2 Diabetes</Text>
                </View>
                <View style={styles.conditionTag}>
                  <Ionicons name="heart-outline" size={11} color={Colors.secondary} />
                  <Text style={styles.conditionTagText}>Hypertension</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.fullDetailAction}
            onPress={() => router.push('/(caregiver)/patient-detail')}
            activeOpacity={0.7}
          >
            <View style={styles.fullDetailTextGroup}>
              <Text style={styles.fullDetailTitle}>View Complete Clinical Adherence Chart</Text>
              <Text style={styles.fullDetailSubtitle}>Medication history, inventory forecast, and mood trendline</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Escalation Notification Preferences */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Escalation & Safety Preferences</Text>
            </View>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Level 3 Escalation Alerts</Text>
              <Text style={styles.switchSub}>
                Immediate push notification and SMS trigger when doses remain unconfirmed past 60 minutes
              </Text>
            </View>
            <Switch
              value={instantAlerts}
              onValueChange={setInstantAlerts}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.switchRow, styles.dividerTop]}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Prescription Stock Warnings</Text>
              <Text style={styles.switchSub}>
                Automatic notice when remaining pills for any maintenance medication dip below 4 days
              </Text>
            </View>
            <Switch
              value={stockReminders}
              onValueChange={setStockReminders}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.switchRow, styles.dividerTop]}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Daily Wellness Summary</Text>
              <Text style={styles.switchSub}>
                Receive a 7:30 PM digest summarizing daily adherence percentage and evening emotional well-being
              </Text>
            </View>
            <Switch
              value={dailySummary}
              onValueChange={setDailySummary}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Demo Persona Switcher */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="swap-horizontal-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Evaluation Role Switcher</Text>
            </View>
          </View>
          <Text style={styles.demoDesc}>
            Quickly toggle perspectives to inspect the end-to-end Sahaaya clinical workflow:
          </Text>

          <View style={styles.roleGrid}>
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => handleRoleSwitch('patient', 'Radha', '/(patient)/home')}
              activeOpacity={0.7}
            >
              <View style={[styles.roleIconCircle, { backgroundColor: Colors.primarySurface }]}>
                <Ionicons name="person" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.roleCardTitle}>Patient View</Text>
              <Text style={styles.roleCardSub}>Radha (Age 65)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => handleRoleSwitch('admin', 'Admin', '/(admin)/home')}
              activeOpacity={0.7}
            >
              <View style={[styles.roleIconCircle, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="speedometer" size={22} color={Colors.clinicalBlue} />
              </View>
              <Text style={styles.roleCardTitle}>Admin Portal</Text>
              <Text style={styles.roleCardSub}>System Telemetry</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Regulatory Healthcare Disclaimer */}
        <View style={styles.safetyCard}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} style={{ marginTop: 2 }} />
          <Text style={styles.safetyText}>
            Sahaaya operates as a supportive wellness and caregiver communication platform. In case of acute clinical distress or emergency, please contact national emergency services (108) immediately.
          </Text>
        </View>

        {/* Logout Action */}
        <PrimaryButton
          title="Sign Out of Caregiver Portal"
          variant="outline"
          onPress={handleLogout}
        />
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
    maxWidth: 860,
    width: '100%',
    alignSelf: 'center',
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.subtle,
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  identityDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  profileName: {
    ...Typography.heading1,
    color: Colors.text,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successSurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  profileRole: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    ...Typography.caption,
    color: Colors.textMuted,
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
  viewChartLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewChartText: {
    ...Typography.buttonSmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  patientBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  patientAvatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientInfoWrap: {
    flex: 1,
  },
  patientTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  patientName: {
    ...Typography.heading3,
    color: Colors.text,
  },
  patientAgePill: {
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  patientAgeText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
  },
  patientRelation: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  conditionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  conditionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  conditionTagText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  fullDetailAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primarySurface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderTeal,
  },
  fullDetailTextGroup: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  fullDetailTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  fullDetailSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  dividerTop: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    marginTop: Spacing.xs,
  },
  switchTextCol: {
    flex: 1,
  },
  switchTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  switchSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  demoDesc: {
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
  safetyCard: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.primarySurface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderTeal,
    marginBottom: Spacing.xl,
  },
  safetyText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});
