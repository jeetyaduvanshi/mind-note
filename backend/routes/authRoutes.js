import express from 'express';
import {
    register,
    login,
    logout,
    getMe,
    updateProfile,
    changePassword,
    getUserById,
    toggleFollow
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import {
    registerValidation,
    loginValidation,
    updateProfileValidation,
    changePasswordValidation
} from '../validators/authValidator.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/users/:id', getUserById);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfileValidation, updateProfile);
router.put('/change-password', changePasswordValidation, changePassword);
router.put('/users/:id/follow', toggleFollow);

export default router;
