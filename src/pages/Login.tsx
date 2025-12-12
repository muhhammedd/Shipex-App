import { useState } from "react";
import { useAuth, UserRole } from "@/lib/auth"; // تأكد أن هذا المسار صحيح
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Truck, ShieldCheck, LogIn, UserPlus } from "lucide-react";

// قمنا بإزالة استيراد الصورة من assets لأننا سنستخدم المسار المباشر
// import heroImage from "@assets/..." ❌

export default function AuthPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("merchant");

  return (
    <div className="min-h-screen w-full flex bg-background" dir="rtl">
      {/* الجانب الأيمن - النموذج */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? "مرحباً بك مجدداً في نظام سويفت شيب" 
                : "انضم إلينا وابدأ في إدارة عملياتك اللوجستية"}
            </p>
          </div>

          <Tabs defaultValue="merchant" onValueChange={(v) => setSelectedRole(v as UserRole)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="merchant" className="gap-2">
                <Store className="h-4 w-4" />
                تاجر
              </TabsTrigger>
              <TabsTrigger value="driver" className="gap-2">
                <Truck className="h-4 w-4" />
                مندوب
              </TabsTrigger>
              <TabsTrigger value="admin" className="gap-2">
                <ShieldCheck className="h-4 w-4" />
                إدارة
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني / رقم الهاتف</Label>
                <Input id="email" placeholder="name@example.com" className="text-right" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" className="text-right" />
              </div>

              {!isLogin && selectedRole === "merchant" && (
                <div className="space-y-2">
                  <Label htmlFor="company">اسم المتجر / الشركة</Label>
                  <Input id="company" placeholder="متجر الأناقة" className="text-right" />
                </div>
              )}

              <Button 
                className="w-full h-12 text-lg mt-4" 
                onClick={() => login(selectedRole)}
              >
                {isLogin ? (
                  <>
                    <LogIn className="ml-2 h-5 w-5" />
                    دخول
                  </>
                ) : (
                  <>
                    <UserPlus className="ml-2 h-5 w-5" />
                    تسجيل
                  </>
                )}
              </Button>
            </div>
          </Tabs>

          <div className="text-center mt-6">
            <Button 
              variant="link" 
              className="text-muted-foreground hover:text-primary"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "ليس لديك حساب؟ سجل الآن" : "لديك حساب بالفعل؟ سجل دخول"}
            </Button>
          </div>
        </div>
      </div>

      {/* الجانب الأيسر - الصورة */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-primary/5">
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] z-10" />
        { }
        <img 
          src="/login-bg.png" 
          alt="Logistics Background" 
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            // كود احتياطي في حال لم تضع الصورة بعد، سيظهر خلفية ملونة بدلاً من كسر الصفحة
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="relative z-20 m-12 text-white text-right">
          <div className="bg-black/20 backdrop-blur-md p-8 rounded-3xl border border-white/10">
            <h1 className="text-4xl font-bold font-display mb-4">الحل المتكامل<br/>للخدمات اللوجستية</h1>
            <p className="text-lg opacity-90 leading-relaxed">
              نظام شامل يربط بين التجار والمندوبين والإدارة لضمان سرعة وكفاءة التوصيل.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
