'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface Item {
  label: string;
  value: string;
  highlight?: 'success' | 'danger' | 'accent';
}

const highlightMap = {
  success: 'text-green-400',
  danger: 'text-red-400',
  accent: 'text-accent',
};

interface IntelligenceCardProps {
  title: string;
  items: Item[];
  data?: any[];
  chartKey?: string;
  color?: string;
}

export function IntelligenceCard({
  title,
  items,
  data = [],
  chartKey = 'value',
  color = '#007f7f', // Default to brand teal
}: IntelligenceCardProps) {
  return (
    <div className="rounded-2xl glass border border-accent/10 p-6 shadow-premium relative overflow-hidden group">
      <h2 className="mb-6 text-sm font-black text-accent uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-2">
        <span className="h-1 w-1 bg-accent rounded-full animate-pulse"></span>
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-surface/20 backdrop-blur-sm p-4 border border-accent/5 hover:border-accent/20 transition-all duration-300">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
            <p
              className={`mt-1 text-xl font-black ${item.highlight ? highlightMap[item.highlight] : 'text-primary-light'
                }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {data.length > 0 && (
        <div className="mt-8 h-32 w-full relative z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 51, 51, 0.9)',
                  border: '1px solid rgba(164, 240, 234, 0.2)',
                  borderRadius: '12px',
                  fontSize: '10px',
                  backdropFilter: 'blur(8px)'
                }}
                itemStyle={{ color: '#a4f0ea' }}
                cursor={{ stroke: 'rgba(164, 240, 234, 0.2)', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey={chartKey}
                stroke={color}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#gradient-${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Background pattern */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="59" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="60" cy="60" r="39" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
}