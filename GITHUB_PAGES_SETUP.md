# GitHub Pages Deployment - Step by Step Guide

Complete walkthrough for deploying your website using GitHub Pages.

---

## Step 1: Create GitHub Account (5 minutes)

1. Go to **github.com**
2. Click **"Sign up"** button (top right)
3. Enter your email address
4. Create a password
5. Enter a username (e.g., `guruteja` or `your-name`)
6. Click "Create account"
7. Verify your email (GitHub will send you an email)
8. Click the verification link in the email

**✅ GitHub account created!**

---

## Step 2: Install Git (10 minutes)

### For Windows:

1. Go to **git-scm.com**
2. Click **"Download for Windows"** button
3. Run the installer (accept all defaults)
4. Click "Install"
5. Finish installation
6. Open PowerShell (Windows key + type "PowerShell")
7. Copy and paste this command:
   ```powershell
   git --version
   ```
8. Press Enter - if it shows a version number, Git is installed! ✅

---

## Step 3: Configure Git (2 minutes)

Open PowerShell and run these commands one by one:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Replace:
- `"Your Name"` with your name (e.g., "Guru Teja")
- `"your-email@example.com"` with the email you used for GitHub

Example:
```powershell
git config --global user.name "Guru Teja"
git config --global user.email "guru@guruteja.com"
```

**✅ Git configured!**

---

## Step 4: Create GitHub Repository (3 minutes)

1. Log in to **github.com** (your new account)
2. Click **"+"** icon in top right → **"New repository"**
3. Fill in the form:
   - **Repository name**: `guruteja-rice` (or any name you like)
   - **Description**: "B2B Rice Export Website"
   - **Public** (make sure this is selected)
4. Click **"Create repository"** button
5. On the next screen, you'll see instructions - **copy the repository URL** (looks like `https://github.com/YOUR-USERNAME/guruteja-rice.git`)

**✅ Repository created!**

---

## Step 5: Upload Your Website (5 minutes)

### Option A: Using Command Line (Recommended)

1. Open PowerShell
2. Navigate to your project folder:
   ```powershell
   cd C:\Users\GuruTeja\Desktop\kishore
   ```

3. Initialize Git in your folder:
   ```powershell
   git init
   ```

4. Add all files:
   ```powershell
   git add .
   ```

5. Create first commit:
   ```powershell
   git commit -m "Initial commit: B2B rice export website"
   ```

6. Rename branch to main:
   ```powershell
   git branch -M main
   ```

7. Add the remote repository (replace with YOUR repository URL from Step 4):
   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/guruteja-rice.git
   ```

8. Push your code:
   ```powershell
   git push -u origin main
   ```

9. GitHub will ask for your credentials:
   - Username: Your GitHub username
   - Password: Your GitHub password (or personal access token)

**✅ Code uploaded to GitHub!**

---

## Step 6: Enable GitHub Pages (2 minutes)

1. Go to your GitHub repository
2. Click **Settings** (tab at top)
3. On the left sidebar, click **"Pages"**
4. Under "Source", select:
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **"Save"**
6. Wait 1-2 minutes for GitHub to build your site

**✅ GitHub Pages enabled!**

---

## Step 7: View Your Live Website! 🎉

After 1-2 minutes, you'll see a green checkmark and a URL like:

```
https://YOUR-USERNAME.github.io/guruteja-rice
```

Click the link to view your live website!

**✅ Website is LIVE!**

---

## Verify Everything Works

- [ ] Homepage loads with hero section
- [ ] Navigation links work (Home, Catalog, Contact)
- [ ] Catalog shows all 4 products
- [ ] Product details page works
- [ ] Calculator updates when changing quantity
- [ ] Contact form submits
- [ ] No errors in console (F12)

---

## Share Your Website

Your website URL is: **`https://YOUR-USERNAME.github.io/guruteja-rice`**

Share this link with:
- Your team
- Clients
- Business partners
- LinkedIn profile
- Email signature

---

## Troubleshooting

### "Git is not installed"
→ Go back to Step 2 and install Git from git-scm.com

### "Cannot authenticate with GitHub"
→ Use a Personal Access Token instead of password:
   1. Go to github.com → Settings → Developer settings → Personal access tokens
   2. Click "Generate new token"
   3. Select "repo" and "workflow" scopes
   4. Copy the token
   5. When asked for password, paste the token

### "Pages not showing"
→ Wait 2-3 minutes and refresh browser (sometimes takes time)

### "Website shows 404 error"
→ Check that:
   1. Repository name in URL matches your repo name
   2. index.html is in the root of main branch
   3. Go to Settings → Pages and verify settings are correct

---

## Making Updates (After Deployment)

When you make changes locally:

```powershell
cd C:\Users\GuruTeja\Desktop\kishore
git add .
git commit -m "Updated product prices"
git push
```

Your changes will appear on the live website in 1-2 minutes!

---

## Custom Domain (Optional)

To use your own domain (like guruteja.com):

1. In GitHub Settings → Pages
2. Add your custom domain
3. Update your domain's DNS settings to point to GitHub Pages
4. See GitHub's documentation for DNS details

---

## Questions?

- **GitHub Help**: help.github.com
- **Git Help**: git-scm.com/doc
- **GitHub Pages Help**: pages.github.com

---

**You're all set! Your website is now live!** 🚀

When you're done with all steps above, your website will be publicly accessible at:
`https://YOUR-USERNAME.github.io/guruteja-rice`
