import React from 'react';
import { View, StyleSheet, useWindowDimensions, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import { useAuthStore } from '../store/authStore';

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showEmergency?: boolean;
}

export default function AppShell({ title, subtitle, children, showEmergency = true }: Props) {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  const { role } = useAuthStore();

  const isDesktop = width >= 860;
  const isCaregiver = role === 'caregiver';

  const patientTabs = [
    { label: 'Home', icon: 'home-outline', activeIcon: 'home', path: '/(patient)/home' },
    { label: 'Meds', icon: 'medical-outline', activeIcon: 'medical', path: '/(patient)/medications' },
    { label: 'Wellness', icon: 'heart-outline', activeIcon: 'heart', path: '/(patient)/wellbeing' },
    { label: 'AI Companion', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles', path: '/(patient)/companion' },
    { label: 'Profile', icon: 'person-outline', activeIcon: 'person', path: '/(patient)/profile' },
  ];

  const caregiverTabs = [
    { label: 'Overview', icon: 'home-outline', activeIcon: 'home', path: '/(caregiver)/home' },
    { label: 'Patients', icon: 'people-outline', activeIcon: 'people', path: '/(caregiver)/patient-detail' },
    { label: 'Alerts', icon: 'warning-outline', activeIcon: 'warning', path: '/(caregiver)/alerts' },
    { label: 'Profile', icon: 'person-outline', activeIcon: 'person', path: '/(caregiver)/profile' },
  ];

  const mobileTabs = isCaregiver ? caregiverTabs : patientTabs;

  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        {/* Left fixed sidebar */}
        <Sidebar />

        {/* Right content column */}
        <View style={styles.desktopMain}>
          <AppHeader title={title} subtitle={subtitle} showEmergency={showEmergency} />
          <View style={styles.contentWrapper}>
            {children}
          </View>
        </View>
      </View>
    );
  }

  // Mobile & Tablet Preview Layout
  return (
    <SafeAreaView style={styles.mobileContainer}>
      <AppHeader title={title} subtitle={subtitle} showEmergency={showEmergency} />
      <View style={styles.contentWrapper}>
        {children}
      </View>

      {/* Mobile Bottom Navigation Bar */}
      <View style={styles.mobileTabBar}>
        {mobileTabs.map((tab, idx) => {
          const isActive = pathname.startsWith(tab.path);
          return (
            <TouchableOpacity
              key={idx}
              style={styles.mobileTabItem}
              onPress={() => router.push(tab.path as any)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? (tab.activeIcon as any) : (tab.icon as any)}
                size={22}
                color={isActive ? Colors.primary : Colors.textMuted}
              />
              <Text style={[styles.mobileTabLabel, isActive && styles.mobileTabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.background,
    height: '100%',
    width: '100%',
  },
  desktopMain: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mobileTabBar: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 12 : 2,
    ...Shadows.subtle,
  },
  mobileTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  mobileTabLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  mobileTabLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
