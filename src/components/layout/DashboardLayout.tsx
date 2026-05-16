'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    ShoppingCart, 
    Users, 
    BarChart3, 
    Settings, 
    LogOut,
    Search,
    Bell,
    MessageSquare,
    ChevronDown,
    Bolt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

const sidebarLinks = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: ShoppingBag },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-[#111827] font-sans selection:bg-indigo-100">
            {/* Floating Sidebar */}
            <aside className="fixed top-6 left-6 bottom-6 w-[280px] bg-white rounded-2xl border border-gray-200 shadow-xl z-50 flex flex-col p-8 transition-all duration-300">
                <div className="flex items-center gap-3 px-4 mb-12">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <Bolt size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Indigo Commerce</span>
                </div>

                <nav className="flex-grow">
                    <ul className="space-y-1">
                        {sidebarLinks.map((link) => (
                            <li key={link.name}>
                                <Link 
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                        pathname === link.href 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <link.icon size={18} />
                                    <span>{link.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-auto border-t border-gray-100 pt-6">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ml-[328px] p-12 pt-6">
                {/* Top Navbar */}
                <header className="h-[72px] flex items-center justify-between mb-10">
                    <div className="flex items-center bg-white border border-gray-200 px-4 py-2.5 rounded-lg w-[400px] gap-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                        <Search size={18} className="text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search orders, products or customers..." 
                            className="bg-transparent border-none outline-none w-full text-sm placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-5">
                        <button className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
                            <Bell size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
                            <MessageSquare size={18} />
                        </button>
                        
                        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-all">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-orange-400" />
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold">Jeevithan R R</p>
                            </div>
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
