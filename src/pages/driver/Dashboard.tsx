import { motion } from "framer-motion";
import { MapPin, Navigation, Phone, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

export default function DriverDashboard() {
  const { logout } = useAuth();
  
  const tasks = [
    { id: 1, location: "حي العليا، شارع التحلية", customer: "محمد أحمد", time: "10:30 ص", status: "pending", priority: "high" },
    { id: 2, location: "حي النرجس، طريق أبي بكر", customer: "سارة علي", time: "11:45 ص", status: "pending", priority: "normal" },
    { id: 3, location: "حي الياسمين، طريق أنس", customer: "شركة التقنية", time: "01:00 م", status: "completed", priority: "normal" },
  ];

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-xl font-bold">مهام اليوم</h1>
          <p className="text-sm text-muted-foreground">لديك 2 مهام متبقية</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="font-bold text-primary">ع.م</span>
        </div>
      </header>

      {/* Map Preview Card */}
      <Card className="overflow-hidden border-none shadow-md bg-muted relative h-48">
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/46.6753,24.7136,12,0/800x400')] bg-cover bg-center opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button className="shadow-lg gap-2">
            <Navigation className="h-4 w-4" />
            بدء المسار
          </Button>
        </div>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">قائمة التوصيل</h2>
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`border-r-4 ${task.status === 'completed' ? 'border-r-green-500 opacity-60' : 'border-r-primary'}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-background">
                      <Clock className="h-3 w-3 ml-1" />
                      {task.time}
                    </Badge>
                    {task.priority === 'high' && (
                      <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-none">
                        عاجل
                      </Badge>
                    )}
                  </div>
                  {task.status === 'completed' && <CheckCircle2 className="text-green-500 h-5 w-5" />}
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="mt-1 bg-muted p-2 rounded-full h-8 w-8 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{task.location}</h3>
                    <p className="text-muted-foreground">{task.customer}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 gap-2 h-10">
                    <Phone className="h-4 w-4" />
                    اتصال
                  </Button>
                  <Button variant="secondary" className="flex-1 gap-2 h-10">
                    <Navigation className="h-4 w-4" />
                    توجيه
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
        تسجيل الخروج
      </Button>
    </div>
  );
}
