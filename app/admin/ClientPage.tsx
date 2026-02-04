'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Package,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Download,
  ArrowRight,
  Building2,
  Truck,
  FileBarChart,
  Settings,
  Bell
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { ActivityTimeline, Activity } from '@/components/ui/ActivityTimeline';
import { QuickActionsPanel } from '@/components/ui/QuickActionsPanel';
import { analyticsService } from '@/lib/services/analyticsService';
import { ordersApiService } from '@/lib/services/ordersApiService';
import { Order, OrderStatus } from '@/types/models';
import { AnalyticsResponse } from '@/types/api';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const OrdersChart = dynamic(() => import('@/components/ui/OrdersChart').then(mod => mod.OrdersChart), {
  loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />,
  ssr: false
});

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [stats, ordersResponse] = await Promise.all([
          analyticsService.getAdminSummary(),
          ordersApiService.getOrders({ limit: 5 })
        ]);
        setAnalytics(stats);

        const ordersData = (ordersResponse as any).orders || (ordersResponse as any).data || ordersResponse;
        setRecentOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (error) {
        console.error('Error loading admin dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Mock Admin Activities (In a real app, this would come from an audit log API)
  const activities: Activity[] = useMemo(() => [
    {
      id: '1',
      type: 'finance',
      title: 'New Merchant Registration',
      description: 'TechGadgets Inc. has just signed up.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      status: OrderStatus.CREATED
    },
    {
      id: '2',
      type: 'system',
      title: 'System Alert',
      description: 'High server load detected in EU region.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: OrderStatus.PENDING
    },
    {
      id: '3',
      type: 'order',
      title: 'Bulk Order Imported',
      description: '500 orders imported by MegaStore.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      status: OrderStatus.CREATED
    }
  ], []);

  // Admin Quick Actions
  const adminActions: import('@/components/ui/QuickActionsPanel').QuickAction[] = [
    { label: 'Add User', icon: Users, onClick: () => console.log('Add User'), color: 'bg-primary text-white' },
    { label: 'Approve Merchant', icon: Building2, onClick: () => console.log('Approve Merchant'), color: 'bg-indigo-600 text-white' },
    { label: 'System Report', icon: FileBarChart, onClick: () => console.log('Report'), color: 'bg-teal-600 text-white' },
    { label: 'Config', icon: Settings, onClick: () => console.log('Config'), variant: 'outline' as const },
  ];

  if (isLoading) return <Loading fullScreen text="Loading dashboard..." />;

  const summary = analytics?.summary;

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
      className="space-y-8 animate-in fade-in duration-500 pb-10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark">
            Admin <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-text-dim mt-2">Monitor system health and manage global operations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export Data
          </Button>
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} className="shadow-lg shadow-primary/20">
            System Action
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={summary?.totalOrders.toLocaleString() || '0'}
          icon={Package}
          variant="gradient-primary"
          trend="+8.5%"
          trendValue={8.5}
        />
        <StatCard
          title="Active Merchants"
          value={summary?.activeMerchants.toString() || '0'}
          icon={Building2}
          variant="default"
          iconClassName="text-purple-600"
          trend="+12%"
          trendValue={12}
        />
        <StatCard
          title="Active Couriers"
          value={summary?.activeCouriers.toString() || '0'}
          icon={Truck}
          variant="default"
          iconClassName="text-cyan-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${summary?.totalRevenue.toLocaleString() || '0'}`}
          icon={DollarSign}
          variant="gradient-success"
          trend="+15.3%"
          trendValue={15.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Chart */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg text-success">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">Revenue Growth</h3>
              </div>
              <select className="bg-transparent border border-border dark:border-border-dark rounded-lg text-sm px-3 py-1">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
            <OrdersChart
              data={analytics?.revenueGrowth as any || []}
              type="area"
              variant="success"
              height={320}
            />
          </Card>

          {/* Recent Orders Table */}
          <Card variant="default" className="overflow-hidden">
            <div className="p-6 border-b border-border dark:border-border-dark flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">Recent Global Orders</h3>
                <p className="text-xs text-text-dim mt-1">Latest activity across all merchants</p>
              </div>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-card dark:bg-background-card-dark border-b border-border dark:border-border-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-dim uppercase tracking-wider">Tracking #</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-dim uppercase tracking-wider">Merchant</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-dim uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-text-dim uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-border-dark">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-background-card dark:hover:bg-background-card-dark transition-colors">
                        <td className="px-6 py-4 font-mono text-sm font-semibold text-primary">
                          {order.trackingNumber}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-text-main dark:text-text-main-dark">
                              {order.merchant?.merchantProfile?.companyName || 'Unknown Merchant'}
                            </span>
                            <span className="text-xs text-text-dim">ID: {order.merchantId?.substring(0, 6)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={order.status === OrderStatus.DELIVERED ? 'success' : 'primary'} size="sm">
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-text-main dark:text-text-main-dark text-sm">
                          ${Number(order.shippingCost).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-text-dim">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActionsPanel actions={adminActions} />

          {/* Activity Feed */}
          <Card variant="default" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-main dark:text-text-main-dark flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                System Activity
              </h3>
            </div>
            <ActivityTimeline activities={activities} />
          </Card>

          {/* Order Volume Chart (Small) */}
          <Card variant="glass" className="p-6 bg-gradient-to-br from-background to-background-card">
            <h3 className="font-bold text-text-main dark:text-text-main-dark mb-4">Volume Trend</h3>
            <OrdersChart
              data={analytics?.orderVolume as any || []}
              type="area"
              variant="primary"
              height={200}
            />
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
