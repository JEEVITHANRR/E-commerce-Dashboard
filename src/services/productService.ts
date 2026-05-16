import apiClient from '../api/client';

export interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    image?: string;
    status: 'active' | 'out_of_stock' | 'draft';
}

export const productService = {
    getAll: async (params?: any) => {
        const { data } = await apiClient.get('/products', { params });
        return data;
    },
    getById: async (id: string) => {
        const { data } = await apiClient.get(`/products/${id}`);
        return data;
    },
    create: async (product: Partial<Product>) => {
        const { data } = await apiClient.post('/products', product);
        return data;
    },
    update: async (id: string, product: Partial<Product>) => {
        const { data } = await apiClient.patch(`/products/${id}`, product);
        return data;
    },
    delete: async (id: string) => {
        const { data } = await apiClient.delete(`/products/${id}`);
        return data;
    }
};
