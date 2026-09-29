import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const handleLogin = async (role: string, name: string, path: any) => {
    await login(name, role);
    router.replace(path);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.logoBadge}>
          <Ionicons name="pulse" size={26} color="#FFFFFF" />
        </View>
        <Text style={styles.brandTitle}>SAHAAYA</Text>
        <Text style={styles.brandSubtitle}>
          An AI-Driven Health Companion for Medication Adherence & Mental Well-Being
        </Text>
        <View style={styles.sessionBadge}>
          <Text style={styles.sessionText}>Select an evaluation role to begin</Text>
        </View>
      </View>

      {/* Role Selection Cards Container */}
      <View style={styles.rolesGrid}>
        {/* Patient Card */}
        <TouchableOpacity
          style={[styles.roleCard, { borderTopColor: Colors.primary }]}
          onPress={() => handleLogin('patient', 'Radha', '/(patient)/home')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.avatarBox, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="person" size={22} color={Colors.primary} />
            </View>
            <View style={styles.roleHeaderInfo}>
              <View style={styles.badgeRow}>
                <Text style={styles.roleCategory}>PATIENT EXPERIENCE</Text>
                <View style={[styles.statusTag, { backgroundColor: Colors.primarySurface }]}>
                  <Text style={[styles.statusTagText, { color: Colors.primaryDark }]}>PRIMARY DEMO</Text>
                </View>
              </View>
              <Text style={styles.roleName}>Radha (Age 65)</Text>
            </View>
          </View>

          <Text style={styles.roleDescription}>
            Managing Type 2 Diabetes and Hypertension with daily Metformin 500mg and Amlodipine 5mg.
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
              <Text style={styles.featureText}>Medication reminders & adherence tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
              <Text style={styles.featureText}>Daily mood check-in & Sahaaya Companion</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
              <Text style={styles.featureText}>Stock refill prediction & Emergency SOS</Text>
            </View>
          </View>

          <View style={[styles.loginBtn, { backgroundColor: Colors.primary }]}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Enter as Patient (Radha)</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Caregiver Card */}
        <TouchableOpacity
          style={[styles.roleCard, { borderTopColor: Colors.secondary }]}
          onPress={() => handleLogin('caregiver', 'Meena', '/(caregiver)/home')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.avatarBox, { backgroundColor: Colors.secondaryMuted }]}>
              <Ionicons name="people" size={22} color={Colors.secondary} />
            </View>
            <View style={styles.roleHeaderInfo}>
              <View style={styles.badgeRow}>
                <Text style={[styles.roleCategory, { color: Colors.secondary }]}>CAREGIVER VIEW</Text>
                <View style={[styles.statusTag, { backgroundColor: Colors.secondaryMuted }]}>
                  <Text style={[styles.statusTagText, { color: Colors.secondaryDark }]}>ALERTS</Text>
                </View>
              </View>
              <Text style={styles.roleName}>Meena (Daughter)</Text>
            </View>
          </View>

          <Text style={styles.roleDescription}>
            Primary family caregiver monitoring Radha's medication adherence, missed dose alerts, and emotional well-being.
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
              <Text style={styles.featureText}>Remote patient adherence & missed dose trends</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
              <Text style={styles.featureText}>Support Priority & explainable risk reasons</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
              <Text style={styles.featureText}>Caregiver escalation notifications</Text>
            </View>
          </View>

          <View style={[styles.loginBtn, { backgroundColor: Colors.secondary }]}>
            <Text style={styles.loginBtnText}>Enter as Caregiver (Meena)</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Admin Card */}
        <TouchableOpacity
          style={[styles.roleCard, { borderTopColor: Colors.accent }]}
          onPress={() => handleLogin('admin', 'Admin', '/(admin)/home')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.avatarBox, { backgroundColor: Colors.accentMuted }]}>
              <Ionicons name="shield-checkmark" size={22} color={Colors.accent} />
            </View>
            <View style={styles.roleHeaderInfo}>
              <View style={styles.badgeRow}>
                <Text style={[styles.roleCategory, { color: Colors.accent }]}>ADMINISTRATION</Text>
                <View style={[styles.statusTag, { backgroundColor: Colors.accentMuted }]}>
                  <Text style={[styles.statusTagText, { color: '#92400E' }]}>TELEMETRY</Text>
                </View>
              </View>
              <Text style={styles.roleName}>System Administrator</Text>
            </View>
          </View>

          <Text style={styles.roleDescription}>
            System-level overview of active users, behavioral priority distribution, and clinical audit timeline.
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
              <Text style={styles.featureText}>System statistics & registered patient roster</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
              <Text style={styles.featureText}>Real-time critical alert logs & activity feed</Text>
            </View>
          </View>

          <View style={[styles.loginBtn, { backgroundColor: Colors.textSecondary }]}>
            <Text style={styles.loginBtnText}>Enter Admin Console</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Safety & Compliance Notice */}
      <View style={styles.footerNotice}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.footerText}>
          Sahaaya is an assistive healthcare prototype providing supportive wellness monitoring.
          It does not diagnose medical conditions or alter prescriptions.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    maxWidth: 500,
    width: '100%',
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  brandTitle: {
    ...Typography.heading1,
    fontSize: 28,
    color: Colors.primaryDark,
    letterSpacing: 2,
    marginBottom: 4,
  },
  brandSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  sessionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sessionText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  rolesGrid: {
    width: '100%',
    maxWidth: 580,
    gap: Spacing.md,
  },
  roleCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 4,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.sm,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleHeaderInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  roleCategory: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.6,
  },
  statusTag: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  statusTagText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  roleName: {
    ...Typography.heading3,
    fontSize: 17,
    color: Colors.text,
  },
  roleDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  featuresList: {
    gap: 5,
    marginBottom: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: BorderRadius.md,
    ...Shadows.subtle,
  },
  loginBtnText: {
    ...Typography.button,
    color: '#FFFFFF',
    fontSize: 14,
  },
  footerNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
    maxWidth: 540,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
});
