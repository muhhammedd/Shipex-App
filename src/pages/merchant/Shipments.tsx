import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Eye, Phone, MapPin, Package, AlertCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

// Mock Data
const ALL_SHIPMENTS = [
  { id: "SW-1001", customer: "أحمد علي", phone: "0501234567", city: "الرياض", status: "pending", price: 250, delivery: 25, date: "2023-12-09" },
  { id: "SW-1002", customer: "سارة محمد", phone: "0559876543", city: "جدة", status: "in-transit", price: 150, delivery: 35, date: "2023-12-08" },
  { id: "SW-1003", customer: "شركة التقنية", phone: "0543210987", city: "الدمام", status: "delivered", price: 1200, delivery: 35, date: "2023-12-07" },
  { id: "SW-1004", customer: "خالد عمر", phone: "0567890123", city: "مكة", status: "returned", price: 80, delivery: 35, date: "2023-12-06" },
  { id: "SW-1005", customer: "منى أحمد", phone: "0598765432", city: "الرياض", status: "pending", price: 400, delivery: 25, date: "2023-12-09" },
  { id: "SW-1006", customer: "فهد العتيبي", phone: "0505555555", city: "القصيم", status: "in-transit", price: 320, delivery: 35, date: "2023-12-08" },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "قيد التحضير", color: "text-orange-600", bg: "bg-orange-100" },
  "in-transit": { label: "جاري التوصيل", color: "text-blue-600", bg: "bg-blue-100" },
  delivered: { label: "تم التسليم", color: "text-green-600", bg: "bg-green-100" },
  returned: { label: "مرتجع", color: "text-red-600", bg: "bg-red-100" },
};

export default function Shipments() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredShipments = ALL_SHIPMENTS.filter(item => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.customer.includes(searchQuery) || 
                          item.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">سجل الشحنات</h1>
          <p className="text-muted-foreground mt-1">إدارة ومتابعة جميع شحناتك في مكان واحد</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="بحث برقم الشحنة، اسم العميل، أو رقم الجوال..." 
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          تصفية
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
        <TabsList className="w-full justify-start h-12 p-1 bg-muted/50 overflow-x-auto">
          <TabsTrigger value="all" className="flex-1 min-w-[100px]">الكل</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1 min-w-[100px]">قيد التحضير</TabsTrigger>
          <TabsTrigger value="in-transit" className="flex-1 min-w-[100px]">جاري التوصيل</TabsTrigger>
          <TabsTrigger value="delivered" className="flex-1 min-w-[100px]">تم التسليم</TabsTrigger>
          <TabsTrigger value="returned" className="flex-1 min-w-[100px]">مرتجع</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredShipments.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">لا توجد شحنات</h3>
                <p className="text-muted-foreground">لم يتم العثور على شحنات تطابق بحثك</p>
              </motion.div>
            ) : (
              filteredShipments.map((shipment) => (
                <motion.div
                  key={shipment.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:shadow-md transition-shadow border-none shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        
                        {/* Status Strip (Mobile Top / Desktop Left) */}
                        <div className={`h-2 lg:h-auto lg:w-2 ${STATUS_MAP[shipment.status].bg.replace('/20', '')}`} />

                        <div className="flex-1 p-5 flex flex-col gap-4">
                          {/* Header: ID & Status */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                                <Package className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg font-display">{shipment.id}</h3>
                                <p className="text-xs text-muted-foreground">{shipment.date}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className={`${STATUS_MAP[shipment.status].bg} ${STATUS_MAP[shipment.status].color} border-none`}>
                              {STATUS_MAP[shipment.status].label}
                            </Badge>
                          </div>

                          <Separator />

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="text-muted-foreground text-xs">العميل</p>
                              <div className="font-medium flex items-center gap-2">
                                <span>{shipment.customer}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <span className="text-xs" dir="ltr">{shipment.phone}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-muted-foreground text-xs">العنوان</p>
                              <div className="font-medium flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{shipment.city}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-muted-foreground text-xs">التكلفة المالية</p>
                              <div className="flex items-baseline gap-1">
                                <span className="font-bold text-lg">{shipment.price + shipment.delivery}</span>
                                <span className="text-xs text-muted-foreground">ر.س</span>
                              </div>
                              <p className="text-[10px] text-muted-foreground">
                                (المنتج: {shipment.price} + التوصيل: {shipment.delivery})
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions (Right side on desktop) */}
                        <div className="p-4 bg-muted/20 border-t lg:border-t-0 lg:border-r border-border flex lg:flex-col justify-center items-center gap-3 min-w-[140px]">
                          <Link href={`/merchant/shipment/${shipment.id}`}>
                            <Button variant="default" className="w-full gap-2 shadow-sm">
                              <Eye className="h-4 w-4" />
                              التفاصيل
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                            طباعة البوليصة
                          </Button>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
