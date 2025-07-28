# Notion Blog Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Notion Integration
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name it "Portfolio Blog" 
4. Select your workspace
5. Click "Submit"
6. **Copy the "Internal Integration Token"** - you'll need this!

### Step 2: Create Blog Database in Notion
1. Create a new page in Notion called "Blog Posts"
2. Add a database with these properties:

| Property Name | Type | Description |
|---------------|------|-------------|
| **Title** | Title | Post title (this is automatic) |
| **Status** | Select | Options: Draft, Published |
| **Date** | Date | Publication date |
| **Excerpt** | Text | Short description for previews |
| **Tags** | Multi-select | Categories like "Product Management", "Career" |
| **Featured** | Checkbox | Mark important posts |

### Step 3: Share Database with Integration
1. Click "Share" on your Blog Posts database
2. Click "Invite" 
3. **Scroll down in the invite dialog** - below the suggested contacts, you should see your integrations
4. Look for "Portfolio Blog" with a puzzle piece icon 🧩
5. Click on "Portfolio Blog" to select it
6. Click "Invite"

**If you don't see your integration in the list:**
1. **Try typing in the search box**: Type "Portfolio Blog" (even though it's meant for emails, sometimes it works)
2. **Check workspace**: Make sure you're in the same Notion workspace where you created the integration
3. **Refresh and retry**: Close the invite dialog, refresh the page, and try again
4. **Alternative method**: 
   - Go back to [Notion Integrations](https://www.notion.so/my-integrations)
   - Click on your "Portfolio Blog" integration
   - Copy the integration ID from the URL or settings
   - Sometimes you can paste this in the search box

**Still not working?** The integration should appear automatically in the invite list. If it doesn't:
- Double-check you completed Step 1 correctly
- Make sure you're the admin of both the integration and the database
- Try creating the integration again with a different name

### Step 4: Get Database ID
1. Open your Blog Posts database
2. Copy the URL - it looks like: `https://notion.so/your-workspace/DATABASE_ID?v=...`
3. The DATABASE_ID is the long string of letters/numbers
4. **Copy this DATABASE_ID** - you'll need it!

### Step 5: Add to Your Portfolio
Add these to your environment variables (in Vercel or `.env` file):

```bash
VITE_NOTION_TOKEN=your_integration_token_here
VITE_NOTION_DATABASE_ID=your_database_id_here
```

## How to Write Blog Posts

### 1. Create New Post
- Add a new row to your Blog Posts database
- Fill in the Title, Date, Excerpt, and Tags
- Set Status to "Draft" while writing

### 2. Write Your Content
- Click on the Title to open the full page
- Write your blog post using Notion's rich editor
- Use headings, lists, quotes, code blocks - everything works!

### 3. Publish
- When ready, change Status to "Published"
- Your portfolio will automatically update within a few minutes!

## Blog Post Template

Here's a template you can duplicate for each post:

```
# [Your Post Title]

## Introduction
Brief intro to hook the reader...

## Main Content
Your insights, experiences, lessons learned...

### Subheading 1
Content here...

### Subheading 2
More content...

> "Quote or key insight"

## Key Takeaways
- Point 1
- Point 2  
- Point 3

## Conclusion
Wrap up your thoughts...
```

## Tips for Great Blog Posts

### Content Ideas
- **Product Insights**: Lessons from OYO, case study analysis
- **Career Journey**: IIT to Product Management, MBA experiences  
- **Industry Thoughts**: Product trends, strategy frameworks
- **Personal Growth**: Learning experiences, challenges overcome

### SEO Best Practices
- Use descriptive titles
- Write compelling excerpts
- Add relevant tags
- Include internal links to your case studies

### Engagement Tips
- Start with a hook
- Use personal stories
- Include actionable insights
- End with a question or call-to-action

## Troubleshooting

### Posts Not Showing Up?
1. Check Status is set to "Published"
2. Verify integration has access to database
3. Wait 2-3 minutes for sync
4. Check browser console for errors

### Formatting Issues?
- Notion blocks are automatically converted to HTML
- Most formatting (headings, lists, quotes) works perfectly
- Complex layouts might need adjustment

### Need Help?
- Check the browser console for error messages
- Verify your Notion token and database ID
- Make sure the integration has database access

## Advanced Features (Coming Soon)
- Scheduled publishing
- Draft previews
- Comment system
- Newsletter integration
- Analytics tracking

---

**That's it!** Once set up, you just write in Notion and your portfolio automatically updates. No code, no Git, no technical stuff needed!