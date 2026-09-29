import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import AppShell from '../../components/AppShell';

const HELPLINES = [
  {
    id: 'emergency',
    title: 'Emergency Medical Services (Ambulance)',
    description: 'National emergency response for acute medical crises',
    number: '108',
    icon: 'call' as const,
    color: Colors.error,
    bgColor: Colors.errorMuted,
    borderColor: Colors.errorBorder,
    badge: 'NATIONAL 24/7',
  },
  {
    id: 'caregiver',
    title: 'Contact Family Caregiver (Meena)',
    description: 'Reach your designated primary caregiver & daughter directly',
    number: '+91 98765 43210',
    icon: 'people' as const,
    color: Colors.primary,
    bgColor: Colors.primarySurface,
    borderColor: Colors.primaryMuted,
    badge: 'FAMILY CONTACT',
  },
  {
    id: 'icall',
    title: 'iCall Psychosocial Helpline (TISS)',
    description: 'Free, professional mental health and emotional counselling support',
    number: '9152987821',
    icon: 'heart' as const,
    color: Colors.secondary,
    bgColor: Colors.secondaryMuted,
    borderColor: '#BAE6FD',
    badge: 'MON–SAT · 8 AM–10 PM',
  },
  {
    id: 'vandrevala',
    title: 'Vandrevala Crisis Support Helpline',
    description: 'Round-the-clock telephone crisis counseling and mental wellness',
    number: '1860-2662-345',
    icon: 'shield-checkmark' as const,
    color: '#7E22CE',
    bgColor: '#FAF5FF',
    borderColor: '#E9D5FF',
    badge: '24/7 TOLL-FREE',
  },
];

export default function Emergency() {
  const handleCall = (item: typeof HELPLINES[0]) => {
    Alert.alert(
      `Call ${item.title}`,
      `Dial number: ${item.number}?\n\nThis is a verified helpline. (In demo environment, this triggers direct dial).`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Call',
          style: item.id === 'emergency' ? 'destructive' : 'default',
          onPress: () => {
            Linking.openURL(`tel:${item.number}`).catch(() => {
              Alert.alert('Demo Notice', `Simulated dial to ${item.number}.`);
            });
          },
        },
      ]
    );
  };

  return (
    <AppShell title="Support & Emergency SOS" subtitle="Immediate Healthcare & Crisis Directory" showEmergency={false}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Supportive Reassurance Banner */}
        <View style={styles.reassuranceCard}>
          <View style={styles.heartCircle}>
            <Ionicons name="heart" size={28} color={Colors.error} />
          </View>
          <Text style={styles.reassuranceTitle}>You don't have to face this alone.</Text>
          <Text style={styles.reassuranceText}>
            Reaching out is a sign of strength. Whether you need immediate medical assistance,
            a gentle voice to speak with, or guidance through physical discomfort, dedicated support is ready.
          </Text>
        </View>

        {/* Directory List */}
        <Text style={styles.sectionHeader}>VERIFIED HELPLINES & CONTACTS</Text>

        <View style={styles.listContainer}>
          {HELPLINES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.helplineCard, { borderLeftColor: item.color }]}
              onPress={() => handleCall(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, { backgroundColor: item.bgColor }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>

              <View style={styles.infoArea}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={[styles.badge, { backgroundColor: item.bgColor, borderColor: item.borderColor }]}>
                    <Text style={[styles.badgeText, { color: item.color }]}>{item.badge}</Text>
                  </View>
                </View>
                <Text style={styles.cardSub}>{item.description}</Text>
                <View style={styles.phoneRow}>
                  <Ionicons name="call" size={13} color={item.color} />
                  <Text style={[styles.phoneText, { color: item.color }]}>{item.number}</Text>
                </View>
              </View>

              <View style={[styles.callBtn, { backgroundColor: item.color }]}>
                <Ionicons name="call" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Clinical Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>
            Numbers provided are verified public health helplines in India. Sahaaya operates as an assistive companion
            and cannot replace local first responders in severe emergencies.
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
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  reassuranceCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  heartCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.errorMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  reassuranceTitle: {
    ...Typography.heading2,
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  reassuranceText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    fontSize: 14,
    maxWidth: 520,
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
  listContainer: {
    gap: Spacing.md,
  },
  helplineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    ...Shadows.subtle,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    flexShrink: 0,
  },
  infoArea: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 2,
  },
  cardTitle: {
    ...Typography.heading3,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cardSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    lineHeight: 15,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  phoneText: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 13,
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xs,
  },
  disclaimerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
});
