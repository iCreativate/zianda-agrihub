## Zianda Agri-Hub

Zianda Agri-Hub is a farm management platform for livestock, vegetation, farm finances, and QR-based health tracking, built with Next.js 14, Tailwind CSS, Supabase, and TanStack Query.

### Tech stack

- **Frontend**: Next.js 14 App Router, React 18, Tailwind CSS, Lucide icons.
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage) using `supabase/schema.sql`.
- **Data fetching & offline-first**: TanStack Query (ready to be wired up).
- **QR codes**: `qrcode.react`.
- **PDF reports**: `jspdf`.

### Project structure

- `app/dashboard` – overview dashboard and financial summary.
- `app/livestock` – CRUD views for animals (to be implemented).
- `app/vegetation` – CRUD views for crops (to be implemented).
- `app/scan` – QR scan landing view; `/scan/[id]` shows a QR health card.
- `components/ui` – shared UI such as `sidebar` and `health-card`.
- `types/agriculture.ts` – core domain types shared across the app.
- `supabase/schema.sql` – Supabase schema for livestock, vegetation, finances, and content.
- `lib/supabase` – Supabase client.
- `lib/reporting` – audit report generation helpers.
- `lib/health` – vaccination schedule helpers.

### Getting started

1. Install dependencies:
   - `pnpm install` or `npm install` or `yarn install`
2. Configure Supabase:
   - Create a Supabase project.
   - Run `supabase/schema.sql` in the SQL editor.
   - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
3. Run the dev server:
   - `npm run dev`
   - Open `http://localhost:3000`.

