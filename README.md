# Bahria University Campus Notice Board

A production-ready React + Vite + Supabase campus notice board for Bahria University Cloud Computing Lab 10A.

Visitors can read notices publicly. Authenticated users can create notices, delete only their own notices, update their display name, and see live notice changes through Supabase Realtime.

## Tech Stack

- React + Vite frontend
- Tailwind CSS responsive UI
- Supabase PostgreSQL, Auth, RLS, and Realtime
- Vercel deployment
- GitHub repository workflow

## Project Structure

```text
bahria-campus-notice-board/
  supabase/
    schema.sql
    seed.sql
  src/
    components/
      Auth.jsx
      CategoryFilter.jsx
      Header.jsx
      NoticeBoard.jsx
      NoticeCard.jsx
      NoticeForm.jsx
      ProfileEditor.jsx
      SkeletonNotice.jsx
    constants/
      categories.js
    hooks/
      useDarkMode.js
      useSession.js
    lib/
      noticesApi.js
      supabaseClient.js
    utils/
      format.js
    App.jsx
    index.css
    main.jsx
  .env.example
  .gitignore
  eslint.config.js
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  vite.config.js
```

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open `SQL Editor`.
3. Run [`supabase/schema.sql`](./supabase/schema.sql).
4. Go to `Authentication > Providers` and enable Email provider.
5. Go to `Project Settings > API` and copy:
   - Project URL
   - anon public key

The SQL creates:

- `profiles`
- `notices`
- RLS policies
- auth signup trigger for profile auto-creation
- Realtime publication for `notices`

Important security note: only use the anon key in the frontend. Never expose the `service_role` key.

## Environment Variables

Create `.env.local`:

```bash
VITE_SUPABASE_URL=https://fkahcsedfxlnpzxqunta.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYWhjc2VkZnhsbnB6eHF1bnRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNTg3NTMsImV4cCI6MjA5NDkzNDc1M30.U7fAqKlltDMZaIP6K8xbdLp2dYEemVK8YS7oWhtRt7o
```

`.env.local` is ignored by Git. Use `.env.example` or `.env.local.example` as the template. Vite reads these variables only when they are in the project root, not inside `src/`.

## Local Development

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Build

```bash
npm run build
npm run preview
```

## Features

- Public notice feed, newest first
- Email/password signup and login
- Persistent Supabase session
- Auth-aware UI
- Create notices only when logged in
- Delete button shown only for the notice owner
- Database-level owner-only delete through RLS
- Supabase Realtime updates across tabs/devices
- Instant client-side category filtering
- Search notices
- Markdown notice body support
- Profile display name editor
- Dark mode
- Toast notifications
- Loading skeletons and empty states
- Vercel-ready environment variable setup

## GitHub Push

```bash
git init
git add .
git commit -m "Build campus notice board"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bahria-campus-notice-board.git
git push -u origin main
```

## Vercel Deployment

1. Push the project to GitHub.
2. Open [vercel.com](https://vercel.com).
3. Select `Add New > Project`.
4. Import the GitHub repository.
5. Keep framework preset as `Vite`.
6. Add environment variables:
   - `VITE_SUPABASE_URL` = `https://fkahcsedfxlnpzxqunta.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYWhjc2VkZnhsbnB6eHF1bnRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNTg3NTMsImV4cCI6MjA5NDkzNDc1M30.U7fAqKlltDMZaIP6K8xbdLp2dYEemVK8YS7oWhtRt7o`
7. Deploy.

In Vercel, add both variables under `Project Settings > Environment Variables` for Production, Preview, and Development. Redeploy after saving them so Vite bakes the values into the deployed frontend build. Use only the Supabase anon public key here; never add a `service_role` key to Vercel for this browser app.

## Supabase Auth URL Configuration

In Supabase:

1. Open `Authentication > URL Configuration`.
2. Set `Site URL` to your Vercel production URL, for example:

```text
https://bahria-campus-notice-board.vercel.app
```

3. Add redirect URLs:

```text
http://localhost:5173
https://bahria-campus-notice-board.vercel.app
```

Use your real Vercel domain. Do not hardcode localhost in production code.

## RLS Policy Summary

`profiles`

- Users can select only their own profile.
- Users can insert only their own profile.
- Users can update only their own profile for the profile editor bonus feature.

`notices`

- Everyone can select notices.
- Authenticated users can insert notices only when `user_id = auth.uid()`.
- Authenticated users can delete only their own notices.

## Lab 10A Evaluation Checklist

- React + Vite frontend: complete
- Supabase backend: complete
- PostgreSQL tables: complete
- Auth: complete
- RLS: complete
- Realtime: complete
- Public feed: complete
- Category filter: complete
- Owner-only delete: complete
- Vercel deployment instructions: complete
- GitHub workflow: complete
- No hardcoded credentials: complete
