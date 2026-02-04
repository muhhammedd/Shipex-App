'use client';

import { useState, useEffect } from 'react';
import { adminService, PayoutRequest } from '@/lib/services/adminService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { Check, X, Loader2, Banknote, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function PayoutsPage() {
    const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPayouts();
    }, []);

    const loadPayouts = async () => {
        try {
            const data = await adminService.getPayoutRequests();
            setPayouts(data);
        } catch (error) {
            toast.error("Failed to load payout requests");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            if (action === 'approve') {
                await adminService.approvePayout(id);
                toast.success('Payout approved');
            } else {
                await adminService.rejectPayout(id);
                toast.success('Payout rejected');
            }
            // Optimistic update
            setPayouts(prev => prev.map(p =>
                p.id === id ? { ...p, status: action === 'approve' ? 'APPROVED' : 'REJECTED' } : p
            ));
        } catch (error) {
            toast.error(`Failed to ${action} payout`);
        }
    };

    const pendingAmount = payouts.filter(p => p.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);
    const totalProcessed = payouts.filter(p => p.status === 'APPROVED').reduce((acc, curr) => acc + curr.amount, 0);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-primary h-8 w-8" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark tracking-tight">
                    Finance Overview
                </h1>
                <p className="text-text-dim mt-2">
                    Manage merchant payouts and review financial activities.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Pending Payouts"
                    value={`$${pendingAmount.toFixed(2)}`}
                    icon={AlertCircle}
                    trend={{ value: payouts.filter(p => p.status === 'PENDING').length, label: 'requests waiting' }}
                    variant="warning"
                />
                <StatCard
                    title="Total Processed"
                    value={`$${totalProcessed.toFixed(2)}`}
                    icon={Check}
                    variant="success"
                />
                <StatCard
                    title="Platform Reserve"
                    value="$124,500.00"
                    icon={Banknote}
                    variant="primary"
                    trend={{ value: 12, label: 'vs last month', isPositive: true }}
                />
            </div>

            {/* Payouts Table */}
            <Card variant="default" className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <DollarSign className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold text-text-main dark:text-text-main-dark">
                            Withdrawal Requests
                        </h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border dark:border-border-dark text-text-dim text-xs uppercase tracking-wider">
                                <th className="py-4 px-4 font-semibold">Merchant</th>
                                <th className="py-4 px-4 font-semibold">Amount</th>
                                <th className="py-4 px-4 font-semibold">Date Requested</th>
                                <th className="py-4 px-4 font-semibold">Status</th>
                                <th className="py-4 px-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-border-dark">
                            {payouts.length > 0 ? (
                                payouts.map((p) => (
                                    <tr key={p.id} className="group hover:bg-background-card dark:hover:bg-background-card-dark transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="font-semibold text-text-main dark:text-text-main-dark">
                                                {p.merchantName}
                                            </div>
                                            <div className="text-xs text-text-dim">{p.id}</div>
                                        </td>
                                        <td className="py-4 px-4 font-mono font-medium text-text-main dark:text-text-main-dark">
                                            ${p.amount.toFixed(2)}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-text-dim">
                                            {format(new Date(p.date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge variant={
                                                p.status === 'APPROVED' ? 'success' :
                                                    p.status === 'REJECTED' ? 'error' :
                                                        'warning'
                                            }>
                                                {p.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            {p.status === 'PENDING' ? (
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-success hover:bg-success/10"
                                                        onClick={() => handleAction(p.id, 'approve')}
                                                        title="Approve"
                                                    >
                                                        <Check size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-error hover:bg-error/10"
                                                        onClick={() => handleAction(p.id, 'reject')}
                                                        title="Reject"
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-text-dim italic">
                                                    Processed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-text-dim">
                                        No payout requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
