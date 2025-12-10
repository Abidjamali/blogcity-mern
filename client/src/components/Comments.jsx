// client/src/components/Comments.jsx

import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // <-- Purana axios HATA diya
import api from '../context/AuthContext'; // <-- Naya AUTHENTICATED api istemal karein
import { useAuth } from '../context/AuthContext'; // <-- Logged-in user ko check karne ke liye
import './Comments.css';

const Comments = ({ postId }) => {
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
    
    // Step 1: Logged-in user ko hasil karein
    const { user } = useAuth();

    // Fetch comments for this post
    const fetchComments = async () => {
        try {
            setLoading(true);
            // 'axios.get' ko 'api.get' se badlein
            const response = await api.get(`/comments/post/${postId}`);
            setComments(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching comments.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    // Handle form input changes for new comments
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewComment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle reply form input changes
    const handleReplyInputChange = (e) => {
        const { name, value } = e.target;
        setReplyComment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit new comment
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        let commentData;
        
        if (user) {
            // Agar user logged in hai, toh uska data use karein
            if (!newComment.content.trim()) {
                alert('Please write a comment.');
                setSubmitting(false);
                return;
            }
            commentData = {
                authorName: user.username, // Automatic username
                authorEmail: user.email,   // Automatic email
                content: newComment.content,
                postId
            };
        } else {
            // Agar logged in nahi hai, toh form se data lein
            if (!newComment.authorName.trim() || !newComment.authorEmail.trim() || !newComment.content.trim()) {
                alert('Please fill in all fields.');
                setSubmitting(false);
                return;
            }
            commentData = { ...newComment, postId };
        }

        try {
            // 'axios.post' ko 'api.post' se badlein
            await api.post('/comments', commentData);
            
            setNewComment({ authorName: '', authorEmail: '', content: '' });
            setShowForm(false);
            fetchComments();
            setSubmitting(false);
        } catch (err) {
            alert('Error creating comment. Please try again.');
            setSubmitting(false);
        }
    };

    // Submit reply
    const handleReplySubmit = async (e, parentId) => {
        e.preventDefault();
        setSubmitting(true);

        let replyData;
        
        if (user) {
            // Agar user logged in hai
            if (!replyComment.content.trim()) {
                alert('Please write a reply.');
                setSubmitting(false);
                return;
            }
            replyData = {
                authorName: user.username,
                authorEmail: user.email,
                content: replyComment.content,
                postId,
                parentId
            };
        } else {
            // Agar logged in nahi hai
            if (!replyComment.authorName.trim() || !replyComment.authorEmail.trim() || !replyComment.content.trim()) {
                alert('Please fill in all fields.');
                setSubmitting(false);
                return;
            }
            replyData = { ...replyComment, postId, parentId };
        }

        try {
            // 'axios.post' ko 'api.post' se badlein
            await api.post('/comments', replyData);
            
            setReplyComment({ authorName: '', authorEmail: '', content: '' });
            setReplyForms({ ...replyForms, [parentId]: false });
            fetchComments();
            setSubmitting(false);
        } catch (err) {
            alert('Error creating reply. Please try again.');
            setSubmitting(false);
        }
    };

    // Delete comment
    const handleDelete = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment? This will also delete all its replies.')) {
            try {
                // 'axios.delete' ko 'api.delete' se badlein (Token ke sath jayega)
                await api.delete(`/comments/${commentId}`);
                fetchComments(); 
            } catch (err) {
                // Backend se "Not Authorized" error yahan dikhayega
                alert(err.response?.data?.message || 'Error deleting comment.');
            }
        }
    };

    // Toggle reply form
    const toggleReplyForm = (commentId) => {
        setReplyForms(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
        if (!replyForms[commentId]) {
            setReplyComment({ authorName: '', authorEmail: '', content: '' });
        }
    };

    // Recursive component to render comment with replies
    // Step 2: 'user' ko as prop pass karein
    const CommentItem = ({ comment, isReply = false, user }) => {
        const hasReplies = comment.replies && comment.replies.length > 0;
        const showingReplyForm = replyForms[comment._id];

        // Step 3: Check karein ke logged-in user hi comment ka author hai
        const isAuthor = user && comment.authorName === user.username;

        return (
            <div className={`comment ${isReply ? 'comment-reply' : ''}`}>
                <div className="comment-header">
                    <div className="comment-author">
                        <strong>{comment.authorName}</strong>
                        <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {comment.parentId && (
                            <span className="reply-indicator">↳ Reply</span>
                        )}
                    </div>
                    {comment.replyCount > 0 && (
                        <span className="reply-count">{comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}</span>
                    )}
                </div>
                <div className="comment-content">
                    <p>{comment.content}</p>
                </div>
                <div className="comment-actions">
                    {/* Sirf non-logged-in users ya doosre users ko reply button dikhao */}
                    {/* (Aap yeh logic change bhi kar sakte hain agar khud ko reply karna hai) */}
                    {(!user || !isAuthor) && (
                         <button 
                            className="btn-reply-comment"
                            onClick={() => toggleReplyForm(comment._id)}
                            title="Reply to this comment"
                        >
                            {showingReplyForm ? 'Cancel Reply' : 'Reply'}
                        </button>
                    )}
                   
                    {/* Step 4: Delete button sirf author ko dikhao */}
                    {isAuthor && (
                        <button 
                            className="btn-delete-comment"
                            onClick={() => handleDelete(comment._id)}
                            title="Delete comment"
                        >
                            Delete
                        </button>
                    )}
                </div>

                {/* Reply Form */}
                {showingReplyForm && (
                    <div className="reply-form">
                        <h5>Reply to {comment.authorName}</h5>
                        <form onSubmit={(e) => handleReplySubmit(e, comment._id)}>
                            
                            {/* Step 5: Agar user logged in nahi hai, tabhi Name/Email poochein */}
                            {!user && (
                                <>
                                    <div className="form-group">
                                        <label htmlFor={`replyName-${comment._id}`}>Name *</label>
                                        <input
                                            type="text" id={`replyName-${comment._id}`} name="authorName"
                                            value={replyComment.authorName} onChange={handleReplyInputChange}
                                            required placeholder="Your name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`replyEmail-${comment._id}`}>Email *</label>
                                        <input
                                            type="email" id={`replyEmail-${comment._id}`} name="authorEmail"
                                            value={replyComment.authorEmail} onChange={handleReplyInputChange}
                                            required placeholder="your.email@example.com"
                                        />
                                    </div>
                                </>
                            )}
                            
                            <div className="form-group">
                                <label htmlFor={`replyContent-${comment._id}`}>Reply *</label>
                                <textarea
                                    id={`replyContent-${comment._id}`} name="content"
                                    value={replyComment.content} onChange={handleReplyInputChange}
                                    required rows="3" placeholder="Write your reply here..."
                                />
                            </div>

                            <button type="submit" className="btn-submit-reply" disabled={submitting}>
                                {submitting ? 'Posting Reply...' : 'Post Reply'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Render Replies */}
                {hasReplies && (
                    <div className="replies-container">
                        {comment.replies.map((reply) => (
                            // Step 2 (B): 'user' ko replies mein bhi pass karein
                            <CommentItem key={reply._id} comment={reply} isReply={true} user={user} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) { /* ... (loading code waisa hi hai) ... */ }
    if (error) { /* ... (error code waisa hi hai) ... */ }

    const totalComments = getTotalCommentCount(comments); // (Yeh function waisa hi hai)

    return (
        <div className="comments-section">
            <div className="comments-header">
                <h3>Comments ({totalComments})</h3>
                <button 
                    className="btn-add-comment"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Add Comment'}
                </button>
            </div>

            {/* Add Comment Form */}
            {showForm && (
                <div className="comment-form">
                    <h4>Add New Comment</h4>
                    <form onSubmit={handleSubmit}>

                        {/* Step 6: Agar user logged in nahi hai, tabhi Name/Email poochein */}
                        {!user && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="authorName">Name *</label>
                                    <input
                                        type="text" id="authorName" name="authorName"
                                        value={newComment.authorName} onChange={handleInputChange}
                                        required placeholder="Your name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="authorEmail">Email *</label>
                                    <input
                                        type="email" id="authorEmail" name="authorEmail"
                                        value={newComment.authorEmail} onChange={handleInputChange}
                                        required placeholder="your.email@example.com"
                                    />
                                </div>
                            </>
                        )}
                        
                        <div className="form-group">
                            <label htmlFor="content">Comment *</label>
                            <textarea
                                id="content" name="content"
                                value={newComment.content} onChange={handleInputChange}
                                required rows="4" placeholder="Write your comment here..."
                            />
                        </div>
                        <button type="submit" className="btn-submit" disabled={submitting}>
                            {submitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </form>
                </div>
            )}

            {/* Comments List */}
            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        // Step 2 (A): 'user' ko top-level comments mein pass karein
                        <CommentItem key={comment._id} comment={comment} user={user} />
                    ))
                )}
            </div>
        </div>
    );
};

// Helper function (yeh bahar hi rahega)
const getTotalCommentCount = (comments) => {
    let count = 0;
    comments.forEach(comment => {
        count += 1; // Count the comment itself
        if (comment.replies) {
            count += getTotalCommentCount(comment.replies);
        }
    });
    return count;
};

export default Comments;