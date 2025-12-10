// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [posts, setPosts] = useState([]); // Saare posts (Original)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- YEH NAYA ADD HUA HAI ---
    const [searchTerm, setSearchTerm] = useState(''); // Search box ke liye state

    // Fetch data (waisa hi hai)
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/posts'); 
            setPosts(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching posts. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // --- YEH NAYI LOGIC ADD HUI HAI ---
    // Search logic: 'posts' state ko filter karo
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    
    if (loading) {
        return <div style={{ padding: '20px' }}><h1>Loading posts...</h1></div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}><h1>{error}</h1></div>;
    }

    return (
        <div className="homepage-container">
            <h1>All Blog Posts</h1>

            {/* --- YEH NAYA SEARCH BAR ADD HUA HAI --- */}
            <div className="search-bar-container" style={{ margin: '20px 0' }}>
                <input
                    type="text"
                    placeholder="Search posts by title..."
                    className="search-input" // Hum isse style karenge
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Check karo agar 'filtered' posts nahi hain */}
            {filteredPosts.length === 0 && <p>No posts found matching your search.</p>}

            <div className="posts-list">
                {/* --- Ab hum 'posts.map' ke bajaye 'filteredPosts.map' use karenge --- */}
                {filteredPosts.map(post => (
                    <div key={post._id} className="post-card">
                        
                        {post.featuredImage && post.featuredImage.url && (
                            <img src={post.featuredImage.url} alt={post.title} />
                        )}
                        <h2>{post.title}</h2>
                        <p className="post-meta">
                            By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                        <p>{post.content.substring(0, 150)}...</p> 
                        <Link to={`/post/${post._id}`} className="read-more-link">
                            ...Read More
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;