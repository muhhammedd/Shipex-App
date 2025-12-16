import { useState } from "react";
import { motion } from "framer-motion";
import { Package, RotateCcw, AlertTriangle, RefreshCw, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../hooks/use-toast";
import { Link } from "react-router-dom";

// Mock Data
const RETURNS_DATA = [
  { id: "SW-1004", customer: "خالد عمر", reason: "العميل رفض الاستلام", cost: 15, date: "2023-12-06", original_price: 80 },
  { id: "SW-9821", customer: "مؤسسة البناء", reason: "العنوان غير صحيح", cost: 0, date: "2023-12-05", original_price: 450 },
  { id: "SW-8712", customer: "سارة خالد", reason: "المنتج تالف", cost: 0, date: "2023-12-04", original_price: 120 },
];

export default function Returns() {
  const { toast } = useToast();

  const handleResend = (id: string) => {
    toast({
      title: "تم استنساخ الشحنة",
      description: `تم إنشاء نسخة جديدة من الشحنة ${id} للمحاولة مرة أخرى`,
    });
    // In a real app, this would redirect to New Shipment with data pre-filled
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/merchant">
          <Button variant="ghost" size="icon">
            <ArrowRight className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-display">سجل المرتجعات</h1>
          <p className="text-muted-foreground mt-1">إدارة الشحنات المرتجعة وأسباب الرفض</p>
        </div>
      </div>

      <div className="grid gap-4">
        {RETURNS_DATA.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  
                  {/* Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                      <RotateCcw className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold">{item.id}</h3>
                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                          {item.date}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{item.customer}</p>
                      
                      <div className="flex items-center gap-2 text-sm bg-red-50 text-red-700 px-3 py-1.5 rounded-lg w-fit">
                        <AlertTriangle className="h-4 w-4" />
                        <span>السبب: {item.reason}</span>
                      </div>
                    </div>
                  </div>

                  {/* Costs */}
                  <div className="flex flex-col items-end gap-1 min-w-[120px]">
                    <span className="text-sm text-muted-foreground">تكلفة الارجاع</span>
                    <span className="font-bold text-xl">{item.cost > 0 ? item.cost : "مجاني"} {item.cost > 0 && "ر.س"}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 w-full lg:w-auto">
                     <Button 
                       className="flex-1 lg:flex-none gap-2" 
                       onClick={() => handleResend(item.id)}
                     >
                       <RefreshCw className="h-4 w-4" />
                       إعادة إرسال
                     </Button>
                     <Link href={`/merchant/shipment/${item.id}`}>
                       <Button variant="outline" className="flex-1 lg:flex-none gap-2">
                         التفاصيل
                         <ArrowLeft className="h-4 w-4" />
                       </Button>
                     </Link>
                  </div>

                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
