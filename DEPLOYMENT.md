# Deployment Guide

## Vercel Deployment Setup

### Prerequisites
1. GitHub repository with the portfolio code
2. Vercel account connected to GitHub
3. Environment variables configured (if any)

### Automatic Deployment Steps

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm ci`

2. **Environment Variables** (if needed)
   ```bash
   NODE_ENV=production
   VITE_APP_VERSION=1.0.0
   ```

3. **Domain Configuration**
   - Add custom domain in Vercel project settings
   - Update SEO URLs in `src/utils/seo.js`
   - Update sitemap URLs in `public/sitemap.xml`

### Manual Deployment Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Build Optimization Checklist

### Performance Optimizations ✅
- [x] Code splitting with manual chunks
- [x] Asset optimization and compression
- [x] CSS code splitting
- [x] Tree shaking enabled
- [x] Bundle size optimization
- [x] Image lazy loading
- [x] Font preloading

### Caching Strategy ✅
- [x] Static assets: 1 year cache
- [x] HTML files: No cache (must-revalidate)
- [x] JS/CSS bundles: Immutable cache
- [x] Images: Long-term cache
- [x] SEO files: 24-hour cache

### SEO Optimization ✅
- [x] Meta tags and Open Graph
- [x] Structured data (JSON-LD)
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Canonical URLs
- [x] Social media previews

### Accessibility ✅
- [x] WCAG 2.1 AA compliance
- [x] Keyboard navigation
- [x] Screen reader support
- [x] Reduced motion support
- [x] Focus indicators
- [x] Semantic HTML

### Performance Monitoring ✅
- [x] Web Vitals tracking
- [x] Lighthouse CI integration
- [x] Error tracking
- [x] Performance metrics
- [x] Resource monitoring

## Testing Before Deployment

### Local Testing
```bash
# Build the project
npm run build

# Preview the build
npm run preview

# Run Lighthouse audit
npx lighthouse http://localhost:4173 --output=html --output-path=./lighthouse-report.html
```

### Performance Targets
- **Performance Score**: > 85
- **Accessibility Score**: > 95
- **Best Practices Score**: > 90
- **SEO Score**: > 95
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### Browser Testing
- [x] Chrome (latest)
- [x] Firefox (latest)
- [x] Safari (latest)
- [x] Edge (latest)
- [x] Mobile Chrome
- [x] Mobile Safari

## Post-Deployment Verification

### Functionality Checklist
- [ ] All sections load correctly
- [ ] Navigation works smoothly
- [ ] Animations perform well
- [ ] Images load properly
- [ ] External links work
- [ ] Contact forms function
- [ ] Mobile responsiveness
- [ ] SEO meta tags present
- [ ] Social media previews work
- [ ] Performance metrics acceptable

### SEO Verification
- [ ] Google Search Console setup
- [ ] Sitemap submitted
- [ ] Meta tags validation
- [ ] Structured data testing
- [ ] Social media preview testing
- [ ] Page speed insights check

### Analytics Setup
- [ ] Google Analytics configured
- [ ] Vercel Analytics enabled
- [ ] Performance monitoring active
- [ ] Error tracking functional

## Monitoring and Maintenance

### Regular Checks
- Weekly performance audits
- Monthly SEO analysis
- Quarterly dependency updates
- Annual accessibility review

### Performance Monitoring
- Core Web Vitals tracking
- Error rate monitoring
- User interaction analytics
- Resource loading performance

### Update Process
1. Test changes locally
2. Create pull request
3. Review Lighthouse CI results
4. Deploy to preview environment
5. Verify functionality
6. Merge to main branch
7. Automatic production deployment

## Troubleshooting

### Common Issues
1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for errors

2. **Performance Issues**
   - Analyze bundle size
   - Check for unused dependencies
   - Optimize images and assets

3. **SEO Problems**
   - Validate meta tags
   - Check robots.txt accessibility
   - Verify sitemap format

4. **Accessibility Issues**
   - Run automated accessibility tests
   - Test with screen readers
   - Verify keyboard navigation

## Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)