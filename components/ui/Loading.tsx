import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div
            className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin shadow-glow-primary ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
}

interface LoadingProps {
    text?: string;
    fullScreen?: boolean;
}

export function Loading({ text = 'Synching Systems...', fullScreen = false }: LoadingProps) {
    const containerClass = fullScreen
        ? 'fixed inset-0 flex items-center justify-center bg-background dark:bg-background-dark z-50'
        : 'flex items-center justify-center p-8';

    return (
        <div className={containerClass}>
            <div className="text-center">
                <div className="relative mb-6">
                    <LoadingSpinner size="lg" className="mx-auto" />
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-text-dim animate-pulse">{text}</p>
            </div>
        </div>
    );
}
