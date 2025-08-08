import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
        minlength: [10, 'Content must be at least 10 characters']
    },
    excerpt: {
        type: String,
        maxlength: [300, 'Excerpt cannot be more than 300 characters']
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/400x300?text=Blog+Post'
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
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
        ]
    },
    tags: [{
        type: String,
        trim: true
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    bookmarks: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    bookmarksCount: {
        type: Number,
        default: 0
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: [500, 'Comment cannot be more than 500 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    commentsCount: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    readTime: {
        type: Number, // in minutes
        default: 1
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Calculate read time based on content length
postSchema.pre('save', function (next) {
    if (this.isModified('content')) {
        const wordsPerMinute = 200;
        const words = this.content.split(' ').length;
        this.readTime = Math.ceil(words / wordsPerMinute);
    }

    // Generate excerpt if not provided
    if (!this.excerpt && this.content) {
        this.excerpt = this.content.substring(0, 150) + '...';
    }

    next();
});

// Update counts
postSchema.pre('save', function (next) {
    this.likesCount = this.likes.length;
    this.bookmarksCount = this.bookmarks.length;
    this.commentsCount = this.comments.length;
    next();
});

// Indexes for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ featured: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

const Post = mongoose.model('Post', postSchema);

export default Post;
