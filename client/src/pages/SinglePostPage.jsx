// src/pages/SinglePostPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const SinglePostPage = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); 
    const navigate = useNavigate();

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/posts/${id}`);
            setPost(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching post.'); 
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`/api/posts/${id}`);
                navigate('/');
            } catch (err) {
                setError('Error deleting post.');
            }
        }
    };

    if (loading) return <div style={{ padding: '20px' }}><h1>Loading post...</h1></div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}><h1>{error}</h1></div>;
    if (!post) return <div style={{ padding: '20px' }}><h1>Post not found.</h1></div>;

    return (
        <div className="single-post-page">
            {post.featuredImage && post.featuredImage.url && (
                <img 
                    src={post.featuredImage.url} 
                    alt={post.title} 
                />
            )}

            <h1>{post.title}</h1>

            <p style={{ color: '#777', fontStyle: 'italic' }}>
                By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
            </p>
            
            <div className="post-content">
                {post.content}
            </div>

            <div className="admin-actions">
                {/* --- YEH TAG AB THEEK HO GAYA HAI --- */}
                <Link to={`/edit/${post._id}`}>
                    Edit Post
                </Link>
                <button onClick={handleDelete}>
                    Delete Post
                </button>
            </div>
        </div>
    );
};

export default SinglePostPage;