import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate, useLocation, BrowserRouter } from "react-router-dom";

export type UserRole = "merchant" | "driver" | "admin" | null;

interface AuthContextType {
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// هذا المكون الداخلي هو الذي يستخدم الـ Hooks
// لأنه سيكون محاطاً بـ Router من المكون الأب
function AuthLogic({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // (اختياري) تفعيل الدخول التلقائي للتجربة
  // useEffect(() => {
  //   if (!role) {
  //     console.log("Dev: Auto-logging in as merchant...");
  //     setRole("merchant");
  //   }
  // }, []);

  const login = (newRole: UserRole) => {
    setRole(newRole);

    // توجيه المستخدم حسب دوره
    if (newRole === "merchant") navigate("/merchant/dashboard", { replace: true });
    else if (newRole === "driver") navigate("/driver/dashboard", { replace: true });
    else if (newRole === "admin") navigate("/admin/dashboard", { replace: true });
    else navigate("/home", { replace: true });
  };

  const logout = () => {
    setRole(null);
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ role, login, logout, isAuthenticated: !!role }}>
      {children}
    </AuthContext.Provider>
  );
}

// هذا المكون الرئيسي الذي تستدعيه في App.tsx
// وظيفته فقط توفير بيئة Router للمكون الداخلي
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <AuthLogic>{children}</AuthLogic>
    </BrowserRouter>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
