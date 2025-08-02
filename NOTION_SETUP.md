# Notion Blog Database Setup Guide

## Required Database Properties

Your Notion database must have these exact properties for the blog system to work:

### 1. Title (Title property)
- **Type**: Title
- **Name**: `Title` or `Name`
- **Description**: The blog post title

### 2. Excerpt (Rich Text)
- **Type**: Rich text
- **Name**: `Excerpt`
- **Description**: Short description/summary of the post

### 3. Status (Select)
- **Type**: Select
- **Name**: `Status`
- **Options**: 
  - `Published` (posts visible on website)
  - `Draft` (posts hidden from website)
  - `Archived` (optional)

### 4. Published Date (Date)
- **Type**: Date
- **Name**: `Published Date`
- **Description**: When the post should be published

### 5. Tags (Multi-select)
- **Type**: Multi-select
- **Name**: `Tags`
- **Description**: Categories/tags for the post

## Database Setup Steps

1. **Create a new Notion database** or use your existing one
2. **Add the required properties** listed above
3. **Make sure property names match exactly** (case-sensitive)
4. **Set up your Notion integration**:
   - Go to https://www.notion.so/my-integrations
   - Create a new integration
   - Copy the integration token
   - Share your database with the integration

## Current Configuration

Your current setup:
- **Database ID**: `23bcf31b151380cab3f0ff3635d58a65`
- **Integration Token**: Configured in `.env`
- **Database URL**: https://www.notion.so/23bcf31b151380cab3f0ff3635d58a65

## Testing Your Setup

1. **Run the development server**: `npm run dev`
2. **Look for the green test box** on your website
3. **Check the browser console** for detailed logs
4. **Verify your posts appear** in the test results

## Troubleshooting

### Common Issues:

**❌ "API connection failed"**
- Check your integration token in `.env`
- Make sure the database is shared with your integration
- Verify the database ID is correct

**❌ "No posts found"**
- Make sure you have posts with `Status = "Published"`
- Check that property names match exactly
- Verify the `Published Date` is set

**❌ "Property not found"**
- Double-check property names (case-sensitive)
- Make sure all required properties exist
- Check property types match the requirements

### Debug Steps:

1. **Check browser console** for detailed error messages
2. **Verify database properties** match the requirements
3. **Test with a simple post** with all fields filled
4. **Check Notion integration permissions**

## Sample Blog Post

Create a test post with these values:
- **Title**: "Welcome to My Blog"
- **Excerpt**: "This is my first blog post using the new system!"
- **Status**: "Published"
- **Published Date**: Today's date
- **Tags**: ["Welcome", "Test"]

## Next Steps

Once the API test shows ✅ success:
1. Remove the test component
2. Create your first real blog posts
3. The blog section will automatically display your content!