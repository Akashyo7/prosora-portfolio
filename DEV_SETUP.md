# 🚀 Development Setup Guide

## 🎯 Blog API Development with Real Notion Data

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**
```bash
vercel login
```
*Follow the prompts to authenticate with your Vercel account*

### **Step 3: Link Your Project**
```bash
vercel link
```
*This connects your local project to your Vercel deployment*

### **Step 4: Start Development with API**
```bash
vercel dev
```
*This starts a local server with API functions working*

### **Step 5: Test the API**
```bash
# In another terminal, test the API
node test-api.js
```

## 🔧 Environment Variables

Make sure your `.env` file has:
```
VITE_NOTION_TOKEN=ntn_556182459079nbVODH1A9uubv1oESeTBEiHRWz78wDS1bCL
VITE_NOTION_DATABASE_ID=23bcf31b151380cab3f0ff3635d58a65
```

## 🎯 API Endpoints

- **Development**: `http://localhost:3000/api/blog` (with vercel dev)
- **Production**: `https://your-domain.vercel.app/api/blog`

## 🐛 Troubleshooting

### If blog posts don't show:
1. Check browser console for errors
2. Test API directly: `curl http://localhost:3000/api/blog`
3. Run the test script: `node test-api.js`
4. Verify environment variables are loaded

### Common Issues:
- **404 on /api/blog**: Use `vercel dev` instead of `npm run dev`
- **Missing configuration**: Check `.env` file exists and has correct values
- **CORS errors**: The Edge Function should handle CORS automatically

## 🚀 Deployment

```bash
# Deploy to Vercel
vercel --prod
```

The API functions automatically work in production!