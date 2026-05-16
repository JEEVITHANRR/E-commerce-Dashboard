'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    Package,
    ArrowUpDown,
    Filter
} from 'lucide-react';
import { productService } from '@/services/productService';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

export default function ProductsPage() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getAll(),
    });

    const seedMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/seed`, { method: 'POST' });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Database seeded with premium products!');
        },
        onError: () => {
            toast.error('Failed to seed database. Check your Railway connection.');
        }
    });

    if (isLoading) return <div className="p-12 text-gray-500 font-medium">Loading Inventory Intelligence...</div>;

    const products = data?.products || [];

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Product Catalog</h1>
                    <p className="text-gray-500 font-medium">Manage your enterprise inventory and global listings</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => seedMutation.mutate()}
                        className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Seed Demo Data
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                        <Plus size={18} />
                        <span>Add Product</span>
                    </button>
                </div>
            </header>

            {/* Filter & Search Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl w-[400px]">
                    <Search size={18} className="text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search products by name, SKU or category..." 
                        className="bg-transparent border-none outline-none w-full text-sm placeholder:text-gray-400"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                        <Filter size={16} />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                        <ArrowUpDown size={16} />
                        Sort
                    </button>
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Product Info</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic">
                                    No products found. Click "Seed Demo Data" to populate your catalog.
                                </td>
                            </tr>
                        ) : (
                            products.map((product: any) => (
                                <tr key={product._id} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-400 font-medium tracking-tight uppercase">SKU-{product._id.substring(0,6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold tracking-tight">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                                            <span className="text-sm font-bold text-gray-700 capitalize">{product.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-bold text-gray-900">{product.stock} units</p>
                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-500 rounded-full" 
                                                style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-lg font-extrabold text-gray-900">${product.price}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-all">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
