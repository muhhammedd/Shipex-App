import { create } from 'zustand';
import { AppNotification } from '@/types/models';

interface NotificationState {
    notifications: AppNotification[];
    unreadCount: number;

    // Actions
    addNotification: (notification: AppNotification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification: AppNotification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
        }));
    },

    markAsRead: (id: string) => {
        set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            if (!notification || notification.isRead) return state;

            return {
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, isRead: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            };
        });
    },

    markAllAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
        }));
    },

    clearNotifications: () => {
        set({
            notifications: [],
            unreadCount: 0,
        });
    },
}));
