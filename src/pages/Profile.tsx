// src/pages/Profile.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // ✅ استبدال المكتبة
import { Settings, User, CreditCard, Bell, Shield, LogOut } from "lucide-react";

export default function Profile() {
  return (
    <div className="pb-24 pt-6 px-4 md:px-8 max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold font-display">Alex Morgan</h1>
          <p className="text-muted-foreground">alex.morgan@company.com</p>
        </div>
      </header>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold font-display">Account Settings</h2>

        <div className="grid gap-3">
           {[
             { icon: User, label: "Personal Information" },
             { icon: CreditCard, label: "Payment Methods" },
             { icon: Bell, label: "Notifications" },
             { icon: Shield, label: "Privacy & Security" },
           ].map((item, i) => (
             <Button 
               key={i}
               variant="outline" 
               className="h-14 justify-start px-4 text-base font-normal bg-card hover:bg-muted/50 border-border"
             >
               <item.icon className="mr-4 h-5 w-5 text-primary" />
               {item.label}
             </Button>
           ))}
        </div>
      </div>

      <div className="pt-4">
        {/* ✅ استخدام to بدلاً من href */}
        <Link to="/"> 
          <Button variant="destructive" className="w-full h-12">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </Link>
      </div>
    </div>
  );
}
