import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BaseLayout } from '../../layouts/BaseLayout';
import { CourierSidebar } from '../../components/courier/CourierSidebar';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { OrderStatus } from '../../lib/types';

export const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useData();
  const [statusUpdated, setStatusUpdated] = useState(false);

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <BaseLayout sidebar={<CourierSidebar />} title="Task Not Found">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Not Found</h2>
          <p className="text-gray-600 mb-6">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/courier/tasks')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Back to Tasks
          </button>
        </div>
      </BaseLayout>
    );
  }

  if (order.courierId !== user?.id) {
    return (
      <BaseLayout sidebar={<CourierSidebar />} title="Unauthorized">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized</h2>
          <p className="text-gray-600 mb-6">You don't have permission to view this task.</p>
          <button
            onClick={() => navigate('/courier/tasks')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Back to Tasks
          </button>
        </div>
      </BaseLayout>
    );
  }

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus);
    setStatusUpdated(true);
    setTimeout(() => setStatusUpdated(false), 3000);
  };

  const getNextStatus = (): OrderStatus | null => {
    if (order.status === 'pending') return 'picked';
    if (order.status === 'picked') return 'delivered';
    return null;
  };

  const sidebar = <CourierSidebar />;

  return (
    <BaseLayout sidebar={sidebar} title="Task Details">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/courier/tasks')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Tasks
        </button>

        {statusUpdated && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Status updated successfully!
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Task {order.id}</h2>
              <p className="text-gray-600 mt-1">Created: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                order.status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'picked'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {/* Status Progress */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Progress</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    ['pending', 'picked', 'delivered'].indexOf(order.status) >= 0
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                >
                  ✓
                </div>
                <p className="text-sm text-gray-600 mt-2">Pending</p>
              </div>
              <div className={`flex-1 h-1 mx-2 ${['picked', 'delivered'].indexOf(order.status) >= 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    ['picked', 'delivered'].indexOf(order.status) >= 0
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                >
                  ✓
                </div>
                <p className="text-sm text-gray-600 mt-2">Picked</p>
              </div>
              <div className={`flex-1 h-1 mx-2 ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  ✓
                </div>
                <p className="text-sm text-gray-600 mt-2">Delivered</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Pickup Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-gray-900 font-medium">{order.pickupAddress}</p>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-gray-900 font-medium">{order.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recipient Name</p>
                  <p className="text-gray-900 font-medium">{order.recipientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900 font-medium">{order.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
            <div>
              <p className="text-sm text-gray-600">Price</p>
              <p className="text-2xl font-bold text-gray-900">${order.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Status Update Actions */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            {getNextStatus() ? (
              <button
                onClick={() => handleStatusUpdate(getNextStatus()!)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                Mark as {getNextStatus()!.charAt(0).toUpperCase() + getNextStatus()!.slice(1)}
              </button>
            ) : (
              <p className="text-gray-600">This task is already completed.</p>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default TaskDetails;
