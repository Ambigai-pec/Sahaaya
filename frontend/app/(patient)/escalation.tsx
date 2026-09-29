import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useMedicationStore } from '../../store/medicationStore';
import { useRiskStore } from '../../store/riskStore';
import { useNotificationStore } from '../../store/notificationStore';
import AppShell from '../../components/AppShell';

interface EscalationConfig {
  level: number;
  levelBadge: string;
  title: string;
  message: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  caregiverAlerted: boolean;
}

export default function Escalation() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { missedThisWeek } = useMedicationStore();
  const { currentAssessment } = useRiskStore();
  const { addNotification } = useNotificationStore();
  const [caregiverNotified, setCaregiverNotified] = useState(false);

  const missedCount = parseInt((params.missed as string) || String(missedThisWeek), 10);

  const getEscalationConfig = (count: number): EscalationConfig => {
    if (count >= 4) {
      return {
        level: 3,
        levelBadge: 'LEVEL 3 ESCALATION · HIGH ATTENTION',
        title: 'Adherence Pattern Requires Attention',
        message:
          'Multiple consecutive doses have been missed. To ensure your health and safety, an alert has been shared with your designated family caregiver (Meena).',
        color: Colors.error,
        bgColor: Colors.errorMuted,
        borderColor: Colors.errorBorder,
        icon: 'alert-circle',
        caregiverAlerted: true,
      };
    } else if (count >= 2) {
      return {
        level: 2,
        levelBadge: 'LEVEL 2 ESCALATION · REPEATED MISSED DOSES',
        title: 'Multiple Doses Missed Recently',
        message:
          'You have missed more than one scheduled dose this week. Staying consistent with daily chronic care prevents symptoms and protects well-being.',
        color: Colors.warning,
        bgColor: Colors.warningMuted,
        borderColor: Colors.warningBorder,
        icon: 'warning',
        caregiverAlerted: false,
      };
    } else {
      return {
        level: 1,
        levelBadge: 'LEVEL 1 REMINDER · SINGLE MISSED DOSE',
        title: 'Missed Medication Notice',
        message:
          'It appears you missed a scheduled dose. Please take your prescribed medicine as soon as safe according to doctor directions, or delay until next scheduled time.',
        color: Colors.primary,
        bgColor: Colors.primarySurface,
        borderColor: Colors.primaryMuted,
        icon: 'information-circle',
        caregiverAlerted: false,
      };
    }
  };

  const config = getEscalationConfig(missedCount);

  useEffect(() => {
    if (config.level === 3 && !caregiverNotified) {
      addNotification({
        title: 'Caregiver Escalation Sent',
        body: `Caregiver Meena notified about ${missedCount} missed doses for patient Radha.`,
        type: 'caregiver_alert',
        severity: 'critical',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
      setCaregiverNotified(true);
    }
  }, [config.level]);

  const handleContactCaregiver = () => {
    Alert.alert(
      'Contact Meena (Caregiver)',
      'Reach out to your daughter Meena via direct call or supportive notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send "Need assistance"',
          onPress: () => {
            addNotification({
              title: 'Patient Reach-Out Message',
              body: 'Radha requested a check-in or medication assistance from Meena.',
              type: 'caregiver_alert',
              severity: 'warning',
              isRead: false,
              createdAt: new Date().toISOString(),
            });
            Alert.alert('✅ Message Sent', 'Meena has been alerted on her caregiver dashboard.');
          },
        },
      ]
    );
  };

  return (
    <AppShell title="Adaptive Escalation" subtitle="Behavioral Intervention Engine">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Escalation Card */}
        <View style={[styles.card, { borderTopColor: config.color }]}>
          {/* Level Header Badge */}
          <View style={[styles.levelTag, { backgroundColor: config.bgColor, borderColor: config.borderColor }]}>
            <Ionicons name={config.icon} size={14} color={config.color} />
            <Text style={[styles.levelTagText, { color: config.color }]}>
              {config.levelBadge}
            </Text>
          </View>

          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.message}>{config.message}</Text>

          {/* Caregiver Alert Notice Banner if Level 3 */}
          {config.caregiverAlerted && (
            <View style={styles.caregiverBanner}>
              <Ionicons name="people" size={18} color={Colors.error} />
              <View style={{ flex: 1 }}>
                <Text style={styles.caregiverBannerTitle}>Caregiver Notification Dispatched</Text>
                <Text style={styles.caregiverBannerSub}>
                  Meena (Daughter) has received a priority intervention alert to check in with you.
                </Text>
              </View>
            </View>
          )}

          {/* Stats Context Box */}
          <View style={styles.statsContextBox}>
            <View style={styles.contextStat}>
              <Text style={[styles.contextVal, { color: config.color }]}>{missedCount}</Text>
              <Text style={styles.contextLbl}>Missed Doses (7d)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.contextStat}>
              <Text style={styles.contextVal}>
                {(currentAssessment?.supportPriority || 'Moderate').toUpperCase()}
              </Text>
              <Text style={styles.contextLbl}>Current Support Priority</Text>
            </View>
          </View>
        </View>

        {/* Recommended Intervention Actions */}
        <Text style={styles.sectionHeader}>SUPPORT & RECOVERY ACTIONS</Text>

        <View style={styles.actionsList}>
          {/* Take Medication */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(patient)/medications')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.takenBg }]}>
              <Ionicons name="medical" size={20} color={Colors.taken} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Take Medication Now</Text>
              <Text style={styles.actionSub}>Open medication schedule and mark dose as completed</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Contact Caregiver */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleContactCaregiver}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.secondaryMuted }]}>
              <Ionicons name="call-outline" size={20} color={Colors.secondary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Contact Caregiver (Meena)</Text>
              <Text style={styles.actionSub}>Request assistance or let her know you are safe</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Open AI Companion */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(patient)/companion')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="chatbubbles-outline" size={20} color="#7E22CE" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Open Sahaaya Companion</Text>
              <Text style={styles.actionSub}>Discuss stress, forgetfulness, or try a 4-7-8 breathing exercise</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Emergency SOS if Level 3 */}
          {config.level >= 2 && (
            <TouchableOpacity
              style={[styles.actionCard, { borderColor: Colors.errorBorder }]}
              onPress={() => router.push('/(patient)/emergency')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: Colors.errorMuted }]}>
                <Ionicons name="shield-outline" size={20} color={Colors.error} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, { color: Colors.error }]}>Emergency Helplines</Text>
                <Text style={styles.actionSub}>Access 24/7 medical or mental health telephone support</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.error} />
            </TouchableOpacity>
          )}
        </View>

        {/* Back home */}
        <TouchableOpacity
          style={styles.returnBtn}
          onPress={() => router.replace('/(patient)/home')}
          activeOpacity={0.8}
        >
          <Text style={styles.returnBtnText}>Return to Dashboard</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 4,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  levelTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  levelTagText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    ...Typography.heading2,
    fontSize: 19,
    color: Colors.text,
    marginBottom: 6,
  },
  message: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  caregiverBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.errorMuted,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  caregiverBannerTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.error,
    fontSize: 13,
  },
  caregiverBannerSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  statsContextBox: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contextStat: {
    flex: 1,
    alignItems: 'center',
  },
  contextVal: {
    ...Typography.heading3,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  contextLbl: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.borderLight,
  },
  sectionHeader: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
    paddingLeft: 2,
  },
  actionsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.heading3,
    fontSize: 14,
    color: Colors.text,
  },
  actionSub: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  returnBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  returnBtnText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    fontSize: 13,
  },
});
