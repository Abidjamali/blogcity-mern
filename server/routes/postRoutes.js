// server/routes/postRoutes.js

import express from 'express';
import Post from '../models/postModel.js';
import mongoose from 'mongoose';
import { uploadImage } from '../middleware/multerMiddleware.js'; // <-- Multer import kiya
import cloudinary from '../config/cloudinaryConfig.js'; // <-- Cloudinary config import ki

const router = express.Router();

// Helper Function (Data URL banane ke liye)
// Multer image ko 'buffer' (raw data) mein deta hai, Cloudinary ko Data URL chahiye
function bufferToDataUrl(buffer, mimeType) {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

// --- API Routes ---

// 1. GET: Saare posts fetch karo (Yeh waisa hi hai)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
});

// 2. GET: Ek single post fetch karo (ID se) (Yeh waisa hi hai)
router.get('/:id', async (req, res) => {
    // ... (purana code bilkul waisa hi rahega, copy paste kar sakte hain ya neeche se le lein)
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


// 3. POST: Naya post create karo (YEH UPDATE HUA HAI)
// Pehle 'uploadImage' middleware chalega, phir hamara function
router.post('/', uploadImage, async (req, res) => {
    try {
        const { title, content, author } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and Content are required.' });
        }

        let featuredImage = { public_id: null, url: null };

        // Step 1: Check karo agar image upload hui hai
        if (req.file) {
            // req.file Multer se aa raha hai
            // Humne file ko memory mein save kiya tha (buffer)
            // Ab usse Data URL banayenge
            const fileDataUrl = bufferToDataUrl(req.file.buffer, req.file.mimetype);
            
            // Step 2: Cloudinary par upload karo
            const uploadResult = await cloudinary.uploader.upload(fileDataUrl, {
                folder: 'BlogCity', // Cloudinary mein 'BlogCity' naam ka folder ban jayega
            });

            featuredImage = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url, // https wala URL
            };
        }

        // Step 3: Naya post database mein save karo (image ke sath)
        const newPost = new Post({
            title,
            content,
            author,
            featuredImage, // Yahan image ka URL aur ID save hoga
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
});


// 4. PUT: Ek post ko update karo (ID se) (YEH UPDATE HUA HAI)
router.put('/:id', uploadImage, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid Post ID' });
        }

        let updateData = { title, content, author };

        // Check karo agar NAYI image upload hui hai
        if (req.file) {
            // Pehle purani image (agar hai) toh delete karo
            const oldPost = await Post.findById(id);
            if (oldPost.featuredImage && oldPost.featuredImage.public_id) {
                await cloudinary.uploader.destroy(oldPost.featuredImage.public_id);
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

        // Post ko dhoondo aur update karo
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData, // Naya data
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error: error.message });
    }
});


// 5. DELETE: Ek post ko delete karo (ID se) (YEH UPDATE HUA HAI)
router.delete('/:id', async (req, res) => {
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

        // Step 2: Agar post ki image hai, toh usse Cloudinary se delete karo
        if (post.featuredImage && post.featuredImage.public_id) {
            await cloudinary.uploader.destroy(post.featuredImage.public_id);
        }

        // Step 3: Ab post ko database se delete karo
        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
});


export default router;