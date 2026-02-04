import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'light',
            setTheme: (theme) => {
                set({ theme });
                // Apply theme to document
                if (typeof window !== 'undefined') {
                    const root = window.document.documentElement;
                    root.classList.remove('light', 'dark');
                    root.classList.add(theme);
                }
            },
            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light';
                get().setTheme(newTheme);
            },
        }),
        {
            name: 'theme-storage',
            onRehydrateStorage: () => (state) => {
                // Apply theme on hydration
                if (state && typeof window !== 'undefined') {
                    const root = window.document.documentElement;
                    root.classList.remove('light', 'dark');
                    root.classList.add(state.theme);
                }
            },
        }
    )
);
