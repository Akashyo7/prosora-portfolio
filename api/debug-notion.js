/**
 * Debug endpoint to test Notion connection
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Check environment variables
    const notionToken = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;

    const envCheck = {
      hasNotionToken: !!notionToken,
      hasNotionDatabase: !!databaseId,
      tokenStart: notionToken ? notionToken.substring(0, 10) + '...' : 'undefined',
      databaseId: databaseId || 'undefined'
    };

    console.log('🔍 Environment check:', envCheck);

    if (!notionToken || !databaseId) {
      return res.status(200).json({
        status: 'error',
        message: 'Missing environment variables',
        envCheck,
        solution: 'Set NOTION_TOKEN and NOTION_DATABASE_ID in Vercel environment variables'
      });
    }

    // Test Notion API connection
    console.log('🔄 Testing Notion API connection...');
    
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        page_size: 10
      })
    });

    const responseText = await response.text();
    console.log('📡 Notion API response status:', response.status);
    console.log('📡 Notion API response:', responseText);

    if (!response.ok) {
      return res.status(200).json({
        status: 'error',
        message: 'Notion API error',
        envCheck,
        apiError: {
          status: response.status,
          statusText: response.statusText,
          response: responseText
        },
        solution: response.status === 404 
          ? 'Database not found - check NOTION_DATABASE_ID or share database with integration'
          : response.status === 401
          ? 'Unauthorized - check NOTION_TOKEN'
          : 'Check Notion API response for details'
      });
    }

    const data = JSON.parse(responseText);
    
    return res.status(200).json({
      status: 'success',
      message: 'Notion API connection successful',
      envCheck,
      results: {
        totalResults: data.results?.length || 0,
        hasResults: (data.results?.length || 0) > 0,
        firstPageId: data.results?.[0]?.id || 'none',
        properties: data.results?.[0]?.properties ? Object.keys(data.results[0].properties) : []
      },
      rawResponse: data
    });

  } catch (error) {
    console.error('❌ Debug error:', error);
    return res.status(200).json({
      status: 'error',
      message: 'Debug endpoint error',
      error: error.message,
      stack: error.stack
    });
  }
}