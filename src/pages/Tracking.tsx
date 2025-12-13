// src/pages/Tracking.tsx
import { useParams, Link } from "react-router-dom"; // ✅ تحديث الاستيراد
import { MOCK_SHIPMENTS } from "../lib/data";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Package, Truck, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export default function Tracking() {
  // ✅ استبدال useRoute بـ useParams
  const { id } = useParams(); 

  // البحث عن الشحنة (أو عرض الأولى كنسخة احتياطية)
  const shipment = MOCK_SHIPMENTS.find(s => s.id === id) || MOCK_SHIPMENTS[0];

  const steps = [
    { label: "Order Placed", date: "Dec 8, 9:00 AM", completed: true, icon: Package },
    { label: "Picked Up", date: "Dec 8, 2:30 PM", completed: true, icon: Truck },
    { label: "In Transit", date: "Dec 9, 8:00 AM", completed: shipment.status !== "Pending", icon: MapPin },
    { label: "Delivered", date: "Est. Dec 10", completed: shipment.status === "Delivered", icon: CheckCircle2 },
  ];

  return (
    <div className="pb-24 h-screen flex flex-col bg-background">
      {/* Map Area (Mock) */}
      <div className="h-[40vh] bg-muted relative w-full overflow-hidden">
        {/* ... (نفس كود الخريطة والتصميم لا يتغير) ... */}
        <div className="absolute inset-0 bg-[#e5e7eb] dark:bg-[#1f2937]">
           <div className="absolute inset-0" style={{ 
             backgroundImage: 'linear-gradient(#d1d5db 1px, transparent 1px), linear-gradient(90deg, #d1d5db 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}/>

           <svg className="absolute inset-0 h-full w-full pointer-events-none">
             <path 
               d="M 100 300 Q 150 150 300 100 T 500 150" 
               fill="none" 
               stroke="hsl(var(--primary))" 
               strokeWidth="4" 
               strokeDasharray="8 4"
               className="animate-pulse"
             />
             <circle cx="100" cy="300" r="8" fill="white" stroke="hsl(var(--primary))" strokeWidth="3" />
             <circle cx="500" cy="150" r="8" fill="hsl(var(--primary))" />
           </svg>

           <motion.div 
             initial={{ x: 100, y: 300 }}
             animate={{ x: 300, y: 100 }}
             transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
             className="absolute -ml-6 -mt-12"
           >
             <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
               <Truck className="h-6 w-6" />
             </div>
             <div className="w-4 h-4 bg-primary/30 rounded-full mx-auto mt-1 animate-ping" />
           </motion.div>
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          {/* ✅ استخدام to بدلاً من href */}
          <Link to="/home"> 
            <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-background/80 backdrop-blur-md">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Details Sheet */}
      <div className="flex-1 -mt-6 bg-background rounded-t-3xl shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] relative z-20 overflow-y-auto">
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-3 mb-6" />

        <div className="px-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold font-display">{shipment.trackingNumber}</h1>
              <p className="text-muted-foreground">{shipment.origin} → {shipment.destination}</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</div>
              <div className="text-primary font-bold">{shipment.status}</div>
            </div>
          </div>

          <div className="space-y-6 relative">
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border" />

            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-4 items-start"
              >
                <div className={cn(
                  "z-10 h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                  step.completed 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "bg-background border-muted text-muted-foreground"
                )}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="pt-1 flex-1">
                  <h3 className={cn(
                    "font-medium leading-none",
                    step.completed ? "text-foreground" : "text-muted-foreground"
                  )}>{step.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.date}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 space-y-3">
             <Button className="w-full h-12 text-base shadow-lg shadow-primary/20">
               Notify me of updates
             </Button>
             <Button variant="outline" className="w-full h-12 text-base">
               Report an issue
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
