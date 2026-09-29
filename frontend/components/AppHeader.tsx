import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

interface Props {
  title: string;
  subtitle?: string;
  showEmergency?: boolean;
}

export default function AppHeader({ title, subtitle, showEmergency = true }: Props) {
  const router = useRouter();
  const { user, role } = useAuthStore();
  const { notifications } = useNotificationStore();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationsPress = () => {
    if (role === 'caregiver') {
      router.push('/(caregiver)/alerts');
    } else {
      router.push('/(patient)/notifications');
    }
  };

  const handleProfilePress = () => {
    if (role === 'caregiver') {
      router.push('/(caregiver)/profile');
    } else if (role === 'patient') {
      router.push('/(patient)/profile');
    }
  };

  const handleEmergencyPress = () => {
    router.push('/(patient)/emergency');
  };

  const roleLabel = role === 'caregiver' ? 'Caregiver' : role === 'admin' ? 'Administrator' : 'Patient (Age 65)';
  const userName = user?.name || (role === 'caregiver' ? 'Meena' : role === 'admin' ? 'Admin' : 'Radha');

  return (
    <View style={styles.header}>
      {/* Title & Context */}
      <View style={styles.titleArea}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>

      {/* Action utilities */}
      <View style={styles.actionsArea}>
        {/* Language selector chip */}
        <View style={styles.langPill}>
          <Ionicons name="globe-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.langText}>EN</Text>
        </View>

        {/* Notification indicator */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleNotificationsPress}
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={20} color={Colors.textSecondary} />
          {unreadCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Emergency SOS button (if enabled) */}
        {showEmergency && (
          <TouchableOpacity
            style={styles.emergencyBtn}
            onPress={handleEmergencyPress}
            accessibilityLabel="Emergency SOS Support"
          >
            <Ionicons name="shield-outline" size={15} color={Colors.error} />
            <Text style={styles.emergencyText}>Emergency SOS</Text>
          </TouchableOpacity>
        )}

        {/* User profile pill */}
        <TouchableOpacity style={styles.profilePill} onPress={handleProfilePress}>
          <View style={[styles.avatar, { backgroundColor: role === 'caregiver' ? Colors.secondary : Colors.primary }]}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName} numberOfLines={1}>{userName}</Text>
            <Text style={styles.profileRole} numberOfLines={1}>{roleLabel}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    ...Shadows.subtle,
  },
  titleArea: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    ...Typography.heading2,
    fontSize: 18,
    lineHeight: 24,
  },
  subtitle: {
    ...Typography.bodySmall,
    fontSize: 12,
    color: Colors.textMuted,
  },
  actionsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notifBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.errorMuted,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  emergencyText: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '700',
    fontSize: 12,
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    paddingLeft: Spacing.xs,
    paddingRight: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  profileTextContainer: {
    maxWidth: 100,
  },
  profileName: {
    ...Typography.bodySmall,
    fontWeight: '600',
    fontSize: 12,
    color: Colors.text,
    lineHeight: 14,
  },
  profileRole: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    lineHeight: 12,
  },
});
