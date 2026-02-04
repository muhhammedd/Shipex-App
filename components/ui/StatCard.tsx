import React from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  title?: string;
  label?: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: string | { value: number; label: string; isPositive?: boolean };
  trendValue?: number;
  iconColor?: string;
  iconClassName?: string;
  className?: string;
  loading?: boolean;
  variant?: 'default' | 'gradient-primary' | 'gradient-success' | 'primary' | 'success' | 'warning' | 'info';
}

export function StatCard({
  title,
  label,
  value,
  icon: Icon = Activity,
  trend,
  trendValue,
  iconClassName = '',
  className = '',
  loading = false,
  variant = 'default',
}: Props) {
  const displayLabel = title || label;

  let trendDisplay = '';
  let trendLabel = '';
  let isPositive = false;

  if (typeof trend === 'object' && trend !== null) {
    trendDisplay = `${trend.value > 0 ? '+' : ''}${trend.value}%`;
    trendLabel = trend.label;
    isPositive = trend.isPositive ?? trend.value > 0;
  } else if (typeof trend === 'string') {
    trendDisplay = trend;
    isPositive = trend.startsWith('+');
  } else if (trendValue !== undefined) {
    trendDisplay = `${trendValue > 0 ? '+' : ''}${trendValue}%`;
    isPositive = trendValue > 0;
  }

  const showTrend = trend || trendValue !== undefined;

  const variantStyles = {
    default: 'card-hover',
    'gradient-primary': 'card-hover gradient-card border-primary/20',
    'gradient-success': 'card-hover gradient-card border-success/20',
    primary: 'card-hover border-primary/20 bg-primary/5',
    success: 'card-hover border-success/20 bg-success/5',
    warning: 'card-hover border-warning/20 bg-warning/5',
    info: 'card-hover border-blue-500/20 bg-blue-500/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className={`relative ${variantStyles[variant]} p-6 group ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">
            {displayLabel}
          </p>
          <div className="flex items-baseline gap-3">
            {loading ? (
              <div className="h-10 w-32 bg-background dark:bg-background-dark rounded-lg shimmer" />
            ) : (
              <p className="text-4xl font-bold text-text-main dark:text-text-main-dark leading-tight">
                {value}
              </p>
            )}
            {showTrend && !loading && (
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive
                ? 'bg-success/10 text-success dark:bg-success/20'
                : 'bg-error/10 text-error dark:bg-error/20'
                }`}>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{trendDisplay} {trendLabel && <span className="opacity-70 font-normal ml-1">{trendLabel}</span>}</span>
              </div>
            )}
          </div>
        </div>

        <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 group-hover:scale-110 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-300 ${!iconClassName && 'text-primary'}`}>
          <Icon className={`h-7 w-7 ${iconClassName}`} />
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}