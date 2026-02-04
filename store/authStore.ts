import { create } from 'zustand';
import { User, UserRole } from '@/types/models';
import { authService } from '@/lib/services/authService';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    setUser: (user: User) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            console.log('[AuthStore] Login requested for:', email);
            const response = await authService.signIn(email, password);
            console.log('[AuthStore] Login response received:', {
                hasToken: !!response.access_token,
                role: response.user.role,
                userId: response.user.id
            });

            // CRITICAL: Set token and cookies FIRST before updating state
            // This ensures middleware can read cookies immediately
            authService.setToken(response.access_token, response.user.role);
            localStorage.setItem('user', JSON.stringify(response.user));

            console.log('[AuthStore] Cookies and localStorage set, updating state...');

            // Now update state
            set({
                user: response.user,
                token: response.access_token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            console.log('[AuthStore] Login complete, isAuthenticated=true');
        } catch (error: any) {
            let errorMessage = 'Authentication failed';

            if (error.response?.data?.message) {
                const msg = error.response.data.message;
                errorMessage = Array.isArray(msg) ? msg[0] : msg;
            } else if (error.message) {
                errorMessage = error.message;
            }

            console.error('[AuthStore] Login failed:', errorMessage);

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    logout: () => {
        authService.signOut();
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        });
    },

    checkAuth: async () => {
        set({ isLoading: true });
        const token = authService.getToken();
        const storedUser = localStorage.getItem('user');

        console.log('[AuthStore] checkAuth:', { hasToken: !!token, hasStoredUser: !!storedUser });

        if (token && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                console.log('[AuthStore] Hydrating user from localStorage:', { role: user.role, email: user.email });

                // CRITICAL: Sync cookies with localStorage to ensure middleware has access
                // This prevents redirect loops when page refreshes
                authService.setToken(token, user.role);

                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                });

                console.log('[AuthStore] Auth check complete, user authenticated');
            } catch (error) {
                console.error('[AuthStore] Hydration failed:', error);
                authService.signOut();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            }
        } else {
            console.log('[AuthStore] No credentials found, user not authenticated');
            set({ isLoading: false });
        }
    },

    setUser: (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },

    clearError: () => {
        set({ error: null });
    },
}));

// Helper function to check user role
export const hasRole = (user: User | null, roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
};
