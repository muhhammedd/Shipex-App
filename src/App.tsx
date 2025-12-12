import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";

// استيراد صفحة الدخول (النسخة العربية الجديدة)
import LoginPage from "@/pages/Login";

// استيراد الصفحات الأخرى
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

import MerchantLayout from "@/layouts/MerchantLayout";
import MerchantDashboard from "@/pages/merchant/Dashboard";

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* صفحة الدخول هي الصفحة الرئيسية إذا لم يكن مسجلاً */}
      <Route path="/" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/home" />} />
      <Route path="/login" element={<AuthPage />} />

      {/* الصفحة الرئيسية بعد الدخول */}
      <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />

      {/* صفحة الخطأ */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
