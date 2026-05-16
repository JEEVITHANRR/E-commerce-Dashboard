import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/client';
import { toast } from 'sonner';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials: any) => {
        try {
            const { data } = await apiClient.post('/auth/login', credentials);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            toast.success('Logged in successfully');
            router.push('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return { user, login, logout, loading };
};
