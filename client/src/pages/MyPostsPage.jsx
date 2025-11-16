// client/src/pages/MyPostsPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../context/AuthContext'; // Authenticated api

// Yeh HomePage.jsx ki copy hai, lekin API call different hai
const MyPostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyPosts = async () => {
        try {
            setLoading(true);
            // Naya API route call karein
            const response = await api.get('/posts/my-posts'); 
            setPosts(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching your posts.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    // Baaki UI bilkul HomePage jaisa hai
    if (loading) {
        return (
            <div style={{...styles.loading, ...styles.container}}>
                <div style={styles.spinner}></div>
                <p>Loading your posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{...styles.error, ...styles.container}}>
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={fetchMyPosts} style={styles.retryButton}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>My Posts</h1>
            
            {posts.length === 0 && (
                <p style={styles.noResults}>You haven't created any posts yet.</p>
            )}

            <div style={styles.postsGrid}>
                {posts.map(post => (
                    <div key={post._id} style={styles.postCard}>
                        {post.featuredImage && post.featuredImage.url && (
                            <img
                                src={post.featuredImage.url}
                                alt={post.title}
                                style={styles.postImage}
                            />
                        )}
                        <div style={styles.postContent}>
                            <h2 style={styles.postTitle}>{post.title}</h2>
                            <div style={styles.postMeta}>
                                <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p style={styles.postExcerpt}>
                                {post.content.length > 150
                                    ? `${post.content.substring(0, 150)}...`
                                    : post.content
                                }
                            </p>
                            <div style={styles.postActions}>
                                <Link
                                    to={`/post/${post._id}`}
                                    style={styles.readMore}
                                >
                                    View/Edit Post →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Styles (HomePage se copy kiye gaye)
const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
    title: { textAlign: 'center', marginBottom: '30px', color: '#333' },
    loading: { textAlign: 'center', padding: '60px 20px' },
    spinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #007bff', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' },
    error: { textAlign: 'center', padding: '60px 20px', color: '#dc3545' },
    retryButton: { marginTop: '20px', padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    noResults: { textAlign: 'center', color: '#666', fontSize: '18px', padding: '40px 20px' },
    postsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' },
    postCard: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' },
    postImage: { width: '100%', height: '200px', objectFit: 'cover' },
    postContent: { padding: '20px' },
    postTitle: { margin: '0 0 15px 0', color: '#333', fontSize: '1.4rem' },
    postMeta: { marginBottom: '15px', fontSize: '14px', color: '#666' },
    postExcerpt: { color: '#555', lineHeight: '1.6', marginBottom: '15px' },
    postActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    readMore: { color: '#007bff', textDecoration: 'none', fontWeight: '500', fontSize: '16px' }
};

export default MyPostsPage;