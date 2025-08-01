# 📝 Blog System - Simple & Bulletproof

## 🎯 How It Works

**Ultra-Simple Architecture:**
```
Notion Database → GitHub Action (hourly) → JSON file → Your website
```

## ✅ Benefits

- **No CORS issues**: GitHub Action runs server-side
- **Always works**: Static JSON file, no runtime API calls
- **Auto-updates**: Runs every hour automatically
- **Free forever**: Uses GitHub Actions (2000 minutes/month free)
- **Reliable**: Falls back to static data if Notion is down
- **Fast**: Instant loading, no API delays

## 🔧 Setup

### 1. Add Secrets to GitHub
Go to your GitHub repo → Settings → Secrets and variables → Actions

Add these secrets:
- `NOTION_TOKEN`: `ntn_556182459079nbVODH1A9uubv1oESeTBEiHRWz78wDS1bCL`
- `NOTION_DATABASE_ID`: `23bcf31b151380cab3f0ff3635d58a65`

### 2. Test Manual Run
Go to Actions tab → "Update Blog Posts" → "Run workflow" → Run workflow

### 2. Enable GitHub Actions
The workflow file is already created at `.github/workflows/update-blog.yml`

### 3. Manual Trigger (Optional)
Go to Actions tab → "Update Blog Posts" → "Run workflow"

## 📊 How Updates Work

**Automatic:**
- Runs daily at 9 AM UTC: `0 9 * * *`
- Checks Notion for new posts
- Updates `src/data/blog-posts.json`
- Auto-commits changes
- Vercel auto-deploys

**Manual:**
- Go to GitHub Actions
- Run "Update Blog Posts" workflow
- Or push changes to trigger

## 🎨 Blog Post Format

Each post includes:
```json
{
  "id": "notion-page-id",
  "title": "Post Title",
  "slug": "post-title",
  "excerpt": "Post description...",
  "date": "2025-01-20",
  "tags": ["Product Management", "Strategy"],
  "featuredImage": "https://notion-image-url.jpg",
  "url": "https://notion.so/page-url",
  "lastUpdated": "2025-01-31T10:00:00.000Z"
}
```

## 🚀 Development

**Local development:**
```bash
npm run dev  # Shows current blog posts
```

**Force update posts:**
```bash
npm run fetch-blog  # Updates local JSON file
```

## 🔍 Troubleshooting

**Posts not updating?**
1. Check GitHub Actions tab for errors
2. Verify secrets are set correctly
3. Check if Notion database is accessible

**No posts showing?**
1. Check browser console for errors
2. Verify `src/data/blog-posts.json` exists
3. Check if blogService is imported correctly

## 📈 Monitoring

- **GitHub Actions**: See all runs and logs
- **Vercel**: Auto-deploys when JSON changes
- **Browser Console**: Shows blog loading logs