'use client';

import React, { useState } from 'react';
import {
    ArrowLeft,
    Wallet,
    TrendingUp,
    Clock,
    Plus,
    ChevronRight,
    ArrowUpRight,
    ArrowDownLeft,
    DollarSign
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';

export default function CourierFinancePage() {
    const router = useRouter();

    const transactions = [
        { id: 1, type: 'EARNING', amount: 45.00, date: 'Today, 14:20', order: 'SHP-12345', status: 'COMPLETED' },
        { id: 2, type: 'EARNING', amount: 32.50, date: 'Today, 11:45', order: 'SHP-12344', status: 'COMPLETED' },
        { id: 3, type: 'WITHDRAWAL', amount: 200.00, date: 'Yesterday', order: '-', status: 'PENDING' },
        { id: 4, type: 'EARNING', amount: 50.00, date: 'Feb 3, 18:10', order: 'SHP-12340', status: 'COMPLETED' },
    ];

    return (
        <div className="pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-10 w-10 p-0 rounded-full">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-bold text-text-main dark:text-text-main-dark">Earnings</h1>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl h-9">
                    History
                </Button>
            </div>

            <div className="p-4 space-y-6">
                {/* Balance Card */}
                <Card variant="default" className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <Wallet size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Available Balance</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-4xl font-bold text-text-main dark:text-text-main-dark">$450.00</p>
                            <p className="text-xs text-text-dim mt-1">Next payout: Feb 10, 2026</p>
                        </div>
                        <Button variant="primary" size="sm" className="rounded-xl px-6 h-11 shadow-glow-primary">
                            Withdraw
                        </Button>
                    </div>
                </Card>

                {/* Daily Summary Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <Card variant="glass" className="p-4">
                        <div className="flex items-center gap-2 text-success mb-1">
                            <TrendingUp size={14} />
                            <span className="text-[10px] font-bold uppercase">Today</span>
                        </div>
                        <p className="text-xl font-bold text-text-main dark:text-text-main-dark">$77.50</p>
                        <p className="text-[10px] text-text-dim">4 Deliveries</p>
                    </Card>
                    <Card variant="glass" className="p-4">
                        <div className="flex items-center gap-2 text-text-dim mb-1">
                            <Clock size={14} />
                            <span className="text-[10px] font-bold uppercase">This Week</span>
                        </div>
                        <p className="text-xl font-bold text-text-main dark:text-text-main-dark">$1,240</p>
                        <p className="text-[10px] text-text-dim">Avg $38/hr</p>
                    </Card>
                </div>

                {/* Recent Transactions */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-sm font-bold text-text-dim uppercase">Recent Activity</h2>
                        <Button variant="ghost" size="sm" className="text-xs font-bold text-primary">See All</Button>
                    </div>

                    <div className="space-y-3">
                        {transactions.map((tx) => (
                            <Card key={tx.id} variant="default" className="p-4 active:scale-[0.98] transition-transform">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tx.type === 'EARNING' ? 'bg-success/10 text-success' : 'bg-orange-500/10 text-orange-500'
                                            }`}>
                                            {tx.type === 'EARNING' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-main dark:text-text-main-dark">
                                                {tx.type === 'EARNING' ? `Delivery: ${tx.order}` : 'Balance Withdrawal'}
                                            </p>
                                            <p className="text-xs text-text-dim">{tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${tx.type === 'EARNING' ? 'text-success' : 'text-text-main dark:text-text-main-dark'
                                            }`}>
                                            {tx.type === 'EARNING' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </p>
                                        <Badge variant={tx.status === 'COMPLETED' ? 'success' : 'primary'} size="sm" className="mt-1 text-[8px] px-1.5 py-0 border-none">
                                            {tx.status}
                                        </Badge>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
