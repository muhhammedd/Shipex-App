'use client';

import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    showHome?: boolean;
}

export function ErrorState({
    title = 'Something went wrong',
    message = 'We encountered an error while processing your request.',
    onRetry,
    showHome = false
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] rounded-xl border border-border/50 dark:border-border-dark/50 bg-background-card/50 dark:bg-background-card-dark/50 backdrop-blur-sm">
            <div className="h-16 w-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-error" />
            </div>
            <h3 className="text-xl font-bold text-text-main dark:text-text-main-dark mb-2">{title}</h3>
            <p className="text-text-dim dark:text-text-dim-dark max-w-md mb-6">{message}</p>
            <div className="flex gap-3">
                {showHome && (
                    <Button
                        variant="ghost"
                        leftIcon={<Home className="h-4 w-4" />}
                        onClick={() => window.location.href = '/'}
                    >
                        Go Home
                    </Button>
                )}
                {onRetry && (
                    <Button
                        variant="primary"
                        leftIcon={<RefreshCw className="h-4 w-4" />}
                        onClick={onRetry}
                    >
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-background dark:bg-background-dark">
                    <ErrorState
                        title="Application Error"
                        message="An unexpected error occurred. Please try refreshing the page."
                        onRetry={() => window.location.reload()}
                        showHome
                    />
                </div>
            );
        }

        return this.props.children;
    }
}
