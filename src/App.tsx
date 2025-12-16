import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider, useAuth } from "./lib/auth";

// Layouts
import MerchantLayout from "./layouts/MerchantLayout";
import DriverLayout from "./layouts/DriverLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages - Auth & Common
import LoginPage from "./pages/Login";
import NotFound from "./pages/not-found";

// Pages - Merchant
import MerchantDashboard from "./pages/merchant/Dashboard";
import NewShipment from "./pages/merchant/NewShipment";
import Shipments from "./pages/merchant/Shipments";
import Settings from "./pages/merchant/Settings";
import MerchantProfile from "./pages/merchant/Profile";
import ShipmentDetails from "./pages/merchant/ShipmentDetails";
import Returns from "./pages/merchant/Returns";
import Support from "./pages/merchant/Support";
import Analytics from "./pages/merchant/Analytics";

// Pages - Driver & Admin (Assuming these exist based on original code, kept as Dashboard for now)
import DriverDashboard from "./pages/driver/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

function ProtectedRoute({ 
  component: Component, 
  layout: Layout, 
  allowedRole 
}: { 
  component: React.ComponentType, 
  layout: React.ComponentType<{ children: React.ReactNode }>,
  allowedRole: string 
}) {
  const { role } = useAuth();

  if (!role) return <Navigate to="/" replace />;
  if (role !== allowedRole) return <Navigate to="/" replace />;

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function Router() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* Merchant Routes */}
      {/* الصفحة الرئيسية للتاجر */}
      <Route path="/merchant" element={
        <ProtectedRoute component={MerchantDashboard} layout={MerchantLayout} allowedRole="merchant" />
      } />

      {/* صفحات القائمة الجانبية */}
      <Route path="/merchant/new-shipment" element={
        <ProtectedRoute component={NewShipment} layout={MerchantLayout} allowedRole="merchant" />
      } />
      <Route path="/merchant/history" element={
        <ProtectedRoute component={Shipments} layout={MerchantLayout} allowedRole="merchant" />
      } />
      <Route path="/merchant/support" element={
        <ProtectedRoute component={Support} layout={MerchantLayout} allowedRole="merchant" />
      } />

      {/* صفحات إضافية قد لا تكون في القائمة مباشرة */}
      <Route path="/merchant/settings" element={
        <ProtectedRoute component={Settings} layout={MerchantLayout} allowedRole="merchant" />
      } />
      <Route path="/merchant/profile" element={
        <ProtectedRoute component={MerchantProfile} layout={MerchantLayout} allowedRole="merchant" />
      } />
      <Route path="/merchant/shipment/:id" element={
        <ProtectedRoute component={ShipmentDetails} layout={MerchantLayout} allowedRole="merchant" />
      } />
      <Route path="/merchant/returns" element={
        <ProtectedRoute component={Returns} layout={MerchantLayout} allowedRole="merchant" />
      } />
      <Route path="/merchant/analytics" element={
        <ProtectedRoute component={Analytics} layout={MerchantLayout} allowedRole="merchant" />
      } />

      {/* Driver Routes */}
      <Route path="/driver" element={
        <ProtectedRoute component={DriverDashboard} layout={DriverLayout} allowedRole="driver" />
      } />
      <Route path="/driver/*" element={
        <ProtectedRoute component={DriverDashboard} layout={DriverLayout} allowedRole="driver" />
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute component={AdminDashboard} layout={AdminLayout} allowedRole="admin" />
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute component={AdminDashboard} layout={AdminLayout} allowedRole="admin" />
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
