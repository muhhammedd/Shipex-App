'use client';

import { useAuthStore } from '@/store/authStore';

/**
 * Custom hook to access authentication state and actions
 */
export function useAuth() {
    const {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        checkAuth,
        setUser,
        clearError,
    } = useAuthStore();

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        checkAuth,
        setUser,
        clearError,
    };
}
