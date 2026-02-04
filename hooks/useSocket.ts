'use client';

import { useEffect } from 'react';
import { socketClient } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';

/**
 * Custom hook to manage WebSocket connection
 */
export function useSocket() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            // Connect to WebSocket when authenticated
            const socket = socketClient.connect();

            return () => {
                // Disconnect when component unmounts or user logs out
                socketClient.disconnect();
            };
        }
    }, [isAuthenticated]);

    return {
        socket: socketClient.getSocket(),
        isConnected: socketClient.isConnected(),
        on: socketClient.on.bind(socketClient),
        off: socketClient.off.bind(socketClient),
        emit: socketClient.emit.bind(socketClient),
    };
}
