// server/middleware/multerMiddleware.js

import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    
    // --- YEH LINE HUMNE 20MB KAR DI HAI ---
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Hum 'featuredImage' naam ki field se ek single file expect karenge
export const uploadImage = upload.single('featuredImage');