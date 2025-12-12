import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { 
  BarChart3, 
  Users, 
  Settings, 
  FileBarChart, 
  Map as MapIcon,
  LogOut,
  Building2,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: BarChart3, label: "لوحة القيادة", path: "/admin" },
    { icon: Users, label: "إدارة المندوبين", path: "/admin/drivers" },
    { icon: Building2, label: "إدارة المناطق", path: "/admin/zones" },
    { icon: FileBarChart, label: "التقارير", path: "/admin/reports" },
    { icon: Wallet, label: "المالية", path: "/admin/finance" },
    { icon: Settings, label: "الإعدادات", path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      {/* Dense Sidebar for Admin */}
      <aside className="w-20 lg:w-64 fixed inset-y-0 right-0 z-50 flex flex-col bg-slate-900 text-white transition-all duration-300">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg lg:ml-3">S</div>
          <span className="hidden lg:block font-bold font-display text-xl">AdminPanel</span>
        </div>
        
        <div className="flex-1 py-6 space-y-2 overflow-y-auto px-3">
          {menuItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"}
                `}>
                  <item.icon className="h-5 w-5" />
                  <span className="hidden lg:block font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <Button 
            variant="ghost" 
            className="w-full justify-center lg:justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-950/30"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden lg:block">خروج</span>
          </Button>
        </div>
      </aside>

      <main className="mr-20 lg:mr-64 flex-1 min-h-screen w-full bg-slate-50/50">
        {children}
      </main>
    </div>
  );
}
