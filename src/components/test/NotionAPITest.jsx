/**
 * Notion API Test Component
 * Use this to test your Notion integration
 */

import { useState, useEffect } from 'react';
import notionBlogService from '../../services/notionBlogService.js';

const NotionAPITest = () => {
  const [testResults, setTestResults] = useState({
    connection: null,
    posts: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setTestResults(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Test API connection
      console.log('🔄 Testing Notion API connection...');
      const connectionTest = await notionBlogService.testConnection();
      
      // Test fetching posts
      console.log('🔄 Testing blog post fetching...');
      const posts = await notionBlogService.fetchPosts(3);
      
      setTestResults({
        connection: connectionTest,
        posts: posts,
        loading: false,
        error: null
      });
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      setTestResults(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  if (testResults.loading) {
    return (
      <div style={{ padding: '20px', background: '#f5f5f5', margin: '20px', borderRadius: '8px' }}>
        <h3>🔄 Testing Notion API...</h3>
        <p>Please wait while we test your Notion integration.</p>
      </div>
    );
  }

  if (testResults.error) {
    return (
      <div style={{ padding: '20px', background: '#ffe6e6', margin: '20px', borderRadius: '8px', border: '1px solid #ff9999' }}>
        <h3>❌ API Test Failed</h3>
        <p><strong>Error:</strong> {testResults.error}</p>
        <button onClick={runTests} style={{ padding: '8px 16px', marginTop: '10px' }}>
          🔄 Retry Tests
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#e6ffe6', margin: '20px', borderRadius: '8px', border: '1px solid #99ff99' }}>
      <h3>✅ Notion API Tests Successful!</h3>
      
      <div style={{ marginTop: '15px' }}>
        <h4>📡 Connection Test:</h4>
        <p>{testResults.connection ? '✅ Connected' : '❌ Failed'}</p>
      </div>
      
      <div style={{ marginTop: '15px' }}>
        <h4>📝 Blog Posts ({testResults.posts?.length || 0} found):</h4>
        {testResults.posts && testResults.posts.length > 0 ? (
          <ul style={{ marginTop: '10px' }}>
            {testResults.posts.map(post => (
              <li key={post.id} style={{ marginBottom: '8px' }}>
                <strong>{post.title}</strong>
                <br />
                <small>Published: {new Date(post.publishedDate).toLocaleDateString()}</small>
                {post.tags.length > 0 && (
                  <>
                    <br />
                    <small>Tags: {post.tags.join(', ')}</small>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No published posts found. Make sure you have posts with Status = "Published" in your Notion database.</p>
        )}
      </div>
      
      <button onClick={runTests} style={{ padding: '8px 16px', marginTop: '15px' }}>
        🔄 Run Tests Again
      </button>
    </div>
  );
};

export default NotionAPITest;