import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Send, FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../hooks/use-toast";

// Mock Data
const TICKETS = [
  { id: "T-1001", subject: "مشكلة في طباعة البوليصة", status: "open", date: "2023-12-09", last_update: "منذ ساعة" },
  { id: "T-992", subject: "تأخير في استلام الشحنة #SW-8821", status: "closed", date: "2023-12-05", last_update: "2023-12-06" },
  { id: "T-985", subject: "استفسار عن الفواتير", status: "pending", date: "2023-12-01", last_update: "2023-12-02" },
];

export default function Support() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("new");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم إرسال التذكرة",
      description: "سيتم الرد عليك في أقرب وقت ممكن",
    });
    setActiveTab("history");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">الدعم الفني</h1>
        <p className="text-muted-foreground mt-1">نحن هنا لمساعدتك في أي وقت</p>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-green-50 border-green-200 hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-green-900">واتساب مباشر</h3>
              <p className="text-green-700 text-sm">تحدث مع فريق الدعم مباشرة</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200 hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-blue-900">اتصل بنا</h3>
              <p className="text-blue-700 text-sm" dir="ltr">01064452019</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket System */}
      <Card>
        <CardHeader>
          <CardTitle>نظام التذاكر</CardTitle>
          <CardDescription>يمكنك فتح تذكرة جديدة أو متابعة التذاكر السابقة</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="new">فتح تذكرة جديدة</TabsTrigger>
              <TabsTrigger value="history">متابعة التذاكر</TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">نوع المشكلة</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option>مشكلة في شحنة</option>
                      <option>مشكلة في الموقع/التطبيق</option>
                      <option>استفسار مالي</option>
                      <option>اقتراح</option>
                      <option>أخرى</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">عنوان الموضوع</Label>
                    <Input id="subject" placeholder="مثال: تأخير في الاستلام" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">تفاصيل المشكلة</Label>
                  <Textarea 
                    id="message" 
                    placeholder="يرجى وصف المشكلة بالتفصيل..." 
                    className="h-32" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachment">مرفقات (اختياري)</Label>
                  <Input id="attachment" type="file" className="cursor-pointer" />
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px] gap-2">
                  <Send className="h-4 w-4" />
                  إرسال التذكرة
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                {TICKETS.map((ticket, i) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`
                        h-10 w-10 rounded-full flex items-center justify-center
                        ${ticket.status === 'open' ? 'bg-orange-100 text-orange-600' : ''}
                        ${ticket.status === 'closed' ? 'bg-green-100 text-green-600' : ''}
                        ${ticket.status === 'pending' ? 'bg-blue-100 text-blue-600' : ''}
                      `}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{ticket.subject}</h4>
                          <span className="text-xs text-muted-foreground">#{ticket.id}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ticket.date}
                          </span>
                          <span>تحديث: {ticket.last_update}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant={ticket.status === 'closed' ? 'secondary' : 'default'} className={`
                      ${ticket.status === 'open' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                      ${ticket.status === 'closed' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                      ${ticket.status === 'pending' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                    `}>
                      {ticket.status === 'open' && 'مفتوحة'}
                      {ticket.status === 'closed' && 'مغلقة'}
                      {ticket.status === 'pending' && 'قيد المعالجة'}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
