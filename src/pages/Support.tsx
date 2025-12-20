import React, { useState } from 'react';
import { BaseLayout } from '../layouts/BaseLayout';
import { MerchantSidebar } from '../components/merchant/MerchantSidebar';
import { CourierSidebar } from '../components/courier/CourierSidebar';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Mail, Phone, Clock, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('contact');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const getSidebar = () => {
    switch (user?.role) {
      case 'merchant':
        return <MerchantSidebar />;
      case 'courier':
        return <CourierSidebar />;
      case 'admin':
        return <AdminSidebar />;
      default:
        return <MerchantSidebar />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setMessage('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  const faqs = [
    {
      question: 'How do I create a new shipment?',
      answer: 'Go to the Orders section and click "Create Order". Fill in the required details and submit. Your shipment will be processed immediately.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit cards, debit cards, and bank transfers. You can manage your payment methods in the Accounts section.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 2-3 business days. Express delivery is available for next-day delivery.',
    },
    {
      question: 'Can I track my shipment?',
      answer: 'Yes, you can track your shipment in real-time using the tracking number provided in your order confirmation.',
    },
    {
      question: 'What is your refund policy?',
      answer: 'We offer full refunds for cancelled orders within 24 hours. For more details, please contact our support team.',
    },
  ];

  const supportChannels = [
    { icon: Mail, label: 'Email Support', value: 'support@shipex.com', description: 'Response within 24 hours' },
    { icon: Phone, label: 'Phone Support', value: '+966 50 123 4567', description: 'Available 24/7' },
    { icon: MessageCircle, label: 'Live Chat', value: 'Available Now', description: 'Chat with our team' },
    { icon: Clock, label: 'Support Hours', value: '24/7', description: 'Always available' },
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
    <BaseLayout sidebar={getSidebar()} title="Support">
      <motion.div
        className="max-w-6xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Support Channels */}
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={itemVariants}>
          {supportChannels.map((channel, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
            >
              <channel.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold text-gray-900 mb-1">{channel.label}</h3>
              <p className="text-sm font-medium text-blue-600 mb-2">{channel.value}</p>
              <p className="text-xs text-gray-600">{channel.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
          <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto">
            {['contact', 'faq', 'tickets'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 font-medium transition-colors capitalize whitespace-nowrap ${
                  selectedTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Contact Form */}
          {selectedTab === 'contact' && (
            <motion.div className="space-y-6" variants={itemVariants}>
              {submitted && (
                <motion.div
                  className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Message Sent Successfully!</p>
                    <p className="text-sm text-green-800">We'll get back to you within 24 hours.</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="What is your issue about?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>General Inquiry</option>
                    <option>Technical Issue</option>
                    <option>Billing Question</option>
                    <option>Complaint</option>
                    <option>Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your issue in detail..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </motion.div>
          )}

          {/* FAQ */}
          {selectedTab === 'faq' && (
            <motion.div className="space-y-4" variants={itemVariants}>
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  whileHover={{ backgroundColor: '#f9fafb' }}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Support Tickets */}
          {selectedTab === 'tickets' && (
            <motion.div className="space-y-4" variants={itemVariants}>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Your Support Tickets
                </h3>
                <p className="text-sm text-blue-800">Track the status of your support requests.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ticket ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'TKT-001', subject: 'Payment issue', status: 'Resolved', date: '2025-12-10' },
                      { id: 'TKT-002', subject: 'Shipment delay', status: 'In Progress', date: '2025-12-12' },
                      { id: 'TKT-003', subject: 'Account verification', status: 'Pending', date: '2025-12-15' },
                    ].map((ticket) => (
                      <motion.tr
                        key={ticket.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                        whileHover={{ backgroundColor: '#f9fafb' }}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-blue-600">{ticket.id}</td>
                        <td className="px-4 py-3 text-sm">{ticket.subject}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ticket.status === 'Resolved'
                              ? 'bg-green-100 text-green-800'
                              : ticket.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{ticket.date}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </BaseLayout>
  );
};

export default SupportPage;
