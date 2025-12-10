// server/middleware/multerMiddleware.js

import multer from 'multer';

<<<<<<< HEAD
// Hum file ko disk par save nahi karenge, balkay memory (RAM) mein rakhenge
// Taake hum usse foran Cloudinary par bhej sakein
const storage = multer.memoryStorage();

// File filter (sirf images ko allow karo)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Image hai, accept karo
    } else {
        cb(new Error('Only image files are allowed!'), false); // Image nahi hai, reject karo
=======
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
<<<<<<< HEAD
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
=======
    
    // --- YEH LINE HUMNE 20MB KAR DI HAI ---
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
});

// Hum 'featuredImage' naam ki field se ek single file expect karenge
export const uploadImage = upload.single('featuredImage');