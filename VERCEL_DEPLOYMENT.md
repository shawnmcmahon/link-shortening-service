# Vercel Deployment Guide

Follow these steps to deploy your link shortening service to Vercel.

## Prerequisites

1. ✅ Your code is working locally
2. ✅ Your code is committed to a Git repository (GitHub, GitLab, or Bitbucket)
3. ✅ You have a Vercel account (sign up at [vercel.com](https://vercel.com))

## Step 1: Push Your Code to Git

Make sure all your code is committed and pushed to your repository:

```bash
git add .
git commit -m "Ready for deployment"
git push
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository:
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Choose your repository
   - Click **"Import"**
4. Configure your project:
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - Click **"Deploy"**

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```
   
3. Follow the prompts:
   - Login to Vercel
   - Link to existing project or create new
   - Confirm settings

## Step 3: Add Environment Variables

**Important:** You must add your Firebase environment variables in Vercel.

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add each of these variables (use the same values from your `.env.local`):

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

4. For each variable:
   - Paste the value
   - Select **"Production"**, **"Preview"**, and **"Development"** environments
   - Click **"Save"**

5. **Redeploy** after adding variables:
   - Go to **"Deployments"** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**

## Step 4: Update Firebase Authentication Settings

You need to add your Vercel domain to Firebase Auth allowed domains:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **"Add domain"**
5. Add your Vercel domain (e.g., `your-project.vercel.app`)
6. If you have a custom domain, add that too
7. Click **"Done"**

## Step 5: Test Your Deployment

1. Visit your Vercel deployment URL (e.g., `https://your-project.vercel.app`)
2. Test the following:
   - ✅ Sign up / Sign in works
   - ✅ Create a shortened link
   - ✅ Click the shortened link (redirects correctly)
   - ✅ View analytics
   - ✅ Delete a link

## Step 6: (Optional) Add Custom Domain

1. In Vercel Dashboard, go to **"Settings"** → **"Domains"**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Firebase Authorized domains with your custom domain

## Troubleshooting

### "Missing environment variables"
- Make sure all `NEXT_PUBLIC_*` variables are added in Vercel
- Redeploy after adding variables

### "Firebase Auth not working"
- Check that your Vercel domain is added to Firebase Authorized domains
- Verify environment variables are correct

### "Links not redirecting"
- Check browser console for errors
- Verify Firestore security rules allow public read
- Check that short links are being created correctly

### "Build fails"
- Check the build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Make sure Node.js version is compatible (Vercel uses Node 18+ by default)

## Post-Deployment Checklist

- [ ] Environment variables added to Vercel
- [ ] Firebase Auth authorized domains updated
- [ ] First deployment successful
- [ ] Can sign in/sign up
- [ ] Can create shortened links
- [ ] Shortened links redirect correctly
- [ ] Analytics page works
- [ ] Can delete links
- [ ] (Optional) Custom domain configured

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:
- **Production:** Deploys from `main` or `master` branch
- **Preview:** Creates preview deployments for pull requests

Every time you push code, Vercel will automatically deploy the changes!

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Check Vercel build logs if deployment fails
