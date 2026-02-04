'use client';

import { use, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Package,
    Truck,
    User,
    MapPin,
    Calendar,
    Clock,
    CheckCircle2,
    Circle,
    FileText,
    DollarSign,
    QrCode,
    AlertCircle,
    Phone,
    Mail,
    Globe
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { ActivityTimeline, Activity } from '@/components/ui/ActivityTimeline';
import { ordersApiService } from '@/lib/services/ordersApiService';
import { Order, OrderStatus } from '@/types/models';
import { format } from 'date-fns';

export default function OrderDetailsPage(props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = use(props.params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setIsLoading(true);
                const data = await ordersApiService.getOrderById(params.id);
                setOrder(data);
            } catch (err: any) {
                console.error('Error fetching order:', err);
                setError(err.response?.data?.message || 'Order not found');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [params.id]);

    const getStatusVariant = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.DELIVERED: return 'success';
            case OrderStatus.PENDING: return 'warning';
            case OrderStatus.CANCELLED:
            case OrderStatus.RETURNED: return 'error';
            case OrderStatus.IN_TRANSIT: return 'primary';
            default: return 'info';
        }
    };

    const timelineActivities: Activity[] = useMemo(() => {
        if (!order?.history) return [];
        return order.history.map((event): Activity => ({
            id: event.id,
            type: 'order',
            title: event.statusTo.replace(/_/g, ' '),
            description: event.notes || `Status updated from ${event.statusFrom.replace(/_/g, ' ')}`,
            timestamp: new Date(event.timestamp),
            status: event.statusTo as OrderStatus,
            icon: event.statusTo === OrderStatus.DELIVERED ? CheckCircle2 : Truck
        })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [order]);

    if (isLoading) return <Loading fullScreen text="Loading order details..." />;

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="p-6 rounded-full bg-error/10 text-error">
                    <AlertCircle className="h-12 w-12" />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-main dark:text-text-main-dark">{error || 'Order not found'}</h2>
                    <p className="text-text-dim mt-2">The requested order could not be located.</p>
                </div>
                <Button variant="outline" onClick={() => router.push('/merchant/orders')} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Return to Orders
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 w-8 p-0 rounded-full hover:bg-background-card dark:hover:bg-background-card-dark">
                            <ArrowLeft className="h-5 w-5 text-text-dim" />
                        </Button>
                        <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark tracking-tight">
                            Order #{order.trackingNumber}
                        </h1>
                        <Badge variant={getStatusVariant(order.status)} size="lg" className="capitalize rounded-full px-4">
                            {order.status.replace(/_/g, ' ')}
                        </Badge>
                    </div>
                    <p className="text-text-dim dark:text-text-dim-dark pl-11 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Created on {format(new Date(order.createdAt), 'MMMM d, yyyy')} at {format(new Date(order.createdAt), 'HH:mm')}
                    </p>
                </div>
                <div className="flex items-center gap-3 pl-11 md:pl-0">
                    <Button variant="outline" leftIcon={<FileText className="h-4 w-4" />}>
                        Invoice
                    </Button>
                    <Button variant="primary" leftIcon={<QrCode className="h-4 w-4" />}>
                        Shipping Label
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipment Details Card */}
                    <Card variant="default" className="p-0 overflow-hidden">
                        <div className="p-6 border-b border-border dark:border-border-dark bg-background-card dark:bg-background-card-dark flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Package className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">Shipment Details</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-text-dim uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <User className="h-3 w-3" /> Recipient
                                    </h4>
                                    <div className="bg-background dark:bg-background-dark p-4 rounded-xl border border-border dark:border-border-dark space-y-1">
                                        <p className="font-semibold text-text-main dark:text-text-main-dark">{order.recipientName}</p>
                                        <p className="text-sm text-text-dim">{order.recipientPhone}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-text-dim uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> Delivery Address
                                    </h4>
                                    <div className="bg-background dark:bg-background-dark p-4 rounded-xl border border-border dark:border-border-dark space-y-1">
                                        <p className="font-medium text-text-main dark:text-text-main-dark">{order.recipientAddress}</p>
                                        <p className="text-sm text-text-dim">
                                            {order.recipientCity}{order.recipientZone ? `, ${order.recipientZone}` : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-text-dim uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Package className="h-3 w-3" /> Package Info
                                    </h4>
                                    <div className="bg-background dark:bg-background-dark p-4 rounded-xl border border-border dark:border-border-dark space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-border dark:border-border-dark">
                                            <span className="text-sm text-text-dim">Content</span>
                                            <span className="font-medium text-text-main dark:text-text-main-dark">{order.packageDescription || 'Standard Parcel'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-border dark:border-border-dark">
                                            <span className="text-sm text-text-dim">Weight</span>
                                            <span className="font-medium text-text-main dark:text-text-main-dark">{order.packageWeight} kg</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-text-dim">Dimensions</span>
                                            <span className="font-medium text-text-main dark:text-text-main-dark">{order.packageDimensions || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-text-dim uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <DollarSign className="h-3 w-3" /> Financials
                                    </h4>
                                    <div className="bg-background dark:bg-background-dark p-4 rounded-xl border border-border dark:border-border-dark space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-border dark:border-border-dark">
                                            <span className="text-sm text-text-dim">Shipping Cost</span>
                                            <span className="font-medium text-text-main dark:text-text-main-dark">${Number(order.shippingCost).toFixed(2)}</span>
                                        </div>
                                        {(order.codAmount ?? 0) > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-text-dim">COD Amount</span>
                                                <span className="font-bold text-success">${Number(order.codAmount).toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Order History Timeline */}
                    <Card variant="glass" className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">Tracking History</h3>
                        </div>
                        <ActivityTimeline activities={timelineActivities} />
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Courier Info */}
                    <Card variant="default" className="p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border dark:border-border-dark">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <Truck className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-text-main dark:text-text-main-dark">Courier</h3>
                        </div>
                        {order.courier ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                        {order.courier.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-text-main dark:text-text-main-dark">{order.courier.name}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                            <p className="text-xs text-text-dim">Active Now</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start" leftIcon={<Phone className="h-4 w-4" />}>
                                        {order.courier.courierProfile?.phoneNumber || 'Call Courier'}
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" leftIcon={<Mail className="h-4 w-4" />}>
                                        {order.courier.email}
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" leftIcon={<Globe className="h-4 w-4" />}>
                                        Live Location
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 rounded-full bg-background dark:bg-background-dark mx-auto flex items-center justify-center mb-3">
                                    <User className="h-6 w-6 text-text-dim" />
                                </div>
                                <p className="font-medium text-text-main dark:text-text-main-dark">No Courier Assigned</p>
                                <p className="text-sm text-text-dim mt-1">Order is currently pending assignment.</p>
                            </div>
                        )}
                    </Card>

                    {/* Support Card */}
                    <Card variant="glass" className="p-6 bg-gradient-to-br from-background to-background-card">
                        <h3 className="font-bold text-text-main dark:text-text-main-dark mb-4">Need Help?</h3>
                        <div className="space-y-3">
                            <Button variant="ghost" className="w-full justify-start text-text-dim hover:text-primary">
                                Report Issue
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-text-dim hover:text-primary">
                                Contact Support
                            </Button>
                            {order.status === OrderStatus.PENDING && (
                                <Button variant="danger" className="w-full mt-4">
                                    Cancel Order
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
