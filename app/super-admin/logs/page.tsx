'use client';

import React, { useState } from 'react';
import {
    FileText,
    Search,
    Filter,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Download,
    Terminal,
    ShieldAlert
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function SuperAdminLogsPage() {
    const logs = [
        { id: 1, type: 'PROVISION', event: 'Tenant "Aramex-LITE" Provisioned', user: 'Admin-Root', target: 'Node-12', time: '2m ago', status: 'SUCCESS' },
        { id: 2, type: 'SECURITY', event: 'Invalid JWT Pattern Detected', user: 'IP: 192.168.1.1', target: 'Auth-Gateway', time: '15m ago', status: 'WARNING' },
        { id: 3, type: 'BILLING', event: 'Subscription Renewed: "DHL-Global"', user: 'System-Auto', target: 'Billing-Engine', time: '1h ago', status: 'SUCCESS' },
        { id: 4, type: 'ERROR', event: 'Websocket Connection Timeout', user: 'Cluster-B', target: 'US-EAST-1', time: '3h ago', status: 'ERROR' },
        { id: 5, type: 'CONFIG', event: 'Global Pricing Model Updated', user: 'J. Doe (Super)', target: 'Pricing-API', time: 'Yesterday', status: 'SUCCESS' },
    ];

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'SUCCESS': return 'success';
            case 'WARNING': return 'warning';
            case 'ERROR': return 'error';
            default: return 'primary';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark tracking-tight">
                        Infrastructure <span className="text-primary">Logs</span>
                    </h1>
                    <p className="text-text-dim mt-1">
                        Audit trail for platform provisioning, security events, and global system changes.
                    </p>
                </div>
                <Button variant="outline" size="lg" className="rounded-2xl" leftIcon={<Download size={18} />}>
                    Export Bundle
                </Button>
            </div>

            {/* Filter Bar */}
            <Card variant="glass" className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter by event, hash or identity..."
                            className="w-full bg-background-main dark:bg-background-main-dark border border-border dark:border-border-dark rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary transition-all text-text-main dark:text-text-main-dark"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex p-1 bg-background-main dark:bg-background-main-dark rounded-xl border border-border dark:border-border-dark">
                            {['Live', 'Provisioning', 'Security', 'Errors'].map((tab, i) => (
                                <button key={i} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${i === 0 ? 'bg-primary text-white' : 'text-text-dim hover:text-text-main dark:hover:text-text-main-dark'
                                    }`}>{tab}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Audit Logs Table */}
            <Card variant="default" className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background-card dark:bg-background-card-dark border-b border-border dark:border-border-dark">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-dim">Timestamp</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-dim">Intensity</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-dim">Event Sequence</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-dim">Initiator</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-dim">Component</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-border-dark">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-background-card/50 dark:hover:bg-background-card-dark/50 transition-colors group">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-xs font-bold text-text-dim">
                                            <Clock size={14} />
                                            {log.time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant={getStatusVariant(log.status)} size="sm" className="font-black border-none px-2 py-0.5">
                                            {log.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                                            <p className="text-sm font-bold text-text-main dark:text-text-main-dark leading-tight">{log.event}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-xs font-semibold text-text-dim">{log.user}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-background-card dark:bg-background-card-dark border border-border dark:border-border-dark">
                                            <Terminal size={12} className="text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-tight text-text-dim">{log.target}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
