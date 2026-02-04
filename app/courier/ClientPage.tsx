'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Package,
    MapPin,
    Phone,
    ChevronRight,
    Truck,
    CheckCircle2,
    Clock,
    Navigation,
    CircleDot
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { StatCard } from '@/components/ui/StatCard'; // While StatCard is desktop-first, we can adapt or use simple Cards for mobile stats
import { ordersApiService } from '@/lib/services/ordersApiService';
import { Order, OrderStatus } from '@/types/models';
import { format } from 'date-fns';

export default function CourierDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        loadAssignedOrders();
    }, []);

    const loadAssignedOrders = async () => {
        try {
            setIsLoading(true);
            const data = await ordersApiService.getAssignedOrders();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading assigned orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusConfig = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.ASSIGNED: return { label: 'New', color: 'text-primary', bg: 'bg-primary/10', icon: Clock };
            case OrderStatus.PICKED_UP: return { label: 'Picked Up', color: 'text-orange-500', bg: 'bg-orange-500/10', icon: Package };
            case OrderStatus.IN_TRANSIT: return { label: 'In Transit', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Truck };
            case OrderStatus.OUT_FOR_DELIVERY: return { label: 'Delivering', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Navigation };
            case OrderStatus.DELIVERED: return { label: 'Completed', color: 'text-success', bg: 'bg-success/10', icon: CheckCircle2 };
            default: return { label: status, color: 'text-text-dim', bg: 'bg-background-card', icon: CircleDot };
        }
    };

    const activeOrders = orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED);
    const completedToday = orders.filter(o => o.status === OrderStatus.DELIVERED).length; // Mock, ideally filter by date

    // Sort: High priority to In Progress, then Assigned
    const sortedOrders = [...activeOrders].sort((a, b) => {
        const priority = { [OrderStatus.OUT_FOR_DELIVERY]: 1, [OrderStatus.IN_TRANSIT]: 2, [OrderStatus.PICKED_UP]: 3, [OrderStatus.ASSIGNED]: 4 };
        return (priority[a.status as keyof typeof priority] || 5) - (priority[b.status as keyof typeof priority] || 5);
    });

    if (isLoading) return <Loading fullScreen text="Loading your tasks..." />;

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            {/* Mobile Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-main dark:text-text-main-dark">
                        Hello, Driver
                    </h1>
                    <p className="text-sm text-text-dim">
                        Ready to hit the road?
                    </p>
                </div>
                <div
                    onClick={() => setIsOnline(!isOnline)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors ${isOnline ? 'bg-success/10 text-success' : 'bg-text-dim/10 text-text-dim'}`}
                >
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-text-dim'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
            </div>

            {/* Quick Stats Row (Horizontal Scroll) */}
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                <div className="min-w-[140px] p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-between h-24">
                    <div className="flex items-center gap-2 text-primary">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Active</span>
                    </div>
                    <p className="text-2xl font-bold text-text-main dark:text-text-main-dark">{activeOrders.length}</p>
                </div>

                <div className="min-w-[140px] p-4 rounded-2xl bg-success/5 border border-success/10 flex flex-col justify-between h-24">
                    <div className="flex items-center gap-2 text-success">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Done</span>
                    </div>
                    <p className="text-2xl font-bold text-text-main dark:text-text-main-dark">{completedToday}</p>
                </div>

                <div className="min-w-[140px] p-4 rounded-2xl bg-background-card dark:bg-background-card-dark border border-border dark:border-border-dark flex flex-col justify-between h-24">
                    <div className="flex items-center gap-2 text-text-dim">
                        <Truck className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Distance</span>
                    </div>
                    <p className="text-2xl font-bold text-text-main dark:text-text-main-dark">45km</p>
                </div>
            </div>

            {/* Active Tasks List */}
            <div>
                <h2 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-4">Current Tasks</h2>
                <div className="space-y-4">
                    {sortedOrders.length > 0 ? (
                        sortedOrders.map((order) => {
                            const config = getStatusConfig(order.status);
                            const Icon = config.icon;

                            return (
                                <Card
                                    key={order.id}
                                    variant="default"
                                    className="p-5 active:scale-[0.98] transition-transform cursor-pointer border-l-4 border-l-primary"
                                    onClick={() => router.push(`/courier/orders/${order.id}`)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-text-dim uppercase tracking-wider">{order.trackingNumber}</p>
                                                <Badge variant="secondary" size="sm" className={`mt-1 font-semibold ${config.color} bg-opacity-10 border-none`}>
                                                    {config.label}
                                                </Badge>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-text-dim bg-background dark:bg-background-dark px-2 py-1 rounded-md">
                                            {format(new Date(order.updatedAt), 'HH:mm')}
                                        </span>
                                    </div>

                                    <div className="flex gap-3 items-start my-4">
                                        <div className="mt-1 flex flex-col items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-border dark:bg-border-dark" />
                                            <div className="w-0.5 h-8 bg-border dark:bg-border-dark" />
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <p className="text-xs text-text-dim font-medium uppercase">Pickup</p>
                                                <p className="text-sm font-semibold text-text-main dark:text-text-main-dark line-clamp-1">{order.merchant?.name || 'Merchant Warehouse'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-dim font-medium uppercase">Dropoff</p>
                                                <p className="text-sm font-semibold text-text-main dark:text-text-main-dark line-clamp-1">{order.recipientAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="w-full justify-between group" variant={order.status === OrderStatus.OUT_FOR_DELIVERY ? 'primary' : 'outline'}>
                                        <span>View Details</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 flex flex-col items-center">
                            <div className="h-24 w-24 bg-background-card dark:bg-background-card-dark rounded-full flex items-center justify-center mb-4">
                                <Truck className="h-10 w-10 text-text-dim" />
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark">No active tasks</h3>
                            <p className="text-sm text-text-dim">You're all caught up! Enjoy your break.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
