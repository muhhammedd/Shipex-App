'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/models';
import { Loading } from '@/components/ui/Loading';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

/**
 * RoleGuard prevents unauthorized users from seeing specific content.
 * Redirects to appropriate dashboard or login if role doesn't match.
 */
export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Wait for auth check to complete
        if (isLoading) {
            console.log('[RoleGuard] Waiting for auth check...');
            return;
        }

        // Not authenticated - redirect to login
        if (!isAuthenticated || !user) {
            console.log('[RoleGuard] Not authenticated, redirecting to login');
            router.push('/login');
            return;
        }

        // SUPER_ADMIN can access everything
        if (user.role === UserRole.SUPER_ADMIN) {
            console.log('[RoleGuard] SUPER_ADMIN access granted');
            setShouldRender(true);
            return;
        }

        // Check if user's role is allowed
        if (!allowedRoles.includes(user.role)) {
            console.error(`[RoleGuard] Access denied. User role: ${user.role}, Allowed: ${allowedRoles.join(', ')}`);

            // Redirect to user's correct dashboard
            const redirectMap: Record<UserRole, string> = {
                [UserRole.SUPER_ADMIN]: '/super-admin',
                [UserRole.ADMIN]: '/admin',
                [UserRole.MERCHANT]: '/merchant',
                [UserRole.COURIER]: '/courier',
            };

            const targetPath = redirectMap[user.role] || '/login';
            console.log(`[RoleGuard] Redirecting to ${targetPath}`);
            router.push(targetPath);
            return;
        }

        // Role matches - allow access
        console.log(`[RoleGuard] Access granted for role: ${user.role}`);
        setShouldRender(true);
    }, [isLoading, isAuthenticated, user, allowedRoles, router]);

    // Show loading while checking auth or redirecting
    if (isLoading || !shouldRender) {
        return <Loading fullScreen text="Verifying credentials..." />;
    }

    return <>{children}</>;
}
