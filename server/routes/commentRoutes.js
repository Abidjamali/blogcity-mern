// server/routes/commentRoutes.js

import express from 'express';
import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';
import mongoose from 'mongoose';

const router = express.Router();

// Helper function to build hierarchical comment tree
const buildCommentTree = (comments) => {
    const commentMap = {};
    const rootComments = [];

    // Create a map for quick lookup
    comments.forEach(comment => {
        commentMap[comment._id.toString()] = {
            ...comment.toObject(),
            replies: []
        };
    });

    // Build the tree structure
    comments.forEach(comment => {
        const commentId = comment._id.toString();
        const parentId = comment.parentId ? comment.parentId.toString() : null;
        
        if (parentId && commentMap[parentId]) {
            // This is a reply
            commentMap[parentId].replies.push(commentMap[commentId]);
        } else {
            // This is a root comment
            rootComments.push(commentMap[commentId]);
        }
    });

    // Sort replies by creation date
    rootComments.forEach(comment => {
        comment.replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    // Sort root comments by creation date (newest first)
    rootComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return rootComments;
};

// GET: Saare comments fetch karo (optional - admin use ke liye)
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find({}).populate('postId', 'title').sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
});

// GET: Specific post ke saare comments fetch karo (with replies)
router.get('/post/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({ message: 'Invalid Post ID' });
        }

        const comments = await Comment.find({
            postId: postId,
            isApproved: true
        }).sort({ createdAt: -1 });

        const commentTree = buildCommentTree(comments);
        res.status(200).json(commentTree);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
});

// GET: Fetch replies for a specific comment
router.get('/:commentId/replies', async (req, res) => {
    try {
        const { commentId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(404).json({ message: 'Invalid Comment ID' });
        }

        const replies = await Comment.find({
            parentId: commentId,
            isApproved: true
        }).sort({ createdAt: 1 }); // Oldest replies first

        res.status(200).json(replies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching replies', error: error.message });
    }
});

// POST: Naya comment create karo (supports both comments and replies)
router.post('/', async (req, res) => {
    try {
        const { postId, authorName, authorEmail, content, parentId } = req.body;

        // Validation
        if (!postId || !authorName || !authorEmail || !content) {
            return res.status(400).json({
                message: 'All fields (postId, authorName, authorEmail, content) are required.'
            });
        }

        // Check if post exists
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({ message: 'Invalid Post ID' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // If this is a reply, validate parent comment
        let parentComment = null;
        if (parentId) {
            if (!mongoose.Types.ObjectId.isValid(parentId)) {
                return res.status(404).json({ message: 'Invalid Parent Comment ID' });
            }
            
            parentComment = await Comment.findById(parentId);
            if (!parentComment) {
                return res.status(404).json({ message: 'Parent comment not found' });
            }

            // Ensure parent comment belongs to the same post
            if (parentComment.postId.toString() !== postId) {
                return res.status(400).json({ message: 'Parent comment does not belong to this post' });
            }
        }

        // Naya comment create karo
        const newComment = new Comment({
            postId,
            parentId: parentId || null, // null for top-level comments
            authorName: authorName.trim(),
            authorEmail: authorEmail.trim().toLowerCase(),
            content: content.trim(),
            isApproved: true // Auto-approve for now
        });

        const savedComment = await newComment.save();

        // If this is a reply, update the parent's reply count
        if (parentComment) {
            await Comment.findByIdAndUpdate(parentId, {
                $inc: { replyCount: 1 }
            });
        }

        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
});

// DELETE: Comment delete karo (and its replies)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid Comment ID' });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // If this comment has replies, delete them too
        if (comment.replyCount > 0) {
            await Comment.deleteMany({ parentId: id });
        }

        // If this comment is a reply, decrement the parent's reply count
        if (comment.parentId) {
            await Comment.findByIdAndUpdate(comment.parentId, {
                $inc: { replyCount: -1 }
            });
        }

        await Comment.findByIdAndDelete(id);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
});

// PUT: Comment update karo (edit karne ke liye)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid Comment ID' });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { content: content.trim() },
            { new: true, runValidators: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
});

export default router;