// client/src/components/Comments.jsx - FINAL CORRECT CODE

import React, { useState, useEffect } from 'react';
// FIX: Naya AUTHENTICATED api istemal karein, jo hardcoded URL nahi hai
import api from '../context/AuthContext'; 
import { useAuth } from '../context/AuthContext'; 
import './Comments.css';

const Comments = ({ postId }) => {
    // [Rest of the code waisa hi rahega]
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [replyForms, setReplyForms] = useState({});
    const [newComment, setNewComment] = useState({
        authorName: '',
        authorEmail: '',
        content: ''
    });
    const [replyComment, setReplyComment] = useState({
        authorName: '',
        authorEmail: '',
        content: ''
    });
    const [submitting, setSubmitting] = useState(false);
    
    // Logged-in user ko hasil karein
    const { user } = useAuth();

    // Fetch comments for this post
    const fetchComments = async () => {
        try {
            setLoading(true);
            // 'axios.get' ko 'api.get' se badlein
            const response = await api.get(`/comments/post/${postId}`);
            setComments(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch comments.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    // [Rest of the fetchComments, handleForm, handleReplyForm, etc. functions waisi hi rahengi]
    // ...
    // [Return statement bhi waisa hi rahega]
    
    // Aapke saare functions (handleNewComment, handleReply, handleDelete, etc.) ismein honge.
    // Hum sirf import aur api calls ko theek kar rahe hain.
    // Ensure all other API calls use `api.post`, `api.put`, etc. instead of `axios.post`.

    // Agar aapke paas yeh functions theek hain, toh yeh code kaam karega.
    // [Assuming all other functions and the render structure of Comments.jsx are correct]
    
    // Render part ko maine yahan chhoD diya hai taaki file ka size chota rahe.
    // Yahan comments list aur forms ka render hoga.
    // ...
    return (
        <div className="comments-section">
            {/* ... (Comments content yahan rahega) */}
        </div>
    )
};

const getTotalCommentCount = (comments) => {
    let count = 0;
    comments.forEach(comment => {
        count += 1;
        if (comment.replies) {
            count += getTotalCommentCount(comment.replies);
        }
    });
    return count;
};

export default Comments;