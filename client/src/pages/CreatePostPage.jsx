// src/pages/CreatePostPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('Admin'); 
    const [featuredImage, setFeaturedImage] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', author);
        if (featuredImage) {
            formData.append('featuredImage', featuredImage);
        }

        try {
            await axios.post('/api/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setLoading(false);
            navigate('/'); 
        } catch (err) {
            setLoading(false);
            setError('Error creating post. Please check fields.');
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit}>
                {/* Title Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Title:</label><br />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                {/* Content Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Content:</label><br />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows="10"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                {/* Image Upload Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Featured Image:</label><br />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFeaturedImage(e.target.files[0])}
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
            </form>
        </div>
    );
};

export default CreatePostPage;