import React, { useState } from 'react';
import { BaseLayout } from '../../layouts/BaseLayout';
import { MerchantSidebar } from '../../components/merchant/MerchantSidebar';
import { FileText, Download, Eye, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const MerchantInvoices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const invoices = [
    { id: 'INV-001', date: '2025-12-15', amount: 5000, status: 'paid', customer: 'Customer A', items: 25 },
    { id: 'INV-002', date: '2025-12-14', amount: 3500, status: 'pending', customer: 'Customer B', items: 18 },
    { id: 'INV-003', date: '2025-12-13', amount: 7200, status: 'paid', customer: 'Customer C', items: 32 },
    { id: 'INV-004', date: '2025-12-12', amount: 2100, status: 'overdue', customer: 'Customer D', items: 12 },
    { id: 'INV-005', date: '2025-12-11', amount: 4500, status: 'paid', customer: 'Customer E', items: 21 },
  ];

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <BaseLayout sidebar={<MerchantSidebar />} title="Invoices">
      <motion.div
        className="max-w-6xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Stats */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={itemVariants}>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Total Invoices</p>
            <p className="text-3xl font-bold">{invoices.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold">${invoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Pending Amount</p>
            <p className="text-3xl font-bold">${invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</p>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by invoice ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invoice ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <motion.tr
                    key={invoice.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                    whileHover={{ backgroundColor: '#f9fafb' }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{invoice.id}</td>
                    <td className="px-4 py-3 text-sm">{invoice.customer}</td>
                    <td className="px-4 py-3 text-sm">{invoice.date}</td>
                    <td className="px-4 py-3 text-sm font-semibold">${invoice.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedInvoice(selectedInvoice === invoice.id ? null : invoice.id)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4 text-green-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Invoice Details Modal */}
        {selectedInvoice !== null && (
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Details
              </h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {(() => {
              const invoice = invoices.find(inv => inv.id === selectedInvoice);
              if (!invoice) return null;

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Invoice ID</p>
                      <p className="font-semibold">{invoice.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">{invoice.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-semibold">{invoice.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize inline-block ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Items: {invoice.items}</p>
                    <p className="text-2xl font-bold text-blue-600">${invoice.amount.toFixed(2)}</p>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                </div>
              );
            })()}
          </motion.div>
        )}
      </motion.div>
    </BaseLayout>
  );
};

export default MerchantInvoices;
