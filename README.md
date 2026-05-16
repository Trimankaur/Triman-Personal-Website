# Triman's Learning Journal

A cozy personal learning journal and proof-of-work website for documenting the journey of a self-learner growing alongside AI.

## Tech Stack

- **Next.js 16** — React framework with App Router
- **Tailwind CSS v4** — Utility-first styling
- **Framer Motion** — Subtle animations
- **Supabase** — Database + Authentication
- **Lucide React** — Icons
- **Vercel** — Deployment (free tier)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the contents of `supabase-schema.sql`
3. Go to Authentication > Settings and create a user for admin access
4. Copy your project URL and anon key from Settings > API

### 3. Configure environment variables

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Hero, quotes, activity graph, recent learnings, curiosities |
| Learnings | `/learnings` | Searchable archive of all learning entries |
| Projects | `/projects` | Showcase of things built |
| Words | `/quotes` | Collection of meaningful quotes |
| Study Room | `/study-room` | Immersive focus space with timer + ambient visuals |
| About | `/about` | Personal story |
| Admin | `/admin` | Private dashboard for adding content |

## Deployment

Deploy to Vercel for free:

```bash
npx vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Design Philosophy

This website feels like a late-night café, a quiet study room, a cozy internet journal. It rewards consistency over perfection and showcases learning publicly without pretending expertise.

---

Built with curiosity and care.
