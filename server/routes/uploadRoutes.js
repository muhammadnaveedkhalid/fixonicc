import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';

const router = express.Router();

// File filter (Optional additional check, CloudinaryStorage also has allowed_formats)
const fileFilter = (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Upload route
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        // Cloudinary returns the full URL in req.file.path
        const fileUrl = req.file.path; 
        // Determine type based on mimetype or Cloudinary response
        const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
        
        res.status(200).json({ 
            success: true, 
            url: fileUrl,
            type: fileType
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: error.message || 'Upload failed' });
    }
});

export default router;
