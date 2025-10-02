import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All upload routes require authentication
router.use(authenticate);

// Upload single image
router.post('/image', upload.single('image'), uploadImage);

// Delete image
router.delete('/image/:filename', deleteImage);

export default router;
