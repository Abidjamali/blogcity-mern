// server/middleware/multerMiddleware.js

import multer from 'multer';

// Hum file ko disk par save nahi karenge, balkay memory (RAM) mein rakhenge
// Taake hum usse foran Cloudinary par bhej sakein
const storage = multer.memoryStorage();

// File filter (sirf images ko allow karo)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Image hai, accept karo
    } else {
        cb(new Error('Only image files are allowed!'), false); // Image nahi hai, reject karo
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Hum 'featuredImage' naam ki field se ek single file expect karenge
export const uploadImage = upload.single('featuredImage');