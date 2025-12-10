// src/pages/EditPostPage.jsx

import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
=======
// import axios from 'axios'; // <-- YEH HATA RAHE HAIN
import { useParams, useNavigate } from 'react-router-dom';
import api from '../context/AuthContext'; // <-- YEH ADD KAREIN (Authenticated API)
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80

const EditPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
<<<<<<< HEAD
    const [author, setAuthor] = useState('');
=======
    const [author, setAuthor] = useState(''); // Yeh field ab shayad zaroori nahi agar backend user se le raha hai
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
    const [newImage, setNewImage] = useState(null); 
    const [oldImage, setOldImage] = useState(''); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
<<<<<<< HEAD
                const response = await axios.get(`/api/posts/${id}`);
=======
                // 'axios.get' ko 'api.get' se badlein
                const response = await api.get(`/posts/${id}`); // <-- CHANGE YAHAN HAI
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
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
<<<<<<< HEAD
            await axios.put(`/api/posts/${id}`, formData, {
                headers: { 'Content-Type': 'multipart-form-data' },
=======
            // 'axios.put' ko 'api.put' se badlein
            await api.put(`/posts/${id}`, formData, { // <-- CHANGE YAHAN HAI
                headers: { 'Content-Type': 'multipart/form-data' },
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
            });
            setLoading(false);
            navigate(`/post/${id}`); 
        } catch (err) {
            setLoading(false);
<<<<<<< HEAD
            setError('Error updating post. Please check fields.');
        }
    };

=======
            setError(err.response?.data?.message || 'Error updating post. Please check fields.');
        }
    };

    // Baaki UI (return) waisa hi rahega
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
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
<<<<<<< HEAD
                {/* Baaki form fields (Title, Content, Image) */}
=======
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
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