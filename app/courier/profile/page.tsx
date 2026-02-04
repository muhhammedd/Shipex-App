'use client';

import { useRouter } from 'next/navigation';
import {
    User,
    Mail,
    Phone,
    LogOut,
    Truck,
    Settings,
    ChevronRight,
    Star,
    Wallet
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

export default function CourierProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!user) return null;

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-text-main dark:text-text-main-dark">
                    My Profile
                </h1>
                <p className="text-sm text-text-dim">
                    Stats and personal details.
                </p>
            </div>

            {/* Profile Header */}
            <Card variant="default" className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <User className="h-32 w-32 text-primary" />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background dark:border-background-dark">
                        <span className="text-2xl font-bold text-primary">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-main dark:text-text-main-dark">{user.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="primary">Courier</Badge>
                            <div className="flex items-center gap-1 text-orange-500 text-xs font-bold">
                                <Star className="h-3 w-3 fill-orange-500" />
                                4.9
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border dark:border-border-dark">
                    <div>
                        <p className="text-xs text-text-dim uppercase font-bold">Total Deliveries</p>
                        <p className="text-lg font-bold text-text-main dark:text-text-main-dark">1,245</p>
                    </div>
                    <div>
                        <p className="text-xs text-text-dim uppercase font-bold">On-Time Rate</p>
                        <p className="text-lg font-bold text-success">98.5%</p>
                    </div>
                </div>
            </Card>

            {/* Earnings Summary Button */}
            <Card
                variant="glass"
                className="p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => router.push('/courier/finance')} // Assuming finance page exists or will be added
            >
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-text-main dark:text-text-main-dark">$450.00</p>
                        <p className="text-xs text-text-dim">Earnings this week</p>
                    </div>
                </div>
                <ChevronRight className="h-5 w-5 text-text-dim" />
            </Card>

            {/* Personal Details */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-text-dim uppercase ml-1">Account Info</h3>

                <Card variant="default" className="divide-y divide-border dark:divide-border-dark overflow-hidden p-0">
                    <div className="p-4 flex items-center gap-4">
                        <Mail className="h-5 w-5 text-text-dim" />
                        <div className="flex-1">
                            <p className="text-xs text-text-dim">Email</p>
                            <p className="text-sm font-medium text-text-main dark:text-text-main-dark">{user.email}</p>
                        </div>
                    </div>
                    {user.courierProfile?.phoneNumber && (
                        <div className="p-4 flex items-center gap-4">
                            <Phone className="h-5 w-5 text-text-dim" />
                            <div className="flex-1">
                                <p className="text-xs text-text-dim">Phone</p>
                                <p className="text-sm font-medium text-text-main dark:text-text-main-dark">{user.courierProfile.phoneNumber}</p>
                            </div>
                        </div>
                    )}
                    <div className="p-4 flex items-center gap-4">
                        <Truck className="h-5 w-5 text-text-dim" />
                        <div className="flex-1">
                            <p className="text-xs text-text-dim">Vehicle Status</p>
                            <p className={`text-sm font-bold ${user.courierProfile?.isAvailable ? 'text-success' : 'text-text-dim'}`}>
                                {user.courierProfile?.isAvailable ? 'Online / Available' : 'Offline'}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Settings & Logout */}
            <div className="space-y-3">
                <Button variant="outline" className="w-full justify-between h-14 bg-background dark:bg-background-dark border-border dark:border-border-dark">
                    <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-text-dim" />
                        <span>App Settings</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-text-dim" />
                </Button>

                <Button
                    variant="ghost"
                    className="w-full justify-center gap-2 h-14 text-error hover:bg-error/5"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </Button>
            </div>

            <p className="text-center text-xs text-text-dim pt-4">Shipex Courier App v2.0.0</p>
        </div>
    );
}
