// SEO utilities and helpers

/**
 * Default SEO configuration
 */
export const defaultSEO = {
  title: 'Akash Yadav - Product & Strategy Professional | Portfolio',
  description: 'Product & Strategy professional specializing in data-driven decision making, product discovery, and customer success. View my portfolio of case studies and professional journey.',
  keywords: [
    'Product Manager',
    'Strategy Professional',
    'Product Analytics',
    'Data-driven Decision Making',
    'Product Discovery',
    'Customer Success',
    'IIT Bombay',
    'MBA',
    'Portfolio',
    'Case Studies',
    'OYO',
    'Product Operations',
    'Marketing Analytics',
    'Business Strategy'
  ],
  author: 'Akash Yadav',
  url: 'https://akash-portfolio.vercel.app', // Update with actual domain
  image: '/assets/65f98e075de77c4670aa9400_Portfolio%20Pic%201-p-500.jpg',
  type: 'website',
  locale: 'en_US',
  siteName: 'Akash Yadav Portfolio'
};

/**
 * Generate page-specific SEO data
 * @param {Object} pageData - Page-specific SEO data
 * @returns {Object} Complete SEO configuration
 */
export const generateSEO = (pageData = {}) => {
  return {
    ...defaultSEO,
    ...pageData,
    keywords: [...defaultSEO.keywords, ...(pageData.keywords || [])],
    url: pageData.url ? `${defaultSEO.url}${pageData.url}` : defaultSEO.url
  };
};

/**
 * Section-specific SEO configurations
 */
export const sectionSEO = {
  home: {
    title: 'Akash Yadav - Product & Strategy Professional | Portfolio',
    description: 'Product & Strategy professional from IIT Bombay specializing in data-driven decision making and customer success. Currently pursuing MBA at University of Southampton.',
    url: '/',
    keywords: ['Product Manager', 'Strategy Professional', 'IIT Bombay', 'MBA Southampton']
  },
  about: {
    title: 'About Akash Yadav - Product & Strategy Professional',
    description: 'Learn about Akash Yadav\'s journey from IIT Bombay to product management, including his experience at OYO and current MBA studies.',
    url: '/#about',
    keywords: ['About', 'Professional Journey', 'IIT Bombay', 'Product Management Career']
  },
  timeline: {
    title: 'Career Timeline - Akash Yadav\'s Professional Journey',
    description: 'Explore Akash\'s career timeline from IIT Bombay graduation to product management roles at OYO and current MBA studies.',
    url: '/#timeline',
    keywords: ['Career Timeline', 'Professional Experience', 'OYO', 'Product Operations']
  },
  work: {
    title: 'Case Studies & Work Portfolio - Akash Yadav',
    description: 'View product case studies including Gaana, Shazam, OYO, Trend Treasure, and Spotify analysis by Akash Yadav.',
    url: '/#work',
    keywords: ['Case Studies', 'Product Analysis', 'Gaana', 'Shazam', 'OYO', 'Spotify']
  },
  contact: {
    title: 'Contact Akash Yadav - Product & Strategy Professional',
    description: 'Get in touch with Akash Yadav for product management opportunities, collaborations, or professional discussions.',
    url: '/#contact',
    keywords: ['Contact', 'Product Manager', 'Collaboration', 'Opportunities']
  }
};

/**
 * Generate structured data (JSON-LD) for search engines
 * @param {string} type - Type of structured data
 * @param {Object} data - Data for structured markup
 * @returns {Object} JSON-LD structured data
 */
export const generateStructuredData = (type, data = {}) => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type
  };

  switch (type) {
    case 'Person':
      return {
        ...baseData,
        name: 'Akash Yadav',
        jobTitle: 'Product & Strategy Professional',
        description: 'Product & Strategy professional specializing in data-driven decision making and customer success',
        url: defaultSEO.url,
        image: `${defaultSEO.url}${defaultSEO.image}`,
        email: 'akashy.iitb@gmail.com',
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: 'Indian Institute of Technology Bombay',
          alternateName: 'IIT Bombay'
        },
        worksFor: {
          '@type': 'EducationalOrganization',
          name: 'University of Southampton',
          description: 'Currently pursuing MBA'
        },
        knowsAbout: [
          'Product Management',
          'Strategy',
          'Analytics',
          'Product Operations',
          'Customer Success',
          'Data-driven Decision Making'
        ],
        sameAs: [
          'https://www.linkedin.com/in/aka-shy/',
          'https://x.com/imakash_y',
          'https://www.instagram.com/a_akasho7/',
          'http://www.youtube.com/@aakashyadav2458',
          'https://www.facebook.com/profile.php?id=100005669528044&sk=about'
        ],
        ...data
      };

    case 'WebSite':
      return {
        ...baseData,
        name: defaultSEO.siteName,
        description: defaultSEO.description,
        url: defaultSEO.url,
        author: {
          '@type': 'Person',
          name: defaultSEO.author
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${defaultSEO.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        },
        ...data
      };

    case 'Portfolio':
      return {
        ...baseData,
        '@type': 'CreativeWork',
        name: 'Akash Yadav Portfolio',
        description: 'Professional portfolio showcasing product management case studies and career journey',
        author: {
          '@type': 'Person',
          name: 'Akash Yadav'
        },
        url: defaultSEO.url,
        workExample: [
          {
            '@type': 'CreativeWork',
            name: 'Gaana.com Product Case Study',
            description: 'Product case study analyzing Gaana.com and strategies for revenue increase'
          },
          {
            '@type': 'CreativeWork',
            name: 'Shazam Product Case Study',
            description: 'Product case study on Shazam app and user experience optimization'
          },
          {
            '@type': 'CreativeWork',
            name: 'OYO Product Case Study',
            description: 'Product case study on OYO onboarding flow and user experience improvements'
          }
        ],
        ...data
      };

    default:
      return { ...baseData, ...data };
  }
};

/**
 * Generate Open Graph meta tags
 * @param {Object} seoData - SEO configuration
 * @returns {Array} Array of meta tag objects
 */
export const generateOpenGraphTags = (seoData) => {
  return [
    { property: 'og:type', content: seoData.type || 'website' },
    { property: 'og:title', content: seoData.title },
    { property: 'og:description', content: seoData.description },
    { property: 'og:url', content: seoData.url },
    { property: 'og:image', content: `${defaultSEO.url}${seoData.image || defaultSEO.image}` },
    { property: 'og:image:alt', content: `${seoData.author || defaultSEO.author} - Professional Portfolio` },
    { property: 'og:site_name', content: seoData.siteName || defaultSEO.siteName },
    { property: 'og:locale', content: seoData.locale || defaultSEO.locale }
  ];
};

/**
 * Generate Twitter Card meta tags
 * @param {Object} seoData - SEO configuration
 * @returns {Array} Array of meta tag objects
 */
export const generateTwitterTags = (seoData) => {
  return [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@imakash_y' },
    { name: 'twitter:creator', content: '@imakash_y' },
    { name: 'twitter:title', content: seoData.title },
    { name: 'twitter:description', content: seoData.description },
    { name: 'twitter:image', content: `${defaultSEO.url}${seoData.image || defaultSEO.image}` },
    { name: 'twitter:image:alt', content: `${seoData.author || defaultSEO.author} - Professional Portfolio` }
  ];
};

/**
 * Generate all meta tags for a page
 * @param {Object} pageData - Page-specific SEO data
 * @returns {Object} Complete meta tags configuration
 */
export const generateMetaTags = (pageData = {}) => {
  const seoData = generateSEO(pageData);
  
  return {
    title: seoData.title,
    meta: [
      { name: 'description', content: seoData.description },
      { name: 'keywords', content: seoData.keywords.join(', ') },
      { name: 'author', content: seoData.author },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'theme-color', content: '#3b82f6' },
      { name: 'msapplication-TileColor', content: '#3b82f6' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: seoData.siteName },
      ...generateOpenGraphTags(seoData),
      ...generateTwitterTags(seoData)
    ],
    link: [
      { rel: 'canonical', href: seoData.url },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' }
    ],
    structuredData: [
      generateStructuredData('Person'),
      generateStructuredData('WebSite'),
      generateStructuredData('Portfolio')
    ]
  };
};

/**
 * Update document head with SEO meta tags
 * @param {Object} metaTags - Meta tags configuration
 */
export const updateDocumentHead = (metaTags) => {
  // Update title
  document.title = metaTags.title;

  // Update or create meta tags
  metaTags.meta.forEach(tag => {
    const identifier = tag.name || tag.property;
    const attribute = tag.name ? 'name' : 'property';
    
    let element = document.querySelector(`meta[${attribute}="${identifier}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, identifier);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', tag.content);
  });

  // Update or create link tags
  metaTags.link.forEach(link => {
    let element = document.querySelector(`link[rel="${link.rel}"]`);
    
    if (!element) {
      element = document.createElement('link');
      document.head.appendChild(element);
    }
    
    Object.keys(link).forEach(attr => {
      element.setAttribute(attr, link[attr]);
    });
  });

  // Add structured data
  metaTags.structuredData.forEach((data, index) => {
    const id = `structured-data-${index}`;
    let script = document.getElementById(id);
    
    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(data);
  });
};