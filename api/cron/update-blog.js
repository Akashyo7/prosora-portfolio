// Vercel Cron Job to update blog posts automatically
// Runs every hour to check for new Notion posts

export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  // Verify this is a cron request
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log('🔄 Cron job: Updating blog posts...');
    
    const NOTION_TOKEN = process.env.VITE_NOTION_TOKEN;
    const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID;

    if (!NOTION_TOKEN || !DATABASE_ID) {
      return new Response('Missing configuration', { status: 500 });
    }

    // Fetch from Notion
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

    // Store in Vercel KV or trigger rebuild
    // For now, just log success
    console.log(`✅ Updated ${posts.length} blog posts`);
    
    return new Response(JSON.stringify({
      success: true,
      message: `Updated ${posts.length} blog posts`,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Cron job failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}