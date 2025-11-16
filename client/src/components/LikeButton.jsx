import React, { useState, useEffect } from 'react';
import api from '../context/AuthContext'; // Use authenticated API instance
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import './LikeButton.css';

const LikeButton = ({ postId }) => {
    const { user } = useAuth();
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch like information when component mounts
    useEffect(() => {
        fetchLikeInfo();
    }, [user, postId]);

    const fetchLikeInfo = async () => {
        try {
            const response = await api.get(`/posts/${postId}/like-info`);
            setLikeCount(response.data.likeCount);
            setIsLiked(response.data.isLiked);
            console.log('Like info fetched:', response.data); // Debug log
        } catch (err) {
            console.error('Error fetching like info:', err);
            // Set default values if user is not logged in
            setLikeCount(0);
            setIsLiked(false);
        }
    };

    const handleLikeClick = async () => {
        if (!user) {
            setError('Please login to like posts');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            let response;
            if (isLiked) {
                // Unlike the post
                response = await api.delete(`/posts/${postId}/like`);
                console.log('Unlike response:', response.data); // Debug log
                setIsLiked(false);
                setLikeCount(response.data.likeCount);
            } else {
                // Like the post
                response = await api.post(`/posts/${postId}/like`);
                console.log('Like response:', response.data); // Debug log
                setIsLiked(true);
                setLikeCount(response.data.likeCount);
            }
        } catch (err) {
            console.error('Error toggling like:', err);
            setError(err.response?.data?.message || 'Error updating like');
        } finally {
            setLoading(false);
        }
    };

    // Always render the heart, but disable if not logged in
    const heartColor = isLiked ? '#e0245e' : '#666';
    const heartFill = isLiked ? '#e0245e' : 'none';

    if (!user) {
        return (
            <div className="like-section">
                <div className="like-info">
                    <Heart
                        size={20}
                        style={{
                            fill: '#ccc',
                            stroke: '#ccc'
                        }}
                    />
                    <span>{likeCount} likes</span>
                    <p className="login-prompt">Login to like this post</p>
                </div>
            </div>
        );
    }

    return (
        <div className="like-section">
            <div className="like-info">
                <Heart
                    size={24}
                    className={`like-button ${isLiked ? 'liked' : ''}`}
                    onClick={!loading ? handleLikeClick : null}
                    style={{
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fill: heartFill,
                        stroke: heartColor,
                        transition: 'all 0.2s ease'
                    }}
                />
                <span className="like-count">{likeCount} likes</span>
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default LikeButton;