import apiClient from '../api-client';
import { UserNotificationSettings, DEFAULT_NOTIFICATION_PREFERENCES } from '@/types/notification';

class NotificationService {
    private baseUrl = '/notifications/settings';

    async getSettings(): Promise<UserNotificationSettings> {
        // Mock implementation for now until backend is ready
        // In real app: return apiClient.get<UserNotificationSettings>(this.baseUrl);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    userId: 'current-user',
                    preferences: DEFAULT_NOTIFICATION_PREFERENCES,
                    quietHoursEnabled: false,
                    quietHoursStart: '22:00',
                    quietHoursEnd: '07:00'
                });
            }, 500);
        });
    }

    async updateSettings(settings: Partial<UserNotificationSettings>): Promise<UserNotificationSettings> {
        // Mock implementation
        // In real app: return apiClient.put<UserNotificationSettings>(this.baseUrl, settings);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    userId: 'current-user',
                    preferences: DEFAULT_NOTIFICATION_PREFERENCES, // In reality, merge with updates
                    quietHoursEnabled: settings.quietHoursEnabled || false,
                    ...settings
                } as UserNotificationSettings);
            }, 800);
        });
    }
}

export const notificationService = new NotificationService();
