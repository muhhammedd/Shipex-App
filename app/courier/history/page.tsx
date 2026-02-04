'use client';

import { useState, useEffect } from 'react';
import {
    History,
    CheckCircle2,
    Calendar,
    Search,
    ChevronRight,
    Package
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { ordersApiService } from '@/lib/services/ordersApiService';
import { Order, OrderStatus } from '@/types/models';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function CourierHistoryPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setIsLoading(true);
            // Fetch delivered/cancelled orders for courier
            const response = await ordersApiService.getOrders({
                limit: 50,
                // In a real app we'd filter by status in the backend
            });

            const historyOrders = (response.data || []).filter(o =>
                [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.RETURNED].includes(o.status)
            );

            setOrders(historyOrders);
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = orders.filter(o =>
        o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <Loading text="Loading history..." />;

    return (
        <div className="space-y-6 pb-4">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delivery History</h2>
                <p className="text-sm text-gray-500">View your completed and cancelled deliveries</p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search tracking # or name..."
                    className="pl-10 h-11"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="space-y-3">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <Card
                            key={order.id}
                            className="p-4 shadow-sm hover:border-gray-300 transition-colors cursor-pointer"
                            onClick={() => router.push(`/courier/orders/${order.id}`)}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                                            {order.trackingNumber}
                                        </span>
                                        <Badge variant={order.status === OrderStatus.DELIVERED ? 'success' : 'error'} className="text-[10px]">
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {order.recipientName}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-500">
                                        <Calendar className="h-3 w-3" />
                                        {format(new Date(order.updatedAt), 'MMM d, yyyy')}
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-300 shrink-0" />
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No records found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
