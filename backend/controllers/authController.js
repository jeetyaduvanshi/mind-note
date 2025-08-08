import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { sendTokenResponse } from '../utils/auth.js';
import { asyncHandler, sendError, sendSuccess } from '../utils/helpers.js';

export const register = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, 'Validation failed', errors.array());
    }

    const { name, email, password, bio } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return sendError(res, 400, 'User already exists with this email');
    }

    const user = await User.create({
        name,
        email,
        password,
        bio
    });

    sendTokenResponse(user, 201, res);
});

export const login = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, 'Validation failed', errors.array());
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return sendError(res, 401, 'Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return sendError(res, 401, 'Invalid credentials');
    }

    if (!user.isActive) {
        return sendError(res, 401, 'Account is deactivated');
    }

    sendTokenResponse(user, 200, res);
});

export const logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    sendSuccess(res, 'User logged out successfully');
});

export const getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)
        .populate('likedPosts', 'title')
        .populate('bookmarkedPosts', 'title');

    sendSuccess(res, 'User profile retrieved successfully', { user });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, 'Validation failed', errors.array());
    }

    const fieldsToUpdate = {
        name: req.body.name,
        bio: req.body.bio,
        avatar: req.body.avatar
    };

    Object.keys(fieldsToUpdate).forEach(key => {
        if (fieldsToUpdate[key] === undefined) {
            delete fieldsToUpdate[key];
        }
    });

    const user = await User.findByIdAndUpdate(
        req.user._id,
        fieldsToUpdate,
        {
            new: true,
            runValidators: true
        }
    );

    sendSuccess(res, 'Profile updated successfully', { user });
});

export const changePassword = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, 'Validation failed', errors.array());
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        return sendError(res, 400, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, 'Password changed successfully');
});

export const getUserById = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
        .populate('followers', 'name avatar')
        .populate('following', 'name avatar');

    if (!user) {
        return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 'User retrieved successfully', { user });
});

export const toggleFollow = asyncHandler(async (req, res, next) => {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
        return sendError(res, 404, 'User not found');
    }

    if (userToFollow._id.toString() === currentUser._id.toString()) {
        return sendError(res, 400, 'You cannot follow yourself');
    }

    const isFollowing = currentUser.following.includes(userToFollow._id);

    if (isFollowing) {
        currentUser.following = currentUser.following.filter(
            id => id.toString() !== userToFollow._id.toString()
        );
        userToFollow.followers = userToFollow.followers.filter(
            id => id.toString() !== currentUser._id.toString()
        );
    } else {
        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    sendSuccess(res, isFollowing ? 'User unfollowed' : 'User followed', {
        isFollowing: !isFollowing
    });
});
