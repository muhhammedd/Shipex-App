import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BaseLayout } from '../../layouts/BaseLayout';
import { CourierSidebar } from '../../components/courier/CourierSidebar';
import { Truck, CheckCircle, Clock, MapPin, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const CourierDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders } = useData();

  // Filter orders assigned to this courier
  const assignedOrders = orders.filter((order) => order.courierId === user?.id);
  const activeDeliveries = assignedOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const completedToday = assignedOrders.filter((o) => {
    const today = new Date().toDateString();
    return o.status === 'delivered' && new Date(o.createdAt).toDateString() === today;
  }).length;
  const totalDelivered = assignedOrders.filter((o) => o.status === 'delivered').length;

  const stats = [
    {
      label: 'Assigned Orders',
      value: assignedOrders.length,
      icon: Truck,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active Deliveries',
      value: activeDeliveries,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Completed Today',
      value: completedToday,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Delivered',
      value: totalDelivered,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const sidebar = <CourierSidebar />;

  return (
    <BaseLayout sidebar={sidebar} title="Courier Dashboard">
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Stats Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className={`${stat.bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions & Info */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={itemVariants}>
          {/* Quick Actions */}
          <motion.div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <motion.button
                onClick={() => navigate('/courier/tasks')}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Truck className="h-5 w-5" />
                View All Tasks
              </motion.button>
              <motion.button
                onClick={() => navigate('/courier/tasks')}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MapPin className="h-5 w-5" />
                View Map
              </motion.button>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border border-green-200" variants={itemVariants}>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Great Work!</h4>
                <p className="text-sm text-green-800">You've completed {totalDelivered} deliveries so far.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Active Tasks */}
        <motion.div className="bg-white rounded-lg shadow-md overflow-hidden" variants={itemVariants}>
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Active Tasks</h3>
            <motion.button
              onClick={() => navigate('/courier/tasks')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              whileHover={{ x: 5 }}
            >
              View All →
            </motion.button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assignedOrders
                  .filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
                  .slice(0, 5)
                  .map((order, idx) => (
                    <motion.tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.recipientName}</td>
                      <td className="px-6 py-4 text-sm">
                        <motion.span
                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                            order.status === 'picked'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate">{order.deliveryAddress}</td>
                      <td className="px-6 py-4 text-sm">
                        <motion.button
                          onClick={() => navigate(`/courier/tasks/${order.id}`)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                          whileHover={{ x: 3 }}
                        >
                          View
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
            {assignedOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No active tasks. Great job!
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </BaseLayout>
  );
};

export default CourierDashboard;
