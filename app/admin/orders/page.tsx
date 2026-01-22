"use client";

import { useState, useEffect, useCallback } from "react";
import { OrderFilters } from "../../../components/domain/order/OrderFilters";
import { OrderRow } from "../../../components/domain/order/OrderRow";
import { orderService, PaginatedResponse } from "../../../lib/services/orderService";
import { Order } from "../../../types/order";
import { ChevronLeft, ChevronRight, Loader2, Download } from "lucide-react";
import { Button } from "../../../components/ui/Button";

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
    date: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<PaginatedResponse<Order> | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrders(filters as any, currentPage, ITEMS_PER_PAGE);
      setResponse(res);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const orders = response?.data || [];
  const totalPages = response?.totalPages || 0;
  const totalResults = response?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track all orders</p>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
          Export
        </Button>
      </div>

      <OrderFilters onFilterChange={handleFilterChange} />

      <div className="overflow-hidden rounded-lg bg-secondary text-white border border-primary/10">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20">
          <table className="w-full border-collapse min-w-[800px]">
            <thead className="bg-primary/60 text-sm text-gray-300">
              <tr>
                <th className="px-4 py-3 text-right font-semibold">Order ID</th>
                <th className="px-4 py-3 text-right font-semibold">Merchant</th>
                <th className="px-4 py-3 text-right font-semibold">Recipient</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
                <th className="px-4 py-3 text-right font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Date</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Loader2 className="h-8 w-8 animate-spin text-accent" />
                      <p>Loading orders...</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <OrderRow key={order.id} order={{
                    id: order.trackingNumber,
                    merchantName: order.merchantName,
                    recipientName: order.recipientName,
                    amount : order.amount,
                    status: order.status,
                    createdAt: new Date(order.createdAt).toISOString().split('T')[0]
                  }} />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="flex items-center justify-between border-t border-primary/20 bg-primary/40 px-4 py-3">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{totalResults === 0 ? 0 : ((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * ITEMS_PER_PAGE, totalResults)}</span> of <span className="font-medium text-white">{totalResults}</span> results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
