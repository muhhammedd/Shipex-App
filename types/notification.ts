export type NotificationChannel = 'email' | 'push' | 'sms';
export type NotificationType = 'order_updates' | 'marketing' | 'system_alerts' | 'delivery_proofs';

export interface NotificationPreference {
    type: NotificationType;
    channels: {
        [key in NotificationChannel]: boolean;
    };
    label: string;
    description: string;
}

export interface UserNotificationSettings {
    userId: string;
    preferences: NotificationPreference[];
    quietHoursEnabled: boolean;
    quietHoursStart?: string; // HH:mm
    quietHoursEnd?: string; // HH:mm
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreference[] = [
    {
        type: 'order_updates',
        label: 'Order Updates',
        description: 'Get notified when order status changes',
        channels: { email: true, push: true, sms: false }
    },
    {
        type: 'delivery_proofs',
        label: 'Delivery Proofs',
        description: 'Receive proof of delivery photos and signatures',
        channels: { email: true, push: true, sms: false }
    },
    {
        type: 'system_alerts',
        label: 'System Alerts',
        description: 'Important warnings and maintenance notices',
        channels: { email: true, push: true, sms: true }
    },
    {
        type: 'marketing',
        label: 'Marketing & Tips',
        description: 'Product updates, tips, and promotional offers',
        channels: { email: true, push: false, sms: false }
    }
];
