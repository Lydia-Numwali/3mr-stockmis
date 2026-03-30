'use client';

import React from 'react';
import { Package, HandHelping, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboard';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    iconBg: string;
    trend?: { value: string; positive: boolean };
    loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, iconBg, trend, loading }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} flex-shrink-0`}>
            {icon}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {loading ? (
            <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        ) : (
            <p className="text-4xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
        )}
        {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                <span>{trend.value}</span>
                <span className="text-gray-400 font-normal ml-0.5">This month</span>
            </div>
        )}
    </div>
);

export const DashboardStatsCards: React.FC = () => {
    const { data: stats, isLoading } = useDashboardStats();

    const formatCurrency = (amount: number) => {
        return `Frws ${amount.toLocaleString()}`;
    };

    const cards: StatCardProps[] = [
        {
            label: 'Items in Stock',
            value: stats?.itemsInStock ?? 0,
            icon: <Package size={20} className="text-green-600" />,
            iconBg: 'bg-green-100 dark:bg-green-900/30',
            trend: { value: String(stats?.itemsInStock ?? 0), positive: true },
        },
        {
            label: 'Total Value of Sales',
            value: formatCurrency(stats?.valueOfSales ?? 0),
            icon: <TrendingUp size={20} className="text-blue-600" />,
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            trend: { value: formatCurrency(stats?.valueOfSales ?? 0), positive: (stats?.valueOfSales ?? 0) > 0 },
        },
        {
            label: 'Total Value of Purchases',
            value: formatCurrency(stats?.valueOfPurchases ?? 0),
            icon: <Package size={20} className="text-purple-600" />,
            iconBg: 'bg-purple-100 dark:bg-purple-900/30',
            trend: { value: formatCurrency(stats?.valueOfPurchases ?? 0), positive: true },
        },
        {
            label: 'Stock Balance',
            value: formatCurrency(stats?.stockBalance ?? 0),
            icon: <TrendingUp size={20} className="text-indigo-600" />,
            iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
            trend: { value: formatCurrency(stats?.stockBalance ?? 0), positive: (stats?.stockBalance ?? 0) >= 0 },
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">{cards.map((card) => (
                <StatCard key={card.label} {...card} loading={isLoading} />
            ))}
        </div>
    );
};
