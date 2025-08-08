import { body } from 'express-validator';

const categories = [
    'Technology',
    'Lifestyle',
    'Travel',
    'Food',
    'Health',
    'Business',
    'Education',
    'Entertainment',
    'Sports',
    'Fashion',
    'Science',
    'Politics',
    'Other'
];

export const createPostValidation = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),

    body('content')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters long'),

    body('excerpt')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('Excerpt cannot be more than 300 characters'),

    body('category')
        .isIn(categories)
        .withMessage('Please select a valid category'),

    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),

    body('tags.*')
        .optional()
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Each tag must be between 1 and 30 characters'),

    body('image')
        .optional()
        .isURL()
        .withMessage('Image must be a valid URL'),

    body('status')
        .optional()
        .isIn(['draft', 'published', 'archived'])
        .withMessage('Status must be draft, published, or archived'),

    body('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean value')
];

export const updatePostValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),

    body('content')
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters long'),

    body('excerpt')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('Excerpt cannot be more than 300 characters'),

    body('category')
        .optional()
        .isIn(categories)
        .withMessage('Please select a valid category'),

    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),

    body('tags.*')
        .optional()
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Each tag must be between 1 and 30 characters'),

    body('image')
        .optional()
        .isURL()
        .withMessage('Image must be a valid URL'),

    body('status')
        .optional()
        .isIn(['draft', 'published', 'archived'])
        .withMessage('Status must be draft, published, or archived'),

    body('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean value')
];

export const addCommentValidation = [
    body('content')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Comment must be between 1 and 500 characters')
];
