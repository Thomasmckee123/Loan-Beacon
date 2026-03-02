# LoanBeacon — Deployment Guide

## Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create an account (free tier works)
2. Click **New Project**, give it a name like "loanbeacon", and set a database password
3. Wait for the project to finish provisioning (~2 minutes)

### Run the Database Schema

4. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
5. Click **New Query**
6. Open the file `supabase/schema.sql` from this project and paste its entire contents into the editor
7. Click **Run** — this creates the companies, loans, and alerts tables with Row Level Security

### Get Your API Keys

8. Go to **Settings** → **API** in the Supabase dashboard
9. Copy the **Project URL** and **anon/public key**
10. Update your `.env` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Configure Auth

11. Go to **Authentication** → **URL Configuration**
12. Set the **Site URL** to your Vercel URL (e.g., `https://loanbeacon.vercel.app`)
13. Add `https://loanbeacon.vercel.app/auth/callback` to **Redirect URLs**
14. (For local development, also add `http://localhost:3000/auth/callback`)

## Step 2: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New Project** → Import your loanbeacon repo
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**

### Option B: Deploy via CLI

```bash
npm i -g vercel
vercel
# Follow the prompts, then set env vars:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

## Step 3: Post-Deploy

1. After deployment, copy your Vercel URL
2. Go back to Supabase **Authentication** → **URL Configuration**
3. Update the **Site URL** to your Vercel URL
4. Ensure your redirect URL is set to `https://your-app.vercel.app/auth/callback`

## Local Development

```bash
npm run dev
```

Visit `http://localhost:3000` — the middleware will redirect you to `/login` if not authenticated.

## Architecture Notes

- **Auth**: Supabase Auth with email/password. Middleware protects `/dashboard/*` routes.
- **RLS**: Row Level Security ensures each user only sees their own data.
- **Data flow**: Client components fetch via `@/lib/supabase/queries` using the browser client.
- **Types**: Database rows (snake_case) are transformed to app types (camelCase) in `@/lib/supabase/types`.
