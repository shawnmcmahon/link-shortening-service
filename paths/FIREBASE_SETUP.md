# Firebase Setup Guide

Follow these steps to connect your link shortening service to Firebase.

## Important: Hosting Setup

**For this Next.js project, you should use Vercel for hosting, not Firebase Hosting.**

- **Vercel** (recommended): Optimized for Next.js, provides serverless functions, edge functions, and automatic deployments
- **Firebase Hosting**: Better for static sites, less optimal for Next.js server-side features

You'll still use Firebase for:
- Authentication (Auth)
- Database (Firestore)
- File Storage (if needed)

But deploy your Next.js app to Vercel. Skip Firebase Hosting setup during Firebase project creation.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Follow the setup wizard:
   - Enter a project name
   - Enable/disable Google Analytics (optional)
   - Click **"Create project"**

## Step 2: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to **Project Overview**
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. If no web app exists, click **"</>" (Add app)** and register a web app
5. Copy the configuration values from the Firebase SDK snippet (config object)

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in the root of your project (same level as `package.json`)
2. Add the following variables with your Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**Important:** Replace all placeholder values with your actual Firebase config values.

## Step 4: Enable Authentication Providers

1. In Firebase Console, go to **Build** > **Authentication**
2. Click **"Get started"** if you haven't set up Authentication yet
3. Go to **"Sign-in method"** tab
4. Enable the following providers:

### Enable Email/Password:
- Click on **"Email/Password"**
- Toggle **"Enable"** to ON
- Click **"Save"**

### Enable Google Sign-In:
- Click on **"Google"**
- Toggle **"Enable"** to ON
- Enter a project support email
- Click **"Save"**

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll add security rules next)
4. Select a Cloud Firestore location (choose closest to your users)
5. Click **"Enable"**

## Step 6: Configure Firestore Security Rules

1. In Firestore Database, go to the **"Rules"** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Links collection
    match /links/{linkId} {
      // Allow public read for redirect functionality (anyone can read links)
      allow read: if true;
      
      // Allow authenticated users to create links with their own userId
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      
      // Allow users to update/delete only their own links
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
    
    // Clicks collection - for analytics tracking
    match /clicks/{clickId} {
      // Allow anyone to create clicks (for tracking redirects)
      allow create: if true;
      
      // Allow users to read clicks only for their own links
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/links/$(resource.data.linkId)).data.userId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"**

## Step 7: Create Firestore Indexes

Firebase will automatically prompt you to create indexes when you first run queries. However, you can also create them manually:

1. In Firestore Database, go to the **"Indexes"** tab
2. Click **"Create Index"**

### Required Indexes:

#### Index 1: Links Collection (for user dashboard)
   - **Collection ID:** `links`
   - **Fields to index:**
     - `userId` (Ascending)
     - `createdAt` (Descending)
   - Click **"Create"**

#### Index 2: Clicks Collection (for analytics)
   - **Collection ID:** `clicks`
   - **Fields to index:**
     - `linkId` (Ascending)
     - `timestamp` (Descending)
   - Click **"Create"**

**Note:** The app will work without these indexes (it will sort client-side as a fallback), but creating them improves performance. Firebase will also provide a direct link to create indexes when you encounter this error.

## Step 8: Test Your Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. You should be redirected to the login page
4. Try signing in with Google or creating an account with email/password
5. If authentication works, your Firebase connection is set up correctly!

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure your `.env.local` file exists and contains all required variables
- Restart your development server after creating/updating `.env.local`

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure you've published the rules (click "Publish" button)

### "Index not found" errors
- Firestore will provide a link to create the index when this error occurs
- Click the link and create the index in Firebase Console

### Authentication not working
- Verify that Email/Password and Google providers are enabled in Authentication settings
- Check browser console for specific error messages

## Security Note

For production, update your Firestore security rules to be more restrictive and ensure your `.env.local` file is in `.gitignore` (which it should be by default in Next.js projects).
