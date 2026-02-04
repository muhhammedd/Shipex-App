'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { format } from 'date-fns';
import { Button } from './Button';
import { Badge } from './Badge';
import { Card } from './Card';

export function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleNotificationClick = (id: string) => {
        markAsRead(id);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 text-text-dim hover:bg-background-card hover:text-primary dark:text-text-dim-dark dark:hover:bg-background-card-dark dark:hover:text-primary rounded-xl transition-all active:scale-95"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white ring-2 ring-background dark:ring-background-dark animate-in zoom-in">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Card variant="glass" className="overflow-hidden shadow-2xl border-primary/10">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-border-dark bg-background/50 dark:bg-background-dark/50 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-text-main dark:text-text-main-dark">
                                    Notifications
                                </h3>
                                {unreadCount > 0 && (
                                    <Badge variant="primary" size="sm">{unreadCount} New</Badge>
                                )}
                            </div>
                            <div className="flex gap-1">
                                {unreadCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={markAllAsRead}
                                        className="h-7 text-xs"
                                        leftIcon={<Check className="w-3 h-3" />}
                                    >
                                        Mark all read
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-background-card dark:bg-background-card-dark">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                    <div className="w-12 h-12 rounded-full bg-background dark:bg-background-dark border border-border dark:border-border-dark flex items-center justify-center mb-3">
                                        <Bell className="w-6 h-6 text-text-dim dark:text-text-dim-dark opacity-50" />
                                    </div>
                                    <p className="text-sm font-medium text-text-main dark:text-text-main-dark">No notifications yet</p>
                                    <p className="text-xs text-text-dim dark:text-text-dim-dark mt-1">
                                        We'll notify you when something important happens.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border dark:divide-border-dark">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification.id)}
                                            className={`p-4 hover:bg-background dark:hover:bg-background-dark cursor-pointer transition-colors group relative ${!notification.isRead ? 'bg-primary/5 dark:bg-primary/5' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                {!notification.isRead && (
                                                    <div className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                                )}
                                                <div className={`flex-1 space-y-1 ${!notification.isRead ? '' : 'pl-5'}`}>
                                                    <div className="flex justify-between items-start">
                                                        <p className={`text-sm ${!notification.isRead ? 'font-bold' : 'font-medium'} text-text-main dark:text-text-main-dark`}>
                                                            {notification.title}
                                                        </p>
                                                        <span className="text-[10px] text-text-dim dark:text-text-dim-dark whitespace-nowrap ml-2">
                                                            {format(new Date(notification.createdAt), 'h:mm a')}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-text-dim dark:text-text-dim-dark line-clamp-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
