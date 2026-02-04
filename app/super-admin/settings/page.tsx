'use client';

import React, { useState } from 'react';
import {
    Settings,
    Shield,
    Globe,
    Lock,
    Bell,
    Database,
    Cpu,
    Save,
    Zap,
    RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function SuperAdminSettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark tracking-tight">
                    System <span className="text-primary">Administration</span>
                </h1>
                <p className="text-text-dim mt-1">
                    Manage global platform settings, feature toggles, and infrastructure parameters.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation Sidebar (Local to Settings) */}
                <div className="space-y-3">
                    {[
                        { icon: Globe, label: 'Global Configurations', active: true },
                        { icon: Shield, label: 'Security Protocols' },
                        { icon: Database, label: 'Database & Storage' },
                        { icon: Bell, label: 'System Notifications' },
                        { icon: Cpu, label: 'Performance Tuning' },
                    ].map((item, i) => (
                        <Card
                            key={i}
                            variant={item.active ? 'default' : 'glass'}
                            className={`p-4 flex items-center gap-4 cursor-pointer hover:border-primary/40 transition-all ${item.active ? 'border-primary/40 bg-primary/5' : ''
                                }`}
                        >
                            <item.icon size={18} className={item.active ? 'text-primary' : 'text-text-dim'} />
                            <span className={`text-sm font-bold ${item.active ? 'text-text-main dark:text-text-main-dark' : 'text-text-dim'}`}>
                                {item.label}
                            </span>
                        </Card>
                    ))}
                </div>

                {/* Settings Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <Card variant="default" className="p-8">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border dark:border-border-dark">
                            <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark">General Settings</h3>
                            <Button variant="primary" size="sm" leftIcon={<Save size={16} />}>Save Changes</Button>
                        </div>

                        <div className="space-y-8">
                            {/* Feature Toggles */}
                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase text-text-dim tracking-widest">Global Features</h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Auto-Provisioning', desc: 'Automatically Provision tenants upon subscription', active: true },
                                        { label: 'Carrier Network Sync', desc: 'Sync driver pools across nearby tenants for efficiency', active: true },
                                        { label: 'Merchant Insurance', desc: 'Enable native shipment protection features', active: false },
                                    ].map((feat, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background-card/50 dark:bg-background-card-dark/50 border border-border dark:border-border-dark">
                                            <div>
                                                <p className="text-sm font-bold text-text-main dark:text-text-main-dark">{feat.label}</p>
                                                <p className="text-xs text-text-dim">{feat.desc}</p>
                                            </div>
                                            <div className={`h-6 w-11 rounded-full p-1 cursor-pointer transition-colors ${feat.active ? 'bg-primary' : 'bg-text-dim/30'}`}>
                                                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${feat.active ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* System Flush */}
                            <div className="pt-6 border-t border-border dark:border-border-dark">
                                <h4 className="text-xs font-black uppercase text-error tracking-widest mb-4">Danger Zone</h4>
                                <div className="p-6 rounded-2xl bg-error/5 border border-error/20 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div>
                                        <p className="text-sm font-bold text-text-main dark:text-text-main-dark">Clear Global Page Cache</p>
                                        <p className="text-xs text-text-dim">Forces all tenants to re-fetch metadata and themes. May cause temporary latency.</p>
                                    </div>
                                    <Button variant="outline" className="text-error border-error/20 hover:bg-error/10 whitespace-nowrap" leftIcon={<RefreshCw size={16} />}>
                                        Flush Shipex Cache
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
