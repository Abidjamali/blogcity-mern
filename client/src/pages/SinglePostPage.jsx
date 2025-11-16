// src/pages/SinglePostPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Comments from '../components/Comments.jsx';
import LikeButton from '../components/LikeButton.jsx';
import api from '../context/AuthContext'; // Authenticated API
import { useAuth } from '../context/AuthContext'; // Logged-in user ko laane ke liye

const SinglePostPage = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Step 1: Logged-in user ko hasil karein
    const { user } = useAuth(); 

    // Data fetch karne ka function
    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/posts/${id}`); // 'api' use karein
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

    // Delete ka function
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/posts/${id}`); // 'api' use karein
                navigate('/');
            } catch (err) {
                setError(err.response?.data?.message || 'Error deleting post.');
            }
        }
    };

    if (loading) return <div style={{ padding: '20px' }}><h1>Loading post...</h1></div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}><h1>{error}</h1></div>;
    if (!post) return <div style={{ padding: '20px' }}><h1>Post not found.</h1></div>;

    // ----- YEH HAI ASLI FIX -----
    // Step 2: User ke 'username' ko post ke 'author' (jo ek string hai) se compare karein
    const isAuthor = user && post.author && user.username === post.author;

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
                {/* Ab yeh 'post.author' string ko sahi se dikhayega */}
                By {post.author || 'Unknown Author'} on {new Date(post.createdAt).toLocaleDateString()}
            </p>
            
            <div className="post-content">
                {post.content}
            </div>

            <LikeButton postId={post._id} />

            {/* Step 3: Ab yeh check bilkul theek kaam karega */}
            {isAuthor && (
                <div className="admin-actions">
                    <Link to={`/edit/${post._id}`}>
                        Edit Post
                    </Link>
                    <button onClick={handleDelete}>
                        Delete Post
                    </button>
                </div>
            )}

            <Comments postId={post._id} />
        </div>
    );
};

export default SinglePostPage;