import React from 'react';

interface ChartPlaceholderProps {
  type?: 'bar' | 'line' | 'pie';
  height?: number;
}

export function ChartPlaceholder({ type = 'line', height = 100 }: ChartPlaceholderProps) {
  return (
    <div 
      className="relative flex w-full items-end justify-around gap-1 overflow-hidden rounded-md bg-primary/20 p-2"
      style={{ height: `${height}px` }}
    >
      {type === 'bar' && (
        <>
          <div className="w-full rounded-t bg-accent/20" style={{ height: '40%' }} />
          <div className="w-full rounded-t bg-accent/40" style={{ height: '70%' }} />
          <div className="w-full rounded-t bg-accent/60" style={{ height: '50%' }} />
          <div className="w-full rounded-t bg-accent/80" style={{ height: '90%' }} />
          <div className="w-full rounded-t bg-accent" style={{ height: '60%' }} />
          <div className="w-full rounded-t bg-accent/40" style={{ height: '30%' }} />
          <div className="w-full rounded-t bg-accent/70" style={{ height: '80%' }} />
        </>
      )}
      
      {type === 'line' && (
        <svg className="h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path
            d="M0 35 Q 20 10, 40 25 T 80 5 T 100 20"
            fill="none"
            stroke="var(--color-accent, #FFCB74)"
            strokeWidth="2"
            className="drop-shadow-lg"
          />
          <path
            d="M0 35 Q 20 10, 40 25 T 80 5 T 100 20 L 100 40 L 0 40 Z"
            fill="url(#gradient)"
            fillOpacity="0.1"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-accent, #FFCB74)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {type === 'pie' && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-16 w-16 rounded-full border-8 border-accent border-l-transparent border-b-transparent rotate-45" />
        </div>
      )}
      
      <div className="absolute inset-0 flex items-center justify-center bg-primary/10 opacity-0 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-medium text-white uppercase tracking-wider">Live Analytics</span>
      </div>
    </div>
  );
}
