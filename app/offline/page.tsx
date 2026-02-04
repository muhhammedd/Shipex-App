'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        setIsOnline(navigator.onLine);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleRetry = () => {
        if (navigator.onLine) {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="glass-card p-8 rounded-2xl">
                    <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20">
                        <WifiOff className="w-10 h-10 text-cyan-400" />
                    </div>

                    <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        You're Offline
                    </h1>

                    <p className="text-gray-400 mb-6">
                        It looks like you've lost your internet connection. Some features may not be available until you're back online.
                    </p>

                    {isOnline ? (
                        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <p className="text-green-400 text-sm">
                                ✓ Connection restored! Click retry to continue.
                            </p>
                        </div>
                    ) : (
                        <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <p className="text-orange-400 text-sm">
                                Check your internet connection and try again.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleRetry}
                        disabled={!isOnline}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-sm text-gray-500">
                            Previously viewed pages may still be available in your cache.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
