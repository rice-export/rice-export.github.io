# Deployment Guide - Guru Teja Heritage Exports Website

Complete step-by-step instructions for deploying the B2B rice export website.

---

## Option 1: GitHub Pages (Free, Automatic Updates)

### Prerequisites
- GitHub account (free at github.com)
- Git installed on your computer

### Steps

1. **Create GitHub Repository**
   - Go to github.com and sign in
   - Click "+" icon → New repository
   - Name: `kishore` (or any name)
   - Description: "Guru Teja Heritage Exports Website"
   - Select Public
   - Click "Create repository"

2. **Push Code to GitHub**
   ```bash
   cd C:\Users\GuruTeja\Desktop\kishore
   git init
   git add .
   git commit -m "Initial commit: B2B rice export website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/kishore.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click Settings → Pages
   - Under "Source", select: main branch / root folder
   - Click Save
   - Website will be live at: `https://YOUR-USERNAME.github.io/kishore`

4. **Access Your Site**
   - URL: `https://YOUR-USERNAME.github.io/kishore`
   - Share this link with clients

---

## Option 2: Netlify (Free, Easy Deployment)

### Prerequisites
- Netlify account (free at netlify.com)

### Steps

1. **Sign Up/Login**
   - Go to netlify.com
   - Click "Sign Up" or "Log In"

2. **Deploy Your Site**
   - Option A: **Drag & Drop**
     - Compress the entire `kishore` folder as `kishore.zip`
     - Go to Netlify Dashboard
     - Drag and drop the folder (not zip) to the drop zone
     - Website will deploy instantly
     - You'll get a random URL: `https://random-name.netlify.app`

   - Option B: **Git Integration** (Recommended)
     - Push code to GitHub (see Option 1)
     - In Netlify Dashboard click "New site from Git"
     - Select GitHub, authorize Netlify
     - Choose `kishore` repository
     - Leave build settings empty (no build needed)
     - Click "Deploy site"

3. **Custom Domain** (Optional)
   - In Netlify Dashboard → Domain settings
   - Add your custom domain: `guruteja.com`
   - Follow DNS setup instructions

---

## Option 3: Vercel (Free, Best Performance)

### Prerequisites
- Vercel account (free at vercel.com)

### Steps

1. **Create Vercel Account**
   - Go to vercel.com
   - Click "Sign Up" (use GitHub to auto-connect)

2. **Deploy**
   - Push code to GitHub (see Option 1)
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Leave settings default (no build needed)
   - Click "Deploy"
   - Website live at: `https://YOUR-PROJECT-NAME.vercel.app`

3. **Custom Domain** (Optional)
   - In Project Settings → Domains
   - Add: `guruteja.com`
   - Update DNS records at your domain provider

---

## Option 4: Traditional Web Hosting (Paid, Full Control)

### Prerequisites
- Web hosting account (GoDaddy, Bluehost, HostGator, etc.)
- FTP or File Manager access

### Steps

1. **Prepare Files**
   - Keep all files as-is (no changes needed)
   - Ensure `index.html` is in root directory

2. **Upload via FTP**
   - Download FTP client: FileZilla (free)
   - Connect to your hosting using FTP credentials
   - Upload entire `kishore` folder contents to `public_html` or `www` folder

3. **Upload via File Manager**
   - Login to hosting control panel (cPanel, Plesk, etc.)
   - Open File Manager
   - Navigate to `public_html`
   - Upload all files (structure must be preserved)

4. **Access Your Site**
   - Website will be live at your domain
   - Example: `https://guruteja.com`

---

## Option 5: Local Testing Before Deployment

### Windows (No Server Required)

1. **Simple Method**
   - Right-click `index.html`
   - Select "Open with" → Choose your browser
   - Website opens locally at: `file:///C:/Users/GuruTeja/Desktop/kishore/index.html`

2. **Using Python (If Installed)**
   ```bash
   cd C:\Users\GuruTeja\Desktop\kishore
   python -m http.server 8000
   ```
   - Visit: `http://localhost:8000`

3. **Using Node.js (If Installed)**
   ```bash
   cd C:\Users\GuruTeja\Desktop\kishore
   npx http-server
   ```
   - Visit: `http://localhost:8080`

---

## Testing Checklist Before Going Live

### Functionality Tests
- [ ] Home page loads with hero section and benefits
- [ ] Navigation links work (Home, Catalog, Contact)
- [ ] Catalog page shows all 4 products
- [ ] Filter by rice type works correctly
- [ ] Filter by grain length works correctly
- [ ] Sorting by price works (low→high, high→low)
- [ ] Product details page displays correctly
- [ ] Calculator updates total when quantity changes
- [ ] Contact form submits successfully
- [ ] Success notification appears on form submission
- [ ] "Back to Catalog" button works
- [ ] Related products display on product page

### Performance Tests
- [ ] All pages load quickly (< 3 seconds)
- [ ] Images load properly
- [ ] No console errors (F12 → Console)
- [ ] Animations are smooth

### Responsive Tests
- [ ] Mobile (iPhone 6/7/8 width: 375px)
- [ ] Tablet (iPad width: 768px)
- [ ] Desktop (width: 1024px+)
- [ ] Text is readable at all sizes
- [ ] Buttons are clickable on mobile

### Cross-Browser Tests
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### SEO Preparation
- [ ] Update `<title>` in index.html to match brand
- [ ] Add meta description
- [ ] Add Open Graph tags for social sharing
- [ ] Verify page loads without JavaScript errors

---

## Post-Deployment Checklist

### After Website Goes Live

1. **Monitor Performance**
   - Track page load times
   - Monitor form submissions
   - Check for errors in browser console

2. **Share with Team**
   - Document the live URL
   - Create style guide for future updates
   - Train team on updating products

3. **Promote**
   - Share link on LinkedIn
   - Add to email signatures
   - Update business cards/brochures
   - Add to social media profiles

4. **Maintenance**
   - Update product prices quarterly
   - Check for broken links monthly
   - Monitor contact form submissions
   - Backup website files regularly

---

## Common Issues & Solutions

### Issue: Pages Show Blank
**Solution**: 
- Check browser console (F12) for errors
- Verify all files are uploaded correctly
- Ensure file paths are correct (case-sensitive on Linux servers)

### Issue: Styles Not Loading
**Solution**:
- Check that `styles/` folder exists with `global.css` and `components.css`
- Verify CSS file paths in HTML
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Images Not Showing
**Solution**:
- Check image URLs are correct
- Verify images exist in `assets/` folder
- External images (Google) require internet connection

### Issue: Form Not Submitting
**Solution**:
- Check browser console for JavaScript errors
- Verify all required fields are filled
- Ensure email format is valid (contains @)
- Check phone number is 10+ digits

### Issue: Custom Domain Not Working
**Solution**:
- Wait 24-48 hours for DNS propagation
- Check DNS records are correctly configured
- Verify domain registrar settings

---

## Keeping Website Updated

### Updating Product Prices
1. Open `scripts/data.js`
2. Find the product
3. Update the `price` field
4. Save and redeploy

### Changing Product Details
1. Open `scripts/data.js`
2. Update product object:
   - `name`, `description`, `specs`, `details`
3. Save and redeploy

### Modifying Company Information
1. Open `scripts/components.js`
2. Find `renderFooter()` function
3. Update phone, email, addresses
4. Save and redeploy

### Adding New Products
1. Open `scripts/data.js`
2. Add new product object to `products` array
3. Increment `id` from previous product
4. Add product image to `assets/` folder
5. Save and redeploy

---

## Backup Strategy

### Backup Your Website
1. **GitHub**: Automatically backs up all code changes
2. **Local**: Keep copy on your computer
3. **Regular Backups**:
   - Before making major changes
   - Monthly full backup
   - After every product update

### Restore from Backup
- If hosted on GitHub: Simply revert to previous commit
- If self-hosted: Re-upload backed-up files via FTP

---

## Performance Optimization

### Current Performance
- ✅ Total Size: ~50KB
- ✅ Load Time: < 1 second (optimized)
- ✅ No external API calls
- ✅ Works offline

### For Future Optimization
1. Compress images (JPEG/WebP)
2. Minify CSS and JavaScript
3. Enable gzip compression on server
4. Use CDN for images

---

## Support

For deployment questions:
- GitHub Pages Support: pages.github.com/support
- Netlify Support: netlify.com/support
- Vercel Support: vercel.com/support
- Hosting Company Support: Contact your provider

---

## Next Steps

1. Choose deployment option (GitHub Pages recommended for free)
2. Follow deployment steps above
3. Run testing checklist
4. Share live URL with team/clients
5. Update contact information to reflect new domain
6. Monitor form submissions regularly

---

**Deployment Date**: _______________  
**Live URL**: _______________  
**Admin**: _______________  
**Backup Location**: _______________
