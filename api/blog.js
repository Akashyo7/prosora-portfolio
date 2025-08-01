// Simple Vercel Edge Function for Notion Blog API
// Free tier: 100GB-seconds/month

export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Get environment variables
    const NOTION_TOKEN = process.env.VITE_NOTION_TOKEN
    const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID

    if (!NOTION_TOKEN || !DATABASE_ID) {
      return new Response(JSON.stringify({ 
        error: 'Missing configuration',
        success: false 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Call Notion API
    const notionResponse = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 100 })
    })

    if (!notionResponse.ok) {
      const errorText = await notionResponse.text()
      return new Response(JSON.stringify({ 
        error: 'Notion API error',
        success: false,
        details: errorText 
      }), {
        status: notionResponse.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await notionResponse.json()

    // Transform posts
    const posts = data.results.map(page => {
      const props = page.properties
      
      const getText = (prop) => {
        if (!prop) return ''
        if (prop.rich_text) return prop.rich_text.map(t => t.plain_text).join('')
        if (prop.title) return prop.title.map(t => t.plain_text).join('')
        return ''
      }

      const title = getText(props.Title || props.Name || props.title) || 'Untitled'
      
      return {
        id: page.id,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: getText(props.Excerpt || props.Description || props.excerpt) || '',
        date: props.Date?.date?.start || props.Created?.date?.start || new Date().toISOString().split('T')[0],
        tags: props.Tags?.multi_select?.map(t => t.name) || [],
        featuredImage: page.cover?.external?.url || page.cover?.file?.url || null,
        url: page.url || `https://notion.so/${page.id.replace(/-/g, '')}`
      }
    })

    return new Response(JSON.stringify({
      success: true,
      posts,
      count: posts.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Server error',
      success: false,
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}