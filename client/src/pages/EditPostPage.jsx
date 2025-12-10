// src/pages/EditPostPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [newImage, setNewImage] = useState(null); 
    const [oldImage, setOldImage] = useState(''); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/posts/${id}`);
                const post = response.data;
                setTitle(post.title);
                setContent(post.content);
                setAuthor(post.author);
                if (post.featuredImage) {
                    setOldImage(post.featuredImage.url);
                }
                setLoading(false);
            } catch (err) {
                setError('Error fetching post data.');
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', author);
        if (newImage) {
            formData.append('featuredImage', newImage);
        }

        try {
            await axios.put(`/api/posts/${id}`, formData, {
                headers: { 'Content-Type': 'multipart-form-data' },
            });
            setLoading(false);
            navigate(`/post/${id}`); 
        } catch (err) {
            setLoading(false);
            setError('Error updating post. Please check fields.');
        }
    };

    if (loading && !title) { 
        return <div style={{ padding: '20px' }}><h1>Loading post data...</h1></div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Edit Post</h1>
            {oldImage && !newImage && (
                <div style={{ marginBottom: '15px' }}>
                    <p>Current Image:</p>
                    <img src={oldImage} alt="Current" style={{ width: '200px' }} />
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {/* Baaki form fields (Title, Content, Image) */}
                 <div style={{ marginBottom: '15px' }}>
                    <label>Title:</label><br />
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Content:</label><br />
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows="10" style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Change Featured Image (Optional):</label><br />
                    <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '10px 15px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {loading ? 'Updating...' : 'Update Post'}
                </button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
        </div>
    );
};

export default EditPostPage;