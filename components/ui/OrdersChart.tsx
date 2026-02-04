import React from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface OrdersChartProps {
    data: Array<{ date?: string; label?: string; count?: number; name?: string; value?: number }>;
    type: 'line' | 'area' | 'donut';
    variant?: 'primary' | 'success';
    className?: string;
    height?: number;
}

export function OrdersChart({
    data,
    type,
    variant = 'primary',
    className = '',
    height = 300
}: OrdersChartProps) {
    const colors = {
        primary: {
            main: '#035BCB',
            light: '#3A7FD5',
            gradient: ['#035BCB', '#024A9F'],
        },
        success: {
            main: '#00B364',
            light: '#10B981',
            gradient: ['#00B364', '#009050'],
        },
    };

    const currentColors = colors[variant];

    // Donut chart colors for status distribution
    const donutColors = [
        '#035BCB', // Primary - In Transit
        '#00B364', // Success - Delivered
        '#FFA500', // Warning - Pending
        '#0EA5E9', // Info - Created
        '#DC2626', // Error - Cancelled
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background-card dark:bg-background-card-dark border border-border dark:border-border-dark rounded-lg shadow-card p-3">
                    <p className="text-sm font-semibold text-text-main dark:text-text-main-dark mb-1">
                        {label || payload[0].name}
                    </p>
                    <p className="text-xs text-text-dim dark:text-text-dim-dark">
                        Orders: <span className="font-bold text-primary">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (type === 'line') {
        return (
            <div className={className}>
                <ResponsiveContainer width="100%" height={height}>
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs>
                            <linearGradient id={`lineGradient-${variant}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={currentColors.main} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={currentColors.light} stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="currentColor"
                            className="text-border dark:text-border-dark"
                            opacity={0.3}
                        />
                        <XAxis
                            dataKey="date"
                            stroke="currentColor"
                            className="text-text-dim dark:text-text-dim-dark text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            stroke="currentColor"
                            className="text-text-dim dark:text-text-dim-dark text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke={currentColors.main}
                            strokeWidth={3}
                            dot={{ fill: currentColors.main, r: 4 }}
                            activeDot={{ r: 6, fill: currentColors.light }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === 'area') {
        return (
            <div className={className}>
                <ResponsiveContainer width="100%" height={height}>
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs>
                            <linearGradient id={`areaGradient-${variant}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={currentColors.main} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={currentColors.main} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="currentColor"
                            className="text-border dark:text-border-dark"
                            opacity={0.3}
                        />
                        <XAxis
                            dataKey="date"
                            stroke="currentColor"
                            className="text-text-dim dark:text-text-dim-dark text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            stroke="currentColor"
                            className="text-text-dim dark:text-text-dim-dark text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke={currentColors.main}
                            strokeWidth={2}
                            fill={`url(#areaGradient-${variant})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === 'donut') {
        const RADIAN = Math.PI / 180;
        const renderCustomizedLabel = ({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
        }: any) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            if (percent < 0.05) return null; // Don't show label for small slices

            return (
                <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-xs font-bold"
                >
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
            );
        };

        return (
            <div className={className}>
                <ResponsiveContainer width="100%" height={height}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={100}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            paddingAngle={2}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => (
                                <span className="text-xs text-text-main dark:text-text-main-dark">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return null;
}
