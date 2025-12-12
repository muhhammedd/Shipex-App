import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ استبدلنا wouter بهذا

export type UserRole = "merchant" | "driver" | "admin" | null;

interface AuthContextType {
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const navigate = useNavigate(); // ✅ أداة التنقل الجديدة
  const location = useLocation();

  // (اختياري) كود للدخول التلقائي أثناء التطوير لتسريع العمل
  // useEffect(() => {
  //   if (!role) {
  //     console.log("Auto-logging in for dev...");
  //     setRole("merchant"); 
  //   }
  // }, []);

  const login = (newRole: UserRole) => {
    setRole(newRole);

    // التوجيه الذكي بعد تسجيل الدخول
    // نستخدم replace: true لكي لا يعود لصفحة الدخول عند الضغط على "رجوع"
    if (newRole === "merchant") navigate("/merchant/dashboard", { replace: true });
    else if (newRole === "driver") navigate("/driver/dashboard", { replace: true });
    else if (newRole === "admin") navigate("/admin/dashboard", { replace: true });
    else navigate("/home", { replace: true });
  };

  const logout = () => {
    setRole(null);
    navigate("/", { replace: true }); // العودة للصفحة الرئيسية
  };

  return (
    <AuthContext.Provider value={{ role, login, logout, isAuthenticated: !!role }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
