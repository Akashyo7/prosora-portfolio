import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Development API middleware
const apiMiddleware = () => {
  return {
    name: 'api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/notion-blog', async (req, res, next) => {
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        try {
          console.log('🚀 Development API: Handling Notion request');
          
          // Get environment variables
          const NOTION_TOKEN = process.env.VITE_NOTION_TOKEN;
          const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID;

          if (!NOTION_TOKEN || !DATABASE_ID) {
            console.error('❌ Missing environment variables');
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: 'Missing Notion configuration',
              success: false
            }));
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

          if (!notionResponse.ok) {
            const errorText = await notionResponse.text();
            console.error('❌ Notion API error:', errorText);
            res.statusCode = notionResponse.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: 'Notion API error',
              success: false,
              details: errorText
            }));
            return;
          }

          const data = await notionResponse.json();
          console.log('✅ Notion API success:', data.results?.length || 0, 'posts');

          // Transform the data (simplified version)
          const transformedPosts = data.results.map(page => {
            const properties = page.properties;
            
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

            const titleProperty = properties.Title || properties.Name || properties.title || properties.name;
            const excerptProperty = properties.Excerpt || properties.excerpt || properties.Description || properties.description;
            const dateProperty = properties.Date || properties.date || properties.Created || properties.created;
            const tagsProperty = properties.Tags || properties.tags || properties.Category || properties.category;

            const title = extractText(titleProperty) || 'Untitled Post';

            return {
              id: page.id,
              title,
              slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
              excerpt: extractText(excerptProperty) || '',
              date: dateProperty?.date?.start || new Date().toISOString().split('T')[0],
              tags: tagsProperty?.multi_select?.map(tag => tag.name) || [],
              status: 'Published',
              featured: false,
              featuredImage: page.cover?.external?.url || page.cover?.file?.url || null,
              readingTime: 3,
              lastModified: page.last_edited_time,
              url: page.url || `https://notion.so/${page.id.replace(/-/g, '')}`
            };
          });

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({
            success: true,
            posts: transformedPosts,
            count: transformedPosts.length
          }));

        } catch (error) {
          console.error('💥 Development API error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ 
            error: 'Internal server error',
            success: false,
            message: error.message
          }));
        }
      });
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiMiddleware()],
  
  // Build optimizations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for production debugging
    sourcemap: false,
    
    // Minify options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Rollup options for advanced bundling
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Optimized manual chunks for better caching and loading
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('lucide-react')) {
              return 'lucide-react';
            }
            // Other vendor libraries
            return 'vendor';
          }
          
          // Component chunks
          if (id.includes('/components/sections/')) {
            return 'sections';
          }
          if (id.includes('/components/')) {
            return 'components';
          }
          if (id.includes('/utils/')) {
            return 'utils';
          }
        },
        
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    
    // Asset handling
    assetsDir: 'assets',
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Preload module detection
    modulePreload: {
      polyfill: true,
    },
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    open: true,
  },
  
  // Asset optimization
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.svg', '**/*.webp'],
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },
  
  // Optimization configuration
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react'
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
  
  // Experimental features
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` }
      } else {
        return { relative: true }
      }
    },
  },
})
