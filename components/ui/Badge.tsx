import React from 'react';

interface Props {
  children?: React.ReactNode;
  label?: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary' | 'outline';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  success: 'bg-success/10 text-success border border-success/20 dark:bg-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20 dark:bg-warning/20',
  error: 'bg-error/10 text-error border border-error/20 dark:bg-error/20',
  info: 'bg-info/10 text-info border border-info/20 dark:bg-info/20',
  primary: 'bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20',
  secondary: 'bg-secondary/10 text-secondary border border-secondary/20 dark:bg-secondary-200 dark:text-secondary-900',
  outline: 'bg-transparent text-text-dim border border-border dark:text-text-dim-dark dark:border-border-dark',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({ children, label, variant = 'info', size = 'sm', className = '' }: Props) {
  const content = children || label;

  const isPulseVariant = variant === 'success' || variant === 'primary';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wide transition-smooth ${variants[variant]} ${sizes[size]} ${className} ${isPulseVariant ? 'animate-pulse-subtle' : ''}`}
    >
      {isPulseVariant && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      )}
      {content}
    </span>
  );
}
