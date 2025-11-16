// server/routes/authRoutes.js

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { verifyToken } from '../middleware/authMiddleware.js';

// --- YEH NAYE IMPORTS HAIN ---
import { uploadImage } from '../middleware/multerMiddleware.js';
import cloudinary from '../config/cloudinaryConfig.js';
import { bufferToDataUrl } from '../utils/dataUrl.js'; // (Yeh file humein banani hogi)

const router = express.Router();

// Generate JWT token (waisa hi hai)
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register new user (waisa hi hai)
router.post('/register', async (req, res) => {
    // ... (Aapka poora register code yahan waisa hi rahega)
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({ username, email, password });
        await newUser.save();
        const token = generateToken(newUser._id);
        res.status(201).json({
            message: 'User created',
            token,
            user: newUser.toJSON()
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user (waisa hi hai)
router.post('/login', async (req, res) => {
    // ... (Aapka poora login code yahan waisa hi rahega)
     try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const user = await User.findOne({ email }).select('+password'); // Password ko explicitly select karein
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user._id);
        res.json({
            message: 'Login successful',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current user profile (waisa hi hai)
router.get('/me', verifyToken, async (req, res) => {
    try {
        res.json({ user: req.user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- YEH ROUTE AB "UPGRADED" HAI ---
// Update user profile (Text + Image Upload)
// 1. verifyToken (check login)
// 2. uploadImage (multer middleware file ko pakdega)
router.put('/profile', verifyToken, uploadImage, async (req, res) => {
    try {
        const { username, email } = req.body; // Text fields
        const userId = req.user._id;

        // 1. Update text fields (username, email)
        const updatedUserData = {
            username: username || req.user.username,
            email: email || req.user.email
        };
        
        // 2. Check agar nayi image upload hui hai
        if (req.file) {
            // 2a. Purani image (agar default nahi hai) ko Cloudinary se delete karo
            const oldPublicId = req.user.profilePicture?.public_id;
            if (oldPublicId) {
                await cloudinary.uploader.destroy(oldPublicId);
            }
            
            // 2b. Nayi image ko Cloudinary par upload karo
            const fileDataUrl = bufferToDataUrl(req.file.buffer, req.file.mimetype);
            const uploadResult = await cloudinary.uploader.upload(fileDataUrl, {
                folder: 'BlogCity_Profiles', // Naya folder
            });

            // 2c. Nayi image ka URL aur ID save karo
            updatedUserData.profilePicture = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            };
        }

        // 3. Database mein user ko update karo
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedUserData,
            { new: true, runValidators: true } // 'new: true' se updated data wapis milta hai
        ).select('-password');

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            message: 'Server error during profile update' 
        });
    }
});

export default router;