# Link Shortening Service (Next.js App Router)

You are an expert in TypeScript, Next.js App Router, React, and Tailwind. Follow @Next.js docs for Data Fetching, Rendering, and Routing. Prefer **Edge runtime** where possible for ultra-fast redirects, and use **Firebase Firestore** as the primary data store.

Your job is to create a production-ready link shortener with the following features and implementation notes:

1. Storage layer & data model:
   - Use **Firebase Firestore** as the main database for storing links and analytics.
   - Implement Firestore collections:
     - `links/{slug}` → `{ url: string; createdAt: number; ownerId?: string; expiresAt?: number | null; passwordHash?: string | null; clickCount: number; title?: string; tags?: string[] }`
     - `clicks/{slug}/{date}` → `{ count: number }` (for simple per-day analytics)
   - Ensure **unique slugs** by checking if the document already exists before inserting.
   - Use batched writes or transactions for atomic updates (e.g., incrementing click counters).
   - Secure access with Firestore Security Rules (only owners can modify their links).

2. Slug generation & validation:
   - Generate short, URL-safe **lowercase** slugs (default length 6–8).
   - Validate **custom aliases** (regex: `^[a-z0-9-]{3,32}$`, disallow reserved words like `api`, `admin`, `_next`, etc.).
   - Handle collisions by retrying generation up to N times, otherwise return a 409 error.

3. Redirects via Middleware (Edge):
   - Use `middleware.ts` to catch `/{slug}` requests.
   - On hit, **fetch** document from Firestore (`links/{slug}`).
   - Enforce **expiration** and **password** protection if configured.
   - **Increment click counters** asynchronously (use Firestore `increment()` field transform).
   - Redirect (301) to the original URL.
   - Respect `noindex` for password-protected/private links.

4. API routes (App Router):
   - `POST /api/links` – create a short link (supports custom slug, expiration, optional password).
   - `GET /api/links/[slug]` – fetch link metadata (auth-guarded if owner-only).
   - `DELETE /api/links/[slug]` – delete link (owner-only).
   - `PATCH /api/links/[slug]` – update destination, expiration, password, tags.
   - `GET /api/analytics/[slug]` – return simple analytics (total clicks, per-day series).
   - Use **Firebase Admin SDK** for all server-side interactions.
   - Implement **rate limiting** via Firestore writes per IP or Cloud Functions if needed.

5. Authentication & ownership:
   - Use **NextAuth** (GitHub/Google) for user authentication.
   - Anonymous link creation allowed (toggleable).
   - Link ownership stored as `ownerId` (user ID from NextAuth session or Firebase Auth).
   - Secure Firestore with owner-based read/write rules.

6. Link features:
   - **Custom alias** (user-provided slug).
   - **Expiration** (datetime): expired links return 410 Gone.
   - **Password protection**: store **hashed** password (e.g., bcrypt). Prompt on first access, store session cookie once authenticated.
   - **QR code** generation endpoint (`/api/qr/[slug]`) returning PNG/SVG.
   - Optional **UTM appending** toggle for redirects.
   - Optional **custom domain binding** (`NEXT_PUBLIC_SITE_URL` override).

7. Analytics (Firestore-based, privacy-aware):
   - Track **total clicks** using `FieldValue.increment(1)` in Firestore.
   - Store **daily counts** under `clicks/{slug}/{date}` for time-based analytics.
   - Optionally record **referrer** and **user-agent hash** (no PII).
   - Expose analytics in UI: sparkline (last 30 days), total clicks, top referrers.

8. Robust error handling & loading states:
   - Display user-friendly error messages (invalid URL, slug in use, rate limit exceeded).
   - Use toast notifications for create/update/delete operations.
   - Add skeleton loaders for the dashboard and analytics pages.

9. UI & UX:
   - Pages:
     - **Dashboard** – lists links, includes search and filters.
     - **Create Link** – form to add new short links.
     - **Link Detail** – shows analytics, edit options, and QR code.
   - Components:
     - `LinkForm`, `LinkCard`, `AnalyticsPanel`, `QRModal`, `PasswordGate`, `CopyButton`, `ConfirmDialog`.
   - Features:
     - **Copy-to-clipboard** for short URLs.
     - **QR download** for each short link.
     - **Domain selector** support for multiple domains.

10. Performance, security & DX:
    - Use **Edge Runtime** for instant redirects.
    - Use **Zod** for request validation in API routes.
    - Store secrets in **Firebase config** and **Vercel environment variables**.
    - Hash passwords only on the server; never log sensitive data.
    - Add unit tests for slug generation and Firestore operations.
    - Add e2e tests (Playwright) for create→redirect flow.

11. Firebase setup:
    - Initialize Firebase Admin SDK on the server (with service account key).
    - Initialize Firebase Client SDK on the client (for dashboard data).
    - Environment variables required:
      - `FIREBASE_PROJECT_ID`
      - `FIREBASE_CLIENT_EMAIL`
      - `FIREBASE_PRIVATE_KEY`
      - `NEXT_PUBLIC_FIREBASE_API_KEY`
      - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
      - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - Use Firestore’s regional settings to optimize latency.

