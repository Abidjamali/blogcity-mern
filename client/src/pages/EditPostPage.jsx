// src/pages/EditPostPage.jsx

import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // <-- YEH HATA RAHE HAIN
import { useParams, useNavigate } from 'react-router-dom';
import api from '../context/AuthContext'; // <-- YEH ADD KAREIN (Authenticated API)

const EditPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState(''); // Yeh field ab shayad zaroori nahi agar backend user se le raha hai
    const [newImage, setNewImage] = useState(null); 
    const [oldImage, setOldImage] = useState(''); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                // 'axios.get' ko 'api.get' se badlein
                const response = await api.get(`/posts/${id}`); // <-- CHANGE YAHAN HAI
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
            // 'axios.put' ko 'api.put' se badlein
            await api.put(`/posts/${id}`, formData, { // <-- CHANGE YAHAN HAI
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setLoading(false);
            navigate(`/post/${id}`); 
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Error updating post. Please check fields.');
        }
    };

    // Baaki UI (return) waisa hi rahega
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