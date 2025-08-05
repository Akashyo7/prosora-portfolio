/**
 * Notion API Proxy - Specific for Blog Posts
 * Handles CORS and returns formatted blog posts
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get environment variables
    const notionToken = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;

    // Debug environment variables (without exposing full tokens)
    console.log('🔍 Environment check:');
    console.log('- NOTION_TOKEN exists:', !!notionToken);
    console.log('- NOTION_TOKEN starts with:', notionToken ? notionToken.substring(0, 10) + '...' : 'undefined');
    console.log('- NOTION_DATABASE_ID exists:', !!databaseId);
    console.log('- NOTION_DATABASE_ID:', databaseId);

    if (!notionToken || !databaseId) {
      return res.status(500).json({ 
        error: 'Missing environment variables',
        details: 'NOTION_TOKEN and NOTION_DATABASE_ID must be set',
        debug: {
          hasToken: !!notionToken,
          hasDatabase: !!databaseId,
          tokenStart: notionToken ? notionToken.substring(0, 10) + '...' : 'undefined'
        }
      });
    }

    console.log('🔄 Fetching from Notion database:', databaseId);

    // Query Notion database
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        filter: {
          property: 'Status',
          select: {
            equals: 'Published'
          }
        },
        sorts: [
          {
            property: 'Date',
            direction: 'descending'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Notion API error:', response.status, errorText);
      return res.status(response.status).json({
        error: `Notion API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log('✅ Notion API response received');
    console.log('📊 Raw response data:', JSON.stringify(data, null, 2));
    console.log('📝 Results count:', data.results?.length || 0);

    // If no results, let's see what we got
    if (!data.results || data.results.length === 0) {
      console.log('⚠️ No results found in Notion response');
      return res.status(200).json({
        posts: [],
        total: 0,
        lastUpdated: new Date().toISOString(),
        debug: {
          rawResponse: data,
          message: 'No results found - check database sharing and filters'
        }
      });
    }

    // Log first page properties to understand structure
    if (data.results[0]) {
      console.log('🔍 First page properties:', Object.keys(data.results[0].properties || {}));
    }

    // Transform Notion data to blog post format
    const posts = data.results.map(page => {
      const properties = page.properties;
      
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
        excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || '',
        publishedDate: properties.Date?.date?.start || new Date().toISOString(),
        tags: properties.Tags?.multi_select?.map(tag => tag.name) || [],
        url: page.url,
        coverImage: page.cover?.external?.url || page.cover?.file?.url || null,
        lastEditedTime: page.last_edited_time
      };
    });

    console.log(`✅ Processed ${posts.length} blog posts`);

    // Add cache headers
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return res.status(200).json({
      posts: posts,
      total: posts.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}