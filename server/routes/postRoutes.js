// server/routes/postRoutes.js

import express from 'express';
import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';
import Like from '../models/likeModel.js';
import mongoose from 'mongoose';
import { uploadImage } from '../middleware/multerMiddleware.js'; // <-- Multer import kiya
import cloudinary from '../config/cloudinaryConfig.js'; // <-- Cloudinary config import ki
import { verifyToken, optionalAuth } from '../middleware/authMiddleware.js'; // <-- Auth middleware import kiya
const router = express.Router();

// Helper Function (Data URL banane ke liye)
// Multer image ko 'buffer' (raw data) mein deta hai, Cloudinary ko Data URL chahiye
function bufferToDataUrl(buffer, mimeType) {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

// --- API Routes ---

// 1. GET: Saare posts fetch karo (Optional auth for user info)
router.get('/', optionalAuth, async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
});

// 2. GET: Ek single post fetch karo (ID se) (Optional auth for user info)
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid Post ID' });
        }
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching single post', error: error.message });
    }
});

// 3. POST: Naya post create karo (Authentication required)
// Pehle 'uploadImage' middleware chalega, phir hamara function
router.post('/', verifyToken, uploadImage, async (req, res) => {
    try {
        const { title, content, author } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and Content are required.' });
        }

        let featuredImage = { public_id: null, url: null };

        // Step 1: Check karo agar image upload hui hai
        if (req.file) {
            const fileDataUrl = bufferToDataUrl(req.file.buffer, req.file.mimetype);
            
            const uploadResult = await cloudinary.uploader.upload(fileDataUrl, {
                folder: 'BlogCity',
            });

            featuredImage = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            };
        }

        // Step 3: Naya post database mein save karo (image ke sath)
        const newPost = new Post({
            title,
            content,
            author: req.user.username, // Use authenticated user's username
            user: req.user._id, // Associate with authenticated user
            featuredImage,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
});

// 4. PUT: Ek post ko update karo (ID se) (Authentication required)
router.put('/:id', verifyToken, uploadImage, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid Post ID' });
        }

        // Find the post first to check ownership
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the authenticated user owns this post
        if (post.user && post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        let updateData = { title, content, author: req.user.username };

        // Check karo agar NAYI image upload hui hai
        if (req.file) {
            // Pehle purani image (agar hai) toh delete karo
            if (post.featuredImage && post.featuredImage.public_id) {
                await cloudinary.uploader.destroy(post.featuredImage.public_id);
            }

            // Ab nayi image upload karo
            const fileDataUrl = bufferToDataUrl(req.file.buffer, req.file.mimetype);
            const uploadResult = await cloudinary.uploader.upload(fileDataUrl, {
                folder: 'BlogCity',
            });

            // Update data mein nayi image add karo
            updateData.featuredImage = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            };
        }

        // Post ko update karo
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error: error.message });
    }
});

// 5. DELETE: Ek post ko delete karo (ID se) (Authentication required)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid Post ID' });
        }

        // Step 1: Post ko database se dhoondo
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the authenticated user owns this post
        if (post.user && post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        // Step 2: Delete comments associated with this post
        await Comment.deleteMany({ postId: id });

        // Step 3: Delete likes associated with this post
        await Like.deleteMany({ post: id });

        // Step 4: Agar post ki image hai, toh usse Cloudinary se delete karo
        if (post.featuredImage && post.featuredImage.public_id) {
            await cloudinary.uploader.destroy(post.featuredImage.public_id);
        }

        // Step 5: Ab post ko database se delete karo
        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
});

// 6. GET: Get posts by current user (new route)
router.get('/my-posts', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user posts', error: error.message });
    }
});

// 7. POST: Like a post
router.post('/:id/like', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid Post ID' });
        }

        // Check if post exists
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user already liked this post
        const existingLike = await Like.findOne({
            user: req.user._id,
            post: id
        });

        if (existingLike) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        // Create new like
        const newLike = new Like({
            user: req.user._id,
            post: id
        });

        await newLike.save();

        // Get total like count
        const likeCount = await Like.countDocuments({ post: id });

        res.status(201).json({
            message: 'Post liked successfully',
            likeCount
        });

    } catch (error) {
        res.status(500).json({ message: 'Error liking post', error: error.message });
    }
});

// 8. DELETE: Unlike a post
router.delete('/:id/like', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid Post ID' });
        }

        // Check if post exists
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find and delete the like
        const like = await Like.findOne({
            user: req.user._id,
            post: id
        });

        if (!like) {
            return res.status(404).json({ message: 'You have not liked this post' });
        }

        await Like.findByIdAndDelete(like._id);

        // Get total like count
        const likeCount = await Like.countDocuments({ post: id });

        res.status(200).json({
            message: 'Post unliked successfully',
            likeCount
        });

    } catch (error) {
        res.status(500).json({ message: 'Error unliking post', error: error.message });
    }
});

// 9. GET: Get like count and user's like status for a post
router.get('/:id/like-info', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid Post ID' });
        }

        // Check if post exists
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Get total like count (this is always available)
        const likeCount = await Like.countDocuments({ post: id });

        // Check if current user has liked this post (only if user is logged in)
        let isLiked = false;
        if (req.user) {
            const userLike = await Like.findOne({
                user: req.user._id,
                post: id
            });
            isLiked = !!userLike;
        }

        res.status(200).json({
            likeCount,
            isLiked
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching like info', error: error.message });
    }
});

export default router;