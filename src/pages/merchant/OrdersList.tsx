import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BaseLayout } from '../../layouts/BaseLayout';
import { MerchantSidebar } from '../../components/merchant/MerchantSidebar';
import { OrderStatus } from '../../lib/types';
import { Plus, Filter } from 'lucide-react';

export const OrdersList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders } = useData();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  // Filter orders for this merchant
  let merchantOrders = orders.filter((order) => order.merchantId === user?.id);

  // Apply status filter
  if (statusFilter !== 'all') {
    merchantOrders = merchantOrders.filter((order) => order.status === statusFilter);
  }

  const sidebar = <MerchantSidebar />;

  const statusOptions: { value: OrderStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'picked', label: 'Picked' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <BaseLayout sidebar={sidebar} title="Orders Management">
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
            <p className="text-gray-600 mt-1">Total: {merchantOrders.length} orders</p>
          </div>
          <button
            onClick={() => navigate('/merchant/orders/new')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            <Plus className="h-5 w-5" />
            Create Order
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Filter by Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  statusFilter === option.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {merchantOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.recipientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate">{order.deliveryAddress}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'picked'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => navigate(`/merchant/orders/${order.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {merchantOrders.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg">No orders found</p>
                <p className="text-sm mt-2">
                  {statusFilter !== 'all'
                    ? `No orders with status "${statusFilter}"`
                    : 'Create your first order to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default OrdersList;
