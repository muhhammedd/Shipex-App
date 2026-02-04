'use client';

import { CheckCircle, Circle, Clock } from 'lucide-react';
import { OrderStatus } from '@/types/models';
import { format } from 'date-fns';

interface StatusTimelineProps {
    currentStatus: OrderStatus;
    statusHistory?: Array<{
        status: OrderStatus;
        timestamp: string;
        note?: string;
    }>;
}

const statusOrder: OrderStatus[] = [
    OrderStatus.CREATED,
    OrderStatus.PENDING,
    OrderStatus.ASSIGNED,
    OrderStatus.PICKED_UP,
    OrderStatus.IN_TRANSIT,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
];

const statusLabels: Record<OrderStatus, string> = {
    [OrderStatus.CREATED]: 'Order Created',
    [OrderStatus.PENDING]: 'Pending Assignment',
    [OrderStatus.ASSIGNED]: 'Courier Assigned',
    [OrderStatus.PICKED_UP]: 'Package Picked Up',
    [OrderStatus.IN_TRANSIT]: 'In Transit',
    [OrderStatus.OUT_FOR_DELIVERY]: 'Out for Delivery',
    [OrderStatus.DELIVERED]: 'Delivered',
    [OrderStatus.CANCELLED]: 'Cancelled',
    [OrderStatus.RETURNED]: 'Returned',
};

export function StatusTimeline({ currentStatus, statusHistory }: StatusTimelineProps) {
    const currentIndex = statusOrder.indexOf(currentStatus);
    const isCancelled = currentStatus === OrderStatus.CANCELLED;
    const isReturned = currentStatus === OrderStatus.RETURNED;

    // If cancelled or returned, show special timeline
    if (isCancelled || isReturned) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-error/5 dark:bg-error/10 border border-error/20">
                    <div className="h-12 w-12 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                        <Circle className="w-6 h-6 text-error" />
                    </div>
                    <div>
                        <p className="font-semibold text-error">
                            {isCancelled ? 'Order Cancelled' : 'Order Returned'}
                        </p>
                        <p className="text-sm text-text-dim dark:text-text-dim-dark">
                            This order has been {isCancelled ? 'cancelled' : 'returned'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border dark:bg-border-dark" />

            {/* Timeline Items */}
            <div className="space-y-6">
                {statusOrder.map((status, index) => {
                    const isPast = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isFuture = index > currentIndex;

                    const historyItem = statusHistory?.find(h => h.status === status);

                    return (
                        <div key={status} className="relative flex items-start gap-4">
                            {/* Status Icon */}
                            <div
                                className={`relative z-10 h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isCurrent
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : isPast
                                            ? 'bg-success text-white'
                                            : 'bg-background dark:bg-background-dark border-2 border-border dark:border-border-dark'
                                    }`}
                            >
                                {isPast || isCurrent ? (
                                    <CheckCircle className="w-6 h-6" />
                                ) : (
                                    <Clock className="w-6 h-6 text-text-dim dark:text-text-dim-dark" />
                                )}
                            </div>

                            {/* Status Info */}
                            <div className="flex-1 pt-2">
                                <p
                                    className={`font-semibold ${isCurrent
                                            ? 'text-primary'
                                            : isPast
                                                ? 'text-text-main dark:text-text-main-dark'
                                                : 'text-text-dim dark:text-text-dim-dark'
                                        }`}
                                >
                                    {statusLabels[status]}
                                </p>
                                {historyItem && (
                                    <div className="mt-1 space-y-1">
                                        <p className="text-sm text-text-dim dark:text-text-dim-dark">
                                            {format(new Date(historyItem.timestamp), 'MMM d, yyyy • h:mm a')}
                                        </p>
                                        {historyItem.note && (
                                            <p className="text-sm text-text-main dark:text-text-main-dark">
                                                {historyItem.note}
                                            </p>
                                        )}
                                    </div>
                                )}
                                {isCurrent && !historyItem && (
                                    <p className="text-sm text-primary mt-1">Current Status</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
