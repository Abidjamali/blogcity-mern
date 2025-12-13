// client/src/components/LikeButton.jsx - FINAL CORRECT CODE

import React, { useState, useEffect } from 'react';
// FIX: Raw axios nahi, authenticated API instance use karein
import api from '../context/AuthContext'; 
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import './LikeButton.css';

const LikeButton = ({ postId }) => {
    // [Rest of the code waisa hi rahega. Ensure all API calls use `api.get/post/delete` instead of `axios.get/post/delete`]
    const { user } = useAuth();
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // [Rest of the functions waisi hi rahengi, bas `axios` ko `api` se badalna zaroori tha]

    // Fetch like information when component mounts
    useEffect(() => {
        fetchLikeInfo();
    }, [user, postId]);

    const fetchLikeInfo = async () => {
        try {
            // FIX: api.get use karein
            const response = await api.get(`/posts/${postId}/like-info`);
            setLikeCount(response.data.likeCount);
            setIsLiked(response.data.isLiked);
        } catch (err) {
            console.error('Error fetching like info:', err);
            setLikeCount(0);
            setIsLiked(false);
        }
    };

    const handleLikeClick = async () => {
        if (!user) {
            setError('Please login to like posts');
            return;
        }
        
        // [Rest of the handleLikeClick logic waisa hi rahega. Ensure it uses `api.post/delete`]
        try {
            setLoading(true);
            setError(null);

            if (isLiked) {
                // Unlike the post
                const response = await api.delete(`/posts/${postId}/like`); // FIX: api.delete
                setIsLiked(false);
                setLikeCount(response.data.likeCount);
            } else {
                // Like the post
                const response = await api.post(`/posts/${postId}/like`); // FIX: api.post
                setIsLiked(true);
                setLikeCount(response.data.likeCount);
            }
        } catch (err) {
            // ... (error handling)
        } finally {
            setLoading(false);
        }
    };
    
    // [Return statement waisa hi rahega]
    return (
        <div className="like-section">
            {/* ... (UI code) */}
        </div>
    );
};

export default LikeButton;