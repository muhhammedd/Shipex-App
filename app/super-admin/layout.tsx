'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    BarChart3,
    Users,
    Building2,
    Settings,
    ShieldCheck,
    Activity,
    Bell,
    Search,
    Zap,
    LogOut,
    ArrowUpRight,
    Menu,
    X,
    Ship
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserRole } from '@/types/models';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NotificationBell } from '@/components/ui/NotificationBell';

export default function SuperAdminLayout({
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
        { icon: BarChart3, label: "System Overview", path: "/super-admin" },
        { icon: Building2, label: "Tenants", path: "/super-admin/tenants" },
        { icon: Zap, label: "Plan Management", path: "/super-admin/plans" },
        { icon: Activity, label: "System Logs", path: "/super-admin/logs" },
        { icon: Settings, label: "Global Settings", path: "/super-admin/settings" },
    ];

    return (
        <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
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
                    {/* Brand */}
                    <div className="flex h-16 items-center px-6 border-b border-border dark:border-border-dark justify-between lg:justify-start">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/25">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-text-main dark:text-text-main-dark leading-none">
                                    SHIPEX<span className="text-primary">.</span>
                                </span>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mt-1">Super Admin</span>
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

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
                        <div className="mb-4 px-3 hidden lg:block">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim opacity-50">Infrastructure</p>
                        </div>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <Link key={item.path} href={item.path} className="block">
                                    <div
                                        className={`
                                            group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200
                                            ${isActive
                                                ? 'bg-primary text-white shadow-glow-primary'
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

                    {/* User Section */}
                    <div className="p-4 border-t border-border dark:border-border-dark space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-background dark:bg-background-dark border border-border dark:border-border-dark">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                SA
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-text-dim uppercase tracking-wide leading-none">Root Authority</p>
                                <p className="text-sm font-bold text-text-main dark:text-text-main-dark truncate mt-1">System Master</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start gap-3 text-error hover:bg-error/10 hover:text-error h-10 rounded-xl"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm font-semibold">Terminate Session</span>
                        </Button>
                    </div>
                </aside>

                {/* Main Content Area */}
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

                            <div className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full bg-background dark:bg-background-dark border border-border dark:border-border-dark">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-success animate-pulse shadow-glow-success"></span>
                                    <span className="text-[10px] font-black uppercase tracking-tight text-text-dim">Latency: 24ms</span>
                                </div>
                                <div className="h-3 w-px bg-border dark:bg-border-dark"></div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-primary shadow-glow-primary"></span>
                                    <span className="text-[10px] font-black uppercase tracking-tight text-text-dim">Cluster: X-09</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <div className="h-6 w-px bg-border dark:bg-border-dark" />
                            <NotificationBell />
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mx-auto max-w-full">
                            {children}
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="py-6 px-8 border-t border-border dark:border-border-dark flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-dim">
                        <div className="flex items-center gap-4 font-semibold uppercase tracking-widest">
                            <span>© 2026 Shipex Intelligence</span>
                            <div className="h-3 w-px bg-border dark:bg-border-dark hidden sm:block"></div>
                            <span>Protocol: ASTRA-9</span>
                        </div>
                        <div className="flex items-center gap-2 font-black uppercase tracking-widest text-primary">
                            <span>Cloud Mesh</span>
                            <ArrowUpRight size={14} />
                        </div>
                    </footer>
                </div>
            </div>
        </RoleGuard>
    );
}
