import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { 
  ClipboardList, 
  Map, 
  CheckSquare, 
  Wallet, 
  User,
  LogOut
} from "lucide-react";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { icon: ClipboardList, label: "المهام", path: "/driver" },
    { icon: Map, label: "الخريطة", path: "/driver/map" },
    { icon: CheckSquare, label: "التسليم", path: "/driver/proof" },
    { icon: Wallet, label: "رصيدي", path: "/driver/wallet" },
    { icon: User, label: "ملفي", path: "/driver/profile" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      {children}
      
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 pb-6 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <div className={`
                  flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-16
                  ${isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"}
                `}>
                  <item.icon 
                    className={`h-6 w-6 mb-1 ${isActive && "fill-current"}`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
