import React from 'react';
import { Package, DollarSign, Bell, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { OrderStatus } from '@/types/models';
import { formatDistanceToNow } from 'date-fns';

export interface Activity {
    id: string;
    type: 'order' | 'payment' | 'notification' | 'finance' | 'system';
    title: string;
    description: string;
    timestamp: Date;
    status?: OrderStatus;
    icon?: React.ElementType;
}

interface ActivityTimelineProps {
    activities: Activity[];
    maxItems?: number;
    className?: string;
}

export function ActivityTimeline({ activities, maxItems = 5, className = '' }: ActivityTimelineProps) {
    const displayActivities = activities.slice(0, maxItems);

    const getActivityIcon = (activity: Activity) => {
        if (activity.icon) return activity.icon;

        switch (activity.type) {
            case 'order':
                return Package;
            case 'payment':
                return DollarSign;
            case 'notification':
                return Bell;
            default:
                return Bell;
        }
    };

    const getActivityColor = (activity: Activity) => {
        if (activity.status) {
            switch (activity.status) {
                case OrderStatus.DELIVERED:
                    return 'bg-success/10 text-success border-success/20';
                case OrderStatus.CANCELLED:
                case OrderStatus.RETURNED:
                    return 'bg-error/10 text-error border-error/20';
                case OrderStatus.IN_TRANSIT:
                case OrderStatus.OUT_FOR_DELIVERY:
                    return 'bg-primary/10 text-primary border-primary/20';
                default:
                    return 'bg-info/10 text-info border-info/20';
            }
        }

        switch (activity.type) {
            case 'order':
                return 'bg-primary/10 text-primary border-primary/20';
            case 'payment':
                return 'bg-success/10 text-success border-success/20';
            case 'notification':
                return 'bg-info/10 text-info border-info/20';
            default:
                return 'bg-info/10 text-info border-info/20';
        }
    };

    if (displayActivities.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
                <div className="p-4 rounded-xl bg-background dark:bg-background-dark border border-border dark:border-border-dark mb-4">
                    <Bell className="w-8 h-8 text-text-dim dark:text-text-dim-dark" />
                </div>
                <p className="text-sm font-semibold text-text-main dark:text-text-main-dark">No Recent Activity</p>
                <p className="text-xs text-text-dim dark:text-text-dim-dark mt-1">
                    Your activity will appear here
                </p>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {displayActivities.map((activity, index) => {
                const Icon = getActivityIcon(activity);
                const colorClass = getActivityColor(activity);
                const isLast = index === displayActivities.length - 1;

                return (
                    <div key={activity.id} className="relative group">
                        {/* Timeline Line */}
                        {!isLast && (
                            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border dark:bg-border-dark group-hover:bg-primary/30 transition-colors" />
                        )}

                        {/* Activity Item */}
                        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-background dark:hover:bg-background-dark transition-all duration-200 cursor-pointer">
                            {/* Icon */}
                            <div className={`relative z-10 flex-shrink-0 p-2.5 rounded-lg border ${colorClass} group-hover:scale-110 transition-transform duration-200`}>
                                <Icon className="w-5 h-5" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-text-main dark:text-text-main-dark truncate">
                                            {activity.title}
                                        </p>
                                        <p className="text-xs text-text-dim dark:text-text-dim-dark mt-0.5 line-clamp-2">
                                            {activity.description}
                                        </p>
                                    </div>
                                    <span className="flex-shrink-0 text-xs text-text-dim dark:text-text-dim-dark">
                                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
