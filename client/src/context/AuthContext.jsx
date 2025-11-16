// client/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Create axios instance with base URL (waisa hi hai)
const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Add token to requests (waisa hi hai)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in (waisa hi hai)
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
            // ... (error handling waisa hi hai)
        } finally {
            setLoading(false);
        }
    };

    // Register (waisa hi hai)
    const register = async (userData) => {
        // ... (Aapka poora register code yahan waisa hi rahega)
        try {
            setError(null); setLoading(true);
            const response = await api.post('/auth/register', userData);
            const { token, user: newUser } = response.data;
            localStorage.setItem('token', token);
            setUser(newUser);
            return { success: true, user: newUser };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Login (waisa hi hai)
    const login = async (credentials) => {
        // ... (Aapka poora login code yahan waisa hi rahega)
        try {
            setError(null); setLoading(true);
            const response = await api.post('/auth/login', credentials);
            const { token, user: loggedInUser } = response.data;
            localStorage.setItem('token', token);
            setUser(loggedInUser);
            return { success: true, user: loggedInUser };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Logout (waisa hi hai)
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setError(null);
    };

    // --- YEH FUNCTION AB "UPGRADED" HAI ---
    // (Yeh ab simple JSON ke bajaye FormData bhejega)
    const updateProfile = async (formData) => {
        try {
            setError(null);
            setLoading(true);
            
            // Hum 'formData' bhej rahe hain (jismein text aur image ho sakti hai)
            const response = await api.put('/auth/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            // Context mein naye user data se update karo
            setUser(response.data.user);
            
            return { success: true, user: response.data.user };
        } catch (error) {
            const message = error.response?.data?.message || 'Profile update failed';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile, // <-- Humne isse update kar diya hai
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

export default api;