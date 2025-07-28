import { useEffect } from 'react';
import { generateMetaTags, updateDocumentHead } from '../../utils/seo.js';

const SEOHead = ({ pageData = {} }) => {
  useEffect(() => {
    const metaTags = generateMetaTags(pageData);
    updateDocumentHead(metaTags);
  }, [pageData]);

  return null; // This component doesn't render anything visible
};

export default SEOHead;