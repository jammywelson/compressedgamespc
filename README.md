# CompressedGamesPC.com — Final Project

## Quick Start

```bash
npm install
cp .env.example .env.local   # Fill in credentials
npm run dev                   # localhost:3000
```

## Admin Panel
URL: /admin/login
Default: admin / cgpc2025
⚠️ Change in .env.local before going live!

## Upload to Vercel (Step by Step)

### Step 1 — GitHub
```bash
git init
git add .
git commit -m "initial commit"
```
Go to github.com → New repo "compressedgamespc" → copy URL then:
```bash
git remote add origin https://github.com/YOUR_NAME/compressedgamespc.git
git push -u origin main
```

### Step 2 — Vercel
1. vercel.com → Login with GitHub
2. "Add New Project" → Import compressedgamespc
3. Framework: Next.js (auto detected)
4. Environment Variables add karo:
   - NEXT_PUBLIC_ADMIN_USER = your_username
   - NEXT_PUBLIC_ADMIN_PASS = strong_password
5. Deploy!

### Step 3 — Domain Connect
1. Vercel → Project → Settings → Domains
2. Add: compressedgamespc.com
3. Note down: A record IP (76.76.21.21)
4. Hostinger → Domain → DNS:
   - A record: @ → 76.76.21.21
   - CNAME: www → cname.vercel-dns.com
5. Wait 24-48 hours

## Admin Panel Pages
- /admin — Dashboard
- /admin/games — All games (bulk select/delete)
- /admin/games/add — Add game (featured image, SEO)
- /admin/pages — About, Privacy, DMCA etc.
- /admin/appearance — Full customization (8 tabs)
- /admin/seo — SEO + Sitemap control
- /admin/stats — Site stats + Cache clear
- /admin/ads — Ad Inserter (6 slots)
- /admin/backup — Backup + Google Drive
- /admin/categories — Add/edit/delete categories
- /admin/users — User management
- /admin/permalinks — URL structure
- /admin/settings — Site settings

## Public Pages
- / — Homepage
- /games — All games
- /games/[slug] — Game detail
- /about — About Us
- /contact — Contact
- /privacy-policy — Privacy Policy
- /disclaimer — Disclaimer
- /dmca — DMCA
- /terms — Terms of Use
- /sitemap.xml — Auto sitemap
- /robots.txt — Auto robots

## After Going Live Checklist
- [ ] Change admin password in .env.local
- [ ] Add DATABASE_URL (neon.tech free)
- [ ] Submit sitemap to Google Search Console
- [ ] Connect Google Drive for backups
- [ ] Add real games with actual download links
- [ ] Set up Google Analytics
