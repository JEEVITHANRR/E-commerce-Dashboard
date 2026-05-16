'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    DollarSign, 
    ShoppingCart, 
    Users, 
    Percent, 
    ArrowUp, 
    ArrowDown 
} from 'lucide-react';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Filler, 
    Legend, 
    ArcElement 
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import apiClient from '@/api/client';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ArcElement
);

const fetchStats = async () => {
    // In a real app, this would be an API call
    // const { data } = await apiClient.get('/stats/dashboard');
    // return data;
    return {
        revenue: 128430,
        orders: 1429,
        customers: 856,
        conversion: 3.2,
        revenueTrend: 12.5,
        ordersTrend: 8.2,
        customersTrend: 24.1,
        conversionTrend: -1.4
    };
};

export default function Dashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchStats,
    });

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Revenue',
            data: [32000, 38000, 35000, 42000, 48000, 45000, 52000, 58000, 55000, 62000, 68000, 72000],
            borderColor: '#4F46E5',
            borderWidth: 3,
            fill: true,
            backgroundColor: (context: any) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
                gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
                return gradient;
            },
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
        }]
    };

    const categoryData = {
        labels: ['Electronics', 'Fashion', 'Home', 'Beauty'],
        datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: ['#4F46E5', '#F97316', '#10B981', '#F3F4F6'],
            borderWidth: 0,
        }]
    };

    if (isLoading) return <div>Loading Intelligence...</div>;

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-3xl font-extrabold tracking-tight">Intelligence Command</h1>
                <p className="text-gray-500 font-medium">Real-time performance analytics & predictive insights</p>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    label="Total Revenue" 
                    value={`$${stats?.revenue.toLocaleString()}`} 
                    trend={stats?.revenueTrend} 
                    icon={DollarSign}
                    color="indigo"
                />
                <StatCard 
                    label="Total Orders" 
                    value={stats?.orders.toLocaleString()} 
                    trend={stats?.ordersTrend} 
                    icon={ShoppingCart}
                    color="orange"
                />
                <StatCard 
                    label="New Customers" 
                    value={stats?.customers.toLocaleString()} 
                    trend={stats?.customersTrend} 
                    icon={Users}
                    color="emerald"
                />
                <StatCard 
                    label="Conversion Rate" 
                    value={`${stats?.conversion}%`} 
                    trend={stats?.conversionTrend} 
                    icon={Percent}
                    color="red"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Revenue Forecast</h3>
                    <div className="h-[320px]">
                        <Line 
                            data={revenueData} 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { grid: { display: false } },
                                    y: { border: { dash: [5, 5] }, grid: { color: '#E5E7EB' } }
                                }
                            }} 
                        />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Top Categories</h3>
                    <div className="h-[320px] flex items-center justify-center">
                        <Doughnut 
                            data={categoryData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom' } }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, trend, icon: Icon, color }: any) {
    const isPositive = trend > 0;
    
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    color === 'indigo' && "bg-indigo-50 text-indigo-600",
                    color === 'orange' && "bg-orange-50 text-orange-600",
                    color === 'emerald' && "bg-emerald-50 text-emerald-600",
                    color === 'red' && "bg-red-50 text-red-600",
                )}>
                    <Icon size={24} />
                </div>
                <div className={cn(
                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                    isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                    {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {Math.abs(trend)}%
                </div>
            </div>
            <div className="text-2xl font-extrabold mb-1">{value}</div>
            <div className="text-sm font-medium text-gray-500">{label}</div>
        </div>
    );
}

function cn(...inputs: any) {
    return inputs.filter(Boolean).join(' ');
}
