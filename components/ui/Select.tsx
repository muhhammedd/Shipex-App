import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { label: string; value: string }[];
}

export function Select({
  label,
  error,
  options,
  children,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-xs font-black text-accent uppercase tracking-widest pl-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          className={`w-full rounded-xl bg-surface/40 backdrop-blur-md border border-accent/10 px-4 py-3 text-sm text-primary-light outline-none transition-all appearance-none cursor-pointer focus:border-accent/40 focus:ring-1 focus:ring-accent/20 group-hover:bg-surface/60 ${error ? 'border-red-500/50' : ''
            } ${className}`}
          {...props}
        >
          {options ? options.map((option) => (
            <option key={option.value} value={option.value} className="bg-primary-dark text-primary-light">
              {option.label}
            </option>
          )) : children}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent/40 group-hover:text-accent transition-colors">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {error && <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter pl-1">{error}</p>}
    </div>
  );
}
