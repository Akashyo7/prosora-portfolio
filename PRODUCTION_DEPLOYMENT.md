# 🚀 Production Deployment Guide

## 📋 **Environment Variables for Vercel**

You need to set these **4 environment variables** in your Vercel dashboard:

### Server-side Variables:
- **Variable Name:** `NOTION_TOKEN`
- **Value:** `your_notion_token_here`

- **Variable Name:** `NOTION_DATABASE_ID`  
- **Value:** `your_database_id_here`

### Client-side Variables:
- **Variable Name:** `VITE_NOTION_TOKEN`
- **Value:** `your_notion_token_here`

- **Variable Name:** `VITE_NOTION_DATABASE_ID`
- **Value:** `your_database_id_here`

## 🔧 **How to Set in Vercel:**

1. **Go to:** https://vercel.com/dashboard
2. **Select your project:** prosora-portfolio
3. **Go to:** Settings → Environment Variables
4. **Add each variable above** (set for Production, Preview, Development)
5. **Redeploy** your application

## ✅ **Expected Result:**

After deployment, your website will show:
- ✅ "Building a Modern Portfolio with AI: A Developer's Journey"
- ✅ "#Day3OfNoCode"
- ✅ "#Day2OfNoCode" 
- ✅ "#Day1OfNoCode"
- ✅ "Blockchain Technology"

## 🧪 **Verification:**

1. **Check deployment logs** for any errors
2. **Visit your live site** and check the blog section
3. **Open browser console** to see API logs
4. **Click on blog posts** to verify Notion links work

---
**Note:** This file contains sensitive information and should not be committed to Git.