'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Package,
    PlusCircle,
    Wallet,
    Settings,
    LogOut,
    Ship,
    LayoutDashboard,
    ClipboardList,
    Bell,
    Menu,
    X,
    Sun,
    Moon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { Button } from '@/components/ui/Button';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserRole } from '@/types/models';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ErrorBoundary, ErrorState } from '@/components/ui/ErrorBoundary';

export default function MerchantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/merchant' },
        { icon: PlusCircle, label: 'New Shipment', path: '/merchant/orders/new' },
        { icon: ClipboardList, label: 'Orders', path: '/merchant/orders' },
        { icon: Wallet, label: 'Wallet', path: '/merchant/finance' }, // Updated path to finance
        { icon: Settings, label: 'Settings', path: '/merchant/settings' },
    ];

    return (
        <RoleGuard allowedRoles={[UserRole.MERCHANT]}>
            <div className="flex min-h-screen bg-background dark:bg-background-dark transition-colors duration-300" dir="ltr">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-background-card dark:bg-background-card-dark border-r border-border dark:border-border-dark shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    {/* Brand Identity */}
                    <div className="flex h-16 items-center px-6 border-b border-border dark:border-border-dark justify-between lg:justify-start">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/25">
                                <Ship className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-text-main dark:text-text-main-dark leading-none">
                                    SHIPEX
                                </span>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Merchant</span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden text-text-dim"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <Link key={item.path} href={item.path}>
                                    <div
                                        className={`
                                            group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200
                                            ${isActive
                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                : 'text-text-dim hover:bg-primary/10 hover:text-primary dark:text-text-dim-dark dark:hover:text-primary'
                                            }
                                        `}
                                    >
                                        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-current'}`} />
                                        <span>{item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-border dark:border-border-dark space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-background dark:bg-background-dark border border-border dark:border-border-dark">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-text-dim uppercase tracking-wide leading-none">Merchant</p>
                                <p className="text-sm font-bold text-text-main dark:text-text-main-dark truncate mt-1">{user?.name}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start gap-3 text-error hover:bg-error/10 hover:text-error h-10 rounded-lg"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm font-semibold">Logout</span>
                        </Button>
                    </div>
                </aside>

                {/* Main Content Wrapper */}
                <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
                    {/* Header */}
                    <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 sm:px-8 bg-background-card/80 dark:bg-background-card-dark/80 backdrop-blur-md border-b border-border dark:border-border-dark">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="lg:hidden -ml-2 text-text-dim"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </Button>

                            <div className="hidden sm:flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <h1 className="text-xs font-bold text-text-dim uppercase tracking-wider">
                                    System Operational
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <div className="hidden sm:block w-px h-6 bg-border dark:bg-border-dark" />
                            <NotificationBell />
                        </div>
                    </header>

                    <main className="flex-1 p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ErrorBoundary
                            fallback={
                                <div className="mx-auto max-w-7xl pt-12">
                                    <ErrorState
                                        title="Dashboard Error"
                                        message="We couldn't load the dashboard content. Please try refreshing the page."
                                        onRetry={() => window.location.reload()}
                                    />
                                </div>
                            }
                        >
                            <div className="mx-auto max-w-7xl">{children}</div>
                        </ErrorBoundary>
                    </main>

                    <footer className="py-6 px-8 border-t border-border dark:border-border-dark flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-dim">
                        <span className="font-semibold uppercase tracking-wide">© 2026 Shipex Inc.</span>
                        <div className="flex items-center gap-4">
                            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
                            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
                            <span className="font-mono bg-background dark:bg-background-dark px-2 py-1 rounded border border-border dark:border-border-dark">
                                v2.4.0
                            </span>
                        </div>
                    </footer>
                </div>
            </div>
        </RoleGuard>
    );
}
