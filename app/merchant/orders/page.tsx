'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Package,
    Search,
    Filter,
    PlusCircle,
    RotateCcw,
    ChevronDown,
    Printer,
    Download,
    Tag,
    X,
    Trash2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Loading } from '@/components/ui/Loading';
import { Pagination } from '@/components/ui/Pagination';
import { ordersApiService } from '@/lib/services/ordersApiService';
import { Order, OrderStatus } from '@/types/models';
import { OrderFilters } from '@/types/api';
import { format } from 'date-fns';

export default function MerchantOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    const toggleOrderSelection = (orderId: string) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const toggleAllSelection = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(o => o.id));
        }
    };

    const [filters, setFilters] = useState<OrderFilters>({
        page: 1,
        limit: 10,
        search: '',
        status: undefined,
    });

    const loadOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await ordersApiService.getOrders(filters);
            setOrders(response.data || []);
            setTotal(response.meta?.total || 0);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadOrders();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [loadOrders]);

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as OrderStatus | 'all';
        setFilters(prev => ({
            ...prev,
            status: status === 'all' ? undefined : status,
            page: 1
        }));
    };

    const resetFilters = () => {
        setFilters({
            page: 1,
            limit: 10,
            search: '',
            status: undefined,
        });
    };

    const getStatusBadge = (status: OrderStatus) => {
        const statusConfig: Record<OrderStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'primary', label: string }> = {
            [OrderStatus.CREATED]: { variant: 'info', label: 'Created' },
            [OrderStatus.PENDING]: { variant: 'warning', label: 'Pending' },
            [OrderStatus.ASSIGNED]: { variant: 'primary', label: 'Assigned' },
            [OrderStatus.PICKED_UP]: { variant: 'info', label: 'Picked Up' },
            [OrderStatus.IN_TRANSIT]: { variant: 'primary', label: 'In Transit' },
            [OrderStatus.OUT_FOR_DELIVERY]: { variant: 'info', label: 'Out for Delivery' },
            [OrderStatus.DELIVERED]: { variant: 'success', label: 'Delivered' },
            [OrderStatus.CANCELLED]: { variant: 'error', label: 'Cancelled' },
            [OrderStatus.RETURNED]: { variant: 'warning', label: 'Returned' },
        };
        const config = statusConfig[status] || { variant: 'info' as const, label: status };
        return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-text-main dark:text-text-main-dark font-gilroy">
                        My Orders
                    </h1>
                    <p className="text-text-dim dark:text-text-dim-dark mt-2">
                        Manage and track all your shipments in one place
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/merchant/orders/new')}
                    variant="primary"
                    size="lg"
                    leftIcon={<PlusCircle className="w-5 h-5" />}
                    className="shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    Create New Order
                </Button>
            </div>

            {/* Filters Section */}
            <Card variant="glass" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim dark:text-text-dim-dark" />
                        <Input
                            placeholder="Search tracking number, recipient..."
                            className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark"
                            value={filters.search}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <Select
                            value={filters.status || 'all'}
                            onChange={handleStatusChange}
                            className="bg-background dark:bg-background-dark border-border dark:border-border-dark w-full"
                        >
                            <option value="all">All Statuses</option>
                            {Object.values(OrderStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status.replace('_', ' ')}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div className="md:col-span-3 flex gap-2">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={resetFilters}
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset Filters
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Orders Table */}
            <Card variant="default" className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background dark:bg-background-dark border-b border-border dark:border-border-dark">
                            <tr>
                                <th className="px-6 py-4 w-12">
                                    <Checkbox
                                        checked={orders.length > 0 && selectedOrders.length === orders.length}
                                        indeterminate={selectedOrders.length > 0 && selectedOrders.length < orders.length}
                                        onChange={toggleAllSelection}
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">Tracking #</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">Recipient</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">Financials</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-border-dark">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="h-40 text-center">
                                        <Loading text="Loading orders..." />
                                    </td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className={`group cursor-pointer transition-colors duration-200 ${selectedOrders.includes(order.id) ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-primary/5 dark:hover:bg-primary/5'}`}
                                        onClick={() => router.push(`/merchant/orders/${order.id}`)}
                                    >
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={() => toggleOrderSelection(order.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-semibold text-primary text-sm group-hover:underline">
                                                {order.trackingNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-text-main dark:text-text-main-dark text-sm">{order.recipientName}</span>
                                                <span className="text-xs text-text-dim dark:text-text-dim-dark">{order.recipientPhone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-text-main dark:text-text-main-dark">{order.recipientCity}</span>
                                                {order.recipientZone && (
                                                    <span className="text-xs text-text-dim dark:text-text-dim-dark">{order.recipientZone}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-text-main dark:text-text-main-dark">Cost: ${Number(order.shippingCost).toFixed(2)}</span>
                                                {(order.codAmount ?? 0) > 0 && (
                                                    <span className="text-xs text-success font-semibold">COD: ${Number(order.codAmount ?? 0).toFixed(2)}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-text-dim dark:text-text-dim-dark">
                                                {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="h-60 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="p-4 rounded-full bg-background dark:bg-background-dark border border-border dark:border-border-dark">
                                                <Package className="h-8 w-8 text-text-dim dark:text-text-dim-dark" />
                                            </div>
                                            <div>
                                                <p className="text-text-main dark:text-text-main-dark font-semibold">No orders found</p>
                                                <p className="text-sm text-text-dim dark:text-text-dim-dark mt-1">Try adjusting your filters or search criteria</p>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={resetFilters}>
                                                Clear all filters
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {total > (filters.limit || 10) && (
                    <div className="border-t border-border dark:border-border-dark bg-background dark:bg-background-dark p-4">
                        <Pagination
                            currentPage={filters.page || 1}
                            totalPages={Math.ceil(total / (filters.limit || 10))}
                            onPageChange={handlePageChange}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </Card>

            {/* Bulk Actions Bar */}
            {
                selectedOrders.length > 0 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                        <Card variant="glass" className="p-3 flex items-center justify-between shadow-2xl border-primary/20 bg-background/95 backdrop-blur-xl">
                            <div className="flex items-center gap-4 pl-2">
                                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs ring-2 ring-primary/20">
                                    {selectedOrders.length}
                                </span>
                                <span className="text-text-main dark:text-text-main-dark font-medium text-sm">Selected</span>
                                <div className="h-4 w-px bg-border dark:bg-border-dark mx-2" />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedOrders([])}
                                    className="text-text-dim hover:text-text-main text-xs"
                                >
                                    Deselect All
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />}>
                                    Print
                                </Button>
                                <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                                    Export
                                </Button>
                                <Button variant="outline" size="sm" leftIcon={<Tag className="w-4 h-4" />}>
                                    Update Status
                                </Button>
                                <Button variant="danger" size="sm" leftIcon={<Trash2 className="w-4 h-4" />}>
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    </div>
                )
            }
        </div >
    );
}
