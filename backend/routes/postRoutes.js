import express from 'express';
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    toggleBookmark,
    addComment,
    deleteComment,
    getMyPosts,
    getLikedPosts,
    getBookmarkedPosts
} from '../controllers/postsController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import {
    createPostValidation,
    updatePostValidation,
    addCommentValidation
} from '../validators/postValidator.js';

const router = express.Router();

// Public routes with optional authentication
router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPost);

// Protected routes
router.use(authenticate); // All routes below require authentication

// Post CRUD operations
router.post('/', createPostValidation, createPost);
router.put('/:id', updatePostValidation, updatePost);
router.delete('/:id', deletePost);

// User interactions
router.put('/:id/like', toggleLike);
router.put('/:id/bookmark', toggleBookmark);

// Comments
router.post('/:id/comments', addCommentValidation, addComment);
router.delete('/:id/comments/:commentId', deleteComment);

// User-specific posts
router.get('/user/my-posts', getMyPosts);
router.get('/user/liked', getLikedPosts);
router.get('/user/bookmarked', getBookmarkedPosts);

export default router;
