# Blog Website - Full Stack Application

This is a full-stack blog application with React frontend and Node.js/Express backend.

🚀 **Deployment Status**: Ready for production deployment on Vercel (frontend) and Render (backend).

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Profile management
- Password change functionality
- User following system

### Blog Management
- Create, read, update, delete blog posts
- Like and bookmark posts
- Comment system
- Category-based filtering
- Search functionality
- Pagination

### User Features
- Personal post management
- View liked and bookmarked posts
- Author profiles
- Following system

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled
- Input validation with express-validator

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGODB_URI=mongodb+srv://admin:QtYFywIIJuol0gFD@cluster0.6azwx.mongodb.net/blog-website?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   JWT_EXPIRE=7d
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will be available at: `http://localhost:5001`

### Frontend Setup

1. Navigate to the root directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at: `http://localhost:5173`

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user (requires auth)
- `GET /me` - Get current user profile (requires auth)
- `PUT /profile` - Update user profile (requires auth)
- `PUT /change-password` - Change user password (requires auth)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id/follow` - Follow/unfollow user (requires auth)

### Posts Routes (`/api/posts`)

- `GET /` - Get all posts (with optional filters)
- `GET /:id` - Get single post by ID
- `POST /` - Create new post (requires auth)
- `PUT /:id` - Update post (requires auth, ownership)
- `DELETE /:id` - Delete post (requires auth, ownership)
- `PUT /:id/like` - Like/unlike post (requires auth)
- `PUT /:id/bookmark` - Bookmark/unbookmark post (requires auth)
- `POST /:id/comments` - Add comment to post (requires auth)
- `DELETE /:id/comments/:commentId` - Delete comment (requires auth, ownership)
- `GET /user/my-posts` - Get current user's posts (requires auth)
- `GET /user/liked` - Get user's liked posts (requires auth)
- `GET /user/bookmarked` - Get user's bookmarked posts (requires auth)

## Database Schema

### User Model
- name, email, password (hashed)
- avatar, bio, role
- likedPosts[], bookmarkedPosts[]
- followers[], following[]
- timestamps

### Post Model
- title, content, excerpt, image
- category, tags[], author
- likes[], likesCount
- bookmarks[], bookmarksCount
- comments[], commentsCount
- views, status, readTime, featured
- timestamps

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Error handling middleware
- Route protection middleware

## Data Migration

All localStorage functionality has been migrated to the backend API:
- Blog posts are now stored in MongoDB
- User authentication replaces mock login
- Like/bookmark states are user-specific
- Author profiles are real user accounts

## Development Notes

- The backend runs on port 5001 to avoid conflicts
- MongoDB connection is configured for Atlas
- JWT tokens are stored in localStorage on the frontend
- All API calls include proper error handling
- Protected routes require authentication tokens

## Future Enhancements

- Image upload functionality with Cloudinary
- Real-time notifications
- Advanced search with indexing
- Email verification for registration
- Password reset functionality
- Admin dashboard
- Content moderation tools
