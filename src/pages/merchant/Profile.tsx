import { useState } from "react";
import { User, Phone, Mail, MapPin, Edit2, Lock, Settings as SettingsIcon, LogOut, Save } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import { useAuth } from "../../lib/auth";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";

export default function MerchantProfile() {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "متجر الأناقة",
    email: "merchant@store.com",
    phone: "0501234567",
    address: "الرياض، حي الملقا، طريق الملك فهد",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "تم حفظ التغييرات",
      description: "تم تحديث بيانات الملف الشخصي بنجاح",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">الملف الشخصي</h1>
        <p className="text-muted-foreground mt-1">إدارة معلومات حسابك والبيانات الشخصية</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Quick Actions */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>MA</AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md">
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            
            <h2 className="text-xl font-bold">{formData.name}</h2>
            <p className="text-sm text-muted-foreground mb-6">تاجر موثوق</p>

            <div className="w-full space-y-2">
              <Link to="/merchant/settings">
                <Button variant="outline" className="w-full gap-2 justify-start">
                  <SettingsIcon className="h-4 w-4" />
                  الإعدادات
                </Button>
              </Link>
              <Button variant="destructive" className="w-full gap-2 justify-start" onClick={logout}>
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Details & Edit */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>البيانات الشخصية</CardTitle>
                <CardDescription>معلومات التواصل والعنوان</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                {isEditing ? (
                  <span className="flex items-center gap-2 text-primary font-bold">
                    <Save className="h-4 w-4" />
                    حفظ
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Edit2 className="h-4 w-4" />
                    تعديل
                  </span>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>اسم المتجر / التاجر</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                    className="pr-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!isEditing}
                      className="pr-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                      dir="ltr"
                      className="pr-10 text-right"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>العنوان</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={formData.address} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    disabled={!isEditing}
                    className="pr-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>الأمان</CardTitle>
              <CardDescription>تغيير كلمة المرور وحماية الحساب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>كلمة المرور الحالية</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>كلمة المرور الجديدة</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>تأكيد كلمة المرور</Label>
                  <Input type="password" />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="secondary" className="gap-2">
                  <Lock className="h-4 w-4" />
                  تحديث كلمة المرور
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
