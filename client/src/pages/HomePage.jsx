import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../context/AuthContext';
import ShareButton from '../components/ShareButton';
import LikeButton from '../components/LikeButton';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/posts');
            setPosts(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching posts. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Loading posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.error}>
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={fetchPosts} style={styles.retryButton}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>All Blog Posts</h1>
                {user && (
                    <p style={styles.welcomeText}>Welcome back, {user.username}!</p>
                )}
            </div>

            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search posts by title, content, or author..."
                    style={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {filteredPosts.length === 0 && searchTerm && (
                <p style={styles.noResults}>No posts found matching "{searchTerm}"</p>
            )}

            <div style={styles.postsGrid}>
                {filteredPosts.map(post => (
                    <div key={post._id} style={styles.postCard}>
                        {post.featuredImage && post.featuredImage.url && (
                            <img
                                src={post.featuredImage.url}
                                alt={post.title}
                                style={styles.postImage}
                            />
                        )}
                        <div style={styles.postContent}>
                            <div style={styles.postHeader}>
                                <h2 style={styles.postTitle}>{post.title}</h2>
                                <ShareButton post={post} size="small" />
                            </div>
                            <div style={styles.postMeta}>
                                <span>📝 {post.author}</span>
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
                                    Read More →
                                </Link>
                                <LikeButton postId={post._id} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    title: {
        margin: '0 0 10px 0',
        color: '#333',
        fontSize: '2.5rem'
    },
    welcomeText: {
        color: '#666',
        fontSize: '16px',
        margin: 0
    },
    loading: {
        textAlign: 'center',
        padding: '60px 20px'
    },
    spinner: {
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
    },
    error: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#dc3545'
    },
    retryButton: {
        marginTop: '20px',
        padding: '10px 20px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    searchContainer: {
        marginBottom: '30px'
    },
    searchInput: {
        width: '100%',
        maxWidth: '500px',
        padding: '12px 20px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '25px',
        boxSizing: 'border-box',
        display: 'block',
        margin: '0 auto'
    },
    noResults: {
        textAlign: 'center',
        color: '#666',
        fontSize: '18px',
        padding: '40px 20px'
    },
    postsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '30px'
    },
    postCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    postImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover'
    },
    postContent: {
        padding: '20px'
    },
    postHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px',
        gap: '15px'
    },
    postTitle: {
        margin: 0,
        color: '#333',
        fontSize: '1.4rem',
        flex: 1
    },
    postMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
        fontSize: '14px',
        color: '#666'
    },
    postExcerpt: {
        color: '#555',
        lineHeight: '1.6',
        marginBottom: '15px'
    },
    postActions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    readMore: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: '500',
        fontSize: '16px'
    }
};

// Add CSS animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .post-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(0,0,0,0.15);
    }
    
    .read-more:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(styleSheet);

export default HomePage;