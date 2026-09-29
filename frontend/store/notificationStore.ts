import { create } from 'zustand';
import { DEMO_NOTIFICATIONS } from '../constants/demoData';

interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  isRead: boolean;
  createdAt: string;
}

interface NotificationStore {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, 'id'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  loadDemoData: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (n) => {
    set((state) => {
      const newNotif = { ...n, id: Math.random().toString(36).substr(2, 9) } as AppNotification;
      return {
        notifications: [newNotif, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    });
  },

  markRead: (id) => {
    set((state) => {
      let readStatusChanged = false;
      const updated = state.notifications.map((n) => {
        if (n.id === id && !n.isRead) {
          readStatusChanged = true;
          return { ...n, isRead: true };
        }
        return n;
      });
      return {
        notifications: updated,
        unreadCount: readStatusChanged ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    });
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  loadDemoData: () => {
    const notifs = DEMO_NOTIFICATIONS as AppNotification[];
    const unread = notifs.filter(n => !n.isRead).length;
    set({
      notifications: notifs,
      unreadCount: unread,
    });
  },
}));
