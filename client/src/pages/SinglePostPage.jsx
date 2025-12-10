// src/pages/SinglePostPage.jsx

import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
=======
import { useParams, useNavigate, Link } from 'react-router-dom';
import Comments from '../components/Comments.jsx';
import LikeButton from '../components/LikeButton.jsx';
import api from '../context/AuthContext'; // Authenticated API
import { useAuth } from '../context/AuthContext'; // Logged-in user ko laane ke liye
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80

const SinglePostPage = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
<<<<<<< HEAD
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
=======
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
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

<<<<<<< HEAD
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`/api/posts/${id}`);
                navigate('/');
            } catch (err) {
                setError('Error deleting post.');
=======
    // Delete ka function
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/posts/${id}`); // 'api' use karein
                navigate('/');
            } catch (err) {
                setError(err.response?.data?.message || 'Error deleting post.');
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
            }
        }
    };

    if (loading) return <div style={{ padding: '20px' }}><h1>Loading post...</h1></div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}><h1>{error}</h1></div>;
    if (!post) return <div style={{ padding: '20px' }}><h1>Post not found.</h1></div>;

<<<<<<< HEAD
    return (
        <div className="single-post-page">
            {post.featuredImage && post.featuredImage.url && (
                <img 
                    src={post.featuredImage.url} 
                    alt={post.title} 
=======
    // ----- YEH HAI ASLI FIX -----
    // Step 2: User ke 'username' ko post ke 'author' (jo ek string hai) se compare karein
    const isAuthor = user && post.author && user.username === post.author;

    return (
        <div className="single-post-page">
            {post.featuredImage && post.featuredImage.url && (
                <img
                    src={post.featuredImage.url}
                    alt={post.title}
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
                />
            )}

            <h1>{post.title}</h1>

            <p style={{ color: '#777', fontStyle: 'italic' }}>
<<<<<<< HEAD
                By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
=======
                {/* Ab yeh 'post.author' string ko sahi se dikhayega */}
                By {post.author || 'Unknown Author'} on {new Date(post.createdAt).toLocaleDateString()}
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
            </p>
            
            <div className="post-content">
                {post.content}
            </div>

<<<<<<< HEAD
            <div className="admin-actions">
                {/* --- YEH TAG AB THEEK HO GAYA HAI --- */}
                <Link to={`/edit/${post._id}`}>
                    Edit Post
                </Link>
                <button onClick={handleDelete}>
                    Delete Post
                </button>
            </div>
=======
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
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
        </div>
    );
};

export default SinglePostPage;