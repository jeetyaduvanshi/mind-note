import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/error.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:5173', // Vite dev server
    'https://localhost:3000',
    'https://localhost:5173'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        console.log('CORS request from origin:', origin);
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow all Vercel domains
        if (origin && origin.includes('.vercel.app')) {
            console.log('Allowing Vercel domain:', origin);
            return callback(null, true);
        }
        
        // Allow specific origins
        if (allowedOrigins.includes(origin)) {
            console.log('Allowing configured origin:', origin);
            return callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Blog Backend API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            posts: '/api/posts',
            health: '/api/health'
        }
    });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`
    🚀 Server running in ${process.env.NODE_ENV} mode
    📡 Listening on port ${PORT}
    🌐 API available at http://localhost:${PORT}
    📋 Health check: http://localhost:${PORT}/api/health
    `);
});

export default app;
