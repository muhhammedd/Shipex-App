'use client';

import { useState, useEffect, useMemo } from 'react';
import { financeService, BalanceResponse } from '@/lib/services/financeService';
import { Transaction } from '@/types/models';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

import dynamic from 'next/dynamic';

const OrdersChart = dynamic(() => import('@/components/ui/OrdersChart').then(mod => mod.OrdersChart), {
    loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />,
    ssr: false
});
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    CreditCard,
    TrendingUp,
    FileText,
    Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

export default function FinancePage() {
    const [balance, setBalance] = useState<BalanceResponse | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [balanceData, transactionsData] = await Promise.all([
                    financeService.getBalance(),
                    financeService.getTransactions()
                ]);
                setBalance(balanceData);
                setTransactions(transactionsData);
            } catch (error) {
                console.error('Failed to load finance data:', error);
                toast.error('Failed to load wallet information');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePayoutRequest = () => {
        if (!payoutAmount || Number(payoutAmount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        if (balance && Number(payoutAmount) > balance.balance) {
            toast.error('Insufficient funds');
            return;
        }

        toast.success(`Payout request of $${payoutAmount} submitted for approval.`);
        setIsPayoutModalOpen(false);
        setPayoutAmount('');
    };

    // Derived Statistics
    const stats = useMemo(() => {
        const totalCredits = transactions
            .filter(t => t.type === 'CREDIT')
            .reduce((acc, t) => acc + Number(t.amount), 0);

        const totalDebits = transactions
            .filter(t => t.type === 'DEBIT')
            .reduce((acc, t) => acc + Number(t.amount), 0);

        return { totalCredits, totalDebits };
    }, [transactions]);

    // Derived Chart Data (Daily Revenue - Last 7 Days)
    const chartData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(new Date(), 6 - i);
            return {
                date: format(date, 'MMM d'),
                fullDate: startOfDay(date),
                value: 0
            };
        });

        transactions.forEach(t => {
            if (t.type === 'CREDIT') {
                const tDate = startOfDay(new Date(t.createdAt));
                const day = last7Days.find(d => isSameDay(d.fullDate, tDate));
                if (day) {
                    day.value += Number(t.amount);
                }
            }
        });

        return last7Days.map(({ date, value }) => ({ date, value }));
    }, [transactions]);

    if (isLoading) return <Loading fullScreen text="Loading financial data..." />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark">Finance Overview</h1>
                    <p className="text-text-dim mt-2">Manage your wallet, transactions, and payouts.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" leftIcon={<FileText className="w-4 h-4" />}>
                        Export Report
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setIsPayoutModalOpen(true)}
                        leftIcon={<Download className="w-4 h-4" />}
                        className="shadow-lg shadow-primary/20"
                    >
                        Request Payout
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Available Balance"
                    value={balance ? `$${Number(balance.balance).toFixed(2)}` : '$0.00'}
                    icon={Wallet}
                    variant="gradient-primary"
                    trend="+12%"
                    trendValue={12}
                />
                <StatCard
                    title="Total Credits"
                    value={`$${stats.totalCredits.toFixed(2)}`}
                    icon={ArrowDownLeft}
                    variant="gradient-success"
                    iconClassName="text-success"
                    trend="+5%"
                    trendValue={5}
                />
                <StatCard
                    title="Total Fees"
                    value={`$${stats.totalDebits.toFixed(2)}`}
                    icon={ArrowUpRight}
                    variant="default"
                    iconClassName="text-error"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2">
                    <Card variant="glass" className="p-6 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">Revenue Trend</h3>
                            </div>
                            <select className="bg-transparent border border-border dark:border-border-dark rounded-lg text-sm px-3 py-1">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <OrdersChart data={chartData} type="area" variant="primary" height={300} />
                    </Card>
                </div>

                {/* Recent Activity / Quick Stats */}
                <div className="space-y-6">
                    <Card variant="default" className="p-6">
                        <h3 className="font-bold text-text-main dark:text-text-main-dark mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            Next Payout
                        </h3>
                        <div className="p-4 bg-background dark:bg-background-dark rounded-xl border border-border dark:border-border-dark mb-4">
                            <p className="text-xs text-text-dim uppercase font-semibold">Estimated Amount</p>
                            <p className="text-2xl font-bold text-text-main dark:text-text-main-dark mt-1">
                                ${balance ? (Number(balance.balance) * 0.9).toFixed(2) : '0.00'}
                            </p>
                            <p className="text-xs text-text-dim mt-1">After standard fees</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-dim">Schedule</span>
                                <span className="font-medium text-text-main dark:text-text-main-dark">Weekly (Monday)</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-dim">Status</span>
                                <Badge variant="success" size="sm">Active</Badge>
                            </div>
                        </div>
                    </Card>

                    <Card variant="glass" className="p-6 bg-gradient-to-br from-background to-background-card">
                        <h3 className="font-bold text-text-main dark:text-text-main-dark mb-2">Need Help?</h3>
                        <p className="text-sm text-text-dim mb-4">Contact support regarding payout issues or discrepancies.</p>
                        <Button variant="outline" className="w-full">
                            Finance Support
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Transactions Table */}
            <Card variant="default" className="p-0 overflow-hidden">
                <div className="p-6 border-b border-border dark:border-border-dark flex items-center justify-between">
                    <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">Transaction History</h3>
                    <div className="flex gap-2">
                        <Input placeholder="Search transactions..." className="w-64 h-9" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length > 0 ? (
                                transactions.map((t, i) => (
                                    <TableRow key={i} className="hover:bg-background-card dark:hover:bg-background-card-dark transition-colors">
                                        <TableCell className="font-medium text-text-dim">
                                            {format(new Date(t.createdAt), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={t.type === 'CREDIT' ? 'success' : 'error'} size="sm">
                                                {t.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-text-main dark:text-text-main-dark">
                                            {t.description}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-text-dim">
                                            {t.orderId ? `#${t.orderId.substring(0, 8)}` : '-'}
                                        </TableCell>
                                        <TableCell className={`text-right font-bold ${t.type === 'CREDIT' ? 'text-success' : 'text-error'}`}>
                                            {t.type === 'CREDIT' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-text-dim">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Payout Modal */}
            <Modal
                isOpen={isPayoutModalOpen}
                onClose={() => setIsPayoutModalOpen(false)}
                title="Request Payout"
                size="md"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-background dark:bg-background-dark rounded-xl border border-border dark:border-border-dark flex justify-between items-center">
                        <span className="text-sm text-text-dim">Available Balance</span>
                        <span className="font-bold text-xl text-text-main dark:text-text-main-dark">
                            ${balance ? Number(balance.balance).toFixed(2) : '0.00'}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-main dark:text-text-main-dark">Payout Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim">$</span>
                            <Input
                                type="number"
                                className="pl-8"
                                placeholder="0.00"
                                value={payoutAmount}
                                onChange={(e) => setPayoutAmount(e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-text-dim">Min payout: $50.00. Processing time: 1-2 business days.</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setIsPayoutModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handlePayoutRequest}>
                            Confirm Request
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
