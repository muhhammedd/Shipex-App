'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Package,
    TrendingUp,
    Clock,
    CheckCircle,
    PlusCircle,
    Download,
    FileText,
    BookOpen,
    Upload,
    ArrowRight,
    DollarSign,
    Truck,
    AlertCircle,
    BarChart3,
    PieChart as PieChartIcon
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { Skeleton, CardSkeleton, StatCardSkeleton, TableRowSkeleton, MetricSkeleton } from '@/components/ui/Skeleton';
import { ActivityTimeline, Activity } from '@/components/ui/ActivityTimeline';
import { QuickActionsPanel } from '@/components/ui/QuickActionsPanel';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const OrdersChart = dynamic(() => import('@/components/ui/OrdersChart').then(mod => mod.OrdersChart), {
    loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />,
    ssr: false
});
import { ordersApiService } from '@/lib/services/ordersApiService';
import { Order, OrderStatus } from '@/types/models';
import { format, subDays, startOfDay } from 'date-fns';

export default function MerchantDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            const ordersResponse = await ordersApiService.getOrders({ limit: 10 });
            const ordersData = (ordersResponse as any).orders || (ordersResponse as any).data || ordersResponse;
            const ordersArray = Array.isArray(ordersData) ? ordersData : [];
            setOrders(ordersArray);

            // Generate activities from orders
            const generatedActivities: Activity[] = ordersArray.slice(0, 5).map((order) => ({
                id: order.id,
                type: 'order' as const,
                title: `Order ${order.trackingNumber}`,
                description: `${order.status === OrderStatus.DELIVERED ? 'Delivered to' : 'Shipping to'} ${order.recipientCity}`,
                timestamp: new Date(order.createdAt || Date.now()),
                status: order.status,
            }));
            setActivities(generatedActivities);

            try {
                const balanceResponse = await ordersApiService.getMerchantBalance();
                setBalance(balanceResponse.balance);
            } catch (error) {
                console.error('Error loading balance:', error);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate chart data from orders or use defaults if empty
    const orderTrends = useMemo(() => {
        if (orders.length === 0) return [
            { date: 'Mon', count: 12 },
            { date: 'Tue', count: 19 },
            { date: 'Wed', count: 15 },
            { date: 'Thu', count: 22 },
            { date: 'Fri', count: 30 },
            { date: 'Sat', count: 25 },
            { date: 'Sun', count: 18 },
        ];

        // Simple grouping by date for demonstration
        // In a real app, this would come from an analytics endpoint
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = subDays(new Date(), 6 - i);
            const dateStr = format(d, 'MMM dd');
            const dayStart = startOfDay(d).getTime();
            const dayEnd = dayStart + 86400000;

            const count = orders.filter(o => {
                const orderDate = new Date(o.createdAt).getTime();
                return orderDate >= dayStart && orderDate < dayEnd;
            }).length;

            return { date: format(d, 'EEE'), count: count + Math.floor(Math.random() * 5) }; // Adding some mock randomness for visual if empty
        });

        return last7Days;
    }, [orders]);

    const statusDistribution = useMemo(() => {
        const counts = {
            transit: orders.filter(o => [OrderStatus.IN_TRANSIT, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.ASSIGNED].includes(o.status)).length,
            delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
            pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
            created: orders.filter(o => o.status === OrderStatus.CREATED).length,
            cancelled: orders.filter(o => [OrderStatus.CANCELLED, OrderStatus.RETURNED].includes(o.status)).length,
        };

        // If no data, return mock distribution for better visual preview
        if (orders.length === 0) {
            return [
                { name: 'In Transit', value: 35 },
                { name: 'Delivered', value: 45 },
                { name: 'Pending', value: 10 },
                { name: 'Created', value: 5 },
                { name: 'Cancelled', value: 5 },
            ];
        }

        return [
            { name: 'In Transit', value: counts.transit },
            { name: 'Delivered', value: counts.delivered },
            { name: 'Pending', value: counts.pending },
            { name: 'Created', value: counts.created },
            { name: 'Cancelled', value: counts.cancelled },
        ].filter(item => item.value > 0);
    }, [orders]);

    const getStatusBadge = (status: OrderStatus) => {
        const statusConfig: Record<OrderStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'primary', label: string }> = {
            [OrderStatus.CREATED]: { variant: 'info', label: 'Created' },
            [OrderStatus.PENDING]: { variant: 'warning', label: 'Pending' },
            [OrderStatus.ASSIGNED]: { variant: 'primary', label: 'Assigned' },
            [OrderStatus.PICKED_UP]: { variant: 'info', label: 'Picked Up' },
            [OrderStatus.IN_TRANSIT]: { variant: 'primary', label: 'In Transit' },
            [OrderStatus.OUT_FOR_DELIVERY]: { variant: 'info', label: 'Out for Delivery' },
            [OrderStatus.DELIVERED]: { variant: 'success', label: 'Delivered' },
            [OrderStatus.CANCELLED]: { variant: 'error', label: 'Cancelled' },
            [OrderStatus.RETURNED]: { variant: 'warning', label: 'Returned' },
        };
        const config = statusConfig[status] || { variant: 'info' as const, label: status };
        return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
    };

    if (isLoading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header Skeleton */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-5 w-96" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <StatCardSkeleton key={i} />
                    ))}
                </div>

                {/* Quick Actions Skeleton */}
                <Card variant="default" className="p-4">
                    <div className="flex justify-between gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </Card>

                {/* Charts Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <CardSkeleton />
                    </div>
                    <div className="lg:col-span-1">
                        <CardSkeleton />
                    </div>
                </div>

                {/* Balance & Activity Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <MetricSkeleton />
                    </div>
                    <div className="lg:col-span-2">
                        <CardSkeleton />
                    </div>
                </div>

                {/* Table Skeleton */}
                <Card variant="default" className="overflow-hidden">
                    <div className="p-6 border-b border-border dark:border-border-dark flex justify-between">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                    <div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRowSkeleton key={i} cols={5} />
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    const stats = {
        total: orders.length,
        inTransit: orders.filter(o => [OrderStatus.ASSIGNED, OrderStatus.PICKED_UP, OrderStatus.IN_TRANSIT, OrderStatus.OUT_FOR_DELIVERY].includes(o.status)).length,
        pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
        delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
    };

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

    const quickActions = [
        {
            icon: PlusCircle,
            label: 'New Shipment',
            description: 'Create a new order',
            href: '/merchant/orders/new',
            variant: 'primary' as const,
        },
        {
            icon: Upload,
            label: 'Bulk Import',
            description: 'Import multiple orders',
            href: '/merchant/import',
            variant: 'secondary' as const,
        },
        {
            icon: BookOpen,
            label: 'Templates',
            description: 'Use saved templates',
            href: '/merchant/templates',
            variant: 'secondary' as const,
        },
        {
            icon: FileText,
            label: 'Address Book',
            description: 'Manage addresses',
            href: '/merchant/address-book',
            variant: 'secondary' as const,
        },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
            className="space-y-8"
        >
            {/* Header with Greeting */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-text-main dark:text-text-main-dark font-gilroy">
                        {greeting}, <span className="text-primary">Merchant</span>
                    </h1>
                    <p className="text-text-dim dark:text-text-dim-dark mt-2">
                        Here's what's happening with your shipments today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        leftIcon={<Download className="w-4 h-4" />}
                    >
                        Export Data
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Shipments"
                    value={stats.total}
                    icon={Package}
                    trend={{ value: 12.5, label: "from last week" }}
                    variant="gradient-primary"
                />
                <StatCard
                    label="In Transit"
                    value={stats.inTransit}
                    icon={Truck}
                    trend={{ value: 8.2, label: "volume up" }}
                    variant="default"
                />
                <StatCard
                    label="Pending"
                    value={stats.pending}
                    icon={Clock}
                    trend={{ value: -3.1, label: "backlog" }}
                    variant="default"
                />
                <StatCard
                    label="Delivered"
                    value={stats.delivered}
                    icon={CheckCircle}
                    trend={{ value: 15.8, label: "completion rate" }}
                    variant="gradient-success"
                />
            </div>

            {/* Quick Actions Panel */}
            <QuickActionsPanel />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card variant="glass" className="p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-text-main dark:text-text-main-dark">
                                Shipment Trends
                            </h3>
                            <p className="text-sm text-text-dim dark:text-text-dim-dark">
                                Order volume over the last 7 days
                            </p>
                        </div>
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                    </div>
                    <OrdersChart data={orderTrends} type="area" variant="primary" height={250} />
                </Card>

                <Card variant="glass" className="p-6 lg:col-span-1">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-text-main dark:text-text-main-dark">
                                Status
                            </h3>
                            <p className="text-sm text-text-dim dark:text-text-dim-dark">
                                Current distribution
                            </p>
                        </div>
                        <div className="p-2 rounded-lg bg-success/10 text-success">
                            <PieChartIcon className="w-5 h-5" />
                        </div>
                    </div>
                    <OrdersChart data={statusDistribution} type="donut" height={250} />
                </Card>
            </div>

            {/* Balance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card variant="hover" className="p-6 lg:col-span-1">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-success/10 text-success">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-dim dark:text-text-dim-dark">
                                Account Balance
                            </p>
                            <p className="text-3xl font-bold text-text-main dark:text-text-main-dark">
                                ${balance.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => router.push('/merchant/finance')}
                    >
                        View Finance
                    </Button>
                </Card>

                <Card variant="glass" className="p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark">
                            Recent Activity
                        </h3>
                    </div>
                    <ActivityTimeline activities={activities} />
                </Card>
            </div>

            {/* Recent Orders Table */}
            <Card variant="default" className="overflow-hidden">
                <div className="p-6 border-b border-border dark:border-border-dark flex items-center justify-between">
                    <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark">
                        Recent Orders
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/merchant/orders')}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                        View All
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background dark:bg-background-dark border-b border-border dark:border-border-dark">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">
                                    Tracking Number
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">
                                    Recipient
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">
                                    Cost
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-border-dark">
                            {orders.slice(0, 5).map((order) => {
                                let formattedDate = 'N/A';
                                try {
                                    if (order?.createdAt) {
                                        formattedDate = format(new Date(order.createdAt), 'MMM d, yyyy');
                                    }
                                } catch (e) {
                                    console.error('Date formatting error:', e);
                                }

                                return (
                                    <tr
                                        key={order.id}
                                        className="group hover:bg-primary/5 dark:hover:bg-primary/5 cursor-pointer transition-colors duration-200"
                                        onClick={() => router.push(`/merchant/orders/${order.id}`)}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-primary">
                                                {order?.trackingNumber || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-text-main dark:text-text-main-dark">
                                                    {order?.recipientName || 'Unknown'}
                                                </span>
                                                <span className="text-xs text-text-dim dark:text-text-dim-dark">
                                                    {order?.recipientCity || 'No City'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {order?.status && getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-text-main dark:text-text-main-dark text-sm">
                                            ${(order?.shippingCost || 0).toString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-dim dark:text-text-dim-dark">
                                            {formattedDate}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div className="p-16 text-center space-y-4">
                        <div className="h-16 w-16 bg-background dark:bg-background-dark rounded-2xl border border-border dark:border-border-dark flex items-center justify-center mx-auto text-text-dim dark:text-text-dim-dark">
                            <Package size={32} />
                        </div>
                        <div className="max-w-sm mx-auto">
                            <p className="text-sm font-semibold text-text-main dark:text-text-main-dark uppercase tracking-wide">
                                No Shipments Yet
                            </p>
                            <p className="text-sm text-text-dim dark:text-text-dim-dark mt-2">
                                Create your first shipment to get started with tracking and management.
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push('/merchant/orders/new')}
                            variant="primary"
                            leftIcon={<PlusCircle className="w-4 h-4" />}
                        >
                            Create Shipment
                        </Button>
                    </div>
                )}
            </Card>
        </motion.div>
    );
}
