import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useMoodStore } from '../../store/moodStore';
import { useRiskStore } from '../../store/riskStore';
import { useMedicationStore } from '../../store/medicationStore';
import { classifySentiment } from '../../services/sentimentEngine';
import AppShell from '../../components/AppShell';
import MoodButton from '../../components/MoodButton';
import PrimaryButton from '../../components/PrimaryButton';

const MOODS = [
  { score: 6, label: 'Great', emoji: '😊', color: Colors.success },
  { score: 5, label: 'Good', emoji: '🙂', color: '#10B981' },
  { score: 4, label: 'Okay', emoji: '😐', color: '#64748B' },
  { score: 3, label: 'Stressed', emoji: '😟', color: Colors.warning },
  { score: 2, label: 'Low', emoji: '😔', color: '#E11D48' },
  { score: 1, label: 'Distressed', emoji: '😭', color: Colors.critical },
];

export default function Mood() {
  const router = useRouter();
  const { entries, todayEntry, addEntry } = useMoodStore();
  const { runAssessment } = useRiskStore();
  const { missedThisWeek, delayedThisWeek, weeklyAdherence, stocks } = useMedicationStore();

  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(
    todayEntry ? MOODS.find((m) => m.score === todayEntry.moodScore) || null : null
  );
  const [journal, setJournal] = useState(todayEntry?.journalText || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sentimentResult, setSentimentResult] = useState<any>(null);

  const recentEntries = entries.slice(-7);

  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert('Selection Required', 'Please tap how you are feeling today before saving.');
      return;
    }

    setIsSaving(true);
    const sentiment = classifySentiment(journal || selectedMood.label);
    setSentimentResult(sentiment);

    const today = new Date().toISOString().split('T')[0];
    addEntry({
      patientId: 'patient-1',
      moodScore: selectedMood.score as any,
      moodLabel: selectedMood.label,
      journalText: journal,
      sentiment: sentiment.sentiment,
      timestamp: new Date().toISOString(),
      date: today,
    });

    // Rerun risk assessment
    const moodScores = [...recentEntries.map((e) => e.moodScore), selectedMood.score];
    const negativeStreak = moodScores.filter((s) => s <= 2).length;
    const minStock = Math.min(...(stocks.map((s) => s.daysRemaining) || [99]));
    runAssessment({
      missedDosesWeek: missedThisWeek,
      delayedDosesWeek: delayedThisWeek,
      adherencePct: weeklyAdherence,
      moodScoresWeek: moodScores,
      minDaysRemainingStock: minStock,
      negativeMoodStreak: negativeStreak,
    });

    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    setSaved(true);

    // If distress, gently offer companion or helpline
    if (selectedMood.score <= 1 || sentiment.sentiment === 'distress') {
      setTimeout(() => {
        Alert.alert(
          'We Are Here For You 💙',
          "We noticed you might be feeling overwhelmed or distressed today. You don't have to carry this alone. Would you like to chat with the Sahaaya Companion or see support numbers?",
          [
            { text: 'Not Now', style: 'cancel' },
            { text: 'Open Companion', onPress: () => router.push('/(patient)/companion') },
            { text: 'Support Helplines', onPress: () => router.push('/(patient)/emergency') },
          ]
        );
      }, 500);
    }
  };

  if (saved) {
    return (
      <AppShell title="Mood Logged" subtitle="Daily Check-in Complete">
        <View style={styles.savedWrapper}>
          <View style={styles.savedCard}>
            <View style={styles.savedIconCircle}>
              <Ionicons name="checkmark-circle" size={44} color={Colors.success} />
            </View>
            <Text style={styles.savedTitle}>Check-in Recorded</Text>
            <Text style={styles.savedSub}>
              Thank you for sharing, Radha. Your self-reflection helps tailor timely wellness insights.
            </Text>

            <View style={styles.sentimentFeedbackBox}>
              <Text style={styles.sentimentLabel}>AUTOMATED SENTIMENT CLASSIFICATION</Text>
              <View style={styles.sentimentTagRow}>
                <View style={[styles.sentimentPill, { backgroundColor: Colors.primarySurface }]}>
                  <Text style={styles.sentimentPillText}>
                    {(sentimentResult?.sentiment || 'Neutral').toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.sentimentScore}>
                  Score: {sentimentResult?.score?.toFixed(1) || '0.0'}
                </Text>
              </View>
            </View>

            <View style={styles.savedActions}>
              <PrimaryButton
                title="View 7-Day Timeline"
                icon="stats-chart-outline"
                onPress={() => router.replace('/(patient)/wellbeing')}
                style={{ marginBottom: Spacing.sm }}
              />
              <PrimaryButton
                title="Return to Home"
                type="outline"
                onPress={() => router.replace('/(patient)/home')}
              />
            </View>
          </View>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell title="Daily Mood Check-in" subtitle="Emotional well-being & reflection">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>How are you feeling today?</Text>
          <Text style={styles.sectionSubtitle}>
            Select the state that best represents your current physical and emotional well-being.
          </Text>

          {/* 6 Mood Options Grid */}
          <View style={styles.moodGrid}>
            {MOODS.map((m) => (
              <MoodButton
                key={m.score}
                emoji={m.emoji}
                label={m.label}
                score={m.score}
                color={m.color}
                selected={selectedMood?.score === m.score}
                onPress={() => setSelectedMood(m)}
              />
            ))}
          </View>

          {/* Journal Note */}
          <View style={styles.journalSection}>
            <View style={styles.journalHeader}>
              <Ionicons name="journal-outline" size={16} color={Colors.primary} />
              <Text style={styles.journalTitle}>Optional Daily Journal</Text>
            </View>
            <Text style={styles.journalSub}>
              How was your day? Jot down thoughts, sleep quality, or any symptoms you noticed:
            </Text>
            <TextInput
              style={styles.journalInput}
              value={journal}
              onChangeText={setJournal}
              placeholder="e.g. Felt a bit tired after lunch, took a walk in the evening..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <PrimaryButton
            title="Save Check-in & Review Factors"
            icon="checkmark"
            onPress={handleSave}
            loading={isSaving}
            style={{ marginTop: Spacing.md }}
          />

          <View style={styles.safetyBox}>
            <Ionicons name="shield-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.safetyText}>
              Your self-reported logs are stored privately for personal wellness tracking and caregiver assistance.
            </Text>
          </View>
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
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  sectionHeading: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.text,
  },
  sectionSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  journalSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
  },
  journalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  journalTitle: {
    ...Typography.heading3,
    fontSize: 14,
    color: Colors.text,
  },
  journalSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  journalInput: {
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minHeight: 100,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  safetyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
  },
  safetyText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    flex: 1,
  },
  savedWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  savedCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    maxWidth: 480,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  savedIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.successMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  savedTitle: {
    ...Typography.heading2,
    color: Colors.text,
  },
  savedSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 19,
    marginBottom: Spacing.md,
  },
  sentimentFeedbackBox: {
    width: '100%',
    backgroundColor: Colors.backgroundSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  sentimentLabel: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  sentimentTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sentimentPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  sentimentPillText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontSize: 11,
  },
  sentimentScore: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
  },
  savedActions: {
    width: '100%',
  },
});
