import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Package } from "lucide-react";

// Mock Data
const MONTHLY_SHIPMENTS = [
  { name: '1', shipments: 12 },
  { name: '5', shipments: 18 },
  { name: '10', shipments: 25 },
  { name: '15', shipments: 45 },
  { name: '20', shipments: 30 },
  { name: '25', shipments: 55 },
  { name: '30', shipments: 48 },
];

const STATUS_DISTRIBUTION = [
  { name: 'تم التسليم', value: 75, color: '#22c55e' }, // Green
  { name: 'مرتجع', value: 10, color: '#ef4444' },     // Red
  { name: 'قيد التوصيل', value: 15, color: '#3b82f6' }, // Blue
];

const BEST_CITIES = [
  { name: 'الرياض', value: 450 },
  { name: 'جدة', value: 320 },
  { name: 'الدمام', value: 210 },
  { name: 'مكة', value: 150 },
  { name: 'المدينة', value: 90 },
];

export default function Analytics() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">الإحصائيات والتقارير</h1>
        <p className="text-muted-foreground mt-1">تحليل مفصل لأداء متجرك خلال الشهر الحالي</p>
      </div>

      {/* Profits Card (Hero) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1"
        >
          <Card className="bg-primary text-primary-foreground border-none shadow-lg relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div>
                <p className="text-primary-foreground/80 font-medium mb-1">أرباح الشهر (صافي)</p>
                <h2 className="text-4xl font-bold font-display">42,500 ر.س</h2>
                <div className="flex items-center gap-2 mt-2 text-green-300 bg-green-900/20 w-fit px-2 py-1 rounded-lg">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-bold">+18.2%</span>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-sm opacity-80 mb-2">مقارنة بالشهر السابق (35,800 ر.س)</p>
                <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white/90 w-[75%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الشحنات</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-bold">1,248</div>
               <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                 <ArrowUpRight className="h-3 w-3 text-green-500" />
                 <span className="text-green-600 font-medium">+12%</span>
                 من الشهر الماضي
               </p>
               <div className="h-[80px] mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={MONTHLY_SHIPMENTS}>
                     <defs>
                       <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <Area type="monotone" dataKey="shipments" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorShipments)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">نسبة المرتجعات</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-bold">4.2%</div>
               <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                 <ArrowDownRight className="h-3 w-3 text-green-500" />
                 <span className="text-green-600 font-medium">-0.8%</span>
                 تحسن في الأداء
               </p>
               <div className="h-[80px] mt-4 flex items-end justify-between gap-1 px-2">
                 {[40, 35, 50, 45, 30, 25, 20].map((h, i) => (
                   <div key={i} className="w-full bg-red-100 rounded-t-sm" style={{ height: `${h}%` }} />
                 ))}
               </div>
             </CardContent>
           </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Shipments Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>نمو الشحنات (خلال الشهر)</CardTitle>
            <CardDescription>عدد الشحنات اليومي خلال آخر 30 يوم</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_SHIPMENTS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="shipments" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Delivered vs Returned */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>تحليل حالات الشحنات</CardTitle>
            <CardDescription>نسبة التسليم مقابل المرتجعات</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STATUS_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {STATUS_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                  <tspan x="50%" dy="-10" fontSize="24" fontWeight="bold" fill="#374151">85%</tspan>
                  <tspan x="50%" dy="25" fontSize="12" fill="#6b7280">نسبة النجاح</tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="flex justify-center gap-6 pb-6">
            {STATUS_DISTRIBUTION.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Best Performing Cities */}
      <Card>
        <CardHeader>
          <CardTitle>المحافظات الأكثر مبيعاً</CardTitle>
          <CardDescription>أفضل المناطق أداءً من حيث عدد الشحنات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {BEST_CITIES.map((city, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{city.name}</span>
                  <span className="text-muted-foreground">{city.value} شحنة</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(city.value / 500) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-primary rounded-full" 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
