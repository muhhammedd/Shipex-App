import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'circle' | 'text' | 'rect';
}

export function Skeleton({ className = '', variant = 'default', ...props }: SkeletonProps) {
    const baseStyles = "animate-pulse bg-text-dim/10 dark:bg-text-dim-dark/20 rounded";

    const variantStyles = {
        default: "",
        circle: "rounded-full",
        text: "h-4 w-full rounded-sm",
        rect: "h-full w-full"
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="p-4 rounded-xl border border-border dark:border-border-dark bg-background-card dark:bg-background-card-dark space-y-3">
            <div className="flex justify-between items-start">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="pt-2">
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
    );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
    return (
        <div className="flex items-center gap-4 py-4 border-b border-border dark:border-border-dark px-4">
            {Array.from({ length: cols }).map((_, i) => (
                <div key={i} className="flex-1">
                    <Skeleton className="h-4 w-full" />
                </div>
            ))}
        </div>
    );
}

export function MetricSkeleton() {
    return (
        <div className="p-4 rounded-xl border border-border dark:border-border-dark bg-background-card dark:bg-background-card-dark">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-6 w-2/3" />
                </div>
            </div>
        </div>
    );
}

// Keep existing exports for backward compatibility if needed, but updated implementation
export function StatCardSkeleton() {
    return (
        <div className="p-6 rounded-2xl bg-background-card dark:bg-background-card-dark border border-border dark:border-border-dark space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-14 w-14 rounded-xl" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
        </div>
    );
}
