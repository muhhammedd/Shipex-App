import apiClient from '../api-client';
import { LoginRequest, LoginResponse } from '@/types/api';
import { User } from '@/types/models';

export const authService = {
    /**
     * Sign in user and get JWT token
     */
    async signIn(email: string, password: string): Promise<LoginResponse> {
        const response = await apiClient.post<any>('/iam/sign-in', {
            email,
            password,
        });
        // Backend wraps response in { success: true, data: T }
        return response.data.data || response.data;
    },

    /**
     * Get current authenticated user profile
     */
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<User>('/iam/me');
        return response.data;
    },

    /**
     * Sign out (client-side token removal)
     */
    signOut(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        // Clear cookies for middleware
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        console.log('[AuthService] Signed out, cleared all auth data');
    },

    /**
     * Store authentication token and user info for middleware
     */
    setToken(token: string, role?: string): void {
        // Store in localStorage for client-side access
        localStorage.setItem('access_token', token);

        // Set cookies for middleware (accessible by server-side middleware)
        // Using 1 hour expiration to match JWT expiration
        const maxAge = 3600; // 1 hour in seconds
        const cookieOptions = `path=/; max-age=${maxAge}; SameSite=Lax`;

        document.cookie = `access_token=${token}; ${cookieOptions}`;

        if (role) {
            document.cookie = `user_role=${role}; ${cookieOptions}`;
            console.log(`[AuthService] Set cookies: token and role=${role}`);
        } else {
            console.log(`[AuthService] Set cookie: token only`);
        }
    },

    /**
     * Get stored token
     */
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};
