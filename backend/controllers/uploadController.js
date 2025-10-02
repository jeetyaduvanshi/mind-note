import { asyncHandler, sendError, sendSuccess } from '../utils/helpers.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload image
// @route   POST /api/upload/image
// @access  Private
export const uploadImage = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return sendError(res, 400, 'Please select an image to upload');
    }

    // Create the full URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    sendSuccess(res, 'Image uploaded successfully', {
        imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
    });
});

// @desc    Delete image
// @route   DELETE /api/upload/image/:filename
// @access  Private
export const deleteImage = asyncHandler(async (req, res, next) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return sendError(res, 404, 'Image not found');
    }

    try {
        // Delete the file
        fs.unlinkSync(filePath);
        sendSuccess(res, 'Image deleted successfully');
    } catch (error) {
        return sendError(res, 500, 'Error deleting image');
    }
});
