import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface NotifProps {
  notif: {
    id: string;
    title: string;
    body: string;
    type: string;
    severity: 'info' | 'warning' | 'critical';
    isRead: boolean;
    createdAt: string;
  };
  onPress: () => void;
}

const SEVERITY_CONFIG: Record<'info' | 'warning' | 'critical', { color: string; bg: string; border: string }> = {
  info: { color: Colors.info, bg: Colors.infoMuted, border: Colors.infoBorder },
  warning: { color: Colors.warning, bg: Colors.warningMuted, border: Colors.warningBorder },
  critical: { color: Colors.critical, bg: Colors.criticalMuted, border: Colors.errorBorder },
};

const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  medication_reminder: 'alarm-outline',
  missed_dose: 'alert-circle-outline',
  refill: 'cube-outline',
  caregiver_alert: 'people-outline',
  wellness: 'heart-outline',
  escalation: 'warning-outline',
};

export default function NotificationItem({ notif, onPress }: NotifProps) {
  const sev = SEVERITY_CONFIG[notif.severity] || SEVERITY_CONFIG.info;
  const icon = TYPE_ICONS[notif.type] || 'notifications-outline';

  const getTimeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        !notif.isRead && styles.cardUnread,
        { borderLeftColor: sev.color },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: sev.bg }]}>
        <Ionicons name={icon} size={18} color={sev.color} />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, !notif.isRead && styles.titleUnread]} numberOfLines={1}>
            {notif.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.time}>{getTimeAgo(notif.createdAt)}</Text>
            {!notif.isRead && <View style={[styles.unreadDot, { backgroundColor: sev.color }]} />}
          </View>
        </View>
        <Text style={styles.body}>{notif.body}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  cardUnread: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primaryMuted,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 2,
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    ...Typography.heading3,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.xs,
  },
  titleUnread: {
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  time: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  body: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
