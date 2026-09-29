import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { role, switchRole, logout } = useAuthStore();

  const isPatient = role === 'patient' || !role;
  const isCaregiver = role === 'caregiver';
  const isAdmin = role === 'admin';

  interface NavItem {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    path: string;
    badge?: number;
    highlight?: boolean;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  const patientSections: NavSection[] = [
    {
      title: 'DAILY CARE',
      items: [
        { label: 'Dashboard', icon: 'grid-outline', path: '/(patient)/home' },
        { label: 'Medications', icon: 'medical-outline', path: '/(patient)/medications' },
        { label: 'Mood & Wellness', icon: 'heart-outline', path: '/(patient)/wellbeing' },
        { label: 'AI Companion', icon: 'chatbubble-ellipses-outline', path: '/(patient)/companion' },
      ],
    },
    {
      title: 'HEALTH MONITORING',
      items: [
        { label: 'Health Analytics', icon: 'stats-chart-outline', path: '/(patient)/dashboard' },
        { label: 'Medicine Stock', icon: 'cube-outline', path: '/(patient)/stock' },
        { label: 'Emergency Support', icon: 'shield-outline', path: '/(patient)/emergency', highlight: true },
      ],
    },
    {
      title: 'PREFERENCES',
      items: [
        { label: 'Notifications', icon: 'notifications-outline', path: '/(patient)/notifications' },
        { label: 'My Profile', icon: 'person-outline', path: '/(patient)/profile' },
      ],
    },
  ];

  const caregiverSections: NavSection[] = [
    {
      title: 'CLINICAL MONITORING',
      items: [
        { label: 'Overview', icon: 'grid-outline', path: '/(caregiver)/home' },
        { label: 'Patient Details (Radha)', icon: 'people-outline', path: '/(caregiver)/patient-detail' },
      ],
    },
    {
      title: 'ALERTS & CARE',
      items: [
        { label: 'Caregiver Alerts', icon: 'warning-outline', path: '/(caregiver)/alerts' },
        { label: 'Caregiver Profile', icon: 'person-outline', path: '/(caregiver)/profile' },
      ],
    },
  ];

  const adminSections: NavSection[] = [
    {
      title: 'ADMINISTRATION',
      items: [
        { label: 'System Overview', icon: 'analytics-outline', path: '/(admin)/home' },
      ],
    },
  ];

  const sections = isCaregiver ? caregiverSections : isAdmin ? adminSections : patientSections;

  const navigateTo = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={styles.sidebar}>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <View style={styles.brandIconBox}>
          <Ionicons name="pulse" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.brandTextContainer}>
          <Text style={styles.brandTitle}>SAHAAYA</Text>
          <Text style={styles.brandSubtitle}>Health Companion</Text>
        </View>
      </View>

      {/* Navigation Sections */}
      <ScrollView style={styles.navScroll} showsVerticalScrollIndicator={false}>
        {sections.map((section, sIdx) => (
          <View key={sIdx} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, iIdx) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <TouchableOpacity
                  key={iIdx}
                  style={[
                    styles.navItem,
                    isActive && styles.navItemActive,
                    item.highlight && styles.navItemHighlight,
                  ]}
                  onPress={() => navigateTo(item.path)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={
                      isActive
                        ? Colors.primary
                        : item.highlight
                        ? Colors.error
                        : Colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.navItemText,
                      isActive && styles.navItemTextActive,
                      item.highlight && styles.navItemTextHighlight,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Switcher & Sign out */}
      <View style={styles.bottomArea}>
        <View style={styles.roleCard}>
          <Text style={styles.roleCardLabel}>EVALUATION ROLE SWITCHER</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleChip, isPatient && styles.roleChipActive]}
              onPress={() => {
                switchRole('patient', 'Radha');
                router.replace('/(patient)/home');
              }}
            >
              <Text style={[styles.roleChipText, isPatient && styles.roleChipTextActive]}>Radha</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleChip, isCaregiver && styles.roleChipActive]}
              onPress={() => {
                switchRole('caregiver', 'Meena');
                router.replace('/(caregiver)/home');
              }}
            >
              <Text style={[styles.roleChipText, isCaregiver && styles.roleChipTextActive]}>Meena</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleChip, isAdmin && styles.roleChipActive]}
              onPress={() => {
                switchRole('admin', 'Admin');
                router.replace('/(admin)/home');
              }}
            >
              <Text style={[styles.roleChipText, isAdmin && styles.roleChipTextActive]}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            logout();
            router.replace('/(auth)/login');
          }}
        >
          <Ionicons name="log-out-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    flexDirection: 'column',
    height: '100%',
  },
  brandContainer: {
    height: 64,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  brandIconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm + 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 1.2,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  navScroll: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  sectionContainer: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginVertical: 1,
  },
  navItemActive: {
    backgroundColor: Colors.primarySurface,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  navItemHighlight: {
    backgroundColor: Colors.errorMuted,
  },
  navItemText: {
    ...Typography.bodySmall,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  navItemTextActive: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  navItemTextHighlight: {
    color: Colors.error,
    fontWeight: '600',
  },
  bottomArea: {
    padding: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.backgroundSubtle,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.sm,
    padding: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  roleCardLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  roleChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.backgroundSubtle,
  },
  roleChipActive: {
    backgroundColor: Colors.primary,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  roleChipTextActive: {
    color: '#FFFFFF',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
  },
});
