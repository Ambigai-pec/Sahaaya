import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useNotificationStore } from '../../store/notificationStore';
import AppShell from '../../components/AppShell';
import NotificationItem from '../../components/NotificationItem';

const FILTERS = ['All', 'Medication', 'Missed', 'Alerts'];

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markRead } = useNotificationStore();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredNotifs = notifications.filter((n) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Medication') return n.type === 'medication_reminder' || n.type === 'refill';
    if (selectedFilter === 'Missed') return n.type === 'missed_dose';
    if (selectedFilter === 'Alerts') return n.type === 'caregiver_alert' || n.type === 'escalation';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.isRead) markRead(n.id);
    });
  };

  return (
    <AppShell title="Notification Center" subtitle="Simulated In-App Alerts & Escalation Logs">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Filter and Mark All Read Bar */}
        <View style={styles.topBar}>
          <View style={styles.filterRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, selectedFilter === f && styles.filterChipActive]}
                onPress={() => setSelectedFilter(f)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, selectedFilter === f && styles.filterTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markReadBtn} onPress={handleMarkAllRead} activeOpacity={0.7}>
              <Ionicons name="checkmark-done" size={14} color={Colors.primary} />
              <Text style={styles.markReadText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications List */}
        {filteredNotifs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="notifications-off-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySub}>
              You have no active alerts in the "{selectedFilter}" category.
            </Text>
          </View>
        ) : (
          filteredNotifs.map((notif) => (
            <NotificationItem
              key={notif.id}
              notif={notif}
              onPress={() => {
                markRead(notif.id);
                if (notif.type === 'missed_dose' || notif.type === 'escalation') {
                  router.push('/(patient)/escalation');
                } else if (notif.type === 'refill') {
                  router.push('/(patient)/stock');
                }
              }}
            />
          ))
        )}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primaryMuted,
  },
  filterText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  filterTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  markReadText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  emptySub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
});
