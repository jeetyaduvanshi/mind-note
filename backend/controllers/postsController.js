import { validationResult } from 'express-validator';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { asyncHandler, sendError, sendSuccess, getPagination, buildSearchQuery } from '../utils/helpers.js';

export const getPosts = asyncHandler(async (req, res, next) => {
    const { page, limit, category, author, search, sort, featured } = req.query;

    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    let query = { status: 'published' };

    if (category && category !== 'All') {
        query.category = category;
    }

    if (author) {
        query.author = author;
    }

    if (featured === 'true') {
        query.featured = true;
    }

    // Search functionality
    if (search) {
        const searchQuery = buildSearchQuery(search, ['title', 'content', 'excerpt']);
        query = { ...query, ...searchQuery };
    }

    // Sort options
    let sortOptions = { createdAt: -1 }; // Default: newest first

    switch (sort) {
        case 'oldest':
            sortOptions = { createdAt: 1 };
            break;
        case 'popular':
            sortOptions = { likesCount: -1, views: -1 };
            break;
        case 'trending':
            sortOptions = { likesCount: -1, createdAt: -1 };
            break;
        case 'title':
            sortOptions = { title: 1 };
            break;
        default:
            sortOptions = { createdAt: -1 };
    }

    const posts = await Post.find(query)
        .populate('author', 'name avatar')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum);

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    // Add user interaction data if user is authenticated
    let postsWithUserData = posts;
    if (req.user) {
        const user = await User.findById(req.user._id);
        postsWithUserData = posts.map(post => {
            const postObj = post.toObject();
            postObj.isLiked = user.likedPosts.includes(post._id);
            postObj.isBookmarked = user.bookmarkedPosts.includes(post._id);
            return postObj;
        });
    }

    sendSuccess(res, 'Posts retrieved successfully', {
        posts: postsWithUserData,
        pagination: {
            currentPage: pageNum,
            totalPages,
            totalPosts: total,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
        }
    });
});

export const getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id)
        .populate('author', 'name avatar bio')
        .populate('comments.user', 'name avatar');

    if (!post) {
        return sendError(res, 404, 'Post not found');
    }

    post.views += 1;
    await post.save();

    let postData = post.toObject();
    if (req.user) {
        const user = await User.findById(req.user._id);
        postData.isLiked = user.likedPosts.includes(post._id);
        postData.isBookmarked = user.bookmarkedPosts.includes(post._id);
    }

    sendSuccess(res, 'Post retrieved successfully', { post: postData });
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, 'Validation failed', errors.array());
    }

    const postData = {
        ...req.body,
        author: req.user._id
    };

    const post = await Post.create(postData);
    await post.populate('author', 'name avatar');

    sendSuccess(res, 'Post created successfully', { post }, 201);
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = asyncHandler(async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, 'Validation failed', errors.array());
    }

    let post = await Post.findById(req.params.id);

    if (!post) {
        return sendError(res, 404, 'Post not found');
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return sendError(res, 403, 'Not authorized to update this post');
    }

    post = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    ).populate('author', 'name avatar');

    sendSuccess(res, 'Post updated successfully', { post });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return sendError(res, 404, 'Post not found');
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return sendError(res, 403, 'Not authorized to delete this post');
    }

    // Remove post from users' liked and bookmarked arrays
    await User.updateMany(
        { $or: [{ likedPosts: post._id }, { bookmarkedPosts: post._id }] },
        {
            $pull: {
                likedPosts: post._id,
                bookmarkedPosts: post._id
            }
        }
    );

    await Post.findByIdAndDelete(req.params.id);

    sendSuccess(res, 'Post deleted successfully');
});

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
export const toggleLike = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!post) {
        return sendError(res, 404, 'Post not found');
    }

    const likeIndex = post.likes.findIndex(like => like.user.toString() === req.user._id.toString());
    const userLikeIndex = user.likedPosts.indexOf(post._id);

    if (likeIndex > -1) {
        // Unlike
        post.likes.splice(likeIndex, 1);
        if (userLikeIndex > -1) {
            user.likedPosts.splice(userLikeIndex, 1);
        }
    } else {
        // Like
        post.likes.push({ user: req.user._id });
        if (userLikeIndex === -1) {
            user.likedPosts.push(post._id);
        }
    }

    // Maintain likesCount based on current likes length
    post.likesCount = post.likes.length;

    await post.save();
    await user.save();

    sendSuccess(res, likeIndex > -1 ? 'Post unliked' : 'Post liked', {
        isLiked: likeIndex === -1,
        likesCount: post.likesCount
    });
});

// @desc    Bookmark/Unbookmark post
// @route   PUT /api/posts/:id/bookmark
// @access  Private
export const toggleBookmark = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!post) {
        return sendError(res, 404, 'Post not found');
    }

    const bookmarkIndex = post.bookmarks.findIndex(bookmark => bookmark.user.toString() === req.user._id.toString());
    const userBookmarkIndex = user.bookmarkedPosts.indexOf(post._id);

    if (bookmarkIndex > -1) {
        // Remove bookmark
        post.bookmarks.splice(bookmarkIndex, 1);
        if (userBookmarkIndex > -1) {
            user.bookmarkedPosts.splice(userBookmarkIndex, 1);
        }
    } else {
        // Add bookmark
        post.bookmarks.push({ user: req.user._id });
        if (userBookmarkIndex === -1) {
            user.bookmarkedPosts.push(post._id);
        }
    }

    // Maintain bookmarksCount based on current bookmarks length
    post.bookmarksCount = post.bookmarks.length;

    await post.save();
    await user.save();

    sendSuccess(res, bookmarkIndex > -1 ? 'Post unbookmarked' : 'Post bookmarked', {
        isBookmarked: bookmarkIndex === -1,
        bookmarksCount: post.bookmarksCount
    });
});

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, 'Validation failed', errors.array());
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
        return sendError(res, 404, 'Post not found');
    }

    const comment = {
        user: req.user._id,
        content: req.body.content
    };

    post.comments.push(comment);
    await post.save();

    await post.populate('comments.user', 'name avatar');

    const newComment = post.comments[post.comments.length - 1];

    sendSuccess(res, 'Comment added successfully', { comment: newComment }, 201);
});

// @desc    Delete comment
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
export const deleteComment = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return sendError(res, 404, 'Post not found');
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
        return sendError(res, 404, 'Comment not found');
    }

    // Check ownership
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return sendError(res, 403, 'Not authorized to delete this comment');
    }

    post.comments.pull(req.params.commentId);
    await post.save();

    sendSuccess(res, 'Comment deleted successfully');
});

// @desc    Get user's posts
// @route   GET /api/posts/my-posts
// @access  Private
export const getMyPosts = asyncHandler(async (req, res, next) => {
    const { page, limit, status } = req.query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    let query = { author: req.user._id };

    if (status) {
        query.status = status;
    }

    const posts = await Post.find(query)
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    sendSuccess(res, 'Your posts retrieved successfully', {
        posts,
        pagination: {
            currentPage: pageNum,
            totalPages,
            totalPosts: total,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
        }
    });
});

// @desc    Get user's liked posts
// @route   GET /api/posts/liked
// @access  Private
export const getLikedPosts = asyncHandler(async (req, res, next) => {
    const { page, limit } = req.query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    const user = await User.findById(req.user._id).populate({
        path: 'likedPosts',
        populate: {
            path: 'author',
            select: 'name avatar'
        },
        options: {
            skip,
            limit: limitNum,
            sort: { createdAt: -1 }
        }
    });

    const totalLiked = user.likedPosts.length;
    const totalPages = Math.ceil(totalLiked / limitNum);

    sendSuccess(res, 'Liked posts retrieved successfully', {
        posts: user.likedPosts,
        pagination: {
            currentPage: pageNum,
            totalPages,
            totalPosts: totalLiked,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
        }
    });
});

// @desc    Get user's bookmarked posts
// @route   GET /api/posts/bookmarked
// @access  Private
export const getBookmarkedPosts = asyncHandler(async (req, res, next) => {
    const { page, limit } = req.query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    const user = await User.findById(req.user._id).populate({
        path: 'bookmarkedPosts',
        populate: {
            path: 'author',
            select: 'name avatar'
        },
        options: {
            skip,
            limit: limitNum,
            sort: { createdAt: -1 }
        }
    });

    const totalBookmarked = user.bookmarkedPosts.length;
    const totalPages = Math.ceil(totalBookmarked / limitNum);

    sendSuccess(res, 'Bookmarked posts retrieved successfully', {
        posts: user.bookmarkedPosts,
        pagination: {
            currentPage: pageNum,
            totalPages,
            totalPosts: totalBookmarked,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
        }
    });
});
