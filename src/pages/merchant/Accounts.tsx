import React, { useState } from 'react';
import { BaseLayout } from '../../layouts/BaseLayout';
import { MerchantSidebar } from '../../components/merchant/MerchantSidebar';
import { CreditCard, DollarSign, TrendingUp, AlertCircle, Edit, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export const MerchantAccounts: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const accountData = {
    accountBalance: 15250.75,
    totalRevenue: 125000,
    totalTransactions: 342,
    pendingPayouts: 3500,
  };

  const transactions = [
    { id: 1, date: '2025-12-15', type: 'Payment', amount: 500, status: 'Completed' },
    { id: 2, date: '2025-12-14', type: 'Refund', amount: -150, status: 'Completed' },
    { id: 3, date: '2025-12-13', type: 'Payment', amount: 750, status: 'Pending' },
    { id: 4, date: '2025-12-12', type: 'Payment', amount: 1200, status: 'Completed' },
    { id: 5, date: '2025-12-11', type: 'Withdrawal', amount: -2000, status: 'Completed' },
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

  return (
    <BaseLayout sidebar={<MerchantSidebar />} title="Merchant Accounts">
      <motion.div
        className="max-w-6xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Account Overview Cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={itemVariants}>
          {[
            { icon: CreditCard, label: 'Account Balance', value: `$${accountData.accountBalance.toFixed(2)}`, color: 'from-blue-500 to-blue-600' },
            { icon: TrendingUp, label: 'Total Revenue', value: `$${accountData.totalRevenue.toFixed(2)}`, color: 'from-green-500 to-green-600' },
            { icon: DollarSign, label: 'Transactions', value: accountData.totalTransactions.toString(), color: 'from-purple-500 to-purple-600' },
            { icon: AlertCircle, label: 'Pending Payouts', value: `$${accountData.pendingPayouts.toFixed(2)}`, color: 'from-orange-500 to-orange-600' },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white shadow-lg`}
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-2">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <card.icon className="h-12 w-12 opacity-30" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            {['overview', 'transactions', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 font-medium transition-colors capitalize ${
                  selectedTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {selectedTab === 'overview' && (
            <motion.div className="space-y-6" variants={itemVariants}>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-blue-900 mb-2">Account Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Account Holder</p>
                    <p className="font-semibold">Ahmed Al-Mansouri</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Account Type</p>
                    <p className="font-semibold">Premium Merchant</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Account Status</p>
                    <p className="font-semibold text-green-600">Active</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Member Since</p>
                    <p className="font-semibold">January 2023</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'transactions' && (
            <motion.div variants={itemVariants}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <motion.tr
                        key={tx.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                        whileHover={{ backgroundColor: '#f9fafb' }}
                      >
                        <td className="px-4 py-3 text-sm">{tx.date}</td>
                        <td className="px-4 py-3 text-sm font-medium">{tx.type}</td>
                        <td className={`px-4 py-3 text-sm font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount > 0 ? '+' : ''} ${Math.abs(tx.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            tx.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4" />
                  Export Statement
                </button>
              </div>
            </motion.div>
          )}

          {selectedTab === 'settings' && (
            <motion.div className="space-y-6" variants={itemVariants}>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      defaultValue="Al-Mansouri Trading"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue="ahmed@almansouri.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+966 50 123 4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </BaseLayout>
  );
};

export default MerchantAccounts;
