'use client';

import React from 'react';
import {
    Building2,
    Users,
    Activity,
    TrendingUp,
    Globe,
    Zap,
    AlertTriangle,
    Server,
    Shield
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load charts to improve initial load
const AnalyticsCharts = dynamic(() => import('@/components/domain/analytics/AnalyticsCharts'), {
    loading: () => <div className="h-[300px] w-full animate-pulse bg-white/5 rounded-3xl" />,
    ssr: false
});

export default function SuperAdminDashboard() {
    const stats = [
        {
            label: "Active Tenants",
            value: "128",
            trend: { value: 12, label: "from last month", isPositive: true },
            icon: Building2,
            variant: "primary" as const
        },
        {
            label: "Platform Revenue",
            value: "$1.2M",
            trend: { value: 18, label: "growth", isPositive: true },
            icon: TrendingUp,
            variant: "success" as const
        },
        {
            label: "Network Load",
            value: "48.2%",
            trend: { value: 5, label: "stabilizing", isPositive: true },
            icon: Zap,
            variant: "info" as const
        },
        {
            label: "System Uptime",
            value: "99.99%",
            trend: "Stable",
            icon: Globe,
            variant: "default" as const
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
            className="space-y-8 animate-in fade-in duration-700"
        >
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark tracking-tight">
                        Platform <span className="text-primary">Intelligence</span>
                    </h1>
                    <p className="text-text-dim mt-1">
                        Global infrastructure monitoring and multi-tenant authority.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-success/10 text-success px-4 py-2 rounded-2xl border border-success/20">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest">Systems Online</span>
                </div>
            </div>

            {/* Global KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.label}
                        value={stat.value}
                        trend={stat.trend}
                        icon={stat.icon}
                        variant={stat.variant}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Traffic Visualization */}
                <div className="lg:col-span-2 space-y-6">
                    <Card variant="default" className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark">Network Throughput</h3>
                                <p className="text-sm text-text-dim">Global packet distribution across all clusters</p>
                            </div>
                            <Badge variant="outline">Live Feed</Badge>
                        </div>
                        <AnalyticsCharts
                            orderVolume={[
                                { date: 'Mon', value: 45 },
                                { date: 'Tue', value: 52 },
                                { date: 'Wed', value: 48 },
                                { date: 'Thu', value: 61 },
                                { date: 'Fri', value: 55 },
                                { date: 'Sat', value: 67 },
                                { date: 'Sun', value: 72 },
                            ]}
                            revenueGrowth={[
                                { date: 'Mon', value: 3200 },
                                { date: 'Tue', value: 4100 },
                                { date: 'Wed', value: 3800 },
                                { date: 'Thu', value: 5200 },
                                { date: 'Fri', value: 4800 },
                                { date: 'Sat', value: 6100 },
                                { date: 'Sun', value: 5900 },
                            ]}
                        />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card variant="glass" className="p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Shield size={18} />
                                </div>
                                <h4 className="font-bold text-text-main dark:text-text-main-dark">Security Health</h4>
                            </div>
                            <div className="space-y-3">
                                <p className="text-sm text-text-dim">Threat level: <span className="text-success font-bold">Minimal</span></p>
                                <div className="h-1.5 w-full bg-border dark:bg-border-dark rounded-full overflow-hidden">
                                    <div className="h-full bg-success w-[95%] transition-all" />
                                </div>
                                <p className="text-[10px] text-text-dim uppercase font-bold">95% Policy Compliance</p>
                            </div>
                        </Card>
                        <Card variant="glass" className="p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-info/10 text-info">
                                    <Server size={18} />
                                </div>
                                <h4 className="font-bold text-text-main dark:text-text-main-dark">Resource Usage</h4>
                            </div>
                            <div className="space-y-3">
                                <p className="text-sm text-text-dim">CPU Consumption: <span className="text-info font-bold">Optimal</span></p>
                                <div className="h-1.5 w-full bg-border dark:bg-border-dark rounded-full overflow-hidden">
                                    <div className="h-full bg-info w-[42%] transition-all" />
                                </div>
                                <p className="text-[10px] text-text-dim uppercase font-bold">42% Avg. Utility</p>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* System Alerts */}
                <div className="space-y-6">
                    <Card variant="default" className="p-0 overflow-hidden h-full">
                        <div className="p-6 border-b border-border dark:border-border-dark flex items-center justify-between">
                            <h3 className="font-bold text-text-main dark:text-text-main-dark">Recent Anomalies</h3>
                            <Activity size={18} className="text-primary" />
                        </div>
                        <div className="p-6 space-y-6">
                            {[
                                { id: "SYS-092", msg: "Alpha-Node storage threshold reached", time: "2m ago", severity: "warning" },
                                { id: "NET-114", msg: "US-EAST-1 Latency Spike detected", time: "14m ago", severity: "info" },
                                { id: "SEC-001", msg: "Failed login attempts on Root", time: "1h ago", severity: "warning" }
                            ].map((alert, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${alert.severity === 'warning' ? 'bg-warning animate-pulse' : 'bg-info'}`} />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase text-text-dim">{alert.id}</span>
                                            <span className="text-[10px] text-text-dim">·</span>
                                            <span className="text-[10px] text-text-dim">{alert.time}</span>
                                        </div>
                                        <p className="text-sm text-text-main dark:text-text-main-dark font-medium group-hover:text-primary transition-colors leading-snug">
                                            {alert.msg}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 pt-0 mt-auto">
                            <button className="w-full py-3 rounded-xl bg-background-card dark:bg-background-card-dark text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-text-main dark:hover:text-text-main-dark transition-colors border border-border dark:border-border-dark">
                                View Intelligence Log
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
