#!/usr/bin/env node

/**
 * Pre-Launch Optimization Check
 * Validates portfolio readiness for production deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🚀 Portfolio Pre-Launch Check\n');

const checks = [];

// Check 1: Essential files exist
const essentialFiles = [
  'index.html',
  'package.json',
  'vite.config.js',
  'src/App.jsx',
  'src/main.jsx',
  'public/robots.txt',
  'public/sitemap.xml'
];

console.log('📁 Checking essential files...');
essentialFiles.forEach(file => {
  const exists = fs.existsSync(path.join(projectRoot, file));
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  checks.push({ name: `Essential file: ${file}`, passed: exists });
});

// Check 2: Asset files exist
const assetFiles = [
  'public/assets/profile-pic-main.jpg',
  'public/assets/gaana-case-study.gif',
  'public/assets/shazam-app.gif',
  'public/assets/oyo-case-study.gif',
  'public/assets/trend-treasure.gif',
  'public/assets/spotify-case-study.gif'
];

console.log('\n🖼️  Checking asset files...');
assetFiles.forEach(file => {
  const exists = fs.existsSync(path.join(projectRoot, file));
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  checks.push({ name: `Asset file: ${file}`, passed: exists });
});

// Check 3: Package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
const requiredScripts = ['dev', 'build', 'preview'];

requiredScripts.forEach(script => {
  const exists = packageJson.scripts && packageJson.scripts[script];
  console.log(`   ${exists ? '✅' : '❌'} ${script} script`);
  checks.push({ name: `Script: ${script}`, passed: !!exists });
});

// Check 4: HTML meta tags
console.log('\n🏷️  Checking HTML meta tags...');
const htmlContent = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const metaTags = [
  'viewport',
  'description',
  'og:title',
  'og:description',
  'twitter:card'
];

metaTags.forEach(tag => {
  const exists = htmlContent.includes(`name="${tag}"`) || htmlContent.includes(`property="og:${tag.replace('og:', '')}"`) || htmlContent.includes(`name="twitter:${tag.replace('twitter:', '')}"`);
  console.log(`   ${exists ? '✅' : '❌'} ${tag} meta tag`);
  checks.push({ name: `Meta tag: ${tag}`, passed: exists });
});

// Check 5: CSS responsiveness
console.log('\n📱 Checking responsive design...');
const cssFiles = [
  'src/index.css',
  'src/components/sections/WorkSection.css',
  'src/components/blog/BlogSection.css',
  'src/components/sections/ContactSection.css'
];

let hasResponsiveCSS = false;
cssFiles.forEach(file => {
  if (fs.existsSync(path.join(projectRoot, file))) {
    const content = fs.readFileSync(path.join(projectRoot, file), 'utf8');
    if (content.includes('@media') && content.includes('max-width')) {
      hasResponsiveCSS = true;
    }
  }
});

console.log(`   ${hasResponsiveCSS ? '✅' : '❌'} Responsive CSS media queries`);
checks.push({ name: 'Responsive CSS', passed: hasResponsiveCSS });

// Check 6: Accessibility features
console.log('\n♿ Checking accessibility features...');
const accessibilityFeatures = [
  { name: 'Alt text for images', check: htmlContent.includes('alt=') },
  { name: 'ARIA labels', check: htmlContent.includes('aria-label') },
  { name: 'Focus styles', check: fs.readFileSync(path.join(projectRoot, 'src/index.css'), 'utf8').includes(':focus') }
];

accessibilityFeatures.forEach(feature => {
  console.log(`   ${feature.check ? '✅' : '❌'} ${feature.name}`);
  checks.push({ name: `Accessibility: ${feature.name}`, passed: feature.check });
});

// Check 7: Performance optimizations
console.log('\n⚡ Checking performance optimizations...');
const viteConfig = fs.readFileSync(path.join(projectRoot, 'vite.config.js'), 'utf8');
const performanceChecks = [
  { name: 'Code splitting', check: viteConfig.includes('manualChunks') },
  { name: 'Asset optimization', check: viteConfig.includes('assetsDir') },
  { name: 'Minification', check: viteConfig.includes('minify') }
];

performanceChecks.forEach(check => {
  console.log(`   ${check.check ? '✅' : '❌'} ${check.name}`);
  checks.push({ name: `Performance: ${check.name}`, passed: check.check });
});

// Summary
console.log('\n📊 Summary:');
const passed = checks.filter(check => check.passed).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`   ${passed}/${total} checks passed (${percentage}%)`);

if (percentage >= 90) {
  console.log('\n🎉 Portfolio is ready for deployment!');
  console.log('   Run: npm run build && vercel --prod');
} else if (percentage >= 75) {
  console.log('\n⚠️  Portfolio needs minor fixes before deployment');
  console.log('   Please address the failed checks above');
} else {
  console.log('\n❌ Portfolio needs significant fixes before deployment');
  console.log('   Please address the failed checks above');
}

// Failed checks
const failedChecks = checks.filter(check => !check.passed);
if (failedChecks.length > 0) {
  console.log('\n❌ Failed checks:');
  failedChecks.forEach(check => {
    console.log(`   - ${check.name}`);
  });
}

console.log('\n📖 For deployment instructions, see: DEPLOYMENT_GUIDE.md');
console.log('🔧 For testing, run: npm run dev');