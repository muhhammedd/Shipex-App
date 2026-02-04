'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    History,
    User,
    LogOut,
    Ship,
    Wallet
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserRole } from '@/types/models';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ErrorBoundary, ErrorState } from '@/components/ui/ErrorBoundary';

export default function CourierLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Tasks', path: '/courier' },
        { icon: History, label: 'History', path: '/courier/history' },
        { icon: Wallet, label: 'Earnings', path: '/courier/finance' },
        { icon: User, label: 'Profile', path: '/courier/profile' },
    ];

    return (
        <RoleGuard allowedRoles={[UserRole.COURIER]}>
            <div className="min-h-screen bg-background dark:bg-background-dark text-text-main dark:text-text-main-dark transition-colors duration-300 pb-28 md:pb-0 md:pt-20">
                {/* Desktop Header */}
                <header className="fixed top-4 left-4 right-4 z-40 hidden md:flex h-20 items-center justify-between bg-background-card/80 dark:bg-background-card-dark/80 backdrop-blur-md border border-border dark:border-border-dark rounded-2xl px-8 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-glow-primary">
                            <Ship className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-xl font-bold">SHIPEX<span className="text-primary">.</span></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <nav className="flex items-center gap-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive
                                            ? 'bg-primary text-white shadow-glow-primary'
                                            : 'text-text-dim hover:bg-primary/10 hover:text-primary dark:text-text-dim-dark dark:hover:text-primary font-semibold'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
                                            <span>{item.label}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="h-8 w-px bg-border dark:bg-border-dark mx-2"></div>
                        <ThemeToggle />
                        <NotificationBell />
                        <button
                            onClick={handleLogout}
                            className="p-2 text-text-dim hover:text-error transition-colors"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </header>

                {/* Mobile Header */}
                <header className="fixed top-0 left-0 right-0 z-40 flex md:hidden h-20 items-center justify-between bg-background-card/80 dark:bg-background-card-dark/80 backdrop-blur-md border-b border-border dark:border-border-dark px-8">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-glow-primary">
                            <Ship size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Courier</p>
                            <p className="text-base font-bold text-text-main dark:text-text-main-dark">Manifest</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <NotificationBell />
                    </div>
                </header>

                <main className="container mx-auto px-4 pt-24 md:pt-4 relative z-10 max-w-2xl">
                    <div className="animate-in fade-in duration-700">
                        <ErrorBoundary fallback={
                            <div className="pt-8">
                                <ErrorState
                                    title="Error"
                                    message="Something went wrong. Tap to retry."
                                    onRetry={() => window.location.reload()}
                                />
                            </div>
                        }>
                            {children}
                        </ErrorBoundary>
                    </div>
                </main>

                {/* Mobile Bottom Navigation - Floating style */}
                <nav className="fixed bottom-6 left-4 right-4 z-40 flex md:hidden h-20 bg-background-card/90 dark:bg-background-card-dark/90 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2.5rem] shadow-2xl px-2 items-center">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-90`}
                            >
                                <div className={`p-3 rounded-2xl transition-all relative ${isActive
                                    ? 'text-white bg-primary shadow-glow-primary'
                                    : 'text-text-dim'
                                    }`}>
                                    <Icon className="h-5 w-5" />
                                    {isActive && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white animate-pulse" />
                                    )}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-primary' : 'text-text-dim/70'
                                    }`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </RoleGuard>
    );
}
