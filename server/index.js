// server/index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- Sirf EK baar import kiya
import mongoose from 'mongoose';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Variables
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- Middlewares ---

// 1. CORS Setup (Sabse pehle, aur sirf EK baar)
// Hum React app (localhost:5173) ko ijazat de rahe hain
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

// 2. Body Parsers (Sirf EK baar)
app.use(express.json()); // JSON data ke liye
app.use(express.urlencoded({ extended: true })); // Form data ke liye

// --- API Routes ---
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('BlogCity Server API is running!');
});

// --- Database Connection & Server Start ---
console.log("Connecting to MongoDB...");
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        
        // Sirf DB connect hone ke BAAD server start karo
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    });