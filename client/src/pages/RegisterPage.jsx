// client/src/pages/RegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    
    const { register, user, loading, error } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const validateForm = () => {
        const errors = {};
        
        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
        // Clear validation error for this field when user starts typing
        if (validationErrors[e.target.name]) {
            setValidationErrors({
                ...validationErrors,
                [e.target.name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const result = await register({
            username: formData.username,
            email: formData.email,
            password: formData.password
        });
        
        if (result.success) {
            navigate('/');
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Loading...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <h2 style={styles.title}>Join BlogCity</h2>
                <p style={styles.subtitle}>Create your account to start blogging</p>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                borderColor: validationErrors.username ? '#dc3545' : '#ddd'
                            }}
                            placeholder="Choose a username"
                        />
                        {validationErrors.username && (
                            <span style={styles.fieldError}>{validationErrors.username}</span>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                borderColor: validationErrors.email ? '#dc3545' : '#ddd'
                            }}
                            placeholder="Enter your email"
                        />
                        {validationErrors.email && (
                            <span style={styles.fieldError}>{validationErrors.email}</span>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.passwordContainer}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                style={{
                                    ...styles.input,
                                    borderColor: validationErrors.password ? '#dc3545' : '#ddd'
                                }}
                                placeholder="Create a password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.togglePassword}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {validationErrors.password && (
                            <span style={styles.fieldError}>{validationErrors.password}</span>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <div style={styles.passwordContainer}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={{
                                    ...styles.input,
                                    borderColor: validationErrors.confirmPassword ? '#dc3545' : '#ddd'
                                }}
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.togglePassword}
                            >
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {validationErrors.confirmPassword && (
                            <span style={styles.fieldError}>{validationErrors.confirmPassword}</span>
                        )}
                    </div>

                    <button type="submit" style={styles.submitButton}>
                        Create Account
                    </button>
                </form>

                <div style={styles.footer}>
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.link}>
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px'
    },
    formCard: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '450px'
    },
    title: {
        textAlign: 'center',
        marginBottom: '8px',
        color: '#333',
        fontSize: '28px',
        fontWeight: '600'
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: '24px',
        color: '#666',
        fontSize: '14px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    inputGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#333',
        fontWeight: '500',
        fontSize: '14px'
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s'
    },
    passwordContainer: {
        position: 'relative'
    },
    togglePassword: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px'
    },
    submitButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '14px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: '8px',
        transition: 'background-color 0.3s'
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '14px'
    },
    fieldError: {
        color: '#dc3545',
        fontSize: '12px',
        marginTop: '4px',
        display: 'block'
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#666'
    },
    footer: {
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '14px',
        color: '#666'
    },
    link: {
        color: '#007bff',
        textDecoration: 'none'
    }
};

export default RegisterPage;