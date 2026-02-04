'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/models';
import { Loading } from '@/components/ui/Loading';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case UserRole.SUPER_ADMIN:
          router.push('/super-admin');
          break;
        case UserRole.ADMIN:
          router.push('/admin');
          break;
        case UserRole.MERCHANT:
          router.push('/merchant');
          break;
        case UserRole.COURIER:
          router.push('/courier');
          break;
        default:
          router.push('/login');
      }
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  return <Loading fullScreen text="Redirecting..." />;
}
