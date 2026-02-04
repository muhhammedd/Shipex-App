'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  RotateCcw,
  UserPlus,
  Eye,
  Building2,
  Trash2,
  PackageCheck,
  MoreVertical,
  CheckCircle2,
  X,
  Truck
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Loading } from '@/components/ui/Loading';
import { Pagination } from '@/components/ui/Pagination';
import { CourierAssignmentModal } from '@/components/ui/CourierAssignmentModal';
import { ordersApiService } from '@/lib/services/ordersApiService';
import { usersService } from '@/lib/services/usersService';
import { Order, OrderStatus, User, UserRole } from '@/types/models';
import { OrderFilters } from '@/types/api';
import { Checkbox } from '@/components/ui/Checkbox';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [merchants, setMerchants] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Assignment modal state
  const [assignmentModal, setAssignmentModal] = useState({
    isOpen: false,
    orderIds: [] as string[],
    trackingNumber: ''
  });

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
    merchantId: undefined,
  });

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [ordersResponse, usersResponse] = await Promise.all([
        ordersApiService.getOrders(filters),
        merchants.length === 0 ? usersService.getUsers() : Promise.resolve({ data: merchants, meta: { total: merchants.length, page: 1, limit: merchants.length, totalPages: 1 } })
      ]);

      const ordersData = (ordersResponse as any).orders || (ordersResponse as any).data || ordersResponse;
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setTotal(ordersResponse.meta?.total || 0);

      if (merchants.length === 0) {
        const allUsers = Array.isArray(usersResponse) ? usersResponse : usersResponse.data;
        if (Array.isArray(allUsers)) {
          setMerchants(allUsers.filter((u: User) => u.role === UserRole.MERCHANT));
        }
      }
    } catch (error) {
      console.error('Error loading admin orders data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, merchants.length]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [loadData]);

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key: keyof OrderFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      status: undefined,
      merchantId: undefined,
    });
  };

  const openAssignmentModal = (orderIds: string[], trackingNumber: string) => {
    setAssignmentModal({
      isOpen: true,
      orderIds,
      trackingNumber
    });
  };

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'warning';
      case OrderStatus.DELIVERED: return 'success';
      case OrderStatus.CANCELLED: return 'error';
      case OrderStatus.RETURNED: return 'error';
      case OrderStatus.IN_TRANSIT: return 'primary';
      default: return 'primary';
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map(o => o.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatusUpdate = async (status: OrderStatus) => {
    try {
      setIsBulkLoading(true);
      await ordersApiService.bulkUpdateStatus(selectedIds, status);
      await loadData();
      setSelectedIds([]);
    } catch (error) {
      console.error('Bulk status update failed:', error);
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark">
            Global <span className="text-primary">Orders</span>
          </h1>
          <p className="text-text-dim mt-2">Manage shipment operations across all merchants.</p>
        </div>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <label className="text-sm font-semibold text-text-main dark:text-text-main-dark mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
              <Input
                placeholder="Tracking # or ID..."
                className="pl-9"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Select
              label="Status"
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
              ))}
            </Select>
          </div>
          <div>
            <Select
              label="Merchant"
              value={filters.merchantId || 'all'}
              onChange={(e) => handleFilterChange('merchantId', e.target.value)}
            >
              <option value="all">All Merchants</option>
              {merchants.map((m) => (
                <option key={m.id} value={m.id}>{m.merchantProfile?.businessName || m.name}</option>
              ))}
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="w-full"
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card variant="default" className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={orders.length > 0 && selectedIds.length === orders.length}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Tracking #</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Courier</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <Loading text="Loading global orders..." />
                  </TableCell>
                </TableRow>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-background-card dark:hover:bg-background-card-dark transition-colors">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm font-semibold text-primary">
                      {order.trackingNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3 w-3 text-text-dim" />
                        <span className="text-sm font-medium text-text-main dark:text-text-main-dark">
                          {order.merchant?.merchantProfile?.businessName || order.merchant?.name || 'System'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-main dark:text-text-main-dark">{order.recipientName}</span>
                        <span className="text-xs text-text-dim">{order.recipientCity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)} size="sm">
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.courier ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {order.courier.name.charAt(0)}
                          </div>
                          <span className="text-sm text-text-main dark:text-text-main-dark">{order.courier.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-text-dim italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary-dark hover:bg-primary/10"
                          onClick={() => openAssignmentModal([order.id], order.trackingNumber)}
                          title="Assign Driver"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center text-text-dim">
                    No orders found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {total > (filters.limit || 10) && (
          <div className="border-t border-border dark:border-border-dark p-4">
            <Pagination
              currentPage={filters.page || 1}
              totalPages={Math.ceil(total / (filters.limit || 10))}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </Card>

      <CourierAssignmentModal
        isOpen={assignmentModal.isOpen}
        onClose={() => setAssignmentModal(prev => ({ ...prev, isOpen: false }))}
        orderIds={assignmentModal.orderIds}
        trackingNumber={assignmentModal.trackingNumber}
        onAssigned={() => {
          loadData();
          setSelectedIds([]);
        }}
      />

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-white dark:bg-background-card-dark text-text-main dark:text-text-main-dark px-6 py-4 rounded-full shadow-2xl border border-border dark:border-border-dark flex items-center gap-6">
            <div className="flex items-center gap-3 border-r border-border dark:border-border-dark pr-6">
              <span className="font-bold text-primary text-lg">{selectedIds.length}</span>
              <span className="text-sm font-medium">Selected</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds([])}
                className="text-text-dim hover:text-error h-6 w-6 p-0 rounded-full"
              >
                <X size={14} />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => openAssignmentModal(selectedIds, `${selectedIds.length} Orders`)}
                disabled={isBulkLoading}
                leftIcon={<UserPlus size={16} />}
                className="rounded-full px-4"
              >
                Assign Fleet
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusUpdate(OrderStatus.DELIVERED)}
                disabled={isBulkLoading}
                className="rounded-full px-4 border-success/30 text-success hover:bg-success/10 hover:border-success/50"
              >
                <CheckCircle2 size={16} className="mr-2" />
                Mark Delivered
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
