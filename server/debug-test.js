// Debug test for multipart form data handling

import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Test route without multer
app.post('/test-json', (req, res) => {
    console.log('JSON request body:', req.body);
    res.json({ message: 'JSON works', body: req.body });
});

// Test route with multer
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

app.post('/test-multipart', upload.single('testfile'), (req, res) => {
    console.log('Multipart request body:', req.body);
    console.log('File info:', req.file);
    res.json({ 
        message: 'Multipart works', 
        body: req.body, 
        file: req.file ? {
            originalname: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        } : null
    });
});

app.listen(PORT, () => {
    console.log(`Debug server running on http://localhost:${PORT}`);
});