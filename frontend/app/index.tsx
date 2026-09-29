import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

import { useMedicationStore } from '../store/medicationStore';
import { useMoodStore } from '../store/moodStore';
import { useRiskStore } from '../store/riskStore';
import { useNotificationStore } from '../store/notificationStore';

export default function Splash() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Initialize demo data for instant out-of-the-box prototype demonstration
    useMedicationStore.getState().loadDemoData();
    useMoodStore.getState().loadDemoData();
    useRiskStore.getState().loadDemoData();
    useNotificationStore.getState().loadDemoData();

    const readyTimer = setTimeout(() => setReady(true), 600);
    const navTimer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2200);

    return () => {
      clearTimeout(readyTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.primary, '#0E5C60']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Brand Icon Badge */}
        <View style={styles.iconCircle}>
          <Ionicons name="pulse" size={44} color="#FFFFFF" />
        </View>

        {/* Brand Title & Tagline */}
        <Text style={styles.title}>SAHAAYA</Text>
        <Text style={styles.subtitle}>Your intelligent health companion</Text>
        <View style={styles.taglineBox}>
          <Text style={styles.subtext}>Medication  •  Mind  •  Safety</Text>
        </View>

        {/* Loading status */}
        <View style={styles.loadingArea}>
          <ActivityIndicator size="small" color="rgba(255, 255, 255, 0.8)" />
          <Text style={styles.loadingText}>
            {ready ? 'Clinical models loaded · Starting session' : 'Initializing demo data...'}
          </Text>
        </View>

        {/* Skip button for evaluation demo */}
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.8}>
          <Text style={styles.skipText}>Enter Application →</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.version}>Sahaaya Healthcare Prototype · IEEE Project</Text>
        <Text style={styles.disclaimer}>Non-diagnostic clinical & mental wellness support</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 420,
    width: '100%',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.xl + 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.92)',
    marginBottom: Spacing.sm,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  taglineBox: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 4,
    marginBottom: Spacing.xl,
  },
  subtext: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.8,
  },
  loadingArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  loadingText: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
  },
  skipBtn: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  skipText: {
    ...Typography.buttonSmall,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
  },
  version: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    marginBottom: 2,
  },
  disclaimer: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 10,
  },
});
