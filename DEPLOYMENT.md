# Deployment Guide

This guide will help you deploy the React Blog Website to Vercel (frontend) and Render (backend).

## Prerequisites

1. GitHub account
2. Vercel account (sign up at vercel.com)
3. Render account (sign up at render.com)
4. MongoDB Atlas account for production database

## Step 1: Push to GitHub

1. Make sure your project is committed and pushed to GitHub
2. Create a new repository on GitHub if you haven't already
3. Push your code:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

## Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `blog-backend` (or your preferred name)
   - **Runtime**: `Node`
   - **Build Command**: `npm install` (or leave empty)
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
   
   **Important**: Make sure to set the Root Directory to `backend` since your backend code is in a subdirectory.

5. Set Environment Variables in Render:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (generate one)
   - `CLIENT_URL`: Your Vercel frontend URL (add this after frontend deployment)

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Note your backend URL (e.g., `https://your-app.onrender.com`)

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Set Environment Variables in Vercel:
   - `VITE_API_URL`: Your Render backend URL + `/api` (e.g., `https://your-app.onrender.com/api`)

6. Click "Deploy"
7. Wait for deployment to complete
8. Note your frontend URL

## Step 4: Update Backend CORS

1. Go back to your Render backend service
2. Update the `CLIENT_URL` environment variable with your Vercel frontend URL
3. Redeploy the backend service

## Step 5: Test the Deployment

1. Visit your frontend URL
2. Test user registration and login
3. Test creating and viewing blog posts
4. Verify all API calls are working correctly

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogdb
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `CLIENT_URL` in backend matches your Vercel URL exactly
2. **API Not Found**: Verify `VITE_API_URL` includes `/api` at the end
3. **Database Connection**: Check MongoDB Atlas network access and connection string
4. **Build Failures**: Check that all dependencies are in `package.json`

### Render Free Tier Limitations:
- Service may sleep after 15 minutes of inactivity
- 750 hours of runtime per month
- Cold start delays when service wakes up

## Custom Domain (Optional)

### Vercel:
1. Go to your project settings
2. Add your custom domain
3. Follow DNS configuration instructions

### Render:
1. Go to your service settings
2. Add custom domain
3. Configure DNS records as instructed

## Monitoring

- **Vercel**: Check deployment logs in the Vercel dashboard
- **Render**: Monitor service logs and metrics in Render dashboard
- Set up error tracking (e.g., Sentry) for production monitoring

## Security Notes

1. Never commit `.env` files to version control
2. Use strong JWT secrets
3. Enable MongoDB Atlas IP whitelist
4. Consider rate limiting for production
5. Use HTTPS only in production

## Image Upload Functionality

Your blog includes basic image upload functionality:

### Current Setup:
- Images are stored as URLs in the database
- Default placeholder images are used
- Upload functionality is implemented but optional

### To Enable Image Uploads (Optional):
1. The backend includes upload routes at `/api/upload/image`
2. Images are stored locally in the `uploads/` directory
3. For production, consider using cloud storage (Cloudinary, AWS S3, etc.)

### Note:
- Render's free tier has ephemeral file storage
- Uploaded files may be deleted when the service restarts
- For persistent storage, integrate with cloud storage services

## Support

If you encounter issues:
1. Check the deployment logs
2. Verify environment variables are set correctly
3. Test API endpoints directly
4. Check database connectivity
