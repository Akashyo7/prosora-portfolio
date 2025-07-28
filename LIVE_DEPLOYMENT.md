# 🚀 PROSORA.IN - Live Deployment Guide

## Your Details:
- **GitHub:** Akashyo7
- **Domain:** prosora.in
- **DNS:** ns1.dns-parking.com, ns2.dns-parking.com

## Step 1: GitHub Repository ✅
Repository URL: https://github.com/Akashyo7/prosora-portfolio

## Step 2: Vercel Deployment
1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import `prosora-portfolio` repository
5. Framework Preset: **Vite**
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Click "Deploy"

## Step 3: Custom Domain Setup
1. In Vercel Dashboard → Project Settings → Domains
2. Add domain: `prosora.in`
3. Add domain: `www.prosora.in`

## Step 4: DNS Configuration
**At your domain provider (where you manage prosora.in DNS):**

### For Root Domain (prosora.in):
```
Type: A
Name: @
Value: 76.76.19.61
TTL: 3600
```

### For WWW Subdomain:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Alternative (if A record doesn't work):
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

## Step 5: SSL Certificate
- Vercel automatically provides SSL
- Your site will be available at:
  - https://prosora.in
  - https://www.prosora.in

## Timeline:
- Vercel deployment: 2-3 minutes
- DNS propagation: 24-48 hours
- SSL activation: Automatic

## Verification:
Once DNS propagates, your portfolio will be live at:
🌐 **https://prosora.in**

## Next Steps After Going Live:
1. Test all functionality
2. Submit to Google Search Console
3. Share on social media
4. Monitor performance with Lighthouse

Ready to go live! 🎉