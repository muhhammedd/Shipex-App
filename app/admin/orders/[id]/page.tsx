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
  DollarSign,
  UserPlus,
  Building2,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  History as HistoryIcon
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { ActivityTimeline, Activity } from '@/components/ui/ActivityTimeline';
import { CourierAssignmentModal } from '@/components/ui/CourierAssignmentModal';
import { ordersApiService } from '@/lib/services/ordersApiService';
import { Order, OrderStatus } from '@/types/models';
import { format } from 'date-fns';

export default function AdminOrderDetailPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(props.params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const data = await ordersApiService.getOrderById(params.id);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order for admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'warning';
      case OrderStatus.DELIVERED: return 'success';
      case OrderStatus.CANCELLED: return 'error';
      case OrderStatus.IN_TRANSIT: return 'primary';
      default: return 'secondary';
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

  if (isLoading) return <Loading fullScreen text="Loading system records..." />;

  if (!order) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="p-4 rounded-full bg-error/10 text-error">
        <AlertCircle className="h-12 w-12" />
      </div>
      <h2 className="text-xl font-bold text-text-main dark:text-text-main-dark">Order Not Found</h2>
      <p className="text-text-dim">The requested order could not be located in the system.</p>
      <Button variant="outline" onClick={() => router.back()}>Return to Orders</Button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-10 w-10 p-0 rounded-full hover:bg-background-card dark:hover:bg-background-card-dark">
            <ArrowLeft className="h-5 w-5 text-text-dim" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark tracking-tight">
                {order.trackingNumber}
              </h1>
              <Badge variant={getStatusVariant(order.status)} size="lg" className="capitalize rounded-full px-4">
                {order.status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <p className="text-sm text-text-dim mt-1">
              System ID: <span className="font-mono">{order.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={<UserPlus className="h-4 w-4" />}
            onClick={() => setIsAssignmentOpen(true)}
          >
            {order.courier ? 'Reassign Courier' : 'Assign Courier'}
          </Button>
          <Button variant="primary" leftIcon={<FileText className="h-4 w-4" />}>
            Log Audit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Parties Card */}
          <Card variant="default" className="p-0 overflow-hidden">
            <div className="p-6 border-b border-border dark:border-border-dark bg-background-card dark:bg-background-card-dark flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <User className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">Involved Parties</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-text-dim uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="h-3 w-3" /> Merchant
                </h4>
                <div className="bg-background dark:bg-background-dark p-4 rounded-xl border border-border dark:border-border-dark space-y-1">
                  <p className="font-bold text-text-main dark:text-text-main-dark text-lg">
                    {order.merchant?.merchantProfile?.businessName || order.merchant?.name}
                  </p>
                  <p className="text-sm text-text-dim">{order.merchant?.email}</p>
                  <div className="mt-2 pt-2 border-t border-border dark:border-border-dark">
                    <p className="text-xs text-text-dim">{order.merchant?.merchantProfile?.businessAddress || 'No Address'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-text-dim uppercase tracking-wider flex items-center gap-2">
                  <User className="h-3 w-3" /> Recipient
                </h4>
                <div className="bg-background dark:bg-background-dark p-4 rounded-xl border border-border dark:border-border-dark space-y-1">
                  <p className="font-bold text-text-main dark:text-text-main-dark text-lg">
                    {order.recipientName}
                  </p>
                  <p className="text-sm text-text-dim">{order.recipientPhone}</p>
                  <div className="mt-2 pt-2 border-t border-border dark:border-border-dark">
                    <p className="text-xs text-text-dim">{order.recipientAddress}</p>
                    <p className="text-xs text-text-dim font-semibold">{order.recipientCity}, {order.recipientZone}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Package & Financials */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <Package className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">Package & Financials</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 rounded-xl bg-background-card dark:bg-background-card-dark border border-border dark:border-border-dark text-center">
                <p className="text-xs text-text-dim uppercase tracking-wider mb-1">Weight</p>
                <p className="text-lg font-bold text-text-main dark:text-text-main-dark">{order.packageWeight} kg</p>
              </div>
              <div className="p-4 rounded-xl bg-background-card dark:bg-background-card-dark border border-border dark:border-border-dark text-center">
                <p className="text-xs text-text-dim uppercase tracking-wider mb-1">Dimensions</p>
                <p className="text-lg font-bold text-text-main dark:text-text-main-dark">{order.packageDimensions || 'STD'}</p>
              </div>
              <div className="p-4 rounded-xl bg-background-card dark:bg-background-card-dark border border-border dark:border-border-dark text-center">
                <p className="text-xs text-text-dim uppercase tracking-wider mb-1">Declared Value</p>
                <p className="text-lg font-bold text-text-main dark:text-text-main-dark">${order.declaredValue}</p>
              </div>
              <div className="p-4 rounded-xl bg-background-card dark:bg-background-card-dark border border-border dark:border-border-dark text-center">
                <p className="text-xs text-text-dim uppercase tracking-wider mb-1">Pending COD</p>
                <p className="text-lg font-bold text-primary">${order.codAmount || 0}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border dark:border-border-dark">
              <p className="text-sm text-text-dim italic">
                <span className="font-semibold not-italic text-text-main dark:text-text-main-dark">Content Description: </span>
                {order.packageDescription || 'No description available'}
              </p>
            </div>
          </Card>

          {/* Timeline */}
          <Card variant="default" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <HistoryIcon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">System Timeline</h3>
            </div>
            <ActivityTimeline activities={timelineActivities} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Courier Profile */}
          <Card variant="default" className="p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-text-main dark:text-text-main-dark">Assigned Courier</h3>
            </div>

            {order.courier ? (
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {order.courier.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-text-main dark:text-text-main-dark">{order.courier.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="success" size="sm" className="h-5 text-[10px]">Active</Badge>
                      <span className="text-xs text-text-dim">{order.courier.email}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<Phone className="w-3 h-3" />}>
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<Mail className="w-3 h-3" />}>
                    Email
                  </Button>
                </div>

                <Button
                  variant="secondary"
                  className="w-full mt-2"
                  onClick={() => setIsAssignmentOpen(true)}
                >
                  Transfer Assignment
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 relative z-10">
                <div className="w-12 h-12 rounded-full bg-background dark:bg-background-dark mx-auto flex items-center justify-center mb-3 border border-dashed border-text-dim">
                  <UserPlus className="h-5 w-5 text-text-dim" />
                </div>
                <p className="font-medium text-text-main dark:text-text-main-dark">No Courier Assigned</p>
                <p className="text-xs text-text-dim mt-1 mb-4">Shipment is waiting for assignment</p>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setIsAssignmentOpen(true)}
                >
                  Assign Now
                </Button>
              </div>
            )}
          </Card>

          {/* Live Location Placeholder */}
          <Card variant="glass" className="p-0 overflow-hidden h-64 relative group">
            <div className="absolute inset-0 bg-secondary/5 flex flex-col items-center justify-center text-center p-6">
              <MapPin className="h-8 w-8 text-primary/40 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-text-main dark:text-text-main-dark">Live Location</p>
              <p className="text-xs text-text-dim mt-1">Waiting for courier telemetry...</p>
            </div>
          </Card>
        </div>
      </div>

      <CourierAssignmentModal
        isOpen={isAssignmentOpen}
        onClose={() => setIsAssignmentOpen(false)}
        orderIds={[order.id]}
        trackingNumber={order.trackingNumber}
        onAssigned={loadOrder}
      />
    </div>
  );
}
