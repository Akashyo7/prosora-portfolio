# 🌐 DNS Configuration for prosora.in

## Current Setup:
- **Domain:** prosora.in
- **Nameservers:** ns1.dns-parking.com, ns2.dns-parking.com
- **Vercel Project:** akash-portfolio

## Step 1: Add Domain in Vercel Dashboard

1. **Go to:** https://vercel.com/akashyo7s-projects/akash-portfolio
2. **Click "Settings"** → **"Domains"**
3. **Add these domains:**
   - `prosora.in`
   - `www.prosora.in`

## Step 2: DNS Records Configuration

### Option A: If you have DNS control panel access

**Add these DNS records:**

```
Type: A
Name: @
Value: 76.76.19.61
TTL: 3600 (or 1 hour)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or 1 hour)
```

### Option B: If using domain parking service

**You may need to:**
1. Contact your domain provider to update DNS records
2. Or change nameservers to a service that gives you DNS control

## Step 3: Common Domain Providers

### If your domain is with:

**GoDaddy:**
1. Go to GoDaddy DNS Management
2. Add A record: @ → 76.76.19.61
3. Add CNAME: www → cname.vercel-dns.com

**Namecheap:**
1. Go to Advanced DNS
2. Add A record: @ → 76.76.19.61
3. Add CNAME: www → cname.vercel-dns.com

**Cloudflare:**
1. Go to DNS settings
2. Add A record: @ → 76.76.19.61
3. Add CNAME: www → cname.vercel-dns.com

**Other providers:**
- Look for "DNS Management" or "DNS Settings"
- Add the same A and CNAME records

## Step 4: Verification

After DNS changes:
1. **Wait 5-10 minutes** for initial propagation
2. **Check:** https://dnschecker.org/#A/prosora.in
3. **Test:** https://prosora.in (may take 24-48 hours)

## Step 5: SSL Certificate

- **Automatic:** Vercel will automatically provision SSL
- **Timeline:** Usually within 1 hour after DNS propagates
- **Result:** https://prosora.in will have SSL

## Troubleshooting

### If DNS records don't work:
1. Try CNAME for root domain:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

2. Or use Vercel's alternative IPs:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   
   Type: A  
   Name: @
   Value: 76.223.126.88
   ```

## Timeline:
- **DNS propagation:** 5 minutes - 48 hours
- **SSL activation:** 1 hour after DNS
- **Full availability:** Usually within 2-4 hours

## Need Help?

**Where is your domain registered?** (GoDaddy, Namecheap, etc.)
This will help me give you exact steps for your provider.

## Next Steps After DNS:
1. Test https://prosora.in
2. Optimize loading speed
3. Set up Google Search Console
4. Add analytics (optional)

Ready to configure! 🚀