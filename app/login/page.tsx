'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/models';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ship } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading, error, clearError, user } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Redirect if already authenticated
        if (isAuthenticated && user && !isLoading) {
            console.log('[LoginPage] User authenticated, redirecting...', { email: user.email, role: user.role });
            redirectToDashboard(user.role);
        }
    }, [isAuthenticated, user, isLoading]);

    const redirectToDashboard = (role: UserRole) => {
        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get('redirect');

        console.log('[LoginPage] Redirecting to dashboard', { role, redirectPath });

        if (redirectPath && redirectPath.startsWith('/')) {
            router.push(redirectPath);
            return;
        }

        const dashboardMap: Record<UserRole, string> = {
            [UserRole.SUPER_ADMIN]: '/super-admin',
            [UserRole.ADMIN]: '/admin',
            [UserRole.MERCHANT]: '/merchant',
            [UserRole.COURIER]: '/courier',
        };

        router.push(dashboardMap[role] || '/');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        console.log('[LoginPage] Submit triggered', { email });
        clearError();

        try {
            await login(email, password);
            console.log('[LoginPage] Login successful, waiting for redirect...');
            // Redirect will happen via useEffect when state updates
        } catch (err: any) {
            console.error('[LoginPage] Login error:', err);
        }
    };

    const handleTestAccount = (testEmail: string) => {
        setEmail(testEmail);
        setPassword('password');
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-primary-dark p-6 relative overflow-hidden font-['Inter',sans-serif]">
            {/* Aurora Background Effects */}
            <div className="aurora-bg scale-150 pointer-events-none">
                <div className="aurora-circle w-[600px] h-[600px] bg-accent-indigo top-[-100px] left-[-100px] opacity-40"></div>
                <div className="aurora-circle w-[500px] h-[500px] bg-accent-pink bottom-[-50px] right-[-50px] opacity-30" style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>
                <div className="aurora-circle w-[400px] h-[400px] bg-accent-cyan top-[20%] right-[10%] opacity-20" style={{ animationDuration: '30s' }}></div>
            </div>

            <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center relative z-50">
                {/* Brand Side */}
                <div className="hidden lg:block space-y-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 glass-card border-white/10 rounded-[2.5rem] mb-4 shadow-glow-indigo">
                        <Ship className="w-12 h-12 text-white" />
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-white mb-4 tracking-tightest uppercase leading-none">
                            SHIPEX<span className="text-accent-cyan">.</span>
                        </h1>
                        <p className="text-xl text-text-dim max-w-sm font-medium leading-relaxed">
                            Command the nexus of global trade with our <span className="text-white">Neural Logistics</span> infrastructure.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 py-8 border-y border-white/5">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-10 w-10 rounded-full border-2 border-primary-dark bg-white/10 glass flex items-center justify-center overflow-hidden">
                                    <div className="h-full w-full bg-gradient-aurora opacity-50"></div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                            Authorized by <span className="text-accent-cyan">500+ Nodes</span>
                        </p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full max-w-md mx-auto">
                    <div className="glass-card border-white/20 rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in-up backdrop-blur-3xl">
                        <div className="p-10">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-lg font-black text-white tracking-tight uppercase">
                                    Authorization
                                </h2>
                                <div className="flex gap-1">
                                    <div className="h-1 w-4 bg-accent-indigo rounded-full"></div>
                                    <div className="h-1 w-1 bg-white/20 rounded-full"></div>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-shake">
                                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-relaxed">
                                        [System Fault]: {error}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pl-1">
                                        Access Identifier
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="operator@shipex.nexus"
                                        required
                                        disabled={isLoading}
                                        className="bg-white/5 border-white/10 focus:border-accent-indigo/60 text-sm h-14 rounded-2xl placeholder:text-white/20 text-white font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pl-1">
                                        Security Protocol
                                    </label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        disabled={isLoading}
                                        className="bg-white/5 border-white/10 focus:border-accent-indigo/60 text-sm h-14 rounded-2xl placeholder:text-white/20 text-white font-medium"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="w-full h-14 text-[10px] font-black uppercase tracking-[0.3em] bg-gradient-aurora text-white rounded-2xl shadow-glow-indigo border-none hover:translate-y-[-2px] transition-all"
                                >
                                    {isLoading ? 'Decrypting...' : 'Initiate Sync'}
                                </Button>
                            </form>

                            {/* Test Accounts Helper */}
                            <div className="mt-8 space-y-4">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] text-center">
                                    Quick Access Nodes
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { email: 'superadmin@test.com', label: 'Super' },
                                        { email: 'admin@test.com', label: 'Admin' },
                                        { email: 'merchant@test.com', label: 'Store' },
                                        { email: 'courier@test.com', label: 'Driver' },
                                    ].map((acc) => (
                                        <button
                                            key={acc.email}
                                            onClick={() => handleTestAccount(acc.email)}
                                            className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-bold text-text-dim hover:text-white hover:bg-white/10 hover:border-white/10 transition-all uppercase"
                                        >
                                            {acc.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-accent-indigo animate-pulse' : 'bg-emerald-500'} shadow-glow`}></div>
                                    <span className="text-[8px] font-black text-text-dim uppercase tracking-widest">
                                        {isLoading ? 'Establishing Link' : 'Secure Channel'}
                                    </span>
                                </div>
                                <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.2em]">v2.0.4-LTS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed inset-0 pointer-events-none grain-overlay opacity-[0.03]"></div>
        </main>
    );
}
