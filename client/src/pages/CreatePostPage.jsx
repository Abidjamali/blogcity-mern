// src/pages/CreatePostPage.jsx

import React, { useState } from 'react';
<<<<<<< HEAD
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
=======
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../context/AuthContext';
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
<<<<<<< HEAD
    const [author, setAuthor] = useState('Admin'); 
    const [featuredImage, setFeaturedImage] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
=======
    const [featuredImage, setFeaturedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
<<<<<<< HEAD
        formData.append('author', author);
=======
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
        if (featuredImage) {
            formData.append('featuredImage', featuredImage);
        }

        try {
<<<<<<< HEAD
            await axios.post('/api/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setLoading(false);
            navigate('/'); 
        } catch (err) {
            setLoading(false);
            setError('Error creating post. Please check fields.');
            console.error(err);
=======
            console.log('Attempting to create post...');
            const response = await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setLoading(false);
            console.log('Post created successfully:', response.data);
            navigate('/');
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || err.message || 'Error creating post. Please check fields.';
            setError(errorMessage);
            console.error('Post creation error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                headers: err.response?.headers
            });
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
        }
    };

    return (
<<<<<<< HEAD
        <div style={{ padding: '20px' }}>
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit}>
                {/* Title Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Title:</label><br />
=======
        <div style={styles.container}>
            <h1 style={styles.title}>Create a New Post</h1>
            {user && (
                <p style={styles.userInfo}>Creating as: {user.username}</p>
            )}
            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Title Field */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Title:</label>
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
<<<<<<< HEAD
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                {/* Content Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Content:</label><br />
=======
                        style={styles.input}
                        placeholder="Enter post title"
                    />
                </div>
                {/* Content Field */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Content:</label>
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
<<<<<<< HEAD
                        rows="10"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                {/* Image Upload Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Featured Image:</label><br />
=======
                        rows="12"
                        style={styles.textarea}
                        placeholder="Write your post content here..."
                    />
                </div>
                {/* Image Upload Field */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Featured Image (Optional):</label>
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFeaturedImage(e.target.files[0])}
<<<<<<< HEAD
                    />
                </div>
                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '10px 15px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    {loading ? 'Submitting...' : 'Create Post'}
                </button>
                {/* Error Message */}
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
=======
                        style={styles.fileInput}
                    />
                    {featuredImage && (
                        <p style={styles.fileInfo}>Selected: {featuredImage.name}</p>
                    )}
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    style={loading ? styles.submitButtonDisabled : styles.submitButton}
                >
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
                {/* Error Message */}
                {error && <p style={styles.error}>{error}</p>}
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
            </form>
        </div>
    );
};

<<<<<<< HEAD
=======
const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
    },
    title: {
        textAlign: 'center',
        marginBottom: '10px',
        color: '#333'
    },
    userInfo: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#666',
        fontSize: '14px'
    },
    form: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    formGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box',
        resize: 'vertical',
        fontFamily: 'inherit'
    },
    fileInput: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        boxSizing: 'border-box'
    },
    fileInfo: {
        marginTop: '8px',
        fontSize: '14px',
        color: '#666'
    },
    submitButton: {
        padding: '14px 24px',
        background: 'linear-gradient(45deg, #007bff, #0056b3)',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        width: '100%',
        transition: 'transform 0.2s'
    },
    submitButtonDisabled: {
        padding: '14px 24px',
        background: '#ccc',
        color: '#666',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'not-allowed',
        width: '100%'
    },
    error: {
        color: '#dc3545',
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#f8d7da',
        borderRadius: '4px',
        fontSize: '14px'
    }
};

>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
export default CreatePostPage;