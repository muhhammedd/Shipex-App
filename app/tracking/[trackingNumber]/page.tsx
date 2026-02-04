'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Package,
    Search,
    MapPin,
    Phone,
    DollarSign,
    Calendar,
    User,
    Share2,
    ArrowLeft
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { StatusTimeline } from '@/components/tracking/StatusTimeline';
import { trackingService } from '@/lib/services/trackingService';
import { Order, OrderStatus } from '@/types/models';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function TrackingPage() {
    const params = useParams();
    const router = useRouter();
    const trackingNumber = params?.trackingNumber as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (trackingNumber) {
            loadOrder(trackingNumber);
        }
    }, [trackingNumber]);

    const loadOrder = async (tracking: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await trackingService.trackOrder(tracking);
            setOrder(data);
        } catch (err: any) {
            console.error('Error loading order:', err);
            setError(err.response?.status === 404 ? 'Order not found' : 'Failed to load order');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            router.push(`/tracking/${searchInput.trim()}`);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Track Order ${trackingNumber}`,
                    text: `Track your Shipex order`,
                    url: url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const getStatusColor = (status: OrderStatus): 'success' | 'warning' | 'info' | 'error' => {
        if (status === OrderStatus.DELIVERED) return 'success';
        if (status === OrderStatus.CANCELLED || status === OrderStatus.RETURNED) return 'error';
        if (status === OrderStatus.OUT_FOR_DELIVERY) return 'warning';
        return 'info';
    };

    return (
        <div className="min-h-screen bg-background dark:bg-background-dark">
            {/* Header */}
            <div className="bg-primary text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold font-gilroy mb-2">Track Your Order</h1>
                        <p className="text-primary-light/80">
                            Enter your tracking number to see real-time updates
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="container mx-auto px-4 -mt-6">
                <div className="max-w-4xl mx-auto">
                    <Card variant="default" className="p-6">
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <div className="flex-1">
                                <Input
                                    leftIcon={<Search className="w-5 h-5" />}
                                    placeholder="Enter tracking number..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>
                            <Button type="submit" variant="primary">
                                Track
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {isLoading ? (
                        <Loading text="Loading order details..." />
                    ) : error ? (
                        <Card variant="default" className="p-16 text-center">
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="h-16 w-16 bg-error/10 rounded-2xl flex items-center justify-center mx-auto text-error">
                                    <Package size={32} />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-text-main dark:text-text-main-dark">
                                        {error}
                                    </p>
                                    <p className="text-sm text-text-dim dark:text-text-dim-dark mt-2">
                                        Please check your tracking number and try again
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ) : order ? (
                        <div className="space-y-6">
                            {/* Order Header */}
                            <Card variant="default" className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-text-dim dark:text-text-dim-dark mb-1">
                                            Tracking Number
                                        </p>
                                        <p className="text-2xl font-bold font-mono text-primary">
                                            {order.trackingNumber}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant={getStatusColor(order.status)} size="lg">
                                            {order.status.replace('_', ' ')}
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleShare}
                                            leftIcon={<Share2 className="w-4 h-4" />}
                                        >
                                            Share
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-text-dim dark:text-text-dim-dark">
                                                Order Date
                                            </p>
                                            <p className="text-sm font-medium text-text-main dark:text-text-main-dark">
                                                {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-text-dim dark:text-text-dim-dark">
                                                Package
                                            </p>
                                            <p className="text-sm font-medium text-text-main dark:text-text-main-dark">
                                                {order.packageDescription || 'Standard Package'}
                                            </p>
                                        </div>
                                    </div>
                                    {order.codAmount && order.codAmount > 0 && (
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="w-5 h-5 text-success" />
                                            <div>
                                                <p className="text-xs text-text-dim dark:text-text-dim-dark">
                                                    COD Amount
                                                </p>
                                                <p className="text-sm font-medium text-success">
                                                    ${Number(order.codAmount).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Recipient Details */}
                            <Card variant="default" className="p-6">
                                <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-4">
                                    Delivery Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-sm text-text-dim dark:text-text-dim-dark">
                                                Recipient
                                            </p>
                                            <p className="font-medium text-text-main dark:text-text-main-dark">
                                                {order.recipientName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-sm text-text-dim dark:text-text-dim-dark">
                                                Phone
                                            </p>
                                            <p className="font-medium text-text-main dark:text-text-main-dark">
                                                {order.recipientPhone}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-sm text-text-dim dark:text-text-dim-dark">
                                                Delivery Address
                                            </p>
                                            <p className="font-medium text-text-main dark:text-text-main-dark">
                                                {order.recipientAddress}
                                            </p>
                                            <p className="text-sm text-text-dim dark:text-text-dim-dark">
                                                {order.recipientCity}
                                                {order.recipientZone && `, ${order.recipientZone}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Status Timeline */}
                            <Card variant="default" className="p-6">
                                <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-6">
                                    Order Timeline
                                </h3>
                                <StatusTimeline currentStatus={order.status} />
                            </Card>
                        </div>
                    ) : (
                        <Card variant="default" className="p-16 text-center">
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="h-16 w-16 bg-background dark:bg-background-dark rounded-2xl border border-border dark:border-border-dark flex items-center justify-center mx-auto text-text-dim dark:text-text-dim-dark">
                                    <Package size={32} />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-text-main dark:text-text-main-dark">
                                        Track Your Package
                                    </p>
                                    <p className="text-sm text-text-dim dark:text-text-dim-dark mt-2">
                                        Enter your tracking number above to see your order status
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
