import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Globe, Bell, FileText, HelpCircle, ChevronLeft } from "lucide-react";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { useToast } from "../../hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("ar");

  // Handle Dark Mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLanguageChange = () => {
    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
    toast({
      title: "تم تغيير اللغة",
      description: newLang === "ar" ? "تم تعيين اللغة إلى العربية" : "Language set to English",
    });
    // In a real app, this would update the context/i18n
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">الإعدادات</h1>
        <p className="text-muted-foreground mt-1">تخصيص تفضيلات التطبيق والحساب</p>
      </div>

      <div className="space-y-6">
        
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>عام</CardTitle>
            <CardDescription>تفضيلات العرض واللغة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-base">اللغة (Language)</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar" ? "العربية" : "English"}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLanguageChange}>
                {language === "ar" ? "Switch to English" : "تغيير للعربية"}
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </div>
                <div className="space-y-0.5">
                  <Label className="text-base">الوضع الليلي</Label>
                  <p className="text-sm text-muted-foreground">تفعيل المظهر الداكن للتطبيق</p>
                </div>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-base">الإشعارات</Label>
                  <p className="text-sm text-muted-foreground">استلام تنبيهات حول تحديثات الشحنات</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

          </CardContent>
        </Card>

        {/* Support & Info */}
        <Card>
          <CardHeader>
            <CardTitle>الدعم والمعلومات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            
            <Button variant="ghost" className="w-full justify-between h-14 px-4 hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">سياسة الاستخدام والخصوصية</span>
              </div>
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </Button>

            <Separator />

            <Button variant="ghost" className="w-full justify-between h-14 px-4 hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">تواصل معنا</span>
              </div>
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </Button>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
