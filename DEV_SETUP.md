# 🚀 Development Setup Guide

## 🎯 Blog API Development

Since we use Vercel Edge Functions for the blog API, you have two options for local development:

### Option 1: Use Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Start development server with API functions
vercel dev
```

### Option 2: Regular Development (Mock Data)
```bash
# Regular Vite development server
npm run dev
```
*Note: This will show mock blog data since API functions don't work in regular dev mode*

## 🔧 Environment Variables

Make sure your `.env` file has:
```
VITE_NOTION_TOKEN=your_notion_token
VITE_NOTION_DATABASE_ID=your_database_id
```

## 🎯 API Endpoints

- **Development**: `http://localhost:3000/api/blog` (with vercel dev)
- **Production**: `https://your-domain.vercel.app/api/blog`

## 🚀 Deployment

```bash
# Deploy to Vercel
vercel --prod
```

The API functions automatically work in production!