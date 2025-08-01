// Build-time script to fetch blog posts from Notion
// This runs during build, not at runtime - no CORS issues!

import { writeFileSync } from 'fs';
import { resolve } from 'path';

const NOTION_TOKEN = 'ntn_556182459079nbVODH1A9uubv1oESeTBEiHRWz78wDS1bCL';
const DATABASE_ID = '23bcf31b151380cab3f0ff3635d58a65';

async function fetchBlogPosts() {
  console.log('🚀 Fetching blog posts from Notion...');
  
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 100 })
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.results.length} posts`);

    // Transform posts
    const posts = data.results.map(page => {
      const props = page.properties;
      
      const getText = (prop) => {
        if (!prop) return '';
        if (prop.rich_text) return prop.rich_text.map(t => t.plain_text).join('');
        if (prop.title) return prop.title.map(t => t.plain_text).join('');
        return '';
      };

      const title = getText(props.Title || props.Name || props.title) || 'Untitled';
      
      return {
        id: page.id,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: getText(props.Excerpt || props.Description || props.excerpt) || '',
        date: props.Date?.date?.start || props.Created?.date?.start || new Date().toISOString().split('T')[0],
        tags: props.Tags?.multi_select?.map(t => t.name) || [],
        featuredImage: page.cover?.external?.url || page.cover?.file?.url || null,
        url: page.url || `https://notion.so/${page.id.replace(/-/g, '')}`
      };
    });

    // Write to static file
    const outputPath = resolve('src/data/blog-posts.json');
    writeFileSync(outputPath, JSON.stringify(posts, null, 2));
    
    console.log(`✅ Blog posts saved to ${outputPath}`);
    return posts;

  } catch (error) {
    console.error('❌ Failed to fetch blog posts:', error);
    
    // Create fallback data
    const fallbackPosts = [
      {
        id: 'fallback-1',
        title: 'Product Management Lessons from OYO',
        slug: 'product-management-lessons-from-oyo',
        excerpt: 'Key insights from managing product operations at OYO and working with chatbot "Yo".',
        date: '2025-01-20',
        tags: ['Product Management', 'OYO'],
        featuredImage: null,
        url: 'https://www.notion.so/23bcf31b151380cab3f0ff3635d58a65'
      },
      {
        id: 'fallback-2',
        title: 'From IIT Bombay to Product Strategy',
        slug: 'from-iit-bombay-to-product-strategy',
        excerpt: 'My journey from engineering to product management and strategic thinking.',
        date: '2025-01-15',
        tags: ['Career', 'Strategy'],
        featuredImage: null,
        url: 'https://www.notion.so/23bcf31b151380cab3f0ff3635d58a65'
      }
    ];

    const outputPath = resolve('src/data/blog-posts.json');
    writeFileSync(outputPath, JSON.stringify(fallbackPosts, null, 2));
    console.log('📝 Created fallback blog posts');
    
    return fallbackPosts;
  }
}

// Run the script
fetchBlogPosts().then(posts => {
  console.log(`🎉 Blog data ready! ${posts.length} posts available.`);
}).catch(console.error);