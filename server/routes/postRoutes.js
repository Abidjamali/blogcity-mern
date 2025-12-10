// server/routes/postRoutes.js

import express from 'express';
import Post from '../models/postModel.js';
<<<<<<< HEAD
import mongoose from 'mongoose';
import { uploadImage } from '../middleware/multerMiddleware.js'; // <-- Multer import kiya
import cloudinary from '../config/cloudinaryConfig.js'; // <-- Cloudinary config import ki

=======
import Comment from '../models/commentModel.js';
import Like from '../models/likeModel.js';
import mongoose from 'mongoose';
import { uploadImage } from '../middleware/multerMiddleware.js'; // <-- Multer import kiya
import cloudinary from '../config/cloudinaryConfig.js'; // <-- Cloudinary config import ki
import { verifyToken, optionalAuth } from '../middleware/authMiddleware.js'; // <-- Auth middleware import kiya
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
const router = express.Router();

// Helper Function (Data URL banane ke liye)
// Multer image ko 'buffer' (raw data) mein deta hai, Cloudinary ko Data URL chahiye
function bufferToDataUrl(buffer, mimeType) {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

// --- API Routes ---

<<<<<<< HEAD
// 1. GET: Saare posts fetch karo (Yeh waisa hi hai)
router.get('/', async (req, res) => {
=======
// 1. GET: Saare posts fetch karo (Optional auth for user info)
router.get('/', optionalAuth, async (req, res) => {
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
});

<<<<<<< HEAD
// 2. GET: Ek single post fetch karo (ID se) (Yeh waisa hi hai)
router.get('/:id', async (req, res) => {
    // ... (purana code bilkul waisa hi rahega, copy paste kar sakte hain ya neeche se le lein)
=======
// 2. GET: Ek single post fetch karo (ID se) (Optional auth for user info)
router.get('/:id', optionalAuth, async (req, res) => {
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
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

<<<<<<< HEAD

// 3. POST: Naya post create karo (YEH UPDATE HUA HAI)
// Pehle 'uploadImage' middleware chalega, phir hamara function
router.post('/', uploadImage, async (req, res) => {
=======
// 3. POST: Naya post create karo (Authentication required)
// Pehle 'uploadImage' middleware chalega, phir hamara function
router.post('/', verifyToken, uploadImage, async (req, res) => {
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
    try {
        const { title, content, author } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and Content are required.' });
        }

        let featuredImage = { public_id: null, url: null };

        // Step 1: Check karo agar image upload hui hai
        if (req.file) {
<<<<<<< HEAD
            // req.file Multer se aa raha hai
            // Humne file ko memory mein save kiya tha (buffer)
            // Ab usse Data URL banayenge
            const fileDataUrl = bufferToDataUrl(req.file.buffer, req.file.mimetype);
            
            // Step 2: Cloudinary par upload karo
            const uploadResult = await cloudinary.uploader.upload(fileDataUrl, {
                folder: 'BlogCity', // Cloudinary mein 'BlogCity' naam ka folder ban jayega
=======
            const fileDataUrl = bufferToDataUrl(req.file.buffer, req.file.mimetype);
            
            const uploadResult = await cloudinary.uploader.upload(fileDataUrl, {
                folder: 'BlogCity',
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
            });

            featuredImage = {
                public_id: uploadResult.public_id,
<<<<<<< HEAD
                url: uploadResult.secure_url, // https wala URL
=======
                url: uploadResult.secure_url,
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
            };
        }

        // Step 3: Naya post database mein save karo (image ke sath)
        const newPost = new Post({
            title,
            content,
<<<<<<< HEAD
            author,
            featuredImage, // Yahan image ka URL aur ID save hoga
=======
            author: req.user.username, // Use authenticated user's username
            user: req.user._id, // Associate with authenticated user
            featuredImage,
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
});

<<<<<<< HEAD

// 4. PUT: Ek post ko update karo (ID se) (YEH UPDATE HUA HAI)
router.put('/:id', uploadImage, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author } = req.body;
=======
// 4. PUT: Ek post ko update karo (ID se) (Authentication required)
router.put('/:id', verifyToken, uploadImage, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid Post ID' });
        }

<<<<<<< HEAD
        let updateData = { title, content, author };
=======
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
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80

        // Check karo agar NAYI image upload hui hai
        if (req.file) {
            // Pehle purani image (agar hai) toh delete karo
<<<<<<< HEAD
            const oldPost = await Post.findById(id);
            if (oldPost.featuredImage && oldPost.featuredImage.public_id) {
                await cloudinary.uploader.destroy(oldPost.featuredImage.public_id);
=======
            if (post.featuredImage && post.featuredImage.public_id) {
                await cloudinary.uploader.destroy(post.featuredImage.public_id);
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
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

<<<<<<< HEAD
        // Post ko dhoondo aur update karo
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData, // Naya data
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

=======
        // Post ko update karo
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error: error.message });
    }
});

<<<<<<< HEAD

// 5. DELETE: Ek post ko delete karo (ID se) (YEH UPDATE HUA HAI)
router.delete('/:id', async (req, res) => {
=======
// 5. DELETE: Ek post ko delete karo (ID se) (Authentication required)
router.delete('/:id', verifyToken, async (req, res) => {
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
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

<<<<<<< HEAD
        // Step 2: Agar post ki image hai, toh usse Cloudinary se delete karo
=======
        // Check if the authenticated user owns this post
        if (post.user && post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        // Step 2: Delete comments associated with this post
        await Comment.deleteMany({ postId: id });

        // Step 3: Delete likes associated with this post
        await Like.deleteMany({ post: id });

        // Step 4: Agar post ki image hai, toh usse Cloudinary se delete karo
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
        if (post.featuredImage && post.featuredImage.public_id) {
            await cloudinary.uploader.destroy(post.featuredImage.public_id);
        }

<<<<<<< HEAD
        // Step 3: Ab post ko database se delete karo
=======
        // Step 5: Ab post ko database se delete karo
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
});

<<<<<<< HEAD
=======
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
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80

export default router;