import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useMedicationStore } from '../../store/medicationStore';
import AppShell from '../../components/AppShell';

export default function PatientProfile() {
  const router = useRouter();
  const { user, logout, switchRole } = useAuthStore();
  const { medications, weeklyAdherence } = useMedicationStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to end your session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const InfoRow = ({ label, value, icon }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIconBox}>
        <Ionicons name={icon} size={15} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <AppShell title="Patient Profile" subtitle="Clinical Identity & System Settings">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Identity Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'R'}</Text>
          </View>
          <View style={styles.identityText}>
            <Text style={styles.name}>{user?.name || 'Radha'}</Text>
            <Text style={styles.roleSub}>Patient · Age 65 · Active Care Plan</Text>
            <View style={styles.verifiedTag}>
              <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
              <Text style={styles.verifiedText}>Verified Clinical Demo Record</Text>
            </View>
          </View>
        </View>

        {/* Clinical Summary Cards */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <InfoRow label="Full Name" value="Radha" icon="person-outline" />
          <InfoRow label="Age & Gender" value="65 years · Female" icon="body-outline" />
          <InfoRow label="Phone Number" value="+91 99999 99998 (Demo)" icon="call-outline" />
          <InfoRow label="Emergency Contact" value="+91 99999 99997 (Demo)" icon="alert-circle-outline" />
        </View>

        {/* Health Conditions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Managed Chronic Conditions</Text>
          <View style={styles.conditionsRow}>
            {['Type 2 Diabetes', 'Hypertension'].map((c) => (
              <View key={c} style={styles.conditionChip}>
                <Ionicons name="medical" size={13} color={Colors.primary} />
                <Text style={styles.conditionText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Assigned Family Caregiver */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Designated Family Caregiver</Text>
          <View style={styles.caregiverRow}>
            <View style={styles.caregiverAvatar}>
              <Text style={styles.caregiverAvatarText}>M</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.caregiverName}>Meena</Text>
              <Text style={styles.caregiverRelation}>Daughter · Primary Caregiver</Text>
              <Text style={styles.caregiverPhone}>+91 98765 43210 (Demo)</Text>
            </View>
            <View style={styles.activeEscalationPill}>
              <Text style={styles.activeEscalationText}>Escalations Enabled</Text>
            </View>
          </View>
        </View>

        {/* Evaluation Role Switcher */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Evaluation Role Switcher</Text>
          <Text style={styles.roleSwitcherSub}>
            Quickly jump to another role to test the entire caregiver-patient workflow:
          </Text>
          <View style={styles.switcherButtonsRow}>
            <TouchableOpacity
              style={[styles.switcherBtn, { backgroundColor: Colors.secondaryMuted, borderColor: '#BAE6FD' }]}
              onPress={() => {
                switchRole('caregiver', 'Meena');
                router.replace('/(caregiver)/home');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="people" size={16} color={Colors.secondary} />
              <Text style={[styles.switcherText, { color: Colors.secondaryDark }]}>Caregiver (Meena)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.switcherBtn, { backgroundColor: Colors.accentMuted, borderColor: Colors.accentLight }]}
              onPress={() => {
                switchRole('admin', 'Admin');
                router.replace('/(admin)/home');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="shield-checkmark" size={16} color={Colors.accent} />
              <Text style={[styles.switcherText, { color: '#92400E' }]}>Administrator</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push('/(patient)/onboarding')}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={16} color={Colors.primary} />
          <Text style={styles.editBtnText}>Edit Health Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={16} color={Colors.error} />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.versionFooter}>
          <Text style={styles.versionText}>Sahaaya Clinical Health Companion · Prototype v1.0.0</Text>
          <Text style={styles.disclaimerText}>Designed for chronic care management & elderly accessibility</Text>
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
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  identityText: {
    flex: 1,
  },
  name: {
    ...Typography.heading2,
    fontSize: 20,
    color: Colors.text,
  },
  roleSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.success,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  cardTitle: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 7,
  },
  infoIconBox: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  infoValue: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  conditionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  conditionText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontSize: 12,
  },
  caregiverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  caregiverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caregiverAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  caregiverName: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
  },
  caregiverRelation: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  caregiverPhone: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  activeEscalationPill: {
    backgroundColor: Colors.successMuted,
    borderWidth: 1,
    borderColor: Colors.successBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  activeEscalationText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  roleSwitcherSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  switcherButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  switcherBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  switcherText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  editBtnText: {
    ...Typography.buttonSmall,
    color: Colors.primary,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.errorMuted,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  logoutBtnText: {
    ...Typography.buttonSmall,
    color: Colors.error,
    fontWeight: '700',
  },
  versionFooter: {
    alignItems: 'center',
  },
  versionText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
  },
  disclaimerText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
