# Pillar — Landing Page & Interactive Demo

Marketing site and interactive product demo for Pillar, a yield-optimized cash management platform.

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS 4** with `@theme inline` design tokens
- **Framer Motion** for animations
- **Recharts** for financial charts
- **Supabase** for waitlist signups
- **TypeScript** throughout

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/demo/](http://localhost:3000/demo/) for the interactive demo.

## Supabase Setup

1. Create a Supabase project
2. Run `supabase-schema.sql` against your database
3. Set environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Deployment

Deployed to GitHub Pages via GitHub Actions on push to `main`. The build outputs static HTML to `/out`.

```bash
npm run build   # Generates static export
```

## Design System

See the [brand repo](https://github.com/getpillar/brand) for the full design system documentation (colors, typography, component patterns, logo assets).
