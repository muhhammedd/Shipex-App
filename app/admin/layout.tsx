"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Users,
  Store,
  Settings,
  FileBarChart,
  Building2,
  Ship ,
  Wallet,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { icon: BarChart3, label: "لوحة القيادة", path: "/admin" },
    { label: "إدارة التجار", path: "/admin/merchants", icon: Store },
    { icon: Users, label: "إدارة المندوبين", path: "/admin/drivers" },
    { icon: Ship , label: "إدارة الطلبات", path: "/admin/orders" },
    { icon: FileBarChart, label: "التحليلات", path: "/admin/analytics" },
    { icon: Wallet, label: "التسعير", path: "/admin/pricing" },
    { icon: Settings, label: "الإعدادات", path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-primary text-background" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 right-0 z-40 flex w-20 lg:w-64 flex-col bg-secondary">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-primary/10 lg:justify-start lg:px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent font-bold text-primary">
            S
          </div>
          <span className="mr-3 hidden text-lg font-bold lg:block">
            Shipex
          </span>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`
                    flex items-center gap-3 rounded-md px-3 py-3 text-sm
                    transition-colors
                    ${
                      isActive
                        ? "bg-accent text-primary"
                        : "text-gray-400 hover:bg-primary/80 hover:text-white"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden lg:block">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="mr-20 flex flex-1 flex-col lg:mr-64 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-primary px-4 sm:px-6">
          <h1 className="text-lg font-semibold truncate">
            Admin Dashboard
          </h1>

          {/* Placeholder for future actions */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-secondary flex-shrink-0" />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-primary">
          <div className="mx-auto max-w-7xl p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}