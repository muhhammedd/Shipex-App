import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { 
  LayoutDashboard, 
  PackagePlus, 
  History, 
  FileText, 
  Wallet, 
  LifeBuoy, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "الرئيسية", path: "/merchant" },
    { icon: PackagePlus, label: "إضافة شحنة", path: "/merchant/new-shipment" },
    { icon: History, label: "سجل الشحنات", path: "/merchant/history" },
    { icon: FileText, label: "الفواتير", path: "/merchant/invoices" },
    { icon: Wallet, label: "الحساب المالي", path: "/merchant/wallet" },
    { icon: LifeBuoy, label: "الدعم الفني", path: "/merchant/support" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold font-display text-primary">SwiftShip</h1>
        <p className="text-sm text-muted-foreground">لوحة التاجر</p>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link key={item.path} to={item.path}>
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors
                ${isActive 
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"}
              `}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">متجر الأناقة</p>
            <p className="text-xs text-muted-foreground">merchant@store.com</p>
          </div>
        </div>
        <Button variant="destructive" className="w-full justify-start gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 right-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 right-0 left-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 z-40">
        <h1 className="text-xl font-bold text-primary">SwiftShip</h1>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <main className="lg:mr-64 flex-1 pt-16 lg:pt-0 min-h-screen w-full">
        {children}
      </main>
    </div>
  );
}
