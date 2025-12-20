import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BaseLayout } from '../../layouts/BaseLayout';
import { MerchantSidebar } from '../../components/merchant/MerchantSidebar';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useData();
  const [cancelConfirm, setCancelConfirm] = useState(false);

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <BaseLayout sidebar={<MerchantSidebar />} title="Order Not Found">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/merchant/orders')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Back to Orders
          </button>
        </div>
      </BaseLayout>
    );
  }

  if (order.merchantId !== user?.id) {
    return (
      <BaseLayout sidebar={<MerchantSidebar />} title="Unauthorized">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized</h2>
          <p className="text-gray-600 mb-6">You don't have permission to view this order.</p>
          <button
            onClick={() => navigate('/merchant/orders')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Back to Orders
          </button>
        </div>
      </BaseLayout>
    );
  }

  const handleCancel = () => {
    if (order.status !== 'delivered' && order.status !== 'cancelled') {
      updateOrderStatus(order.id, 'cancelled');
      setCancelConfirm(false);
    }
  };

  const sidebar = <MerchantSidebar />;

  return (
    <BaseLayout sidebar={sidebar} title="Order Details">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/merchant/orders')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Orders
        </button>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order {order.id}</h2>
              <p className="text-gray-600 mt-1">Created: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
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

          {/* Order Details */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-2xl font-bold text-gray-900">${order.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Assigned Courier</p>
                <p className="text-gray-900 font-medium">
                  {order.courierId ? `Courier ${order.courierId}` : 'Not assigned yet'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div>
                {!cancelConfirm ? (
                  <button
                    onClick={() => setCancelConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                  >
                    Cancel Order
                  </button>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-900 font-semibold mb-4">
                      Are you sure you want to cancel this order?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleCancel}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                      >
                        Yes, Cancel Order
                      </button>
                      <button
                        onClick={() => setCancelConfirm(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-6 rounded-lg transition duration-200"
                      >
                        No, Keep Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {(order.status === 'delivered' || order.status === 'cancelled') && (
              <p className="text-gray-600">No actions available for this order.</p>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default OrderDetails;
