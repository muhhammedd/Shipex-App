import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, AuthContextType } from '../lib/types';
import { MOCK_USERS } from '../lib/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedUser = localStorage.getItem('user');
    if (storedRole && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (email: string, password: string, role: Role): boolean => {
    // Mock authentication - no real validation
    // Find or create a user with the given role
    const mockUser = MOCK_USERS.find((u) => u.role === role);
    
    if (mockUser) {
      const authenticatedUser: User = {
        ...mockUser,
        email,
        isAuthenticated: true,
      };
      setUser(authenticatedUser);
      localStorage.setItem('userRole', role);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: user?.isAuthenticated ?? false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
