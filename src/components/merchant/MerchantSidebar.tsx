import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Plus, CreditCard, FileText, Settings, LifeBuoy } from 'lucide-react';

export const MerchantSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/merchant/dashboard' },
    { icon: Package, label: 'Orders', path: '/merchant/orders' },
    { icon: Plus, label: 'Create Order', path: '/merchant/orders/new' },
    { icon: CreditCard, label: 'Accounts', path: '/merchant/accounts' },
    { icon: FileText, label: 'Invoices', path: '/merchant/invoices' },
    { icon: Settings, label: 'Settings', path: '/merchant/settings' },
    { icon: LifeBuoy, label: 'Support', path: '/merchant/support' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition duration-200 ${
              isActive(item.path)
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};
