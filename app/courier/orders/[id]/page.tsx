'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Package,
    Navigation,
    Phone,
    MapPin,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    ChevronUp,
    ChevronDown,
    Camera
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { Modal } from '@/components/ui/Modal';
import { SignaturePad } from '@/components/ui/SignaturePad';
import { PhotoUpload } from '@/components/courier/PhotoUpload';
import { GPSCapture } from '@/components/courier/GPSCapture';
import { ordersApiService } from '@/lib/services/ordersApiService';
import { Order, OrderStatus } from '@/types/models';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function CourierOrderDetailPage(props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = use(props.params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);

    useEffect(() => {
        loadOrder();
    }, [params.id]);

    const loadOrder = async () => {
        try {
            setIsLoading(true);
            const data = await ordersApiService.getOrderById(params.id);
            setOrder(data);
        } catch (err) {
            toast.error('Failed to load order details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (nextStatus: OrderStatus) => {
        if (!order) return;

        try {
            setIsUpdating(true);
            await ordersApiService.updateOrderStatus(order.id, {
                status: nextStatus,
                // Include proof if delivering
                ...(nextStatus === OrderStatus.DELIVERED && signature ? { proofOfDelivery: signature } : {})
            });
            await loadOrder();
            toast.success(`Status updated to ${nextStatus.replace('_', ' ')}`);
            setShowProofModal(false);
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleActionClick = () => {
        if (!order) return;

        if (order.status === OrderStatus.OUT_FOR_DELIVERY) {
            setShowProofModal(true);
        } else {
            // Determine next status automatically for simpler flows
            let nextStatus;
            if (order.status === OrderStatus.ASSIGNED) nextStatus = OrderStatus.PICKED_UP;
            else if (order.status === OrderStatus.PICKED_UP) nextStatus = OrderStatus.IN_TRANSIT;
            else if (order.status === OrderStatus.IN_TRANSIT) nextStatus = OrderStatus.OUT_FOR_DELIVERY;

            if (nextStatus) handleUpdateStatus(nextStatus);
        }
    };

    const getActionLabel = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.ASSIGNED: return 'Confirm Pickup';
            case OrderStatus.PICKED_UP: return 'Start Route';
            case OrderStatus.IN_TRANSIT: return 'Arrived at Dropoff';
            case OrderStatus.OUT_FOR_DELIVERY: return 'Complete Delivery';
            default: return null;
        }
    };

    const openNavigation = () => {
        if (!order) return;
        const address = `${order.recipientAddress}, ${order.recipientCity}`;
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    };

    if (isLoading) return <Loading fullScreen text="Loading manifest..." />;
    if (!order) return <div className="p-8 text-center text-text-dim">Order not found</div>;

    const actionLabel = getActionLabel(order.status);

    return (
        <div className="pb-28 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-background/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border dark:border-border-dark p-4 flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-10 w-10 p-0 rounded-full">
                    <ArrowLeft className="h-6 w-6 text-text-main dark:text-text-main-dark" />
                </Button>
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-text-main dark:text-text-main-dark leading-tight">{order.trackingNumber}</h2>
                    <p className="text-xs text-text-dim font-medium uppercase tracking-wider">{order.status.replace('_', ' ')}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(`tel:${order.recipientPhone}`)}
                        className="h-10 w-10 p-0 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none"
                    >
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={openNavigation}
                        className="h-10 w-10 p-0 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-none"
                    >
                        <Navigation className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Status Progress */}
                <Card variant="default" className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-text-dim uppercase">Shipment Progress</h3>
                        <Badge variant={order.status === OrderStatus.DELIVERED ? 'success' : 'primary'}>
                            {order.status === OrderStatus.DELIVERED ? 'Completed' : 'Active'}
                        </Badge>
                    </div>
                    <div className="relative pl-4 space-y-6 border-l-2 border-border dark:border-border-dark ml-2">
                        {order.history?.map((h, i) => (
                            <div key={h.id} className="relative">
                                <div className={`absolute -left-[21px] top-0 h-4 w-4 rounded-full border-2 border-background dark:border-background-dark ${i === 0 ? 'bg-primary' : 'bg-text-dim/30'}`} />
                                <p className="text-sm font-bold text-text-main dark:text-text-main-dark leading-none">{h.statusTo.replace('_', ' ')}</p>
                                <p className="text-xs text-text-dim mt-1">{format(new Date(h.timestamp), 'h:mm a · MMM d')}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Delivery Info */}
                <Card variant="default" className="p-0 overflow-hidden">
                    <div className="p-4 bg-background-card dark:bg-background-card-dark border-b border-border dark:border-border-dark">
                        <h3 className="text-sm font-bold text-text-dim uppercase">Destination</h3>
                    </div>
                    <div className="p-5">
                        <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                            <div>
                                <p className="text-lg font-bold text-text-main dark:text-text-main-dark leading-snug">{order.recipientAddress}</p>
                                <p className="text-sm text-text-dim mt-1">{order.recipientCity}, {order.recipientZone}</p>
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-background-card/50 dark:bg-background-card-dark/50 rounded-lg">
                                    <Package className="h-4 w-4 text-text-dim" />
                                    <span className="text-sm font-medium text-text-main dark:text-text-main-dark">{order.recipientName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Package Details */}
                <div className="grid grid-cols-2 gap-4">
                    <Card variant="glass" className="p-4">
                        <p className="text-xs font-bold text-text-dim uppercase mb-1">Details</p>
                        <p className="text-lg font-bold text-text-main dark:text-text-main-dark">{order.packageWeight} kg</p>
                        <p className="text-xs text-text-dim truncate">{order.packageDescription}</p>
                    </Card>
                    <Card variant="glass" className="p-4">
                        <p className="text-xs font-bold text-text-dim uppercase mb-1">COD Amount</p>
                        <p className="text-lg font-bold text-success flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {order.codAmount?.toFixed(2) || '0.00'}
                        </p>
                    </Card>
                </div>
            </div>

            {/* Sticky Action Footer */}
            {actionLabel && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background dark:bg-background-dark border-t border-border dark:border-border-dark mb-safe">
                    <Button
                        size="lg"
                        className="w-full text-lg font-bold shadow-lg h-14"
                        variant="primary"
                        onClick={handleActionClick}
                        isLoading={isUpdating}
                    >
                        {actionLabel}
                    </Button>
                </div>
            )}

            {/* Proof of Delivery Modal */}
            <Modal isOpen={showProofModal} onClose={() => setShowProofModal(false)} title="Proof of Delivery">
                <DeliveryProofForm
                    onSubmit={async (proofData) => {
                        try {
                            setIsUpdating(true);
                            await ordersApiService.updateOrderStatus(order.id, {
                                status: OrderStatus.DELIVERED,
                                ...proofData
                            });
                            await loadOrder();
                            toast.success('Delivery completed successfully!');
                            setShowProofModal(false);
                        } catch (error) {
                            toast.error('Failed to complete delivery');
                        } finally {
                            setIsUpdating(false);
                        }
                    }}
                    isSubmitting={isUpdating}
                />
            </Modal>
        </div>
    );
}

// Delivery Proof Form Component
function DeliveryProofForm({ onSubmit, isSubmitting }: {
    onSubmit: (data: any) => Promise<void>;
    isSubmitting: boolean;
}) {
    const [photos, setPhotos] = useState<File[]>([]);
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | undefined>();
    const [notes, setNotes] = useState('');
    const [signature, setSignature] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (photos.length === 0) {
            toast.error('Please upload at least one photo');
            return;
        }
        if (!coordinates) {
            toast.error('Please capture GPS location');
            return;
        }

        // In a real app, you'd upload photos to a server first
        // For now, we'll just pass the data structure
        await onSubmit({
            photos: photos.map(p => p.name), // In reality, these would be URLs after upload
            gpsCoordinates: coordinates,
            notes: notes || undefined,
            signature: signature || undefined,
        });
    };

    return (
        <div className="space-y-6">
            <PhotoUpload photos={photos} onPhotosChange={setPhotos} />
            <GPSCapture onLocationCapture={setCoordinates} coordinates={coordinates} />

            <div>
                <label className="block text-sm font-medium text-text-main dark:text-text-main-dark mb-2">
                    Delivery Notes (Optional)
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about the delivery..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-border dark:border-border-dark bg-background-card dark:bg-background-card-dark text-text-main dark:text-text-main-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
            </div>

            <div>
                <p className="text-sm font-medium text-text-main dark:text-text-main-dark mb-4">
                    Recipient Signature
                </p>
                <SignaturePad onSave={setSignature} />
            </div>

            <Button
                variant="primary"
                className="w-full"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={photos.length === 0 || !coordinates}
            >
                Complete Delivery
            </Button>
        </div>
    );
}
