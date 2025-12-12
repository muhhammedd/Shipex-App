import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const data = [
    { name: 'السبت', shipments: 400 },
    { name: 'الأحد', shipments: 300 },
    { name: 'الإثنين', shipments: 550 },
    { name: 'الثلاثاء', shipments: 450 },
    { name: 'الأربعاء', shipments: 600 },
    { name: 'الخميس', shipments: 700 },
    { name: 'الجمعة', shipments: 200 },
  ];

  const pieData = [
    { name: 'تم التسليم', value: 75, color: '#22c55e' },
    { name: 'قيد التوصيل', value: 15, color: '#3b82f6' },
    { name: 'مرتجع', value: 10, color: '#ef4444' },
  ];

  return (
    <div className="p-8 space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">نظرة عامة (KPIs)</h1>
        <p className="text-slate-500">مؤشرات الأداء الرئيسية للنظام</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "إجمالي الشحنات", value: "12,450", change: "+12%", color: "border-l-4 border-l-blue-500" },
          { label: "نسبة التوصيل الناجح", value: "94.2%", change: "+2.1%", color: "border-l-4 border-l-green-500" },
          { label: "المندوبين النشطين", value: "48", change: "-2", color: "border-l-4 border-l-orange-500" },
          { label: "إجمالي الإيرادات", value: "450k", change: "+8%", color: "border-l-4 border-l-purple-500" },
        ].map((kpi, i) => (
          <Card key={i} className={`shadow-sm ${kpi.color}`}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold">{kpi.value}</h3>
                <span className={kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {kpi.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>حركة الشحنات الأسبوعية</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="shipments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>توزيع الحالات</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
