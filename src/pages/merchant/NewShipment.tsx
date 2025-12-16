import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, User, MapPin, Package, CreditCard, Info, Wallet } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Separator } from "../../components/ui/separator";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function NewShipment() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [governorate, setGovernorate] = useState("");
  const [shippingCost, setShippingCost] = useState(0);

  // Mock shipping cost calculation
  useEffect(() => {
    if (governorate === "riyadh") setShippingCost(25);
    else if (governorate) setShippingCost(35);
    else setShippingCost(0);
  }, [governorate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم حفظ الشحنة بنجاح",
      description: "سيتم إشعار أقرب مندوب لاستلام الشحنة.",
    });
    setTimeout(() => navigate("/merchant/Dashboard"), 1500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">إنشاء شحنة جديدة</h1>
        <p className="text-muted-foreground mt-1">أدخل تفاصيل الشحنة والعميل لإنشاء طلب توصيل جديد</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Right Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  بيانات العميل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم العميل</Label>
                    <Input id="name" placeholder="الاسم الكامل" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input id="phone" placeholder="05xxxxxxxx" dir="ltr" className="text-right" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">العنوان التفصيلي</Label>
                  <Input id="address" placeholder="اسم الشارع، رقم المبنى، المعلم القريب" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>المحافظة / المدينة</Label>
                    <Select onValueChange={setGovernorate} required>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="riyadh">الرياض</SelectItem>
                        <SelectItem value="jeddah">جدة</SelectItem>
                        <SelectItem value="dammam">الدمام</SelectItem>
                        <SelectItem value="mecca">مكة المكرمة</SelectItem>
                        <SelectItem value="medina">المدينة المنورة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الحي</Label>
                    <Input placeholder="اسم الحي" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  تفاصيل الشحنة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>نوع الطلب</Label>
                  <Select defaultValue="product">
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">منتجات (ملابس، إلكترونيات...)</SelectItem>
                      <SelectItem value="parcel">طرد مغلق</SelectItem>
                      <SelectItem value="documents">مستندات / أوراق</SelectItem>
                      <SelectItem value="fragile">قابل للكسر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">سعر المنتج (لتحصيل الكاش)</Label>
                    <div className="relative">
                      <Input id="price" type="number" placeholder="0.00" className="pl-12" />
                      <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-bold">ر.س</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">الوزن / الحجم (اختياري)</Label>
                    <Input id="weight" placeholder="مثال: 2 كجم" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات الشحنة</Label>
                  <Textarea id="notes" placeholder="أي تعليمات خاصة للمندوب..." className="h-24" />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  طريقة الدفع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="cod" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                    <Label
                      htmlFor="cod"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <Wallet className="mb-3 h-6 w-6" />
                      الدفع عند الاستلام
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="prepaid" id="prepaid" className="peer sr-only" />
                    <Label
                      htmlFor="prepaid"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <CreditCard className="mb-3 h-6 w-6" />
                      مدفوع مسبقاً
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

          </div>

          {/* Left Column - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="bg-muted/50 border-none shadow-inner">
                <CardHeader>
                  <CardTitle>ملخص التكلفة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">تكلفة الشحن الأساسية</span>
                    <span className="font-medium">{shippingCost > 0 ? shippingCost.toFixed(2) : "--"} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
                    <span className="font-medium">{shippingCost > 0 ? (shippingCost * 0.15).toFixed(2) : "--"} ر.س</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">الإجمالي</span>
                    <span className="font-bold text-xl text-primary">
                      {shippingCost > 0 ? (shippingCost * 1.15).toFixed(2) : "--"} <span className="text-sm font-normal text-muted-foreground">ر.س</span>
                    </span>
                  </div>

                  {shippingCost === 0 && (
                    <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded mt-2">
                      <Info className="h-4 w-4 shrink-0" />
                      <p>يرجى اختيار المدينة لحساب تكلفة الشحن</p>
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full mt-6 text-lg font-bold shadow-lg shadow-primary/25" disabled={!governorate}>
                    <Save className="ml-2 h-5 w-5" />
                    حفظ الشحنة
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
