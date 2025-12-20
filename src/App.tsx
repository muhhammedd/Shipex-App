import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/not-found';

// Merchant Pages
import MerchantDashboard from './pages/merchant/Dashboard';
import OrdersList from './pages/merchant/OrdersList';
import CreateOrder from './pages/merchant/CreateOrder';
import OrderDetails from './pages/merchant/OrderDetails';
import MerchantAccounts from './pages/merchant/Accounts';
import MerchantInvoices from './pages/merchant/Invoices';

// Courier Pages
import CourierDashboard from './pages/courier/Dashboard';
import TasksList from './pages/courier/TasksList';
import TaskDetails from './pages/courier/TaskDetails';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UsersManagement from './pages/admin/UsersManagement';
import OrdersManagement from './pages/admin/OrdersManagement';

// Global Pages
import SettingsPage from './pages/Settings';
import SupportPage from './pages/Support';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  const getHomeRoute = () => {
    if (!isAuthenticated || !user) return '/login';
    return `/${user.role}/dashboard`;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />

      {/* Merchant Routes */}
      <Route
        path="/merchant/dashboard"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/orders"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <OrdersList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/orders/new"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <CreateOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/orders/:id"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/accounts"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantAccounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/invoices"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <MerchantInvoices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/settings"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/support"
        element={
          <ProtectedRoute allowedRoles={['merchant']}>
            <SupportPage />
          </ProtectedRoute>
        }
      />

      {/* Courier Routes */}
      <Route
        path="/courier/dashboard"
        element={
          <ProtectedRoute allowedRoles={['courier']}>
            <CourierDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courier/tasks"
        element={
          <ProtectedRoute allowedRoles={['courier']}>
            <TasksList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courier/tasks/:id"
        element={
          <ProtectedRoute allowedRoles={['courier']}>
            <TaskDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courier/settings"
        element={
          <ProtectedRoute allowedRoles={['courier']}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courier/support"
        element={
          <ProtectedRoute allowedRoles={['courier']}>
            <SupportPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UsersManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <OrdersManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="p-8">
              <h1 className="text-2xl font-bold">User Details (Read-Only)</h1>
              <p>User ID: {':id'}</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/support"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SupportPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all - Redirect to 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
