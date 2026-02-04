import React from 'react';
import { Check, Minus } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className = '', label, indeterminate, ...props }, ref) => {
        return (
            <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                    <input
                        type="checkbox"
                        ref={ref}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border dark:border-border-dark bg-background dark:bg-background-dark transition-all hover:border-primary checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                        {...props}
                    />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        {indeterminate ? (
                            <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                        ) : (
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        )}
                    </div>
                </div>
                {label && (
                    <label className="text-sm text-text-main dark:text-text-main-dark cursor-pointer select-none" onClick={(e) => {
                        // Forward click to input if needed, but wrapping label usually works.
                        // Here we just display text.
                        const input = e.currentTarget.previousElementSibling?.querySelector('input');
                        input?.click();
                    }}>
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';
