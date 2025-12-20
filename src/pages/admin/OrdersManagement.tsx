import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { BaseLayout } from '../../layouts/BaseLayout';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

export const OrdersManagement: React.FC = () => {
  const navigate = useNavigate();
  const { orders, users, assignCourier } = useData();
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<string>('');

  const couriers = users.filter((u) => u.role === 'courier');

  const handleAssignCourier = (orderId: string) => {
    if (selectedCourier) {
      assignCourier(orderId, selectedCourier);
      setAssigningOrderId(null);
      setSelectedCourier('');
    }
  };

  const sidebar = <AdminSidebar />;

  return (
    <BaseLayout sidebar={sidebar} title="Orders Management">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Orders</h2>
          <p className="text-gray-600 mt-1">Total: {orders.length} orders</p>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const assignedCourier = order.courierId
                    ? users.find((u) => u.id === order.courierId)?.name
                    : 'Not assigned';

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.recipientName}</td>
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
                      <td className="px-6 py-4 text-sm text-gray-600">{assignedCourier}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          View
                        </button>
                        {!order.courierId && (
                          <button
                            onClick={() => setAssigningOrderId(order.id)}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Assign
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg">No orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Assign Courier Modal */}
        {assigningOrderId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Courier</h3>
              <div className="mb-4">
                <label htmlFor="courier" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Courier
                </label>
                <select
                  id="courier"
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Select a courier --</option>
                  {couriers.map((courier) => (
                    <option key={courier.id} value={courier.id}>
                      {courier.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAssignCourier(assigningOrderId)}
                  disabled={!selectedCourier}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Assign
                </button>
                <button
                  onClick={() => {
                    setAssigningOrderId(null);
                    setSelectedCourier('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default OrdersManagement;
