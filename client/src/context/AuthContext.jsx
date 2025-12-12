// client/src/context/AuthContext.jsx - FINAL CORRECT CODE

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// FIX: baseURL ko environment variable se badlein (Vercel ke liye)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL // <--- YEH FIX HAI!
});

// Add token to requests (waisa hi rahega)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const AuthProvider = ({ children }) => {
    // [Rest of the AuthProvider code waisa hi rahega]
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await api.get('/auth/me');
                setUser(response.data.user);
            }
        } catch (error) {
            // Handle error, e.g., token invalid
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => { /* ... */ };
    const login = async (credentials) => { /* ... */ };
    
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        // Optionally redirect or show message
    };

    const updateProfile = async (formData) => { /* ... */ };


    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile, 
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Export the authenticated API instance
export default api;