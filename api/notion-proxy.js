/**
 * Vercel Serverless Function - Notion API Proxy
 * Handles CORS issues by proxying requests to Notion API
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method, body } = req;
    const { endpoint } = req.query;

    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint parameter' });
    }

    const notionToken = process.env.VITE_NOTION_TOKEN;
    if (!notionToken) {
      return res.status(500).json({ error: 'Notion token not configured' });
    }

    const notionUrl = `https://api.notion.com/v1/${endpoint}`;
    
    const response = await fetch(notionUrl, {
      method: method,
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: method === 'POST' ? JSON.stringify(body) : undefined
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
    res.status(200).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}