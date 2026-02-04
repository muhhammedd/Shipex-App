import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary: 'bg-primary hover:bg-primary-600 text-white shadow-soft hover:shadow-card dark:shadow-dark-soft dark:hover:shadow-dark-card',
    secondary: 'bg-secondary hover:bg-secondary-600 text-white shadow-soft hover:shadow-card dark:bg-secondary-100 dark:hover:bg-secondary-200 dark:text-secondary-900',
    success: 'bg-success hover:bg-success-600 text-white shadow-soft hover:shadow-card',
    warning: 'bg-warning hover:bg-warning-600 text-white shadow-soft hover:shadow-card',
    danger: 'bg-error hover:bg-error-600 text-white shadow-soft hover:shadow-card',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary dark:hover:text-white',
    ghost: 'bg-transparent text-text-main hover:bg-background-card dark:text-text-main-dark dark:hover:bg-background-card-dark',
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${variant === 'primary' ? 'shimmer-sweep' : ''}`}
      disabled={disabled || isLoading}
      onClick={(e: any) => {
        if (!isLoading && !disabled && props.onClick) {
          props.onClick(e);
        }
      }}
      aria-busy={isLoading}
      {...(props as any)}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span className="relative z-10">{children}</span>
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
}
