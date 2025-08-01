// Vercel serverless function to proxy Notion API requests
// This avoids CORS issues when calling Notion API from the frontend

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('🚀 Notion API proxy called');
    
    // Get environment variables
    const NOTION_TOKEN = process.env.VITE_NOTION_TOKEN;
    const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID;

    console.log('🔍 Environment check:', {
      tokenExists: !!NOTION_TOKEN,
      databaseId: DATABASE_ID
    });

    if (!NOTION_TOKEN || !DATABASE_ID) {
      console.error('❌ Missing environment variables');
      res.status(500).json({ 
        error: 'Missing Notion configuration',
        details: {
          tokenExists: !!NOTION_TOKEN,
          databaseIdExists: !!DATABASE_ID
        }
      });
      return;
    }

    // Make request to Notion API
    const notionResponse = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100
      })
    });

    console.log('📡 Notion API response status:', notionResponse.status);

    if (!notionResponse.ok) {
      const errorText = await notionResponse.text();
      console.error('❌ Notion API error:', errorText);
      res.status(notionResponse.status).json({ 
        error: 'Notion API error',
        status: notionResponse.status,
        details: errorText
      });
      return;
    }

    const data = await notionResponse.json();
    console.log('✅ Notion API success:', data.results?.length || 0, 'posts');

    // Transform the data
    const transformedPosts = data.results.map(page => {
      const properties = page.properties;
      
      // Extract text from different property types
      const extractText = (prop) => {
        if (!prop) return '';
        if (prop.rich_text && Array.isArray(prop.rich_text)) {
          return prop.rich_text.map(text => text.plain_text || '').join('');
        }
        if (prop.title && Array.isArray(prop.title)) {
          return prop.title.map(text => text.plain_text || '').join('');
        }
        return '';
      };

      // Extract cover image
      const extractCoverImage = (page) => {
        if (page.cover) {
          if (page.cover.type === 'external') {
            return page.cover.external.url;
          } else if (page.cover.type === 'file') {
            return page.cover.file.url;
          }
        }
        
        // Check properties for cover
        const coverProp = properties.Cover || properties.cover || properties.Image || properties.image;
        if (coverProp && coverProp.files && coverProp.files.length > 0) {
          const file = coverProp.files[0];
          if (file.type === 'external') {
            return file.external.url;
          } else if (file.type === 'file') {
            return file.file.url;
          }
        }
        
        return null;
      };

      // Try different property names
      const titleProperty = properties.Title || properties.Name || properties.title || properties.name;
      const statusProperty = properties.Status || properties.status;
      const dateProperty = properties.Date || properties.date || properties.Created || properties.created;
      const tagsProperty = properties.Tags || properties.tags || properties.Category || properties.category;
      const excerptProperty = properties.Excerpt || properties.excerpt || properties.Description || properties.description;

      const title = extractText(titleProperty) || 'Untitled Post';

      return {
        id: page.id,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        excerpt: extractText(excerptProperty) || '',
        date: dateProperty?.date?.start || new Date().toISOString().split('T')[0],
        tags: tagsProperty?.multi_select?.map(tag => tag.name) || [],
        status: statusProperty?.select?.name || 'Published',
        featured: properties.Featured?.checkbox || false,
        featuredImage: extractCoverImage(page),
        readingTime: Math.ceil((extractText(excerptProperty) || '').split(' ').length / 200) || 3,
        lastModified: page.last_edited_time,
        url: page.url || `https://notion.so/${page.id.replace(/-/g, '')}`
      };
    });

    console.log('🔄 Transformed posts:', transformedPosts.length);

    res.status(200).json({
      success: true,
      posts: transformedPosts,
      count: transformedPosts.length
    });

  } catch (error) {
    console.error('💥 Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}