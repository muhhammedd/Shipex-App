import { motion } from "framer-motion";
import { Package, TrendingUp, Users, AlertCircle, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function MerchantDashboard() {
  const stats = [
    { label: "شحنات اليوم", value: "24", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "قيد التوصيل", value: "12", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "تم التسليم", value: "148", icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "مرتجع", value: "3", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">لوحة المعلومات</h1>
          <p className="text-muted-foreground">أهلاً بك، إليك ملخص عمليات اليوم</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          شحنة جديدة
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>آخر الشحنات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    #{1000 + item}
                  </div>
                  <div>
                    <h4 className="font-semibold">عميل رقم {item}</h4>
                    <p className="text-sm text-muted-foreground">الرياض، حي الملقا</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">250 ر.س</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    جاري التوصيل
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
