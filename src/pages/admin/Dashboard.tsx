import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { BaseLayout } from '../../layouts/BaseLayout';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Users, Package, Truck, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, users } = useData();

  // Calculate stats
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const activeCouriers = users.filter((u) => u.role === 'courier').length;
  const merchants = users.filter((u) => u.role === 'merchant').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Active Couriers',
      value: activeCouriers,
      icon: Truck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Merchants',
      value: merchants,
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
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

  const sidebar = <AdminSidebar />;

  return (
    <BaseLayout sidebar={sidebar} title="Admin Dashboard">
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
                onClick={() => navigate('/admin/users')}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="h-5 w-5" />
                Manage Users
              </motion.button>
              <motion.button
                onClick={() => navigate('/admin/orders')}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Package className="h-5 w-5" />
                Manage Orders
              </motion.button>
            </div>
          </motion.div>

          {/* System Status Card */}
          <motion.div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border border-green-200" variants={itemVariants}>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">System Status</h4>
                <p className="text-sm text-green-800">All systems operational</p>
                <p className="text-xs text-green-700 mt-2">Delivered: {deliveredOrders} | Pending: {pendingOrders}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={itemVariants}>
          <motion.div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500" variants={itemVariants}>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Delivery Rate</h4>
            <p className="text-3xl font-bold text-gray-900">{totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0}%</p>
            <p className="text-xs text-gray-500 mt-2">{deliveredOrders} of {totalOrders} orders delivered</p>
          </motion.div>

          <motion.div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500" variants={itemVariants}>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Pending Orders</h4>
            <p className="text-3xl font-bold text-gray-900">{pendingOrders}</p>
            <p className="text-xs text-gray-500 mt-2">Awaiting courier assignment</p>
          </motion.div>

          <motion.div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500" variants={itemVariants}>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Active Users</h4>
            <p className="text-3xl font-bold text-gray-900">{activeCouriers + merchants}</p>
            <p className="text-xs text-gray-500 mt-2">{merchants} merchants, {activeCouriers} couriers</p>
          </motion.div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div className="bg-white rounded-lg shadow-md overflow-hidden" variants={itemVariants}>
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <motion.button
              onClick={() => navigate('/admin/orders')}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.slice(0, 5).map((order, idx) => (
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
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'picked'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <motion.button
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
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
          </div>
        </motion.div>
      </motion.div>
    </BaseLayout>
  );
};

export default AdminDashboard;
