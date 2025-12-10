// server/utils/dataUrl.js

// Multer image ko 'buffer' (raw data) mein deta hai, Cloudinary ko Data URL chahiye
export function bufferToDataUrl(buffer, mimeType) {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}