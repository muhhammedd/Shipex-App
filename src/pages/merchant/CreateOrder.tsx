import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BaseLayout } from '../../layouts/BaseLayout';
import { MerchantSidebar } from '../../components/merchant/MerchantSidebar';
import { ArrowLeft } from 'lucide-react';

export const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createOrder } = useData();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    recipientName: '',
    phone: '',
    price: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (
      !formData.pickupAddress ||
      !formData.deliveryAddress ||
      !formData.recipientName ||
      !formData.phone ||
      !formData.price
    ) {
      setError('Please fill in all fields');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError('Price must be a valid positive number');
      return;
    }

    try {
      createOrder({
        merchantId: user?.id || '',
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        recipientName: formData.recipientName,
        phone: formData.phone,
        price,
      });

      setSuccess(true);
      setFormData({
        pickupAddress: '',
        deliveryAddress: '',
        recipientName: '',
        phone: '',
        price: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/merchant/orders');
      }, 2000);
    } catch (err) {
      setError('Failed to create order. Please try again.');
    }
  };

  const sidebar = <MerchantSidebar />;

  return (
    <BaseLayout sidebar={sidebar} title="Create New Order">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/merchant/orders')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-900 font-medium mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Orders
        </button>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Order</h2>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Order created successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pickup Address */}
            <div>
              <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Address
              </label>
              <textarea
                id="pickupAddress"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter pickup address"
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter delivery address"
              />
            </div>

            {/* Recipient Name */}
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Name
              </label>
              <input
                id="recipientName"
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter recipient name"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter phone number"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter price"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Create Order
              </button>
              <button
                type="button"
                onClick={() => navigate('/merchant/orders')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </BaseLayout>
  );
};

export default CreateOrder;
