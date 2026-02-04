'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="relative w-10 h-10 rounded-lg bg-background-card dark:bg-background-card-dark border border-border dark:border-border-dark flex items-center justify-center transition-all hover:shadow-card"
                aria-label="Toggle theme"
            >
                <Sun className="w-5 h-5 text-text-dim" />
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-lg bg-background-card dark:bg-background-card-dark border border-border dark:border-border-dark flex items-center justify-center transition-all hover:shadow-card hover:scale-105 active:scale-95 focus-ring"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className="relative w-5 h-5">
                <Sun
                    className={`absolute inset-0 w-5 h-5 text-warning transition-all duration-300 ${theme === 'light'
                            ? 'rotate-0 scale-100 opacity-100'
                            : 'rotate-90 scale-0 opacity-0'
                        }`}
                />
                <Moon
                    className={`absolute inset-0 w-5 h-5 text-primary transition-all duration-300 ${theme === 'dark'
                            ? 'rotate-0 scale-100 opacity-100'
                            : '-rotate-90 scale-0 opacity-0'
                        }`}
                />
            </div>
        </button>
    );
}
