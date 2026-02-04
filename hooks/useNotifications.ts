'use client';

import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { useNotificationStore } from '@/store/notificationStore';
import { AppNotification } from '@/types/models';

/**
 * Custom hook to manage real-time notifications
 */
export function useNotifications() {
    const { on, off, isConnected } = useSocket();
    const { addNotification, notifications, unreadCount, markAsRead, markAllAsRead } =
        useNotificationStore();

    useEffect(() => {
        if (!isConnected) return;

        // Listen for new notifications
        const handleNotification = (notification: AppNotification) => {
            addNotification(notification);

            // Optionally show browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(notification.title, {
                    body: notification.message,
                    icon: '/favicon.ico',
                });
            }
        };

        // Listen for order updates
        const handleOrderUpdate = (data: any) => {
            const notification: AppNotification = {
                id: `order-${data.orderId}-${Date.now()}`,
                userId: data.userId || '',
                type: 'ORDER_UPDATE',
                title: 'Order Update',
                message: `Order ${data.trackingNumber} status changed to ${data.status}`,
                isRead: false,
                metadata: data,
                createdAt: new Date().toISOString(),
            };
            addNotification(notification);
        };

        // Listen for order assignment (for couriers)
        const handleOrderAssignment = (data: any) => {
            const notification: AppNotification = {
                id: `assignment-${data.orderId}-${Date.now()}`,
                userId: data.courierId || '',
                type: 'ORDER_ASSIGNED',
                title: 'New Order Assigned',
                message: `You have been assigned order ${data.trackingNumber}`,
                isRead: false,
                metadata: data,
                createdAt: new Date().toISOString(),
            };
            addNotification(notification);
        };

        // Register event listeners
        on('notification', handleNotification);
        on('order:updated', handleOrderUpdate);
        on('order:assigned', handleOrderAssignment);

        // Request browser notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Cleanup
        return () => {
            off('notification', handleNotification);
            off('order:updated', handleOrderUpdate);
            off('order:assigned', handleOrderAssignment);
        };
    }, [isConnected, on, off, addNotification]);

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
    };
}
