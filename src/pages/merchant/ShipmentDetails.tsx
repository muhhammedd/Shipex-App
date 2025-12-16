import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Package, 
  MapPin, 
  User, 
  Phone, 
  Truck, 
  Calendar, 
  DollarSign, 
  Printer, 
  Edit, 
  Save, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";

// Mock Data
const MOCK_SHIPMENT = {
  id: "SW-1001",
  status: "in-transit",
  created_at: "2023-12-09",
  delivery_date: "2023-12-10 (Est.)",
  customer: {
    name: "أحمد علي",
    phone: "0501234567",
    address: "الرياض، حي الملقا، شارع الأمير محمد",
    city: "الرياض"
  },
  merchant: {
    name: "متجر الأناقة",
    phone: "0599999999",
    address: "الرياض، العليا"
  },
  financials: {
    price: 250,
    delivery: 35,
    total: 285
  },
  delegate: {
    name: "فهد العتيبي",
    phone: "0555555555",
    assigned: true
  }
};

const TIMELINE_STEPS = [
  { id: "received", label: "تم الاستلام", date: "Dec 9, 09:00 AM" },
  { id: "in-transit", label: "جاري التوصيل", date: "Dec 9, 02:30 PM" },
  { id: "delivered", label: "تم التسليم", date: "--" },
  // 'returned' would be an alternative end state
];

export default function ShipmentDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(MOCK_SHIPMENT);

  // Allow editing only if status is 'received' (before delegate pickup usually)
  // For this mock, we'll allow it if status is not delivered
  const canEdit = data.status !== "delivered" && data.status !== "returned";

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "تم تحديث البيانات",
      description: "تم حفظ تعديلات الشحنة بنجاح",
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/merchant/history">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-display">{data.id}</h1>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none text-base px-3">
                جاري التوصيل
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">تاريخ الإنشاء: {data.created_at}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {canEdit && (
            <Button 
              variant={isEditing ? "default" : "outline"} 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="gap-2"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? "حفظ التعديلات" : "تعديل البيانات"}
            </Button>
          )}
          <Button variant="secondary" className="gap-2">
            <Printer className="h-4 w-4" />
            طباعة البوليصة
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="p-6 bg-muted/30">
          <div className="relative flex justify-between items-center max-w-3xl mx-auto mt-4 mb-8">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -z-10" />
            <div 
              className="absolute top-1/2 right-0 h-1 bg-primary -z-10 transition-all duration-1000" 
              style={{ width: '50%' }} 
            />

            {TIMELINE_STEPS.map((step, i) => {
              const isCompleted = i <= 1; // Mock completion
              const isCurrent = i === 1;

              return (
                <div key={step.id} className="flex flex-col items-center gap-2 bg-background p-2 rounded-xl">
                  <div className={`
                    h-10 w-10 rounded-full flex items-center justify-center border-4 transition-all duration-300
                    ${isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted text-muted-foreground"}
                    ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}
                  `}>
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div className="text-center">
                    <p className={`font-bold text-sm ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer & Merchant Data */}
          <Card>
            <CardHeader>
              <CardTitle>بيانات الأطراف</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              
              {/* Customer */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
                  <User className="h-5 w-5" />
                  بيانات العميل
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">الاسم</Label>
                    <Input 
                      value={data.customer.name} 
                      disabled={!isEditing} 
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">رقم الهاتف</Label>
                    <Input 
                      value={data.customer.phone} 
                      disabled={!isEditing} 
                      dir="ltr" 
                      className="h-9 text-right"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">العنوان</Label>
                    <Input 
                      value={data.customer.address} 
                      disabled={!isEditing} 
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              {/* Merchant */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
                  <Package className="h-5 w-5" />
                  بيانات المتجر
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">اسم المتجر</Label>
                    <p className="font-medium mt-1">{data.merchant.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">رقم التواصل</Label>
                    <p className="font-medium mt-1" dir="ltr">{data.merchant.phone}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">العنوان</Label>
                    <p className="font-medium mt-1">{data.merchant.address}</p>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Delegate Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                معلومات المندوب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{data.delegate.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Phone className="h-3 w-3" />
                      <span dir="ltr">{data.delegate.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">مراسلة</Button>
                  <Button size="sm">اتصال</Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Left Column: Financials */}
        <div className="space-y-6">
          <Card className="bg-slate-50 dark:bg-slate-900/50 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                التفاصيل المالية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">سعر الطلب</span>
                <span className="font-medium">{data.financials.price} ر.س</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">رسوم التوصيل</span>
                <span className="font-medium">{data.financials.delivery} ر.س</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">الإجمالي</span>
                <span className="font-bold text-2xl text-primary">{data.financials.total} ر.س</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                التواريخ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">تاريخ الاستلام</Label>
                <p className="font-medium">{data.created_at}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">تاريخ التسليم المتوقع</Label>
                <p className="font-medium text-green-600">{data.delivery_date}</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
