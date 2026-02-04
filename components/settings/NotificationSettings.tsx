'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, MessageSquare, Moon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Loading } from '@/components/ui/Loading';
import { notificationService } from '@/lib/services/notificationService';
import { UserNotificationSettings, NotificationChannel, NotificationType } from '@/types/notification';
import { toast } from 'react-hot-toast';

export function NotificationSettings() {
    const [settings, setSettings] = useState<UserNotificationSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await notificationService.getSettings();
            setSettings(data);
        } catch (error) {
            toast.error('Failed to load notification settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleChannel = (typeIndex: number, channel: NotificationChannel) => {
        if (!settings) return;

        const newPreferences = [...settings.preferences];
        newPreferences[typeIndex].channels[channel] = !newPreferences[typeIndex].channels[channel];

        setSettings({
            ...settings,
            preferences: newPreferences
        });
    };

    const handleSave = async () => {
        if (!settings) return;

        try {
            setIsSaving(true);
            await notificationService.updateSettings(settings);
            toast.success('Notification preferences saved');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <Loading text="Loading settings..." />;
    if (!settings) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-text-main dark:text-text-main-dark">
                        Notification Preferences
                    </h2>
                    <p className="text-text-dim dark:text-text-dim-dark">
                        Manage how and when you receive notifications
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    isLoading={isSaving}
                    variant="primary"
                >
                    Save Changes
                </Button>
            </div>

            <Card variant="default" className="divide-y divide-border dark:divide-border-dark">
                {/* Header Row */}
                <div className="p-4 grid grid-cols-12 gap-4 items-center bg-background/50 dark:bg-background-dark/50 font-semibold text-sm text-text-dim dark:text-text-dim-dark">
                    <div className="col-span-6">Notification Type</div>
                    <div className="col-span-2 flex flex-col items-center">
                        <Mail className="h-4 w-4 mb-1" />
                        <span>Email</span>
                    </div>
                    <div className="col-span-2 flex flex-col items-center">
                        <Bell className="h-4 w-4 mb-1" />
                        <span>Push</span>
                    </div>
                    <div className="col-span-2 flex flex-col items-center">
                        <MessageSquare className="h-4 w-4 mb-1" />
                        <span>SMS</span>
                    </div>
                </div>

                {/* Preference Rows */}
                {settings.preferences.map((pref, index) => (
                    <div key={pref.type} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-background/30 dark:hover:bg-background-dark/30 transition-colors">
                        <div className="col-span-6">
                            <p className="font-medium text-text-main dark:text-text-main-dark">{pref.label}</p>
                            <p className="text-sm text-text-dim dark:text-text-dim-dark">{pref.description}</p>
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <Checkbox
                                checked={pref.channels.email}
                                onChange={() => handleToggleChannel(index, 'email')}
                            />
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <Checkbox
                                checked={pref.channels.push}
                                onChange={() => handleToggleChannel(index, 'push')}
                            />
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <Checkbox
                                checked={pref.channels.sms}
                                onChange={() => handleToggleChannel(index, 'sms')}
                            />
                        </div>
                    </div>
                ))}
            </Card>

            {/* Quiet Hours Section */}
            <Card variant="default" className="p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Moon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-text-main dark:text-text-main-dark">Quiet Hours</h3>
                            <Checkbox
                                checked={settings.quietHoursEnabled}
                                onChange={() => setSettings({ ...settings, quietHoursEnabled: !settings.quietHoursEnabled })}
                            />
                        </div>
                        <p className="text-sm text-text-dim dark:text-text-dim-dark mb-4">
                            Pause all notifications (except critical alerts) during specific hours.
                        </p>

                        {settings.quietHoursEnabled && (
                            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase">Start Time</label>
                                    <input
                                        type="time"
                                        value={settings.quietHoursStart}
                                        onChange={(e) => setSettings({ ...settings, quietHoursStart: e.target.value })}
                                        className="block p-2 rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark text-text-main dark:text-text-main-dark focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                                <span className="text-text-dim dark:text-text-dim-dark pt-5">to</span>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase">End Time</label>
                                    <input
                                        type="time"
                                        value={settings.quietHoursEnd}
                                        onChange={(e) => setSettings({ ...settings, quietHoursEnd: e.target.value })}
                                        className="block p-2 rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark text-text-main dark:text-text-main-dark focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
