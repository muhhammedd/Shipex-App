'use client';

import React, { useEffect, useState } from 'react';
import {
    Building2,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock,
    Shield,
    ExternalLink,
    Plus
} from 'lucide-react';
import { tenantsService } from '@/lib/services/tenantsService';
import { Tenant, TenantStatus } from '@/types/models';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProvisionTenantModal } from '@/components/dashboard/ProvisionTenantModal';

export default function TenantsPage() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);

    const fetchTenants = async () => {
        setLoading(true);
        try {
            const response = await tenantsService.getTenants();
            setTenants(response.data);
        } catch (error) {
            console.error('Failed to fetch tenants:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const getStatusConfig = (status: TenantStatus) => {
        switch (status) {
            case TenantStatus.ACTIVE:
                return { label: 'Active', variant: 'success' as const };
            case TenantStatus.SUSPENDED:
                return { label: 'Suspended', variant: 'error' as const };
            case TenantStatus.TRIAL:
                return { label: 'Trialing', variant: 'primary' as const };
            default:
                return { label: status, variant: 'secondary' as const };
        }
    };

    if (loading) return <Loading fullScreen text="Synchronizing tenant grid..." />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark tracking-tight">
                        Merchant <span className="text-primary">Tenants</span>
                    </h1>
                    <p className="text-text-dim mt-1">
                        Monitor and manage all active logistics nodes across the platform.
                    </p>
                </div>
                <Button
                    onClick={() => setIsProvisionModalOpen(true)}
                    variant="primary"
                    size="lg"
                    className="h-12 px-8 rounded-2xl shadow-glow-primary"
                    leftIcon={<Plus size={18} />}
                >
                    Provision Tenant
                </Button>
            </div>

            {/* Filter Bar */}
            <Card variant="glass" className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by identity or slug..."
                            className="w-full bg-background-main dark:bg-background-main-dark border border-border dark:border-border-dark rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary transition-all text-text-main dark:text-text-main-dark"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="h-10 gap-2 font-semibold">
                            <Filter size={14} />
                            <span>Filter</span>
                        </Button>
                        <div className="h-6 w-px bg-border dark:bg-border-dark hidden md:block" />
                        <Badge variant="primary" className="h-8 px-4 font-bold border-none">
                            Total: {tenants.length}
                        </Badge>
                    </div>
                </div>
            </Card>

            {/* Tenant Table */}
            <Card variant="default" className="p-0 overflow-hidden border-border dark:border-border-dark">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background-card dark:bg-background-card-dark border-b border-border dark:border-border-dark">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-dim">Node Identity</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-dim">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-dim">Telemetry</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-dim">Plan</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-dim text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-border-dark">
                            {tenants.map((tenant) => {
                                const status = getStatusConfig(tenant.status);
                                return (
                                    <tr key={tenant.id} className="hover:bg-background-card/50 dark:hover:bg-background-card-dark/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                                    {tenant.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-text-main dark:text-text-main-dark truncate">{tenant.name}</p>
                                                    <p className="text-xs text-text-dim font-mono">{tenant.slug}.shipex.io</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant={status.variant} size="sm">
                                                {status.label}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-text-dim uppercase font-bold">Users</span>
                                                    <span className="font-bold text-text-main dark:text-text-main-dark">{tenant.users?.length || 0}</span>
                                                </div>
                                                <div className="h-4 w-px bg-border dark:bg-border-dark" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-text-dim uppercase font-bold">Orders</span>
                                                    <span className="font-bold text-text-main dark:text-text-main-dark">1.4K</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                                                {tenant.plan || 'PREMIUM'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg hover:text-primary">
                                                    <Shield size={16} />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg hover:text-info">
                                                    <ExternalLink size={16} />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            <ProvisionTenantModal
                isOpen={isProvisionModalOpen}
                onClose={() => setIsProvisionModalOpen(false)}
                onSuccess={fetchTenants}
            />
        </div>
    );
}
