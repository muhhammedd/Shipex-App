'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { analyticsService } from '@/lib/services/analyticsService';
import { AnalyticsResponse } from '@/types/api';
import { Loading } from '@/components/ui/Loading';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Package, TrendingUp, DollarSign, Activity, Download, MapPin, Building2 } from 'lucide-react';

const AnalyticsCharts = dynamic(
  () => import('@/components/domain/analytics/AnalyticsCharts'),
  {
    loading: () => <div className="h-72 flex items-center justify-center bg-background-card/50 rounded-xl"><Loading text="Loading Charts..." /></div>,
    ssr: false
  }
);

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await analyticsService.getAdminSummary();
        setData(response);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) return <Loading fullScreen text="Loading analytics..." />;
  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Activity className="h-12 w-12 text-text-dim" />
      <p className="text-text-dim">Data unavailable.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark tracking-tight">
            System Analytics
          </h1>
          <p className="text-text-dim mt-2">
            Comprehensive overview of platform performance and revenue.
          </p>
        </div>
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={data.summary.totalOrders.toLocaleString()}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="Delivered"
          value={data.summary.deliveredOrders.toLocaleString()}
          icon={Activity}
          variant="success"
        />
        <StatCard
          title="Trend"
          value={`${data.summary.recentTrend}%`}
          icon={TrendingUp}
          variant="warning"
          trend={{ value: Number(data.summary.recentTrend), label: 'growth', isPositive: Number(data.summary.recentTrend) > 0 }}
        />
        <StatCard
          title="Total Revenue"
          value={`$${data.summary.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          variant="info"
        />
      </div>

      {/* Charts (Lazy Loaded) */}
      <Card variant="default" className="p-6">
        <AnalyticsCharts orderVolume={data.orderVolume} revenueGrowth={data.revenueGrowth} />
      </Card>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Zones */}
        <Card variant="default" className="p-0 overflow-hidden">
          <div className="p-6 border-b border-border dark:border-border-dark flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">Regional Performance</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead className="bg-background-card dark:bg-background-card-dark">
                <tr>
                  <th className="py-3 px-6 text-xs font-semibold text-text-dim uppercase tracking-wider">Zone</th>
                  <th className="py-3 px-6 text-xs font-semibold text-text-dim uppercase tracking-wider text-right">Volume</th>
                  <th className="py-3 px-6 text-xs font-semibold text-text-dim uppercase tracking-wider text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {(data.topZones || []).map((zone) => (
                  <tr key={zone.name} className="group hover:bg-background/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-text-main dark:text-text-main-dark">{zone.name}</td>
                    <td className="py-4 px-6 text-right font-mono text-sm text-text-dim">{zone.orders}</td>
                    <td className="py-4 px-6 text-right font-bold text-text-main dark:text-text-main-dark">${(zone.revenue || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Merchants */}
        <Card variant="default" className="p-0 overflow-hidden">
          <div className="p-6 border-b border-border dark:border-border-dark flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">Top Markets</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead className="bg-background-card dark:bg-background-card-dark">
                <tr>
                  <th className="py-3 px-6 text-xs font-semibold text-text-dim uppercase tracking-wider">Merchant</th>
                  <th className="py-3 px-6 text-xs font-semibold text-text-dim uppercase tracking-wider text-right">Volume</th>
                  <th className="py-3 px-6 text-xs font-semibold text-text-dim uppercase tracking-wider text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {(data.topMerchants || []).map((merchant) => (
                  <tr key={merchant.name} className="group hover:bg-background/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-text-main dark:text-text-main-dark">{merchant.name}</td>
                    <td className="py-4 px-6 text-right font-mono text-sm text-text-dim">{merchant.orders}</td>
                    <td className="py-4 px-6 text-right font-bold text-text-main dark:text-text-main-dark">${(merchant.revenue || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}