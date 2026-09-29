import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useMoodStore } from '../../store/moodStore';
import { useRiskStore } from '../../store/riskStore';
import AppShell from '../../components/AppShell';
import SectionHeader from '../../components/SectionHeader';
import PrimaryButton from '../../components/PrimaryButton';

const MOOD_EMOJIS: Record<number, string> = { 1: '😭', 2: '😔', 3: '😟', 4: '😐', 5: '🙂', 6: '😊' };
const MOOD_COLORS: Record<number, string> = {
  1: Colors.critical,
  2: Colors.error,
  3: Colors.warning,
  4: '#64748B',
  5: '#10B981',
  6: Colors.success,
};
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Wellbeing() {
  const router = useRouter();
  const { entries, todayEntry } = useMoodStore();
  const { currentAssessment } = useRiskStore();

  const weekEntries = entries.slice(-7);
  const avgMoodScore =
    weekEntries.length > 0
      ? weekEntries.reduce((a, b) => a + b.moodScore, 0) / weekEntries.length
      : 4;

  const avgMoodLabel =
    avgMoodScore >= 5
      ? 'Great'
      : avgMoodScore >= 4.2
      ? 'Good'
      : avgMoodScore >= 3.2
      ? 'Okay'
      : avgMoodScore >= 2
      ? 'Low'
      : 'Distressed';

  const avgMoodEmoji = MOOD_EMOJIS[Math.round(avgMoodScore)] || '😐';
  const lowMoodCount = weekEntries.filter((e) => e.moodScore <= 2).length;

  const getTrend = () => {
    if (weekEntries.length < 3) return { label: 'Baseline', icon: 'remove' as const, color: Colors.textMuted };
    const recentAvg = weekEntries.slice(-3).reduce((a, b) => a + b.moodScore, 0) / 3;
    const olderAvg = weekEntries.slice(0, 3).reduce((a, b) => a + b.moodScore, 0) / 3;
    if (recentAvg > olderAvg + 0.5) return { label: 'Improving', icon: 'trending-up' as const, color: Colors.success };
    if (recentAvg < olderAvg - 0.5) return { label: 'Declining', icon: 'trending-down' as const, color: Colors.error };
    return { label: 'Stable', icon: 'remove' as const, color: Colors.warning };
  };

  const trend = getTrend();

  const getInsight = () => {
    if (lowMoodCount >= 3) {
      return 'Your recent entries suggest increased stress or fatigue over the past few days. Small pauses, breathing exercises, and connecting with Meena can help restore balance.';
    }
    if (trend.label === 'Improving') {
      return 'Your self-reported well-being shows an encouraging upward pattern this week. Keep honoring your rest and routine!';
    }
    if (avgMoodScore >= 4.5) {
      return 'Your wellness scores have been consistently positive. Staying engaged with daily routines and hydration supports continued vitality.';
    }
    return 'Your emotional state has shown mild fluctuations across the week. Regular daily check-ins help us personalize supportive reminders.';
  };

  return (
    <AppShell title="Mental Well-Being" subtitle="Self-Reported Wellness & Emotional Trends">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Summary Row */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiEmoji}>{avgMoodEmoji}</Text>
            <Text style={styles.kpiVal}>{avgMoodLabel}</Text>
            <Text style={styles.kpiLbl}>7-Day Average ({avgMoodScore.toFixed(1)}/6)</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValLarge, lowMoodCount > 2 ? { color: Colors.error } : { color: Colors.success }]}>
              {lowMoodCount}
            </Text>
            <Text style={styles.kpiLbl}>Low Mood Days (≤ 2)</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={styles.trendIconRow}>
              <Ionicons name={trend.icon} size={22} color={trend.color} />
              <Text style={[styles.kpiValTrend, { color: trend.color }]}>{trend.label}</Text>
            </View>
            <Text style={styles.kpiLbl}>Weekly Trajectory</Text>
          </View>
        </View>

        {/* 7-Day Mood Timeline Chart */}
        <View style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <View>
              <Text style={styles.timelineTitle}>7-Day Mood Timeline</Text>
              <Text style={styles.timelineSub}>Logged emotional checkpoints</Text>
            </View>
            <TouchableOpacity
              style={styles.checkinLink}
              onPress={() => router.push('/(patient)/mood')}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil" size={13} color={Colors.primary} />
              <Text style={styles.checkinLinkText}>
                {todayEntry ? 'Review Today' : 'Log Today'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.barsContainer}>
            {weekEntries.length === 0 ? (
              <Text style={styles.emptyText}>No check-ins logged yet this week.</Text>
            ) : (
              weekEntries.map((entry, idx) => {
                const color = MOOD_COLORS[entry.moodScore] || Colors.textMuted;
                const emoji = MOOD_EMOJIS[entry.moodScore] || '😐';
                const heightPct = (entry.moodScore / 6) * 75 + 15;

                return (
                  <View key={entry.id || idx} style={styles.barColumn}>
                    <Text style={styles.barEmoji}>{emoji}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { height: heightPct, backgroundColor: color }]} />
                    </View>
                    <Text style={styles.barDay}>
                      {entry.date ? entry.date.slice(-5) : DAY_NAMES[idx] || `D${idx + 1}`}
                    </Text>
                    <Text style={[styles.barScore, { color }]}>{entry.moodScore}/6</Text>
                  </View>
                );
              })
            )}
          </View>
        </View>

        {/* Non-Diagnostic Clinical Insight Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.insightIconBox}>
              <Ionicons name="bulb-outline" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.insightTitle}>Supportive Wellness Observation</Text>
          </View>
          <Text style={styles.insightText}>{getInsight()}</Text>
          <View style={styles.disclaimerRow}>
            <Ionicons name="shield-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.disclaimerText}>
              Observations reflect self-reported entries and are not a psychiatric or clinical diagnosis.
            </Text>
          </View>
        </View>

        {/* Supportive Action Cards */}
        <SectionHeader title="Supportive Next Steps" icon="heart-outline" />

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(patient)/companion')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="chatbubbles" size={20} color="#7E22CE" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Talk with Sahaaya Companion</Text>
              <Text style={styles.actionSub}>Guided 4-7-8 breathing exercises & wellness suggestions</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(patient)/emergency')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: Colors.errorMuted }]}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.error} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.actionTitle, { color: Colors.error }]}>Access Immediate Helplines</Text>
              <Text style={styles.actionSub}>Free, confidential Indian mental health telephone helplines (iCall)</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.error} />
          </TouchableOpacity>
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
  kpiRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  kpiEmoji: {
    fontSize: 26,
    marginBottom: 2,
  },
  kpiVal: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
  },
  kpiValLarge: {
    ...Typography.heading1,
    fontSize: 28,
    lineHeight: 32,
  },
  trendIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  kpiValTrend: {
    ...Typography.heading3,
    fontSize: 14,
    fontWeight: '700',
  },
  kpiLbl: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  timelineTitle: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
  },
  timelineSub: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
  },
  checkinLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  checkinLinkText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontSize: 11,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: Spacing.sm,
  },
  emptyText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    width: '100%',
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barEmoji: {
    fontSize: 18,
    marginBottom: 6,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: Colors.backgroundSubtle,
    borderRadius: BorderRadius.full,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: BorderRadius.full,
  },
  barDay: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 6,
  },
  barScore: {
    ...Typography.caption,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 1,
  },
  insightCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  insightIconBox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTitle: {
    ...Typography.heading3,
    fontSize: 14,
    color: Colors.primaryDark,
  },
  insightText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 2,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  disclaimerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    flex: 1,
  },
  actionsGrid: {
    gap: Spacing.sm,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    ...Shadows.subtle,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    ...Typography.heading3,
    fontSize: 14,
    color: Colors.text,
  },
  actionSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
});
